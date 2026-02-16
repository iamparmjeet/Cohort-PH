// You have a pile of gifts, and you want to give each of your friends one gift at a time. You keep giving them gifts until they all get one.
//
// Write a function to distribute gifts to your friends one by one. It should stop once all your friends have received a gift.
//

function distributeGifts(totalGifts, friends) {
	let giftsGiven = 0;
	for (let i = 0; i < friends; i++) {
		if (totalGifts > 0) {
			giftsGiven++;
			totalGifts--;
		}
	}
	return giftsGiven;
}

console.log(distributeGifts(11, 5));
