# webrtc-signaling-server

## STUN servers

```sh
stun.l.google.com:19302
stun1.l.google.com:19302
stun2.l.google.com:19302
stun3.l.google.com:19302
stun4.l.google.com:19302

stun:global.stun.twilio.com:3478?transport=udp
```

## TURN servers

```sh
turn:global.turn.twilio.com:3478?transport=udp
turn:global.turn.twilio.com:3478?transport=tcp
turn:global.turn.twilio.com:443?transport=tcp
```

Twilio's TURN servers can be used to avoid the complexity of setting up our own TURN server.

The short lived credentials (24 hours TTL) for the TURN servers can be retrieved by calling Twilio's REST APIs using your Twilio's account credentials.

Given a TURN server is configured for ICE servers then _icecandidate (relay)_ events can be seen as well in the `chrome://webrtc-internals/` tab in _Google Chrome_.

## Environment variables

Set up a `.env` file as follows:

```sh
# LOG_ERROR_PATH=webrtc-signaling-server_error.log
# LOG_PATH=webrtc-signaling-server.log
# PORT=5000
STUN_SERVERS=stun:stun.l.google.com:19302
TURN_SERVERS=turn:global.turn.twilio.com:3478?transport=udp
TWILIO_ACCOUNT_SID=Your-Twilio-Account-SID
TWILIO_AUTH_TOKEN=Your-Twilio-Auth-Token
```

## Prerequisites

- [yarn](https://classic.yarnpkg.com/en/docs/install#debian-stable)

## Install

```sh
yarn
```

## Build

```sh
yarn build
```

## Run

```sh
# Start the built server
yarn start

# Start the server using ts-node
yarn dev

# Start the server in watch mode
yarn watch
```

## Lint

```sh
# Lint code
yarn lint

# Lint code with trying to fix potential issues automatically
yarn lint:fix
```

## API specifaction

Once the server is running the OpenAPI 3.0 specification can be accessed at http://localhost:5000/docs
