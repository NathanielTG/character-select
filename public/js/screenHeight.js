//THIS JAVASCRIPT CODE IS RESPONSIBLE FOR CALCULATING SCREEN HEIGHT

function setMainHeight() {
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const headerHeight = header.offsetHeight;
    main.style.minHeight = `calc(100vh - ${headerHeight}px)`;
}

// Set the main height on page load
window.addEventListener('load', setMainHeight);
// Adjust the main height if the window is resized
window.addEventListener('resize', setMainHeight);