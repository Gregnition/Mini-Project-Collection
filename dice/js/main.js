document.getElementById("rollBtn").addEventListener("click", rollDice);

function rollDice() {
    const numOfDice = parseInt(document.getElementById("numOfDice").value);
    const diceResult = document.getElementById("diceResult");
    const diceImages = document.getElementById("diceImages");
    const diceSum = document.getElementById("diceSum");
    const diceSound = document.getElementById("diceSound");

    diceImages.innerHTML = "";
    diceResult.textContent = "";
    diceSum.textContent = "";

    // Play dice sound
    diceSound.currentTime = 0;
    diceSound.play();

    // Show rolling animation before final result
    let rollInterval = setInterval(() => {
        diceImages.innerHTML = "";
        for (let i = 0; i < numOfDice; i++) {
            const randomTemp = Math.floor(Math.random() * 6) + 1;
            diceImages.innerHTML += `<img src="dice_images/${randomTemp}.png">`;
        }
    }, 100);

    setTimeout(() => {
        clearInterval(rollInterval);
        const values = [];
        diceImages.innerHTML = "";

        for (let i = 0; i < numOfDice; i++) {
            const value = Math.floor(Math.random() * 6) + 1;
            values.push(value);
            diceImages.innerHTML += `<img src="dice_images/${value}.png">`;
        }

        diceResult.textContent = `You rolled: ${values.join(", ")}`;
        diceSum.textContent = `Total: ${values.reduce((a, b) => a + b, 0)}`;
    }, 1000);
}
