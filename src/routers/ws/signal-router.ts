import Router from 'koa-router';
import { MiddlewareContext } from 'koa-websocket';
import { DefaultState, DefaultContext } from 'koa';
import { v4 } from 'uuid';

import { logger as baseLogger } from '../../logging/logger';
import { AppConfig, RouteConfig } from '../../config';
import { helloMessage, iceServersMessage } from '../../models/signaling-message';
import { connectionManagerService } from '../../services';
import { parseMessage, sendMessage } from '../../utils/message-utils';

const logger = baseLogger.child({ module: 'SignalRouter' });
const {
  signal: { prefix },
} = RouteConfig;
const { ICE_SERVERS } = AppConfig;

// Remove the connection. Note that this does not tell anyone you are currently in a call with
// that this happened. This would require additional statekeeping that is not done here.
const handleCloseForPeer = (id: string) => () => {
  logger.info(`Connection has been closed for id: ${id}`);
  connectionManagerService.removeConnection(id);
};

const handleMessageForPeer = (id: string) => (message: string) => {
  const data = parseMessage(message);

  // TODO: your protocol should send some kind of error back to the caller instead of
  // returning silently below.
  if (!data) {
    return;
  }

  const {
    payload: { id: peerId },
  } = data;

  // The direct lookup of the other clients websocket is overly simplified.
  // In the real world you might be running in a cluster and would need to send
  // messages between different servers in the cluster to reach the other side.
  const peer = connectionManagerService.getConnection(peerId);

  if (!peer) {
    logger.info(`Peer id '${peerId}' provided by client '${id}' cannot be found`);
    // TODO: the protocol needs some error handling here. This can be as
    // simple as sending a 'bye' with an extra error element saying 'not-found'.
    return;
  }

  // Stamp messages with our id. In the client-to-server direction, 'id' is the
  // client that the message is sent to. In the server-to-client direction, it is
  // the client that the message originates from.
  data.payload.id = id;
  sendMessage(peer, data, (err) => {
    if (err) {
      logger.info(`Failed to send message to peer '${peerId}' from client '${id}'`);
    }
  });
};

export const signalRouter = new Router<DefaultState, MiddlewareContext<DefaultState> & DefaultContext>({ prefix });

signalRouter.get('/', ({ websocket: ws }) => {
  // Assign an id to the client. The other alternative is to have the client
  // pick its id and tell us. But that needs handle duplicates. It is preferable
  // if you have ids from another source but requires some kind of authentication.
  // TODO: Replace with OAuth
  const id = v4();
  logger.info(`New connection with id '${id}' has been received`);

  if (connectionManagerService.hasConnection(id)) {
    logger.info(`A duplicate connection with id '${id}' has been detected. Closing...`);
    ws.close();
    return;
  }

  // Store the connection in our map of connections.
  connectionManagerService.addConnection(id, ws);

  // Send a greeting to tell the client its id.
  sendMessage(ws, helloMessage(id));

  // Send an ICE server configuration to the client. For STUN this is synchronous,
  // for TURN it might require getting credentials.
  sendMessage(ws, iceServersMessage([{ urls: ICE_SERVERS }]));

  ws.on('close', handleCloseForPeer(id));

  ws.on('message', handleMessageForPeer(id));
});
