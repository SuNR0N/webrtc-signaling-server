import { DefaultState, DefaultContext } from 'koa';
import { MiddlewareContext } from 'koa-websocket';
import { Middleware as MW } from 'koa-compose';

import { logger, PIPE_SEPARATOR_WITH_SPACES } from './logger';
import { connectionManagerService } from '../services';

export const messageLogger = (): MW<MiddlewareContext<DefaultState> & DefaultContext> => (ctx, next) => {
  const { headers } = ctx.request;
  ctx.websocket.on('message', (data) => {
    const id = connectionManagerService.getIdByConnection(ctx.websocket);
    const incomingMessageBase = '<-- WS Message';
    const incomingMessageSource = `Source: ${headers.origin}`;
    const incomingClientID = id && `Client ID: ${id}`;
    const incomingMessageData = data && `Data: ${data}`;
    const incomingMessageLogMessage = [incomingMessageBase, incomingMessageSource, incomingClientID, incomingMessageData]
      .filter(Boolean)
      .join(PIPE_SEPARATOR_WITH_SPACES);
    logger.info(incomingMessageLogMessage);
  });
  const proxied = ctx.websocket.send;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx.websocket.send = function (...args: any[]) {
    const [data] = args;
    const id = connectionManagerService.getIdByConnection(ctx.websocket);
    const outgoingMessageBase = '--> WS Message';
    const outgoingMessageTarget = `Target: ${headers.origin}`;
    const outgoingClientID = id && `Client ID: ${id}`;
    const outgoingMessageData = data && `Data: ${data}`;
    const outgoingMessageLogMessage = [outgoingMessageBase, outgoingMessageTarget, outgoingClientID, outgoingMessageData]
      .filter(Boolean)
      .join(PIPE_SEPARATOR_WITH_SPACES);
    logger.info(outgoingMessageLogMessage);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return proxied.apply(this, args as any);
  };
  next();
};
