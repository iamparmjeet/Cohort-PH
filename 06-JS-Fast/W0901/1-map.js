// first understand signature 

// calling object - this

const arr = [1, 2, 3, 4, 5]

if (!Array.prototype.myMap) {
  Array.prototype.myMap = function (cb) {
    const result = []

    for (let i = 0; i < this.length; i++) {
      const value = cb(this[i], i)
      result.push(value)
    }

    return result
  }
}

arr.myMap((value) => console.log(`At index:  Value: ${value * 2}`))