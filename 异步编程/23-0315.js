class myPromise {
  constructor(executor) {
    this.initValue();
    this.initBind();
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }
  initValue() {
    this.promiseState = "pending";
    this.promiseResult = undefined;
    this.fulfilledCallback = [];
    this.rejectedCallback = [];
  }
  initBind() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }
  resolve(value) {
    if (this.promiseState !== "pending") return;
    this.promiseResult = value;
    this.promiseState = "fulfilled";
    while (this.fulfilledCallback.length) {
      this.fulfilledCallback.shift()(value);
    }
  }
  reject(reason) {
    if (this.promiseState !== "pending") return;
    this.promiseResult = reason;
    this.promiseState = "rejected";
    while (this.rejectedCallback.length) {
      this.rejectedCallback.shift()(reason);
    }
  }
  then(fulfilled, rejected) {
    fulfilled = typeof fulfilled === "function" ? fulfilled : (value) => value;
    rejected =
      typeof rejected === "function"
        ? rejected
        : (reason) => {
            throw reason;
          };
    const thenPromise = new myPromise((resolve, reject) => {
      if (this.promiseState === "fulfilled") {
        executorPromise(fulfilled);
      } else if (this.promiseState === "rejected") {
        executorPromise(rejected);
      } else if (this.promiseState === "pending") {
        this.fulfilledCallback.push(executorPromise.bind(this, fulfilled));
        this.rejectedCallback.push(executorPromise.bind(this, rejected));
      }
      const executorPromise = (callback) => {
        setTimeout(() => {
          try {
            const res = callback(this.promiseResult);
            if (res && res === thenPromise) {
              throw new Error("Cannot return to itself");
            }
            if (res instanceof myPromise) {
              res.then(resolve, reject);
            } else {
              resolve(res);
            }
          } catch (error) {
            reject(error);
            throw new Error(error);
          }
        });
      };
    });
    return thenPromise;
  }
  static all(promiseList) {
    return new myPromise((resolve, reject) => {
      const promiseResult = [];
      const addRes = (value, index) => {
        promiseResult[index] = value;
        if (promiseResult.length === promiseList.length) {
          resolve(promiseResult);
        }
      };
      promiseList.forEach((promise, index) => {
        if (promise instanceof myPromise) {
          promise.then(
            (res) => {
              addRes(res, index);
            },
            (reason) => {
              reject(reason);
            }
          );
        } else {
          addRes(promise, index);
        }
      });
    });
  }
  static allSettled(promiseList) {
    return new myPromise((resolve) => {
      const promiseResult = [];
      const addRes = (state, value, index) => {
        promiseResult[index] = {
          value,
          state,
        };
        if (promiseResult.length === promiseList.length) {
          resolve(promiseResult);
        }
      };
      promiseList.forEach((promise, index) => {
        if (promise instanceof myPromise) {
          promise.then(
            (res) => {
              addRes("fulfilled", res, index);
            },
            (reason) => {
              addRes("rejected", reason, index);
            }
          );
        } else {
          addRes("fulfilled", promise, index);
        }
      });
    });
  }
  static race(promiseList) {
    return new myPromise((resolve, reject) => {
      promiseList.forEach((promise) => {
        if (promise instanceof myPromise) {
          promise.then(
            (res) => {
              resolve(res);
            },
            (reason) => {
              reject(reason);
            }
          );
        } else {
          resolve(promise);
        }
      });
    });
  }

  static any(promiseList) {
    return new myPromise((resolve, reject) => {
      let count = 0;
      promiseList.forEach((promise) => {
        if (promise instanceof myPromise) {
          promise.then(
            (res) => {
              resolve(res);
            },
            (reason) => {
              count++;
              if (count === promiseList.length) {
                reject(new AggregateError("All Promise were rejected"));
              }
            }
          );
        } else {
          resolve(promise);
        }
      });
    });
  }
  static catch(onRejected) {
    return this.then(undefined, onRejected);
  }
}
