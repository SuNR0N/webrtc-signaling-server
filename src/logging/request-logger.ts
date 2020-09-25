import { Middleware } from 'koa';

import { logger, PIPE_SEPARATOR_WITH_SPACES } from './logger';

export const requestLogger = (): Middleware => async (ctx, next) => {
  const start = Date.now();
  const { request } = ctx;
  const { body: reqBody, header: reqHeaders, method, url } = request;
  const requestBase = `<-- ${method} ${url}`;
  const requestHeaders = reqHeaders && `Headers: ${JSON.stringify(reqHeaders)}`;
  const requestBody = reqBody && `Body: ${JSON.stringify(reqBody)}`;
  const requestLogMessage = [requestBase, requestHeaders, requestBody].filter(Boolean).join(PIPE_SEPARATOR_WITH_SPACES);
  logger.info(requestLogMessage);

  await next();

  const finish = Date.now();
  const duration = finish - start;
  const { response } = ctx;
  const { body: resBody, header: resHeaders, status } = response;
  const responseBase = `--> ${method} ${url} ${status} ${duration}ms`;
  const responseHeaders = resHeaders && `Headers: ${JSON.stringify(resHeaders)}`;
  const responseBody = resBody && `Body: ${JSON.stringify(resBody)}`;
  const responseLogMessage = [responseBase, responseHeaders, responseBody].filter(Boolean).join(PIPE_SEPARATOR_WITH_SPACES);
  logger.info(responseLogMessage);
};
