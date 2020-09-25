import Koa, { DefaultState, DefaultContext } from 'koa';
import websockify, { Middleware } from 'koa-websocket';

import * as httpRouters from './routers/http';
import * as wsRouters from './routers/ws';
import { messageLogger, requestLogger } from './logging';

export const app = websockify(new Koa());

// HTTP
Object.values(httpRouters).forEach((router) => {
  app.use(router.routes());
  app.use(router.allowedMethods());
});

// WebSocket
app.ws.use(requestLogger());
app.ws.use(messageLogger());

Object.values(wsRouters).forEach((router) => {
  app.ws.use(router.routes() as Middleware<DefaultState, DefaultContext>);
  app.ws.use(router.allowedMethods() as Middleware<DefaultState, DefaultContext>);
});
