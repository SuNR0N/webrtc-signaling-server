# webrtc-signaling-server

## Environment variables

Set up a `.env` file as follows:

```sh
ICE_SERVERS=stun:stun.l.google.com:19302
# LOG_ERROR_PATH=webrtc-signaling-server_error.log
# LOG_PATH=webrtc-signaling-server.log
# PORT=5000
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
