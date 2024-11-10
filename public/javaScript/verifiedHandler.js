document.addEventListener('DOMContentLoaded', function () {
    // Pobieranie parametrów URL
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const message = params.get('message');

    // Wybierz elementy HTML, które będą modyfikowane
    const statusMessage = document.getElementById('status-message');

    // Ustawienie treści na podstawie statusu
    if (status === 'success') {
        statusMessage.textContent = decodeURIComponent(
            message || 'Your account has been successfully verified!',
        );
        statusMessage.style.color = 'green';
    } else if (status === 'error') {
        statusMessage.textContent = decodeURIComponent(
            message ||
                'There was an error verifying your account. Please try again.',
        );
        statusMessage.style.color = 'red';
    }
});
