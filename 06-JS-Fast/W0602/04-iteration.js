let expenses = [
  { description: "Groceries", amount: 50, category: "Food" },
  { description: "Electricity Bill", amount: 100, category: "Utilities" },
  { description: "Dinner", amount: 30, category: "Food" },
  { description: "Internet Bill", amount: 50, category: "Utilities" },
];

// function expenseReportCategory(key) {
//   let expenseReport = expenses.reduce((index, item) => item.category === key ? index + item.amount : index, 0)
//   console.log(expenseReport)
// }

// expenseReportCategory("Food")


let expenseReport1 = expenses.reduce(
  (report, expense) => (
    report[expense.category] = (report[expense.category] || 0)
  ),
  { Food: 0 }
)
// console.log(expenseReport1)


let tasks = [
  { description: "Write Report", completed: false, priority: 2 },
  { description: "Send Email", completed: true, priority: 3 },
  { description: "Prepare presentation", completed: false, priority: 1 },
]

let pendingSortedTasks = tasks
  .filter((task) => !task.completed)
  .sort((a, b) => a.priority - b.priority)

console.log(pendingSortedTasks)


let movieRatings = [
  { title: "A", ratings: [4, 5, 3] },
  { title: "B", ratings: [5, 5, 4] },
  { title: "C", ratings: [3, 4, 2] },
]


/*
keep in mind - not mutate old array
check whether it mutate or not
*/

console.log('Original arr', movieRatings)

let averageRatings = movieRatings.map((movie) => {
  let total = movie.ratings.reduce((sum, rating) => sum + rating, 0)
  let avg = total / movie.ratings.length
  // movie.ratings = avg
  // return movie
  return { title: movie.title, average: avg.toFixed(2) }
})

console.log(averageRatings)

// Pendingfunction
