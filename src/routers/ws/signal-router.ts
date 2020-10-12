import Router from 'koa-router';
import { MiddlewareContext } from 'koa-websocket';
import { DefaultState, DefaultContext } from 'koa';
import { v4 } from 'uuid';

import { logger as baseLogger } from '../../logging/logger';
import { AppConfig, RouteConfig } from '../../config';
import {
  byeMessage,
  ErrorType,
  heartbeatMessage,
  helloMessage,
  iceServersMessage,
  isHeartbeatMessage,
  Peer,
  SignalingMessageType,
} from '../../models';
import { connectionManagerService, sessionManagerService } from '../../services';
import { parseMessage, sendMessage } from '../../utils/message-utils';
import { getIceServers } from '../../utils/ice-server-utils';

const logger = baseLogger.child({ module: 'SignalRouter' });
const {
  signal: { prefix },
} = RouteConfig;
const { HEARTBEAT_INTERVAL } = AppConfig;

const handleAnswerMessage = (sourcePeer: Peer, sourcePeerId: string, destinationPeer: Peer, destinationPeerId: string) => {
  sessionManagerService.createSession(destinationPeerId, sourcePeerId);
  sourcePeer.peerConnections.push(destinationPeerId);
  destinationPeer.peerConnections.push(sourcePeerId);
};

const handleByeMessage = (sourcePeer: Peer, sourcePeerId: string, destinationPeer: Peer, destinationPeerId: string) => {
  sessionManagerService.endSession(sourcePeerId, destinationPeerId);
  const destinationPeerIndex = sourcePeer.peerConnections.findIndex((id) => id === destinationPeerId);
  if (destinationPeerIndex > -1) {
    sourcePeer.peerConnections.splice(destinationPeerIndex, 1);
  }
  const sourcePeerIndex = destinationPeer.peerConnections.findIndex((id) => id === sourcePeerId);
  if (sourcePeerIndex > -1) {
    destinationPeer.peerConnections.splice(sourcePeerIndex, 1);
  }
};

// Remove the connection. Note that this does not tell anyone you are currently in a call with
// that this happened. This would require additional statekeeping that is not done here.
const handleCloseForPeer = (id: string, intervalId: NodeJS.Timeout) => () => {
  logger.info(`Connection has been closed for id: ${id}`);
  clearInterval(intervalId);
  const connectedPeers = connectionManagerService.getConnectedPeers(id);
  connectedPeers.forEach((peer) => {
    sendMessage(peer, byeMessage(id));
  });
  connectionManagerService.removePeer(id);
};

const handleMessageForPeer = (sourcePeerId: string) => (rawMessage: string) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const sourcePeer = connectionManagerService.getPeer(sourcePeerId)!;

  if (isHeartbeatMessage(rawMessage)) {
    return;
  }

  const message = parseMessage(rawMessage);

  // Sending a 'bye' message with an appropriate error text
  if (!message) {
    sendMessage(sourcePeer.ws, byeMessage('', ErrorType.InvalidMessageFormat));
    return;
  }

  const {
    payload: { id: destinationPeerId },
  } = message;

  // The direct lookup of the other clients websocket is overly simplified.
  // In the real world you might be running in a cluster and would need to send
  // messages between different servers in the cluster to reach the other side.
  const destinationPeer = connectionManagerService.getPeer(destinationPeerId);

  if (!destinationPeer) {
    logger.info(`Peer id '${destinationPeerId}' provided by client '${sourcePeerId}' cannot be found`);
    // Sending a 'bye' message with an appropriate error text
    sendMessage(sourcePeer.ws, byeMessage(destinationPeerId, ErrorType.NotFound));
    return;
  }

  switch (message.type) {
    case SignalingMessageType.Answer:
      handleAnswerMessage(sourcePeer, sourcePeerId, destinationPeer, destinationPeerId);
      break;
    case SignalingMessageType.Bye:
      handleByeMessage(sourcePeer, sourcePeerId, destinationPeer, destinationPeerId);
      break;
    default:
      break;
  }

  // Stamp messages with our id. In the client-to-server direction, 'id' is the
  // client that the message is sent to. In the server-to-client direction, it is
  // the client that the message originates from.
  message.payload.id = sourcePeerId;
  sendMessage(destinationPeer.ws, message, (err) => {
    if (err) {
      logger.info(`Failed to send message to peer '${destinationPeerId}' from client '${sourcePeerId}'`);
    }
  });
};

export const signalRouter = new Router<DefaultState, MiddlewareContext<DefaultState> & DefaultContext>({ prefix });

signalRouter.get('/', async ({ websocket: ws }) => {
  // Assign an id to the client. The other alternative is to have the client
  // pick its id and tell us. But that needs handle duplicates. It is preferable
  // if you have ids from another source but requires some kind of authentication.
  // TODO: Replace with OAuth
  const id = v4();
  logger.info(`New connection with id '${id}' has been received`);

  if (connectionManagerService.hasPeer(id)) {
    logger.info(`A duplicate connection with id '${id}' has been detected. Closing...`);
    ws.close();
    return;
  }

  const heartbeatIntervalId = setInterval(() => {
    sendMessage(ws, heartbeatMessage());
  }, HEARTBEAT_INTERVAL);

  // Store the connection in our map of connections.
  connectionManagerService.addPeer(id, ws);

  // Send a greeting to tell the client its id.
  sendMessage(ws, helloMessage(id));

  // Send an ICE server configuration to the client. For STUN this is synchronous,
  // for TURN it might require getting credentials.
  const iceServers = await getIceServers();
  sendMessage(ws, iceServersMessage(iceServers));

  ws.on('close', handleCloseForPeer(id, heartbeatIntervalId));

  ws.on('message', handleMessageForPeer(id));
});
