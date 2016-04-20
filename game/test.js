var message,
	nbTry,
	nbMin=20,
	nbMax=80;
​
​
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
var nbToSeek = getRandomInt(nbMin,nbMax);
console.log(nbToSeek);
var ok = false;
function isGood(nbPurpose,nbSeek){
	if (nbPurpose < nbSeek) {
		return "c'est plus" ;
	} else if (nbPurpose > nbSeek) {
		return "c'est moins";
	} else {
		ok = true;
		return "GAGNER!!!";
	}
}
​
while (!ok) {
	var enteredNumber = prompt("entrer un numéro entre 20 et 80.");
	alert(isGood(enteredNumber,nbToSeek));
}