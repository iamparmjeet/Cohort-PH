

let chaiTypes = ["Masala chai", "Ginger Chai", "Lemon Chai"]

// chaiTypes.forEach((chai, index) => {
//   console.log(`${index + 1}: ${chai}`)
// })

let moreChaiTypes = ["Oolong Tea", "White Tea"]

// Object Literals

const chaiRecipe = {
  name: "Masala Chai",
  ingredients: {
    teaLeaves: "Assam Tea",
    milk: "Full cream Milk",
    sugar: "Brown",
    spices: ["Cloves", "Cardamon", "Ginger"]
  },
  instruction: "Boil water, add tea leaves, milk, sugar and spices"
}

// console.log(chaiRecipe)

console.log(chaiRecipe["ingredients"]["spices"][2])

const updatedRecepie = {
  ...chaiRecipe,
  instruction: "Boil water with tea leaves"
}

// console.log(updatedRecepie)

let { name, ingredients } = chaiRecipe
let { Myingredients } = chaiRecipe

console.log(ingredients)
console.log(Myingredients) // undefined


