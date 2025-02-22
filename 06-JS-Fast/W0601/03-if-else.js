
function prepareChai(type) {
  if (type === "Masala Chai") {
    console.log("Adding spices to the chai")
  } else {
    console.log("Preparing regular chai")
  }
}

prepareChai("Masala Chai") // if
prepareChai("Chai") // else

function prepareChai2(type) {
  if (type === "Masala Chai") {
    console.log("Adding spices to the chai")
  } else {
    console.log("Preparing regular chai")
  }
}

// prepareChai2("Masala Chai") // if
// prepareChai2("Chai") // else

/*
Ek online store mein, agar customer ko toal bill amount 1000 se zyada hai to 10% discount milta hai, Nahi toh full amount pay
*/

function calculateFinalBill(amount) {
  // convert to number

  if (amount > 1000) {
    return amount * 0.9
  } else return amount
}

console.log(calculateFinalBill(1100)) // 990

/*
Ek traffic light system mein, agar light "red" hai, to "stop print karo. agar Uellow hai, to "slow down" print karo. Agar "green hai, to "Go print karo
*/


function trafficLight(color) {
  switch (color.toLowerCase()) {
    case "red": return "Stop";
    case "yellow": return "Slow Down";
    case "green": return "Go";
    default: "Marji apki"
  }
}

console.log(trafficLight('Red')) // Stop
// console.log(trafficLight('red')) // Stop
console.log(trafficLight('yellow')) // Stop


function checkTruthyValue(value) {
  if (value) {
    console.log("Truthy")
  } else {
    console.log("Falsy")
  }
}

checkTruthyValue([1, 2])


function login(username, password) {
  if (username === "admin" && password === "123") {
    return "You are logged in"
  } else return "Invalid credentials"
}
