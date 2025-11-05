class myPromise {
  constructor(executor) {
    this.initValue();
    this.initBind();

    // try catch保证在promise中抛出错误时状态变为rejected
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }
  // 初始化状态和结果
  initValue() {
    this.promiseState = "pending";
    this.promiseResult = undefined;
    this.onFulfilledCallBacks = []; // 把then的回调保存起来，当状态发生变化时执行
    this.onRejectedCallBacks = [];
  }
  // 确保resolve/reject每次调用时this都指向当前实例
  initBind() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }
  resolve(value) {
    if (this.promiseState !== "pending") return; // 状态一旦发生变化就不会再改变
    this.promiseState = "fulfilled";
    this.promiseResult = value;

    // 状态发生变化时执行回调
    while (this.onFulfilledCallBacks.length) {
      this.onFulfilledCallBacks.shift()(this.promiseResult);
    }
  }
  reject(reason) {
    if (this.promiseState !== "pending") return; // 状态一旦发生变化就不会再改变
    this.promiseState = "rejected";
    this.promiseResult = reason;
    while (this.onRejectedCallBacks.length) {
      this.onRejectedCallBacks.shift()(this.promiseResult);
    }
  }
  then(onFulfilled, onRejected) {
    // 判断入参是不是函数不是的话赋值上一个函数
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (val) => val;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const thenPromise = new myPromise((resolve, reject) => {
      // 封装相同部分的代码,执行then的回调，根据回调结果改变当前实例的状态
      const executorPromise = (callback) => {
        setTimeout(() => {
          try {
            const res = callback(this.promiseResult);
            // Promise规范不能返回自身,避免死循环
            if (res === thenPromise && res) {
              throw new Error("Chaining cycle detected for promise");
            }
            // 如果then回到返回的结果是Promise
            if (res instanceof myPromise) {
              res.then(resolve, reject);
            } else {
              // then回到返回的结果是非Promise
              resolve(res);
            }
          } catch (error) {
            reject(error);
            throw new Error(error);
          }
        });
      };
      if (this.promiseState === "fulfilled") {
        // 成功的回调
        executorPromise(onFulfilled);
      } else if (this.promiseState === "rejected") {
        // 失败的回调
        executorPromise(onRejected);
      } else if (this.promiseState === "pending") {
        // 状态不确定时，把回调先保存起来, executePromise最终要在resolve/reject中执行，所以执行的时候要确保this指向当前实例，必须把当前的上下文绑定上去
        this.onFulfilledCallBacks.push(executorPromise.bind(this, onFulfilled));
        this.onRejectedCallBacks.push(executorPromise.bind(this, onRejected));
      }
    });
    return thenPromise;
  }
  /**
   *
   * @param {*} promiseList
   * 传入一个promise数组，如果数组中有非promise项，则此项成功
   * 执行所有promise都成功返回成功的结果列表，有一个失败就会返回第一个失败的结果
   */
  static all(promiseList) {
    return new myPromise((resolve, reject) => {
      const result = [];
      const addRes = (res, index) => {
        result[index] = res;
        if (promiseList.length === result.length) {
          resolve(result);
        }
      };
      promiseList.forEach((promise, index) => {
        if (promise instanceof myPromise) {
          promise.then(
            (res) => {
              addRes(res, index);
            },
            (err) => {
              reject(err);
            }
          );
        } else {
          addRes(promise, index);
        }
      });
    });
  }
  /**
   * 传入一个promise数组，如果数组中有非promise项，则此项成功
   * 哪个promise先执行完，就返回先执行完的结果，无论失败或成功都返回
   */
  static race(promiseList) {
    return new myPromise((resolve, reject) => {
      promiseList.forEach((promise, index) => {
        if (promise instanceof myPromise) {
          promise.then(
            (res) => {
              resolve(res);
            },
            (err) => {
              reject(err);
            }
          );
        } else {
          resolve(promise);
        }
      });
    });
  }
  /**
   * 传入一个Promise数组，如果数组中有非Promise项，此项当作成功
   * 执行所有每一项，返回所有的执行结果和状态，放到数组中返回
   */
  static allSettled(promiseList) {
    return new myPromise((resolve, reject) => {
      const result = [];
      const addRes = (status, value, index) => {
        result[index] = {
          status,
          value,
        };
        if (result.length === promiseList.length) {
          resolve(result);
        }
      };
      promiseList.forEach((promise, index) => {
        if (promise instanceof myPromise) {
          promise.then(
            (res) => {
              addRes("fulfilled", res, index);
            },
            (err) => {
              addRes("rejected", err, index);
            }
          );
        } else {
          addRes("fulfilled", promise, index);
        }
      });
    });
  }
  /**
   * 传入一个Promis数组，如果数组中有非Promise项，此项当作成功
   * 执行所有每一项，如果有一个成功则返回这个结果，如果都失败则报错 'All promises were rejected'
   *
   */
  static any(promiseList) {
    return new myPromise((resolve, reject) => {
      let count = 0;
      promiseList.forEach((promise, index) => {
        if (promise instanceof myPromise) {
          promise.then(
            (res) => {
              resolve(res);
            },
            (err) => {
              count++;
              if (count === promiseList.lenght) {
                // AggregateError模仿内置Promise的any实现,把多个错误包在一个错误里
                reject(new AggregateError("All promises were rejected"));
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
