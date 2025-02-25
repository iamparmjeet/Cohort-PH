const fs = require("fs")

function readFileWithPromise(filePath, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, encoding, (err, content) => {
      if (err) {
        // console.log("err Reading file", err)
        reject(err)
      } else {
        resolve(content)
      }
    })
  })
}

const result = readFileWithPromise("./hello.txt", "utf-8")