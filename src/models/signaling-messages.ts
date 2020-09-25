import { HELLO_MESSAGE, ICE_SERVERS_MESSAGE, SignalingActionTypes } from './signaling-action-types';

export const helloMessage = (id: string): SignalingActionTypes => ({
  type: HELLO_MESSAGE,
  payload: id,
});

export const iceServersMessage = (iceServers: RTCIceServer[]): SignalingActionTypes => ({
  type: ICE_SERVERS_MESSAGE,
  payload: iceServers,
});
