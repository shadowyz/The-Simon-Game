var tileIDList = [];
let clickedBtnList = [];
let level = 0; // Track the current level

// Function to start the game
function startGame() {

    // Reset game state
    tileIDList = [];
    clickedBtnList = [];
    level = 0;  // Start from level 0

    // Start the first level
    gameOn(level);
}

// Function to handle the next level
function nextLevel() {
    clickedBtnList = [];  // Reset clicked buttons for the new level

    // Increment the level
    level++;

    // Update the level display
    $("h1").text("Level " + (level + 1));  // Display level number (level starts from 0, so add 1)

    // Start the game for the next level
    gameOn(level);
}

// Function to animate the sequence of buttons
function animateButton(num) {
    let buttonClass;
    switch (num) {
        case 1:
            buttonClass = ".green";
            break;
        case 2:
            buttonClass = ".red";
            break;
        case 3:
            buttonClass = ".yellow";
            break;
        case 4:
            buttonClass = ".blue";
            break;
        default:
            return;
    }

    // Apply a temporary 'pressed' effect by changing button color or adding a CSS class
    $(buttonClass).addClass("pressed");  // Add 'pressed' class to simulate pressing the button

    // Play the corresponding sound for the button
    playSound(buttonClass);

    // Remove the 'pressed' effect after a short delay
    setTimeout(function () {
        $(buttonClass).removeClass("pressed");  // Remove the 'pressed' class after the delay
    }, 500);  // Duration of the highlight (500ms)
}

function playSound(className) {
    // Play the corresponding sound for the button
    let buttonName = className.slice(1);  // Remove the '.' from the class name
    let buttonSound = new Audio("./Assets/sounds/" + buttonName + ".mp3");  // Create a new Audio object
    buttonSound.play();  // Play the sound
}

// Function to generate random sequence of numbers for the level
function randomNumGen(rounds) {
    let numList = [];
    for (let i = 0; i < rounds; i++) {
        let num = Math.floor(Math.random() * 5);
        if (num === 0) {
            num += 1;
        }
        numList.push(num);
    }
    return numList;
}

// Function to generate and reveal the sequence of buttons for the level
function revealTiles(gameLevel) {
    let randomNumList = randomNumGen(gameLevel);

    // Delay between each button's animation
    let delay = 0;

    // Iterate over the random number list (button sequence)
    for (let num of randomNumList) {
        // Use setTimeout to delay the animation for each button
        setTimeout(function () {
            animateButton(num);  // Animate the button based on the number
        }, delay);

        // Increase the delay by a little to space out the animations
        delay += 500; // 1000ms = 1 second delay, you can adjust this value for faster/slower animations
    }

    return randomNumList;  // Return the generated sequence for comparison with player's input
}

// Function to handle the game logic for a given level
function gameOn(no) {
    // Update the game with the new level
    $("h1").text("Level " + (no + 1)); // Show the level number (starting from 1)

    // Generate a sequence of buttons for the current level
    let tileID = revealTiles(no + 1);  // Generate a sequence of length equal to the level

    // Store the generated sequence
    tileIDList = [...tileID]; // Store the sequence for comparison
}

// Function to check if the player's input matches the generated sequence
function checkSequence(buttonClicked) {
    let flattenedTileIDList = tileIDList;

    // Compare the clicked buttons with the flattened sequence
    for (let i = 0; i < buttonClicked.length; i++) {
        if (buttonClicked[i] !== flattenedTileIDList[i]) {
            return false;
        }
    }
    return true;
}

// Function to handle button clicks during the game
$(".btn").click(function () {
    var clickedButton = $(this).attr("id"); // Get the ID of the clicked button

    // Map button ID to a number
    let num;
    switch (clickedButton) {
        case "green":
            num = 1;
            break;
        case "red":
            num = 2;
            break;
        case "yellow":
            num = 3;
            break;
        case "blue":
            num = 4;
            break;
        default:
            return;
    }

    clickedBtnList.push(num); // Add the clicked button's number to the list
    animateButton(num); // Animate the button

    // Check if the sequence matches the generated sequence
    if (checkSequence(clickedBtnList)) {
        // If the player entered the correct sequence
        if (clickedBtnList.length === tileIDList.length) {

            // Introduce a delay of 3000ms (3 seconds) before moving to the next level
            setTimeout(function () {
                nextLevel();  // Move to the next level after the delay
            }, 3000);  // 3000ms = 3 seconds
        }
    } else {
        $("h1").text("Game Over! Press Any Key to Restart");
        resetGame();  // Reset the game after a loss
    }

});

// Function to reset the game
function resetGame() {
    tileIDList = [];
    clickedBtnList = [];
    $("h1").text("Please press any key to restart"); // Reset the heading text
}

// jQuery code begins to run after the DOM has been completely loaded
$(document).ready(function () {
    $(document).keypress(function () {
        // Start the game only if the game has been reset (tileIDList is empty)
        if (tileIDList.length === 0) {
            startGame();
        }
    });
});
