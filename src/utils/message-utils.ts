import WebSocket from 'ws';

import { ClientMessage, SignalingMessage } from '../models/signaling-message';
import { logger as baseLogger } from '../logging/logger';

const logger = baseLogger.child({ module: 'MessageUtils' });

export const parseMessage = (message: string): ClientMessage | undefined => {
  let data: ClientMessage;

  try {
    data = JSON.parse(message);
  } catch (err) {
    logger.info(`Invalid JSON message has been received: ${message}`);
    return;
  }

  if (!data.payload.id) {
    logger.info(`Message does not contain an 'id' field within its payload: ${message}`);
    return;
  }

  return data;
};

export const sendMessage = (ws: WebSocket, message: SignalingMessage, cb?: (err?: Error | undefined) => void): void => {
  const strMessage = typeof message === 'string' ? message : JSON.stringify(message);
  ws.send(strMessage, cb);
};
