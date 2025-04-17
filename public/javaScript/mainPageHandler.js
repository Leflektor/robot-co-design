const questionnaire = document.querySelector('.questionnaire');
const coCreationSite = document.querySelector('.robot-co-creation');
const imageGenerationTab = document.querySelector('.robot-image-generation');

const preQuestionnaireText = document.getElementById('pre-questionnaire-text');
const questionnaireCompletedText = document.getElementById(
    'questionnaire-complete-text',
);
const coCreationCompletedText = document.getElementById(
    'co-creation-complete-text',
);
const allCompletedText = document.getElementById('all-complete-text');

const questionnaireCompleteIcon = document.getElementById(
    'questionnaire-complete-icon',
);
const coCreationCompleteIcon = document.getElementById(
    'co-creation-complete-icon',
);
const allCompleteIcon = document.getElementById('all-complete-icon');

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
        userHelloText.textContent = `Hello ${name}`;
        affiliationCodeText.textContent = `Your affiliation code:`;
        affiliationCodeValue.textContent = `${affiliationCode}`;
        roleText.textContent = `Your role is ${role}`;
    } else if (affiliationCode) {
        userHelloText.textContent = 'Hello affiliated guest';
        affiliationCodeText.textContent = `Affiliation code you used:`;
        affiliationCodeValue.textContent = `${affiliationCode}`;
        roleText.textContent = `Your role is ${role}`;
    } else {
        userHelloText.textContent = 'Hello non-affiliated guest';
        roleText.textContent = `Your role is ${role}`;
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
        coCreationCompletedText.classList.remove('hidden');
        imageGenerationTab.addEventListener('click', () => {
            window.location.href = '/generateRobotImage';
        });
        imageGenerationTab.classList.add('cursor-pointer');
        imageGenerationTab.classList.remove('cursor-not-allowed');
    } else {
        imageGenerationTab.classList.remove('cursor-pointer');
        imageGenerationTab.classList.add('cursor-not-allowed');
    }

    if (localStorage.getItem('allCompleted')) {
        allCompletedText.classList.remove('hidden');
        allCompleteIcon.classList.remove('hidden');
        coCreationCompletedText.classList.add('hidden');
        questionnaireCompletedText.classList.add('hidden');
        preQuestionnaireText.classList.add('hidden');
    }
});

questionnaire.addEventListener('click', () => {
    window.location.href = '/questionnaire';
});

logOutButton.addEventListener('click', async () => {
    if (
        confirm(
            'Are you sure you want to log out? \n It will erease your progress.',
        ) == true
    ) {
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
