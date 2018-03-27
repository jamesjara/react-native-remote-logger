'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objectAssign = function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RemoteLogger = function () {
  function RemoteLogger(config) {
    _classCallCheck(this, RemoteLogger);

    this.config = _objectAssign({}, {
      endpoint: 'https://',
      debug: true,
      maxPerRequest: 100,
      clientId: 'anon3',
      type: null
    }, config);
    this.data = [];
  }

  _createClass(RemoteLogger, [{
    key: 'addEntry',
    value: function addEntry(value) {
      if (typeof value === 'string') return;
      this.data.push(value);
    }
  }, {
    key: 'send',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var clientId, entries, literalData, xhr;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                clientId = this.config.clientId;
                entries = this.data.map(function (entry) {
                  // eslint-disable-next-line
                  entry.timestamp = new Date();
                  return ['{ "index": { "_index": "' + clientId + '", "_type": "log" }}', JSON.stringify(entry)].join('\n');
                });
                literalData = entries.join('\n');
                // eslint-disable-next-line

                xhr = new XMLHttpRequest();

                xhr.open('POST', this.config.endpoint, true);
                xhr.setRequestHeader('Content-type', 'application/json');
                xhr.send(literalData + '\n');
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

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function send() {
        return _ref.apply(this, arguments);
      }

      return send;
    }()
  }, {
    key: 'log',
    value: function log(value) {
      if (this.data.length >= this.config.maxPerRequest) {
        this.send();
      }
      if (this.config.debug === true) {
        // eslint-disable-next-line no-console
        console.log('RL', value);
      }
      this.addEntry(value);
    }
  }]);

  return RemoteLogger;
}();

// eslint-disable-next-line no-shadow


function RemoteLoggerReduxMid(RemoteLogger) {
  return function (next) {
    return function (action) {
      // const prevState = getState();
      var returnValue = next(action);
      // const nextState = getState();
      var entry = {
        // prev: prevState,
        action: returnValue
        // next: nextState,
      };
      RemoteLogger.log(entry);
      return returnValue;
    };
  };
}

module.exports = {
  RemoteLogger: RemoteLogger,
  RemoteLoggerReduxMid: RemoteLoggerReduxMid
};