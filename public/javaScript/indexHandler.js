const startButton = document.querySelector('.start-btn');

startButton.addEventListener('click', () => {
    window.location.href = '/mainPage';
    // TESTOWE USUNAC POZNIEJ
    localStorage.clear();
});
