// @flow

import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { RemoteLogger, RemoteLoggerReduxMid } from 'react-native-remote-logger';

import { app } from './modules'

// Create your client with you configuration
const RemoteLoggerClient = new RemoteLogger({ 
    maxPerRequest: 10, 
    clientId: 'counter', 
    endpoint: 'https://.us-west-2.es.amazonaws.com/_bulk' 
});

// Appened the curry-fn with the Remote Logger Binded
const middleware = applyMiddleware(thunk, RemoteLoggerReduxMid.bind(null, RemoteLoggerClient))

export default (data: Object = {}) => {
  const rootReducer = combineReducers({
    //every modules reducer should be define here
    [app.NAME]: app.reducer
  })

  return createStore(rootReducer, data, middleware)
}
