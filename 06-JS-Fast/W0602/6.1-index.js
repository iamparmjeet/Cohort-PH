console.log("1st")

const obj = {
  personName: "John",
  greet: function () {
    console.log(`Hello ${this.personName} ji`)
  }
}

obj.greet()

console.log('3rd')

