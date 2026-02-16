// You have a basket full of apples. You need to count how many apples are in the basket, but you don't know the exact number. Each time you pick an apple, you count one. Your task is to count how many apples are in the basket.
// Problem Statement:
// Create a function that counts the number of apples in the basket using a loop.

function countApples(apples) {
	let basketHasApples = 0;

	while (basketHasApples < apples) {
		basketHasApples++;
	}

	return basketHasApples;
}

console.log(countApples(10));
