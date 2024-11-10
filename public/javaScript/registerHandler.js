const submitButton = document.getElementById('submit-btn');
const firstNameField = document.getElementById('first-name');
const lastNameField = document.getElementById('last-name');
const institutionField = document.getElementById('institution');
const emailField = document.getElementById('email');
const loginField = document.getElementById('login');
const passwordField = document.getElementById('password');
const description = document.getElementById('description');
const registerForm = document.getElementById('register-form');

const pLength = document.getElementById('p-length');
const pSpaces = document.getElementById('p-spaces');
const pUppercase = document.getElementById('p-uppercase');
const pNumber = document.getElementById('p-number');

const lLength = document.getElementById('l-length');
const lSpaces = document.getElementById('l-spaces');

const formSection = document.getElementById('form-div');
const succesMessage = document.getElementById('success');

// TODO: if enough time button with example password generation

// Funkcja sprawdzająca spełnienie kryteriów hasła
function passwordLifeValidation(password) {
    const minLength = password.length >= 12;
    const hasNoSpaces = !/\s/.test(password) && password != '';
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    // Aktualizacja wizualna kryteriów
    pLength.style.color = minLength ? 'green' : 'red';
    pUppercase.style.color = hasUpperCase ? 'green' : 'red';
    pNumber.style.color = hasNumber ? 'green' : 'red';
    pSpaces.style.color = hasNoSpaces ? 'green' : 'red';
}

// Event listener, który reaguje na zmiany w polu hasła
passwordField.addEventListener('input', e => {
    passwordLifeValidation(e.target.value);
});

function loginLifeValidation(login) {
    const minLength = login.length >= 8;
    const hasNoSpaces = !/\s/.test(login) && login != '';

    // Aktualizacja wizualna kryteriów
    lLength.style.color = minLength ? 'green' : 'red';
    lSpaces.style.color = hasNoSpaces ? 'green' : 'red';
}

// Event listener, który reaguje na zmiany w polu hasła
loginField.addEventListener('input', e => {
    loginLifeValidation(e.target.value);
});

async function sendPostReq(data) {
    const res = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const response = await res.json();
    return response;
}

function validateLogin(login) {
    const minLength = 8;
    const hasNoSpaces = !/\s/.test(login);
    return login.length >= minLength && hasNoSpaces;
}

function validatePassword(password) {
    const minLength = 12;
    const hasNoSpaces = !/\s/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return (
        password.length >= minLength && hasNoSpaces && hasUpperCase && hasNumber
    );
}

submitButton.addEventListener('click', async function (e) {
    e.preventDefault();

    // Cheching if forms validity
    if (!registerForm.reportValidity()) {
        return;
    }

    const login = loginField.value;
    const password = passwordField.value;

    if (!validateLogin(login)) {
        alert(
            'Login must be at least 8 characters long and contain no spaces.',
        );
        return;
    }

    if (!validatePassword(password)) {
        alert(
            'Password must be at least 12 characters long, contain at least one uppercase letter, and one number.',
        );
        return;
    }

    const registrationData = {
        firstname: firstNameField.value,
        lastName: lastNameField.value,
        institution: institutionField.value,
        email: emailField.value,
        login: loginField.value,
        password: passwordField.value,
        description: description.value,
    };

    const response = await sendPostReq(registrationData);

    switch (response.status) {
        case 'success':
            formSection.classList.add('hidden');
            succesMessage.classList.remove('hidden');
            break;
        case 'email taken':
            alert(response.message);

            break;
        case 'login taken':
            alert(response.message);

            break;
        case 'error':
            console.log(response.message);

            break;
        default:
            console.log('Unexpected response from the server.');
            break;
    }
});
