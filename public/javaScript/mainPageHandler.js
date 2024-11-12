const questionare = document.querySelector('.questionare');
const co_creationSite = document.querySelector('.robot-co-creation');

const preQuestionnaire = document.querySelector('.pre-complete');
const afterQuestionnaire = document.querySelector('.complete');
const correctIcon = document.querySelector('.correct');

const analyticsTab = document.getElementById('analytics');

const userHelloText = document.getElementById('user-hello');
const affiliationCodeText = document.getElementById('affiliation-text');
const affiliationCodeValue = document.getElementById('affiliation-code');
const roleText = document.getElementById('role');

document.addEventListener('DOMContentLoaded', async () => {
    const res = await (await fetch('/userData')).json();

    const { isAuthenticated, role, name, affiliationCode } = res.userData;
    console.log(res.userData);

    if (isAuthenticated) {
        analyticsTab.addEventListener('click', () => {
            window.location.href = '/analytics';
        });
        userHelloText.textContent = `Hello ${name}`;
        affiliationCodeText.textContent = `Your affiliation code:`;
        affiliationCodeValue.textContent = `${affiliationCode}`;
        roleText.textContent = `Your role is ${role}`;
    } else if (affiliationCode) {
        userHelloText.textContent = 'Hello affiliated guest';
        affiliationCodeText.textContent = `Affiliation code you used:`;
        affiliationCodeValue.textContent = `${affiliationCode}`;
        roleText.textContent = `Your role is ${role}`;
        analyticsTab.classList.remove('cursor-pointer');
        analyticsTab.classList.add('cursor-not-allowed');
    } else {
        userHelloText.textContent = 'Hello non-affiliated guest';
        roleText.textContent = `Your role is ${role}`;
        analyticsTab.classList.remove('cursor-pointer');
        analyticsTab.classList.add('cursor-not-allowed');
    }
});

if (localStorage.getItem('surveyedData')) {
    correctIcon.classList.remove('hidden');
    preQuestionnaire.classList.add('hidden');
    afterQuestionnaire.classList.remove('hidden');
    co_creationSite.addEventListener('click', () => {
        window.location.href = '/robotCoCreation';
    });
} else {
    co_creationSite.classList.remove('cursor-pointer');
    co_creationSite.classList.add('cursor-not-allowed');
}

questionare.addEventListener('click', () => {
    window.location.href = '/questionare';
});
