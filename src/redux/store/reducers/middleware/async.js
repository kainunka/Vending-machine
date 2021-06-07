import { isClientSide } from '../../../utils/helpers';

// let CONNECTION_TIMEOUT = 10000;
const cachedIsClientSide = isClientSide();

// if (!cachedIsClientSide) {
//   // part of server init time
//   CONNECTION_TIMEOUT = 600;
// }

const canceledRes = 'canceled';

export default class AsyncMiddleware {
  _req;

  _waRequests = {};

  _xhrRequests = {};

  constructor(req) {
    this._req = req;
  }

  create() {
    return (state) => {
      return (next) => {
        return (action) => {
          const {
            types = {},
            call,
            callXhr,
            reqKey,
            cancelActiveReq,
            ...rest
          } = action;
          const {
            success,
            error,
            update,
            pending,
          } = types;

          // handle promise calls and return success/errors
          if (pending) {
            next({ ...rest, type: pending });
          }
          if (call) {
            const {
              serverInstance:{
              actions: {
                Error: {
                  handledWebApiErrors,
                  handleWebApiConnectionTimeout,
                  clearWebApiConnectionTimeout,
                },
              }
            }
          } = state.getState()
            let callTimeout;

            return new Promise((resolve, reject) => {
              if (reqKey) {
                if (cancelActiveReq && this._waRequests[reqKey]) {
                  this._waRequests[reqKey](canceledRes);
                }
                this._waRequests[reqKey] = reject;
              }

              call.then(resolve).catch(reject);
            }).then((result) => {
              clearTimeout(callTimeout);
              clearWebApiConnectionTimeout();
              if (success) {
                delete this._waRequests[reqKey];
                next({ ...rest, result, type: success });
              }
              return result;
            }).catch((err) => {
              clearTimeout(callTimeout);
              clearWebApiConnectionTimeout();

              if (err !== canceledRes) {
                delete this._waRequests[reqKey];
                // console.warn('WebApi error when processing action:', types, err);

                if (error) {
                  next({ ...rest, error: err, type: error });
                } else if (cachedIsClientSide) {
                  handledWebApiErrors({ ...rest, error: err });
                }
              }
            });
          }

          if (callXhr) {
            const {
              serverInstance:{
              actions: {
                Error: { handleXhrDataErrors },
              },
            }
          } = state.getState()
            let callTimeout;

            return new Promise((resolve, reject) => {
              if (reqKey) {
                if (cancelActiveReq && this._xhrRequests[reqKey]) {
                  this._xhrRequests[reqKey](canceledRes);
                }
                this._xhrRequests[reqKey] = reject;
              }
           
              callXhr.then(resolve).catch(reject);
            }).then((result) => {
              clearTimeout(callTimeout);
              if (success) {
                delete this._xhrRequests[reqKey];
                next({ ...rest, result, type: success });
              }
              return result;
            }).catch((err) => {
              clearTimeout(callTimeout);

              if (err !== canceledRes) {
                delete this._xhrRequests[reqKey];
                // console.warn('XHR error when processing action:', types);
                // console.error(err);
                // const newErr = new Error('xhrReqError');
                // newErr.stack = err.stack;
                let newErr = new Error('xhrReqError');
                const {response:{data}={}} = err
                if(data){
                  const {error:newError} = data
                  newErr = newError
                }
                if (error) {
                  next({ ...rest, error: newErr, type: error });
                } else if (cachedIsClientSide) {
                  handleXhrDataErrors({ ...rest, error: newErr, type: error });
                }
              }
            });
          }


          return next(action);
        };
      };
    };
  }
}
