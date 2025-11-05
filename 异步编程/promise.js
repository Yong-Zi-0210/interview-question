const { realpath } = require("fs");

/**
 * 1、三个状态；pending,fulfilled,rejected
 * 2、状态变化pending->fulfilled或者pending->rejected且状态一旦发生变化就不会再改变
 * 3、改变状态的方法：调用resolve状态由pending转fulfilled；调用reject由pending转rejected；throw 抛出错误也会变reject
 * api有then; catch; race; all; allSetlled; any
 *
 * then:
 * 1、传参有两个，一个是成功的回调，一个是失败的回调
 * 2、then回调执行的代码是异步的
 * 3、当promise状态为pending是不回执行then里面的回调，当状态发生变化后才会执行回调，状态对应执行成功或者失败的回调
 * 4、当不传成功/失败回调函数时，会正常返回对应状态和结果的promise，如p= {PromiseResult: undefined, PromiseState: 'fulfilled'},p.then(）
 *    会返回跟p一样的状态和结果，说明当成功/失败不传时会分别给成功和失败的定义成一个函数
 * 5、then会返回一个Promise可以连续调用。里面的回调结果如果返回的是一个promise，则返回的Promise的状态由回调里面返回的Promise的结果决定，
 *    如果是非promise返回fulfilled状态的Promise
 * 6、then里面的回调抛出错误时，返回的一个状态为rejected的Promise
 */
class myPromise {
  constructor(fn) {
    this.initValue();
    this.initBind();
    try {
      fn(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }
  // 确保每次调用resolve和reject时this都是指向myPromise
  initBind() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }
  initValue() {
    this.promiseState = "pending";
    this.promiseResult = undefined;
    this.successCallBack = []; // 成功的回调
    this.errorCallBack = []; // 失败的回调
  }
  resolve(value) {
    // 状态一旦发生变化就不会再改变
    if (this.promiseState !== "pending") return;
    this.promiseState = "fulfilled";
    this.promiseResult = value;
    // 异步任务执行，比如const p = myPromise((resolve,reject)=>{
    //    setTimeout(()=>{
    //        resolve(2)
    //    },1000)
    // })
    // 一秒后执行resolve,p的状态变为fulfilled,所以先把回调函数保存起来，等到状态发生变化时再执行
    while (this.successCallBack.length) {
      this.successCallBack.shift()(this.promiseResult);
    }
  }
  reject(value) {
    if (this.promiseState !== "pending") return;
    this.promiseState = "rejected";
    this.promiseResult = value;
    // 与成功的回调同理
    while (this.errorCallBack.length) {
      this.errorCallBack.shift()(this.promiseResult);
    }
  }
  then(onResolved, onRejected) {
    // 保证两个回调传参，如果两个都没传，则分别给他们定义一个方法
    onResolved = typeof onResolved === "function" ? onResolved : (val) => val;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    // 返回的是必须是一个Promise才可以确保可以使用链式调用
    return new myPromise((resolve, reject) => {
      if (this.promiseState === "fulfilled") {
        //使用setTimeOut保证.then里面执行的代码是异步的
        setTimeout(() => {
          // trycatch 保证在then中抛出错误
          try {
            const result = onResolved(this.promiseResult);
            // 如果是Promise
            if (result instanceof myPromise) {
              result.then(resolve, reject);
            } else {
              // 非Promise
              resolve(result);
            }
          } catch (error) {
            reject(error);
            throw Error(error); // 链式调用保证错误往后传递
          }
        });
      } else if (this.promiseState === "rejected") {
        setTimeout(() => {
          try {
            const result = onRejected(this.promiseResult);
            if (result instanceof myPromise) {
              result.then(resolve, reject);
            } else {
              reject(result);
            }
          } catch (error) {
            reject(result);
            throw Error(error);
          }
        });
      } else if (this.promiseState === "pending") {
        //当前的Promise状态为Pending，先把then里面的回调函数保存起来，Promise状态发生变化时执行
        this.successCallBack.push(() => {
          setTimeout(() => {
            const result = onResolved.bind(this)(this.promiseResult);
            try {
              // 如果是Promise
              if (result instanceof myPromise) {
                result.then(resolve, reject);
              } else {
                // 非Promise
                resolve(result);
              }
            } catch (error) {
              reject(error);
              throw Error(error);
            }
          });
        });
        this.errorCallBack.push(() => {
          const result = onRejected.bind(this)(this.promiseResult);
          setTimeout(() => {
            try {
              if (result instanceof myPromise) {
                result.then(resolve, reject);
              } else {
                resolve(result);
              }
            } catch (error) {
              reject(error);
              throw Error(error);
            }
          });
        });
      }
    });
  }
}

/**
 * then方法实现中有很多重复的代码,可以用个方法封装起来
 * setTimeout(()=>{
 *      try(){
 *
 *      }catch(){
 *
 *      }
 * })
 */
