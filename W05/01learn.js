// Create an Array
const teas = ["Green Tea", "Black Tea", "White Tea", "Herbal Tea"];
console.log(teas);

// Add "Chamomile Tea" to the existing list
teas.push("Chamomile Tea");
console.log(teas);

// Remove White Tea
const indexOfWhiteTea = teas.indexOf("White Tea");
console.log(indexOfWhiteTea);

// We do -1 of there is not matching string like "White-Tea" instead of "White Tea"
if (indexOfWhiteTea > -1) {
	teas.splice(indexOfWhiteTea, 1);
}

console.log(teas);

// Filter the list to only include teas that area caffeinated
const newTea = teas.filter((tea) => tea !== "Herbal Tea");
console.log("Caffeinated tea", newTea);

// Sort the list of teas in alphabetical order
const sortedTea = teas.sort();
console.log("Sorted Tea:", sortedTea);

// Use a for loop to print each type of tea in the Array
for (let i = 0; i < teas.length; i++) {
	console.log(teas[i]);
}

// Use a for loop to count how many teas are caffeinated (excluding "Herbal tea")
const CaffTea = teas.filter((tea) => tea !== "Herbal Tea");
console.log("Caffienated Tea:", CaffTea.length);

let caffTea2 = 0;
for (let i = 0; i < teas.length; i++) {
	if (teas[i] !== "Herbal Tea") {
		caffTea2++;
	}
}

console.log("Caff Tea:", caffTea2);

// Use a for loop to create a new array with all tea names in uppercase
const upppercaseTeas = [];
for (let i = 0; i < teas.length; i++) {
	upppercaseTeas.push(teas[i].toUpperCase());
}
console.log("UpperCaseTea:", upppercaseTeas);

// Use a for loop to find the tea name with the most characters
let longestTea = "";
for (let i = 0; i < teas.length; i++) {
	if (teas[i].length > longestTea.length) {
		longestTea = teas[i];
	}
}
console.log("Longest Tea:", longestTea);

// use a for loop to reverse the order of teas in the array
const reverseTea = [];
for (let i = teas.length - 1; i >= 0; i--) {
	reverseTea.push(teas[i]);
}

console.log("Reverse Tea Arr:", reverseTea);
