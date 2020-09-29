interface AppConfig {
  API_SPEC_PATH: string;
  LOG_ERROR_PATH: string;
  LOG_PATH: string;
  PORT: number;
  SERVICE_NAME: string;
  STUN_SERVERS: string[];
  TURN_SERVERS: string[];
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name } = require('../../package.json');

const resolveIceServers = (value?: string): string[] => {
  if (value === undefined) {
    return [];
  }

  return value.split(' ');
};

export const AppConfig: AppConfig = {
  API_SPEC_PATH: `${__dirname}/../../openapi/${name}.spec.yml`,
  LOG_PATH: process.env.LOG_PATH || `${__dirname}/../../${name}.log`,
  LOG_ERROR_PATH: process.env.LOG_ERROR_PATH || `${__dirname}/../../${name}_error.log`,
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  SERVICE_NAME: name,
  STUN_SERVERS: resolveIceServers(process.env.STUN_SERVERS),
  TURN_SERVERS: resolveIceServers(process.env.TURN_SERVERS),
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
};
