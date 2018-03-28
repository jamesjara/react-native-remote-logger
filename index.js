
class RemoteLogger {
  constructor(config) {
    this.config = Object.assign({}, {
      endpoint: 'https://',
      debug: true,
      maxPerRequest: 100,
      clientId: 'anon3',
      type: null,
    }, config);
    this.data = [];
  }

  setClientId(clientId) {
    this.config.clientId = clientId;
  }

  addEntry(value) {
    if (typeof value === 'string') {
      return false;
    }
    this.data.push(value);
    return true;
  }

  async send() {
    const { clientId } = this.config;
    const entries = this.data.map((entry) => {
      return [
        `{ "index": { "_index": "${clientId}", "_type": "log" }}`,
        this.cleanJson(entry),
      ].join('\n');
    });
    const literalData = entries.join('\n');
    // eslint-disable-next-line
    const xhr = new XMLHttpRequest();
    xhr.open('POST', this.config.endpoint, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(`${literalData}\n`);
    // eslint-disable-next-line
      xhr.onreadystatechange = function () { 
      if (xhr.status === 200) {
        this.data = [];
        this.data.length = 0;
      } else {
        // eslint-disable-next-line no-console
        console.log('RL ERROR - ', xhr, xhr.status);
      }
    };
    // eslint-disable-next-line
    xhr.onerror = function () {
      // eslint-disable-next-line no-console
      console.log('RL ERROR - ', xhr.status);
    };
  }

  cleanJson(entry) {
    const cache = [];
    const clean = JSON.stringify(entry, (key, value) => {
      if (typeof value === 'function') {
        return undefined;
      }
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          return undefined;
        }
        cache.push(value);
      }
      return value;
    });
    return clean;
  }

  log(value) {
    if (this.data.length >= this.config.maxPerRequest) {
      this.send();
    }
    if (this.config.debug === true) {
      // eslint-disable-next-line no-console
      console.log('RL', value);
    }
    this.addEntry(value);
  }
}

// eslint-disable-next-line no-shadow
function RemoteLoggerReduxMid(RemoteLogger) {
  return next => (action) => {
    // const prevState = getState();
    const returnValue = next(action);
    // const nextState = getState();
    const entry = {
      timestamp: new Date(),  
      // prev: prevState,
      action: returnValue,
      // next: nextState,
    };
    RemoteLogger.log(entry);
    return returnValue;
  };
}

module.exports = {
  RemoteLogger,
  RemoteLoggerReduxMid,
};
