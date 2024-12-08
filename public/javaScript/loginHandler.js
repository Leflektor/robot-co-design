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

async function sendPostReq(data, url) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const res = await response.json();

    if (res.status === 'success') {
        localStorage.clear();
        window.location.href = '/mainPage';
    }
    if (res.status === 'fail' || res.status === 'error') {
        alert(res.message);
    }
}

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
});

submitPasswordButton.addEventListener('click', async e => {
    e.preventDefault();

    const loginAndPassword = {
        login: fields.login.value,
        password: fields.password.value,
    };
    const url = '/login';

    await sendPostReq(loginAndPassword, url);
});

submitCodeButton.addEventListener('click', async e => {
    e.preventDefault();

    const affiliationCode = {
        affiliationCode: fields['affiliation-code'].value,
    };
    const url = '/checkAffiliationCode';

    await sendPostReq(affiliationCode, url);
});
