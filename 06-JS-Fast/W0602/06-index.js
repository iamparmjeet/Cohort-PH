
const obj = {
  personName: "John",
  greet: function () {
    console.log(`Hello ${this.personName} ji`)
  }
}

// setTimeout(obj.greet(), 2000); // error
// setTimeout(obj.greet, 2000); // error


const a = 1
const b = 2

console.log('Sum', a + b)

setTimeout(function () { console.log("delayed") }, 1 * 1000) // min wait 

console.log("hello")



