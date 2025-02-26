class MyPromise {
  constructor(executorFn) {
    this._state = 'pending'
    this._successCallbacks = []
    this._errorCallbacks = []
    this._finallyCallbacks = []

    executorFn(
      this.resolverFunction.bind(this),
      this.rejecterFunction.bind(this)
    )
  }

  then(cb) {
    this._successCallbacks.push(cb) // it registers not run
    return this
  }

  catch(cb) {
    this._errorCallbacks.push(cb) // it registers not run
    return this
  }

  finally(cb) {
    this._finallyCallbacks.push(cb) // it registers not run
    return this

  }

  resolverFunction() {
    this._state = "fulfilled"
    this._successCallbacks.forEach((cb) => cb())
    this._finallyCallbacks.forEach((cb) => cb())
  }

  rejecterFunction() {
    this._state = "rejected"
    this._errorCallbacks.forEach((cb) => cb())
    this._finallyCallbacks.forEach((cb) => cb())
  }
}


// function wait(sec) {
//   return new Promise((res, rej) => {
//     setTimeout(() => res(), sec * 1000)
//   })
// }


function wait(sec) {
  const p = new MyPromise((res, rej) => {
    setTimeout(() => res(), sec * 1000)
  })
  return p
}



wait(5)
  .then(() => console.log(`Promise after 5 sec -resolved`))
  .catch(() => console.log(`Rejected after 5 sec`))
  .finally(() => console.log('Finally'))