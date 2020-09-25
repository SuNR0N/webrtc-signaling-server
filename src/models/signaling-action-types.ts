export const HELLO_MESSAGE = 'hello';
export const ICE_SERVERS_MESSAGE = 'iceServers';

interface HelloMessageAction {
  type: typeof HELLO_MESSAGE;
  payload: string;
}

interface ICEServersMessageAction {
  type: typeof ICE_SERVERS_MESSAGE;
  payload: RTCIceServer[];
}

export interface ClientMessageAction {
  id: string;
}

export type SignalingActionTypes = HelloMessageAction | ICEServersMessageAction | ClientMessageAction;
