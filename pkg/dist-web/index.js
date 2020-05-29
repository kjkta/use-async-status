import { useState } from 'react';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var AsyncStates;

(function (AsyncStates) {
  AsyncStates["Idle"] = "Idle";
  AsyncStates["Pending"] = "Pending";
  AsyncStates["Success"] = "Success";
  AsyncStates["Error"] = "Error";
})(AsyncStates || (AsyncStates = {}));

function useAsyncStatus(asyncFn, successTimeout // How long Success state is active until reverting to Idle
) {
  var [{
    status,
    lastResult,
    lastError
  }, updateState] = useState({
    status: AsyncStates.Idle,
    lastResult: null,
    lastError: null
  }); // Thing that calls the async function

  function trigger() {
    return _trigger.apply(this, arguments);
  }

  function _trigger() {
    _trigger = _asyncToGenerator(function* () {
      updateState(state => _objectSpread2(_objectSpread2({}, state), {}, {
        status: AsyncStates.Pending
      }));

      try {
        var result = yield asyncFn(...arguments);
        updateState(state => _objectSpread2(_objectSpread2({}, state), {}, {
          status: AsyncStates.Success,
          lastResult: result
        }));

        if (successTimeout !== undefined) {
          // Reset to Idle state
          setTimeout(function () {
            updateState(state => _objectSpread2(_objectSpread2({}, state), {}, {
              status: AsyncStates.Idle
            }));
          }, successTimeout);
        } // Return the result of the async function


        return result;
      } catch (error) {
        updateState(state => _objectSpread2(_objectSpread2({}, state), {}, {
          status: AsyncStates.Error,
          lastError: error
        })); // Return the error

        return error;
      }
    });
    return _trigger.apply(this, arguments);
  }

  function reset() {
    updateState(state => _objectSpread2(_objectSpread2({}, state), {}, {
      status: AsyncStates.Idle,
      lastResult: null,
      lastError: null
    }));
  }

  return {
    trigger,
    status,
    lastResult,
    lastError,
    reset
  };
}

export { useAsyncStatus };