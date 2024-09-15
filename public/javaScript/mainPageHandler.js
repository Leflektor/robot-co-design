const questionare = document.querySelector('.questionare');
const co_creationSite = document.querySelector('.robot-co-creation');

const preQuestionnaire = document.querySelector('.pre-complete');
const afterQuestionnaire = document.querySelector('.complete');
const correctIcon = document.querySelector('.correct');

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
