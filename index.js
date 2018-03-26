
class RemoteLogger {
  constructor(config) {
    this.config = Object.assign({}, {
      endpoint: 'https://',
      debug: true,
      maxPerRequest: 100,
    }, config);
    this.data = [];
  }

  addEntry(value) {
    this.data.push(value);
  }

  async send() {
    try {
      await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.data),
      });
      this.data = [];
      this.data.length = 0;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('RL ERROR - ', error);
    }
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
function RemoteLoggerReduxMid(RemoteLogger, { getState }) {
  return next => (action) => {
    const prevState = getState();
    const returnValue = next(action);
    const nextState = getState();
    const entry = {
      prev: prevState,
      action: returnValue,
      next: nextState,
    };
    RemoteLogger.log(entry);
    return returnValue;
  };
}

module.exports = {
  RemoteLogger,
  RemoteLoggerReduxMid,
};
