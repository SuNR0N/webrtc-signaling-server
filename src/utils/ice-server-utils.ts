import { AppConfig } from '../config';
import { twilioService } from '../services';
import { logger as baseLogger } from '../logging/logger';

const { STUN_SERVERS, TURN_SERVERS } = AppConfig;

const logger = baseLogger.child({ module: 'ICEServerUtils' });

export const getIceServers = async (): Promise<RTCIceServer[]> => {
  const iceServers: RTCIceServer[] = STUN_SERVERS.map((url) => ({
    urls: url,
  }));
  try {
    const { ice_servers: twilioICEServers } = await twilioService.getTokens();
    const turnServers = TURN_SERVERS.reduce((acc, url) => {
      const turnServer = twilioICEServers.find((iceServer) => iceServer.url === url);
      if (turnServer) {
        acc.push({ username: turnServer.username, credential: turnServer.credential, urls: turnServer.urls });
      } else {
        logger.info(`Could not find TURN server configuration for '${url}'`);
      }
      return acc;
    }, [] as RTCIceServer[]);
    iceServers.push(...turnServers);
  } catch (err) {
    logger.info(`Could not fetch ICE server configuration from Twilio: ${err.message}`);
  }

  return iceServers;
};
