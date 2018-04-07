# remote-logging-react-native-redux
remote logging for react native and redux store with a remote elastic-search kibana center


## 1. Install
`npm install --save react-native-remote-logger`

## 2. Import the classes
`import { RemoteLogger, RemoteLoggerReduxMid } from 'react-native-remote-logger';`

## 3. Configure your client
```
const RemoteLoggerClient = new RemoteLogger({
    maxPerRequest: 10,
    clientId: 'counter',
    endpoint: 'https://.us-west-2.es.amazonaws.com/_bulk'
});
```

## 4. Appened the curry utility to the middleware of your redux store
```
const middleware = applyMiddleware(thunk, RemoteLoggerReduxMid.bind(null, RemoteLoggerClient))
...cuted code...
...cuted code...
return createStore(rootReducer, data, middleware)
```

## Complete Redux Thunk Example
```
cat examples/Counters/src/createStore.js                                                        ✓  11211  00:06:36
// @flow

import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
// 2. Import the classes
import { RemoteLogger, RemoteLoggerReduxMid } from 'react-native-remote-logger'

import { app } from './modules'

// 3. Configure your client
const RemoteLoggerClient = new RemoteLogger({
    maxPerRequest: 10,
    clientId: 'counter',
    endpoint: 'https://.us-west-2.es.amazonaws.com/_bulk'
});

// 4. Appened the curry utility to the middleware of your redux store
const middleware = applyMiddleware(thunk, RemoteLoggerReduxMid.bind(null, RemoteLoggerClient))

export default (data: Object = {}) => {
  const rootReducer = combineReducers({
    //every modules reducer should be define here
    [app.NAME]: app.reducer
  })

  return createStore(rootReducer, data, middleware)
}
```
