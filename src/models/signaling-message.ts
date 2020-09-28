export enum SignalingMessageType {
  Hello = 'hello',
  IceServers = 'iceServers',
}

interface HelloMessage {
  type: typeof SignalingMessageType.Hello;
  payload: string;
}

interface ICEServersMessage {
  type: typeof SignalingMessageType.IceServers;
  payload: RTCIceServer[];
}

export interface ClientMessage {
  payload: {
    id: string;
  };
}

export type SignalingMessage = HelloMessage | ICEServersMessage | ClientMessage;

export const helloMessage = (id: string): SignalingMessage => ({
  type: SignalingMessageType.Hello,
  payload: id,
});

export const iceServersMessage = (iceServers: RTCIceServer[]): SignalingMessage => ({
  type: SignalingMessageType.IceServers,
  payload: iceServers,
});
