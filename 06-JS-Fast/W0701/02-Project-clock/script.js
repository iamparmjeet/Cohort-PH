
function updateTime() {


  const timeEle = document.getElementById("time")
  console.log(timeEle)
  const dateEle = document.getElementById("date")


  const now = new Date()
  const hours = now.getHours() % 12 || 12
  const minutes = now.getMinutes().toString().padStart(2, "0")
  console.log(minutes)
  const seconds = now.getSeconds().toString().padStart(2, "0")
  const ampm = now.getHours() >= 12 ? "PM" : "AM"

  timeEle.textContent = `${hours}:${minutes}:${seconds} ${ampm}`
}

setInterval(up, clock, 1000)

updateTime()
