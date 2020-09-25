interface AppConfig {
  API_SPEC_PATH: string;
  ICE_SERVERS: string | string[];
  LOG_PATH: string;
  LOG_ERROR_PATH: string;
  PORT: number;
  SERVICE_NAME: string;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name } = require('../../package.json');

const resolveIceServers = (value?: string): string | string[] => {
  if (value === undefined) {
    return [];
  }

  const iceServers = value.split(' ');

  return iceServers.length > 1 ? iceServers : iceServers[0];
};

export const AppConfig: AppConfig = {
  API_SPEC_PATH: `${__dirname}/../../openapi/${name}.spec.yml`,
  ICE_SERVERS: resolveIceServers(process.env.ICE_SERVERS),
  LOG_PATH: process.env.LOG_PATH || `${__dirname}/../../${name}.log`,
  LOG_ERROR_PATH: process.env.LOG_ERROR_PATH || `${__dirname}/../../${name}_error.log`,
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  SERVICE_NAME: name,
};
