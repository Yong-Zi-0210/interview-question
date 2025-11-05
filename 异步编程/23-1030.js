class myPromise {
  constructor(excutor) {
    try {
      this.initValue();
      this.initBind();
      excutor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }
  initValue() {
    this.promiseResult = undefined;
    this.promiseSattus = "pending";
    this.fulfillCallback = []
    this.rejectCallback = []
  }
  initBind() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }
  resolve(value) {
    if (this.promiseSattus !== "pending") return;
    this.promiseResult = value;
    this.promiseSattus = "fulfilled";
    while(this.fulfillCallback.length){
      this.fulfillCallback.shift()(this.promiseResult)
    }
  }

  reject(reason) {
    if (this.promiseSattus !== "pending") return;
    this.promiseResult = reason;
    this.promiseSattus = "rejected";
    while(this.rejectCallback.length){
      this.fulfillCallback.shift()(this.promiseResult)
    }
  }

  static then(onFulFilled, onRejected) {
    onFulFilled = typeof onFulFilled === 'function' ? onFulFilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason}
    const thenPromise = new myPromise((resolve, reject) => {
      if(this.promiseSattus === 'fulfilled'){
        exceutor(onFulFilled)
      }
      if(this.promiseSattus === 'rejected'){
        exceutor(onRejected)
      }
      if(this.promiseSattus === 'pending'){
        this.fulfillCallback.push(exceutor.bind(this, onFulFilled))
        this.rejectCallback.push(exceutor.bind(this, onRejected))

      }
      const exceutor = (callback) => {
        setTimeout(() => {
          try {
            const res = callback(this.promiseResult)
            if(res && res === thenPromise){
              throw new Error('Cannot return to itself')
            }
            if(res instanceof myPromise){
              res.then(resolve, reject)
            } else {
              resolve(res)
            }
          } catch (error) {
            reject(error)
            throw new Error(error);
          }
        })
      }
    })

    return thenPromise
  }
}
