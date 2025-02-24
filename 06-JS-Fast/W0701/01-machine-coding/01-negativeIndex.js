let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// console.log(arr(-1)) // error cannot access 
// But we can using proxy

console.log(arr.length)  // 10

// proxy

const user = {
  name: "john",
  age: 40,
  password: "123"
}

const proxyUser = new Proxy(user, {
  get(target, prop) {
    if (prop === "password") {
      throw new Error("Access Denied")
    }
    return target[prop]
  },
  set(target, prop, user) {

  }
})

console.log(user.password)
console.log(proxyUser.password)