import WebSocket from 'ws';

export interface Peer {
  ws: WebSocket;
  peerConnections: string[];
}
