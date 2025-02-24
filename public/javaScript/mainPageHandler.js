const questionare = document.querySelector('.questionare');
const coCreationSite = document.querySelector('.robot-co-creation');

const preQuestionnaireText = document.getElementById('pre-questionnaire-text');
const questionnaireCompletedText = document.getElementById(
    'questionnaire-complete-text',
);

const allCompletedText = document.getElementById('all-complete-text');

const questionnaireCompleteIcon = document.getElementById(
    'questionnaire-complete-icon',
);
const coCreationCompleteIcon = document.getElementById(
    'co-creation-complete-icon',
);

const analyticsTab = document.getElementById('analytics');

const userHelloText = document.getElementById('user-hello');
const affiliationCodeText = document.getElementById('affiliation-text');
const affiliationCodeValue = document.getElementById('affiliation-code');
const roleText = document.getElementById('role');

const logOutButton = document.getElementById('log-out-btn');

document.addEventListener('DOMContentLoaded', async () => {
    const res = await (await fetch('/userData')).json();

    const { isAuthenticated, role, name, affiliationCode } = res.userData;

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

    if (localStorage.getItem('surveyedData')) {
        const surveyedData = JSON.parse(localStorage.getItem('surveyedData'));
        surveyedData['affiliationCode'] = affiliationCode;
        localStorage.setItem('surveyedData', JSON.stringify(surveyedData));
        questionnaireCompleteIcon.classList.remove('hidden');

        preQuestionnaireText.classList.add('hidden');
        questionnaireCompletedText.classList.remove('hidden');
        coCreationSite.addEventListener('click', () => {
            window.location.href = '/robotCoCreation';
        });
    } else {
        coCreationSite.classList.remove('cursor-pointer');
        coCreationSite.classList.add('cursor-not-allowed');
    }

    if (localStorage.getItem('coCreationPassed')) {
        coCreationCompleteIcon.classList.remove('hidden');

        preQuestionnaireText.classList.add('hidden');
        questionnaireCompletedText.classList.add('hidden');
        allCompletedText.classList.remove('hidden');
    }
});

questionare.addEventListener('click', () => {
    window.location.href = '/questionare';
});

logOutButton.addEventListener('click', async () => {
    if (confirm('Are you sure you want to log out?') == true) {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
        });

        const res = await response.json();

        if (res.status === 'success') {
            localStorage.clear();
            window.location.href = '/login';
        }
        if (res.status === 'fail') {
            alert(res.message);
        }
    }
});
