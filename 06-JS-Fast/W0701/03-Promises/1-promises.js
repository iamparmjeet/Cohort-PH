const items = document.getElementById("items")
console.log('1')
let api = "https://api.freeapi.app/api/v1/public/randomproducts"

function renderToScreen(obj) {
  const products = obj.data.data
  console.log(products)
  products.forEach((product) => {
    const li = document.createElement("li")
    li.innerText = product.title
    items.appendChild(li)
  })
}


const data =
  fetch(api)
    .then((res) => res.json())
    .then(renderToScreen)
    .catch((err) => { })
    .finally(() => [])



data.then((res) => console.log("reponse", res))
console.log(data)

console.log('3')