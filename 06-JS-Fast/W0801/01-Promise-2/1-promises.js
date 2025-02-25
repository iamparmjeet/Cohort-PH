const fs = require("fs")

console.log("starting ")


// Sync - blocking code
/*

*/
const contents = fs.readFileSync('./hello.txt', 'utf-8')

console.log(contents)

console.log("After contents")

fs.readFile("./hello.txt", "utf-8", function (err, contnent) {
  if (err) {

  }
})