const ageInput = document.getElementById('ageInput');
const professionInput = document.getElementById('professionInput');

const genderSection = document.getElementById('gender');
const maritalSection = document.getElementById('maritalStatus');
const educationSection = document.getElementById('education');
const residenceSection = document.getElementById('placeOfResidence');
const livingSection = document.getElementById('livingArrangement');

const allSections = [
    genderSection,
    maritalSection,
    educationSection,
    residenceSection,
    livingSection,
];

const questions1_5 = document.querySelector('table');

const submitButton = document.querySelector('.submit-btn');
const errorMessage = document.querySelector('.error');

const surveyedData = {
    age: '',
    gender: '',
    maritalStatus: '',
    education: '',
    placeOfResidence: '',
    livingArrangement: '',
    profession: '',
    computerFamiliarity: '',
    techSysFamiliarity: '',
    loneliness: '',
    healthRating: '',
    fitnessRating: '',
};

function sectionsHandler(e) {
    e.preventDefault();
    const button = e.target.closest('button');

    if (button) {
        const sectionName = button.closest('.section').id;
        surveyedData[sectionName] = button.textContent.toLowerCase().trim();

        const sectionButtons = button
            .closest('.section')
            .querySelectorAll('button');
        sectionButtons.forEach(e => {
            e.classList.remove('btn-active');
            e.classList.add('btn-inactive');
        });
        button.classList.remove('btn-inactive');
        button.classList.add('btn-active');
    }
}

allSections.forEach(section => {
    section.addEventListener('click', sectionsHandler);
});

function tableHandler(e) {
    e.preventDefault();
    const button = e.target.closest('button');

    if (button) {
        const sectionName = button.closest('tr').id;
        surveyedData[sectionName] = button.name;

        const allButtons = button.closest('tr').querySelectorAll('button');

        allButtons.forEach(el => {
            el.classList.remove('table-btn-active');
            el.classList.add('table-btn');
        });
        button.classList.remove('table-btn');
        button.classList.add('table-btn-active');
    }
}

questions1_5.addEventListener('click', tableHandler);

submitButton.addEventListener('click', () => {
    const age = ageInput.value;
    const profession = professionInput.value;

    if (age && profession) {
        surveyedData.age = age;
        surveyedData.profession = profession;
        // check if any value is empty in surveyedData
        if (!Object.values(surveyedData).some(value => value == '')) {
            localStorage.setItem('surveyedData', JSON.stringify(surveyedData));
            console.log(surveyedData);

            window.location.href = '/mainPage';
        } else {
            errorMessage.classList.remove('hidden');
        }
    } else {
        errorMessage.classList.remove('hidden');
    }
});
