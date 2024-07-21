//Grabs Exit Button From Document
const exitButton = document.getElementById('exit-button');

//Grabs The Exit Screen
const exitScreen = document.getElementById('exit-screen');

//Grabs The Overlay
const overlay = document.getElementById('overlay');

//Grabs The No Button
const noButton = document.getElementById('no');

//Creates Exit Button Event
exitButton.addEventListener('click', displayExitMenu);
noButton.addEventListener('click', displayExitMenu);

//Logs for Debugging
console.log(exitButton, exitScreen);

function displayExitMenu() {
    if(exitScreen.style.display === "none" || exitScreen.style.display === "") {
        exitScreen.style.display = "flex";
        overlay.style.display = "block";
    }
    else
    {
        exitScreen.style.display = "none";
        overlay.style.display = "none";
    }
}