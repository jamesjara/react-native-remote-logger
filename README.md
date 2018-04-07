# remote-logging-react-native-redux
Remote logging for react native and redux store on top of  elastic-search kibana dashboard.
Features:
- Bulk updates to save bandwidth 
- Indexing data by key(clientId)
- Offline support
- Created for redux and thunk
- Entries are composed by the action value
- Time based, automatically timestamp per entry

## Install
`npm install --save react-native-remote-logger`

# Complete Redux Thunk Example
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

# API
## Constructor
maxPerRequest: Integer, How many entries would you like to bulk per request
clientId: String, Elastic Search Index
endpoint: Strig, URL of your elastic search
debug: bool, Set to true to show in the inspector the entry value

## setClientId:
Update the elastic search index

## RemoteLoggerReduxMid:
Curry function for the Middleware

# Elastic Search + KIBANA
## AWS Deploy:
Create a new instance in less than 5 minutes here: https://aws.amazon.com/elasticsearch-service/

## Create a index per clientId
1. Go to management > Index Patterns > Create index pattern
2. Write down the client id which is the index pattern
3. Go to Discover > search the recently created index pattern


# VIDEO DEMO
https://www.youtube.com/watch?v=k73ifeAnLVg&feature=youtu.be

