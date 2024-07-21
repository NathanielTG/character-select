// Grabs Menu Button From Document
const menuButton = document.getElementById('menu');

// Creates Menu Event
menuButton.addEventListener('click', displayMenu);

const exitButton = document.getElementById('exit');

exitButton.addEventListener('click', displayMenu);

// Grabs Menu Screen
const menuScreen = document.getElementById('ms');
//Grabs Menu Options Div
const menuOptions = document.getElementById('ms-options');
//Grabs Height Of Menu
const menuHeaderHeight = document.getElementById('ms-header').offsetHeight;

const headerHeight = document.querySelector('header').offsetHeight;
const mainHeight = document.querySelector('main').offsetHeight;

function displayMenu() {
    if (menuScreen.style.display === "none" || menuScreen.style.display === "") {
        menuScreen.style.display = "flex";
        menuOptions.style.height = `calc(100vh - ${menuHeaderHeight}px)`;
    } else {
        menuScreen.style.display = "none";
    }
}
