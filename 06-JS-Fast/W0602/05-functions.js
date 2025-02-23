
/*

function parameter 

*/

function greet(name) {
  console.log(name)
}

greet("parm")

let globalVar = "I am global"

function modifyGlobal() {
  globalVar = "modifed"
}

console.log(globalVar)
modifyGlobal()
console.log(globalVar)

let person1 = {
  name: "ravi",
  greet: function () {
    console.log(`Hello ${this.name}`)
  }
}

// this - context

// console.log(person1.greet)
// console.log(person1.greet())

let person2 = {
  name: "john"
}

// call - it calls while bind return

person1.greet.call(person2)
let person2call = person1.greet.bind(person2)

person2call()

console.log(person2call)
// console.log(person2.greet())

// apply - return array

let person3 = {
  name: "wick",
  greet: function () {
    console.log(`Hello ${this.name} ji`)
  }
}

console.log(person3)
person3.greet()

let person4 = {
  name: "Spider"
}

person3.greet.call(person4)
person3.greet.call({ name: "Jaisingh" })
console.log(person3.greet.bind("Wanda"))