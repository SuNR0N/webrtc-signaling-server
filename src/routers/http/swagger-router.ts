import Router from 'koa-router';
import { koaSwagger } from 'koa2-swagger-ui';
import yamljs from 'yamljs';

import { AppConfig, RouteConfig } from '../../config';

const { API_SPEC_PATH } = AppConfig;
const {
  swagger: { prefix },
} = RouteConfig;

export const swaggerRouter = new Router({ prefix });

const spec = yamljs.load(API_SPEC_PATH);

swaggerRouter.get('/', koaSwagger({ routePrefix: false, swaggerOptions: { spec } }));
