const enterButton = document.querySelector('.enter-btn');
const registerButton = document.querySelector('.register-btn');

const showPassword = document.getElementById('show-password');
const showLogin = document.getElementById('show-login');
const showAffiliationCode = document.getElementById('show-affiliation-code');

const passwordField = document.getElementById('password');
const loginField = document.getElementById('login');
const affiliationCodeField = document.getElementById('affiliation-code');

const showIcons = [showPassword, showLogin, showAffiliationCode];
const fields = {
    password: passwordField,
    login: loginField,
    'affiliation-code': affiliationCodeField,
};

const submitPasswordButton = document.getElementById('submit-password');
const submitCodeButton = document.getElementById('submit-code');

showIcons.forEach(el => {
    el.addEventListener('click', function () {
        this.classList.toggle('fa-eye-slash');
        this.classList.toggle('fa-eye');

        const field = fields[this.getAttribute('name')];

        const type =
            field.getAttribute('type') === 'password' ? 'text' : 'password';

        field.setAttribute('type', type);
    });
});

enterButton.addEventListener('click', () => {
    window.location.href = '/mainPage';
    localStorage.clear();
});

registerButton.addEventListener('click', () => {
    window.location.href = '/register';
    localStorage.clear();
});

submitPasswordButton.addEventListener('click', e => {
    e.preventDefault();
});

submitCodeButton.addEventListener('click', e => {
    e.preventDefault();
});
