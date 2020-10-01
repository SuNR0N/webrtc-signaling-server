import { logger as baseLogger } from '../logging/logger';
import { Session } from '../models';

const logger = baseLogger.child({ module: 'SessionManagerService' });

class SessionManagerService {
  private _sessions: Session[] = [];

  createSession(sourceId: string, destinationId: string) {
    const now = new Date().toISOString();
    const session: Session = {
      destinationId,
      sourceId,
      startTime: now,
    };
    this._sessions.push(session);
    logger.info(`A new session has been created: ${JSON.stringify(session)}`);
  }

  endSession(...ids: string[]) {
    const now = new Date().toISOString();
    const activeSession = this._sessions.find(
      (session) =>
        ids.includes(session.sourceId) &&
        ids.includes(session.destinationId) &&
        session.sourceId !== session.destinationId &&
        session.endTime === undefined
    );
    if (activeSession) {
      const startTime = new Date(activeSession.startTime).getTime();
      const endTime = new Date(now).getTime();
      activeSession.endTime = now;
      activeSession.duration = endTime - startTime;
      logger.info(`Session has ended: ${JSON.stringify(activeSession)}`);
    } else {
      logger.info(`Could not find active session for the following ids: ${ids}'`);
    }
  }
}

export const sessionManagerService = new SessionManagerService();
