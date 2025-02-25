const fs = require("fs")

console.log('Starting')

fs.readFile("./hello.txt", "utf-8", function (err, content) {
  if (err) {
    console.log('Err', err)
  } else {
    console.log('File Reading success', content)
    fs.writeFile("backup.txt", content, function (err) {
      if (err) {
        console.log('Err in writing', err)
      } else {
        fs.unlink("./hello.txt", function (err) {
          if (err) {
            console.log('Err deletingi', err)
          } else {
            console.log("File Delete success")
          }
        })
      }
    })
  }
})

console.log('Ending')

// call back hell

const fsv2 = require("fs/promises")

