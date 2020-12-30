# Chat application - front vuejs

An example of a Chat application in JS with room management registration and real login saved in MongoDB written in typescript

The back part is here: https://github.com/juliendu11/Chat-Application-Back-Express (it's Express and Socket.io in typescript)

## TODO

- [X] Enforce typescript because is not full typescript
- [] Add unit tests
- [] Add e2e tests
- [X] Refresh jwt token before expiration
- [] Add private message
- [] Show all member registered not just online
- [] Sending image
- [X] Add env for API URL
- [] Add support push notification (PWA)
- [] Email format verification for Auth page
- [] Add retype password for register page
- [X] Add users list connected per room
- [X] Add logout
- [] Load more messages when scroll in TOP
- [X] Private room

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
