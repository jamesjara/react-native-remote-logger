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
      maxPerRequest: 100
    }, config);
    this.data = [];
  }

  _createClass(RemoteLogger, [{
    key: 'addEntry',
    value: function addEntry(value) {
      this.data.push(value);
    }
  }, {
    key: 'send',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return fetch(this.config.endpoint, {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(this.data)
                });

              case 3:
                this.data = [];
                this.data.length = 0;
                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context['catch'](0);

                // eslint-disable-next-line no-console
                console.log('RL ERROR - ', _context.t0);

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 7]]);
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
      } else {
        if (this.config.debug === true) {
          // eslint-disable-next-line no-console
          console.log('RL', value);
        }
        this.addEntry(value);
      }
    }
  }]);

  return RemoteLogger;
}();

// eslint-disable-next-line no-shadow


function RemoteLoggerReduxMid(RemoteLogger, _ref2) {
  var getState = _ref2.getState;

  return function (next) {
    return function (action) {
      var prevState = getState();
      var returnValue = next(action);
      var nextState = getState();
      var entry = {
        prev: prevState,
        action: returnValue,
        next: nextState
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