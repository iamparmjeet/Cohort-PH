let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// console.log(arr(-1)) // error cannot access 
// But we can using proxy

console.log(arr.length)  // 10
console.log(arr)
// proxy

const user = {
  name: "john",
  age: 40,
  password: "123"
}

// const proxyUser = new Proxy(user, {
//   get(target, prop) {
//     if (prop === "password") {
//       throw new Error("Access Denied")
//     }
//     return target[prop]
//   },
//   set(target, prop, user) {

//   }
// })

// console.log(user.password)
// console.log(proxyUser.password)

// function negativeIndex(arr) {
//   return new Proxy(arr, {
//     get(target, prop) {
//       console.log('target', target)
//       console.log('prop', prop)
//     }
//   })
// }

function negativeIndex(arr) {
  return new Proxy(arr, {
    get(target, prop) {
      const index = Number(prop)
      if (index < 0) {
        return target[target.length + index]
      }
      return target[index]
    },
    set(target, prop, value) {
      const index = Number(prop)
      if (index < 0) {
        target[target.length + index] = value
      } else {
        target[index] = value
      }
      return true
    }
  })
}

// console.log(negativeIndex(arr))

let newArr = negativeIndex(arr)
console.log(newArr[-2])
console.log('orig', arr)
newArr[-2] = 55
console.log(newArr)
console.log('orig', arr)
