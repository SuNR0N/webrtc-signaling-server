import WebSocket from 'ws';

import { Peer } from '../models';
import { logger as baseLogger } from '../logging/logger';

const logger = baseLogger.child({ module: 'ConnectionManagerService' });

class ConnectionManagerService {
  private _connections: Map<string, Peer> = new Map();

  addPeer(id: string, ws: WebSocket): void {
    const peer: Peer = {
      ws,
      peerConnections: [],
    };
    this._connections.set(id, peer);
    logger.info(`A peer connection with id '${id}' has been registered`);
  }

  getPeer(id: string): Peer | undefined {
    return this._connections.get(id);
  }

  getConnectedPeers(id: string): WebSocket[] {
    const peer = this._connections.get(id);
    return (peer?.peerConnections || []).reduce((acc, peerId) => {
      const connectedPeer = this._connections.get(peerId);
      if (connectedPeer) {
        acc.push(connectedPeer.ws);
      }
      return acc;
    }, [] as WebSocket[]);
  }

  getIdByConnection(ws: WebSocket): string | undefined {
    const [id] = Array.from(this._connections.entries()).find(([, peer]) => peer.ws === ws) || [];
    return id;
  }

  hasPeer(id: string): boolean {
    return this._connections.has(id);
  }

  removePeer(id: string): boolean {
    const deleted = this._connections.delete(id);
    if (deleted) {
      logger.info(`A peer connection with id '${id}' has been removed`);
    }
    return deleted;
  }
}

export const connectionManagerService = new ConnectionManagerService();
