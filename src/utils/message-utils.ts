import WebSocket from 'ws';

import { ClientMessageAction, SignalingActionTypes } from '../models/signaling-action-types';
import { logger as baseLogger } from '../logging/logger';

const logger = baseLogger.child({ module: 'MessageUtils' });

export const parseMessage = (message: string): ClientMessageAction | undefined => {
  let data: ClientMessageAction;

  try {
    data = JSON.parse(message);
  } catch (err) {
    logger.info(`Invalid JSON message has been received: ${message}`);
    return;
  }

  if (!data.id) {
    logger.info(`Message does not contain an 'id' field: ${message}`);
    return;
  }

  return data;
};

export const sendMessage = (ws: WebSocket, message: SignalingActionTypes, cb?: (err?: Error | undefined) => void): void => {
  ws.send(JSON.stringify(message), cb);
};
