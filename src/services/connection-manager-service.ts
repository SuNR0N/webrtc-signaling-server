import WebSocket from 'ws';

import { logger as baseLogger } from '../logging/logger';

const logger = baseLogger.child({ module: 'ConnectionManagerService' });

class ConnectionManagerService {
  private _connections: Map<string, WebSocket> = new Map();

  addConnection(id: string, ws: WebSocket): void {
    this._connections.set(id, ws);
    logger.info(`A peer connection with id '${id}' has been registered`);
  }

  getConnection(id: string): WebSocket | undefined {
    return this._connections.get(id);
  }

  getIdByConnection(ws: WebSocket): string | undefined {
    const [id] = Array.from(this._connections.entries()).find(([, connection]) => connection === ws) || [];
    return id;
  }

  hasConnection(id: string): boolean {
    return this._connections.has(id);
  }

  removeConnection(id: string): boolean {
    const deleted = this._connections.delete(id);
    if (deleted) {
      logger.info(`A peer connection with id '${id}' has been removed`);
    }
    return deleted;
  }
}

export const connectionManagerService = new ConnectionManagerService();
