class MyPromise {
  consturctor(exexcuter) {
    //  当我们创建Promise时再回调函数内部抛出异常时Promise状态变成rejected
    try {
      this.initValue;
      this.initBind;
      exexcuter(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }
  initValue() {
    this.promiseResult = undefined;
    this.promiseState = "pending";
    this.fulfillCallbacks = [];
    this.rejectCallbacks = [];
  }
  initBind() {
    this.reslove = this.reslove.bind(this);
    this.reject = this.reject.bind(this);
  }
  reslove(value) {
    if (this.promiseState !== "pending") return; // 如果状态已经发生变化直接返回
    this.promiseResult = value;
    this.promiseState = "fulfilled";
    while (this.fulfillCallbacks.length) {
      this.fulfillCallbacks.pop()(value);
    }
  }
  reject(value) {
    if (this.promiseState !== "pending") return;
    this.promiseResult = value;
    this.promiseState = "rejected";
    while (this.rejectCallbacks.length) {
      this.rejectCallbacks.pop()(value);
    }
  }

  // then,传入成功和失败回调两个参数, 返回的结果也是Promise实例
  // then内部的代码是一部执行的
  // then内部抛出异常也会把Promise的状态变成rejected
  // 当前状态为pending时，不执行回调，等待状态发生变化时才会执行相应的回调
  then(fulfillCallback, rejectCallback) {
    fulfillCallback =
      typeof fulfillCallback !== "undefined"
        ? fulfillCallback
        : (value) => value;
    rejectCallback =
      typeof rejectCallback !== "undefined"
        ? rejectCallback
        : (reason) => {
            throw reason;
          };
    const thenPromise = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          const promiseExecuter = (callback) => {
            const res = callback(this.promiseResult);
            if (res && res === thenPromise) {
              throw new Error("Cannot return to itself"); // 不能返回自身，不然会死循环
            }
            if (res instanceof MyPromise) {
              res.then(resolve, reject);
            } else {
              resolve(res);
            }
          };

          if (this.promiseState === "fulfilled") {
            promiseExecuter(fulfillCallback);
          }
          if (this.promiseState === "rejected") {
            promiseExecuter(rejectCallback);
          }
          if (this.promiseState === "pending") {
            this.fulfillCallbacks.push(
              promiseExecuter.bind(this, fulfillCallback)
            );
            this.rejectCallbacks.push(
              promiseExecuter.bind(this, rejectCallback)
            );
          }
        } catch (error) {
          reject(error);
          throw new Error(error); // 把错误往后传
        }
      });
    });
    return thenPromise;
  }

  // 出入一个promise数组，非promise项表示成功
  // 如果promise项都成功返回成功的列表，如果有一个失败就返回第一个失败的结果
  static all(promiseList) {
    return new MyPromise((resolve, reject) => {
      const result = [];
      const addRes = (index, value) => {
        result[index] = value;
        if (promiseList.length === result.length) {
          resolve(result);
        }
      };
      promiseList.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (res) => {
              addRes(index, res);
            },
            (err) => {
              reject(err);
            }
          );
        } else {
          addRes(index, promise);
        }
      });
    });
  }

  // 无论成功还是失败，谁先执行完就返回谁
  static race(promiseList) {
    return new MyPromise((resolve, reject) => {
      promiseList.forEach((promise) => {
        if (promise instanceof MyPromise) {
          promise.then(resolve, reject);
        } else {
          resolve(promise);
        }
      });
    });
  }

  static allSettled(promiseList) {
    return new MyPromise((resolve, reject) => {
      const result = [];
      const addRes = (type, index, value) => {
        result[index] = {
          type,
          value,
        };
        if (result.length === promiseList.length) {
          resolve(result);
        }
      };
      promiseList.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (res) => {
              addRes("fulfilled", index, res);
            },
            (error) => {
              addRes("rejected", index, error);
            }
          );
        } else {
          addRes("fulfilled", index, promise);
        }
      });
    });
  }

  static any(promiseList) {
    return new MyPromise((resolve, reject) => {
      const count = 0;
      promiseList.forEach((promise) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (res) => {
              resolve(res);
            },
            (error) => {
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
