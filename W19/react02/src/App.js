import React from "https://"

const chai = () => {
  return React.createElement("h1", {}, "Masala Chai")
}

const App = () => {
  return React.createElement(
    "div",
    {},
    React.createElement("h1", {}, "react 01")
  )
}


const container = document.getElementById("root")
const root = ReactDOM.createRoot(container)
root.render(React.createElement(App))