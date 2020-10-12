export enum SignalingMessageType {
  Answer = 'answer',
  Bye = 'bye',
  Hello = 'hello',
  IceServers = 'iceServers',
}

interface Message {
  type: string;
}

interface MessageWithPayload<T> extends Message {
  payload: T;
}

interface IdPayload {
  id: string;
}

interface ErrorPayload extends IdPayload {
  error?: string;
}

interface ICEServersPayload {
  iceServers: RTCIceServer[];
}

interface AnswerMessage extends MessageWithPayload<IdPayload> {
  type: typeof SignalingMessageType.Answer;
}

interface ByeMessage extends MessageWithPayload<ErrorPayload> {
  type: typeof SignalingMessageType.Bye;
}

type HeartbeatMessage = '\n';

interface HelloMessage extends MessageWithPayload<IdPayload> {
  type: typeof SignalingMessageType.Hello;
}

interface ICEServersMessage extends MessageWithPayload<ICEServersPayload> {
  type: typeof SignalingMessageType.IceServers;
}

export type ClientMessage = AnswerMessage | ByeMessage | MessageWithPayload<IdPayload>;

export type SignalingMessage = ClientMessage | HeartbeatMessage | HelloMessage | ICEServersMessage;

export const isHeartbeatMessage = (message: string): message is HeartbeatMessage => message === '\n';

export const byeMessage = (id: string, error?: string): ByeMessage => ({
  type: SignalingMessageType.Bye,
  payload: {
    id,
    error,
  },
});

export const heartbeatMessage = (): HeartbeatMessage => '\n';

export const helloMessage = (id: string): HelloMessage => ({
  type: SignalingMessageType.Hello,
  payload: {
    id,
  },
});

export const iceServersMessage = (iceServers: RTCIceServer[]): ICEServersMessage => ({
  type: SignalingMessageType.IceServers,
  payload: {
    iceServers,
  },
});
