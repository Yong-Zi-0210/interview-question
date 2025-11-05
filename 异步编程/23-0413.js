class myPromise {
  constructor(excutor) {
    this.initValue();
    this.initBind();
    try {
      excutor(this.resolve, this.reject);
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
    this.reject = this.reject.bin(this);
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
    const thenPromise = new myPromise((resolve, reject) => {
      fulfilled =
        typeof fulfilled !== "function" ? (value) => value : fulfilled;
      rejected =
        typeof rejected !== "function"
          ? (reason) => {
              throw reason;
            }
          : rejected;
      if (this.promiseState === "fulfilled") {
        exceutorPromise(fulfilled);
      } else if (this.promiseState === "rejected") {
        exceutorPromise(rejected);
      } else if (this.promiseState === "pending") {
        this.fulfilledCallback.push(exceutorPromise.bind(this, fulfilled));
        this.rejectedCallback.push(exceutorPromise.bind(this, rejected));
      }
      // 执行回调结果
      const exceutorPromise = (callback) => {
        setTimeout(() => {
          try {
            const res = callback(this.promiseResult);
            if (res && res === thenPromise) {
              throw new Error("不能返回自身");
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
    return new myPromise((resolve, rejetc) => {
      const res = [];
      const addRes = (index, value) => {
        res[index] = value;
        if (res.length === promiseList.length) {
          resolve(res);
        }
      };
      promiseList.forEach((promise, index) => {
        if (promise instanceof myPromise) {
          promise.then(
            (value) => {
              addRes(index, value);
            },
            (reason) => {
              rejetc(reason);
            }
          );
        } else {
          addRes(index, promise);
        }
      });
    });
  }
  static allSettled(promiseList) {
    return new myPromise((resolve, reject) => {
      const res = [];
      const addRes = (index, state, value) => {
        res[index] = {
          state,
          value,
        };
        if (res.length === promiseList.length) {
          resolve(res);
        }
      };
      promiseList.forEach((promise, index) => {
        if (promise instanceof myPromise) {
          promise.then(
            (value) => {
              addRes(index, "fulfilled", value);
            },
            (reason) => {
              addRes(index, "rejected", reason);
            }
          );
        } else {
          addRea(index, "fulfilled", promise);
        }
      });
    });
  }
  static race(promiseList) {
    return new myPromise((resolve, reject) => {
      promiseList.forEach((promise) => {
        if (promise instanceof myPromise) {
          promise.then(
            (value) => {
              resolve(value);
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
      const count = 0;
      promiseList.forEach((promise) => {
        if (promise instanceof myPromise) {
          promise.then(
            (value) => {
              resolve(value);
            },
            (reason) => {
              count++;
              if (promiseList.length === count) {
                reject(new AggreagteError("All promise were rejected"));
              }
            }
          );
        } else {
          resolve(promise);
        }
      });
    });
  }
  static catch(reject) {
    return this.then(undefined, reject);
  }
}
