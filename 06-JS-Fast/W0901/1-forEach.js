// first understand signature 

// calling object - this

const arr = [1, 2, 3, 4, 5]

if (!Array.prototype.myForEach) {
  Array.prototype.myForEach = function (cb) {
    for (let i = 0; i < this.length; i++) {
      cb(this[i], i)
    }
  }
}

arr.myForEach((value, index) => console.log(`At index: ${index} Value: ${value}`))