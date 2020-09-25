interface RouteConfig {
  signal: Route;
  swagger: Route;
}

interface Route {
  prefix: string;
}

export const RouteConfig: RouteConfig = {
  signal: {
    prefix: '/signal',
  },
  swagger: {
    prefix: '/docs',
  },
};
