import isEqual from 'react-fast-compare';

export default class CombineActionsMiddleware {
  _req;

  constructor(req) {
    this._req = req;
  }

  _getPromises = (next, action) => {
    const { payload, sequence } = action;
    let promise;

    if (sequence) {
      promise = payload.reduce((result, item) => {
        return result.then((response) => {
          const itemVal = item(response);

          if (!this._isArrayOfFunctions(itemVal.payload)) {
            return next(itemVal);
          }

          return this._getPromises(next, itemVal);
        });
      }, Promise.resolve());
    } else {
      promise = Promise.all(payload.map((item) => {
        const itemVal = item();

        if (!this._isArrayOfFunctions(itemVal.payload)) {
          return next(itemVal);
        }

        return this._getPromises(next, itemVal);
      }));
    }

    return promise;
  };

  create() {
    return () => {
      return (next) => {
        return (action) => {
          if (!this._isArrayOfFunctions(action.payload)) {
            return next(action);
          }

          const {
            types: { pending, success, error } = {},
            payload,
            sequence,
            ...restActions
          } = action;

          if (pending) {
            next({ ...restActions, type: pending });
          }

          return this._getPromises(next, action).then((result) => {

            if (success) {
              next({
                ...restActions,
                result,
                type: success,
              });
            }

            return result;
          }, (err) => {
            if (error) {
              next({
                ...restActions,
                error: err,
                type: error,
              });
            }
          });
        };
      };
    };
  }

  _isArrayOfFunctions(array) {
    return Array.isArray(array) && array.length > 0 && array.every((item) => {
      return item instanceof Function;
    });
  }

  _removeFinishedAction(pendingData, action) {
    return pendingData.filter(item => {
      return isEqual(item.args, action.args) && isEqual(item.types, action.types);
    });
  }
}
