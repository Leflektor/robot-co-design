const startButton = document.querySelector('.start-btn');

startButton.addEventListener('click', () => {
    window.location.href = '/login';
    localStorage.clear();
});
