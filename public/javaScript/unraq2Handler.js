const app = document.querySelector('.app');

const goal_section = document.querySelector('.goal');

const button_yes = document.querySelector('.yes');
const button_no = document.querySelector('.no');

const button_formal = document.querySelector('.form');
const button_informal = document.querySelector('.inform');

const questionsOneSection = document.querySelector('.questions1');
const input = document.querySelector('.input');

const nextPageBtn = document.querySelector('.next-page');
const prevPageBtn = document.querySelector('.prev-page');

const formalButtons = document.querySelectorAll('.formal');
const informalButtons = document.querySelectorAll('.informal');
const formalSection = document.querySelector('.formal-section');
const informalSection = document.querySelector('.informal-section');
const caregiverForm = document.querySelector('.caregiver-form');
const caregiverSubmitBtn = document.querySelector('.caregiver-submit');

const birthDateForm = document.querySelector('.birth-date-form');
const birthDateSubmitBtn = document.querySelector('.birth-date-submit');

const genderSection = document.querySelector('.gender-section');
const genderButtons = document.querySelectorAll('.gender');

const educationForm = document.querySelector('.education-form');
const educationSubmitBtn = document.querySelector('.education-submit');

const professionForm = document.querySelector('.profession-form');
const professionSubmitBtn = document.querySelector('.profession-submit');

const backgroundSection = document.querySelector('.background-section');
const backgroundSectionButtons = document.querySelectorAll('.background');

const computersSection = document.querySelector('.computers-section');
const computersSectionButtons = document.querySelectorAll('.computers');

const techSystemsSection = document.querySelector('.tech-systems-section');
const techSystemsSectionButtons = document.querySelectorAll('.tech-systems');

const tables = document.querySelectorAll('table');

const textarea = document.querySelector('textarea');

const submitAllButton = document.querySelector('.submit-all');

const pages = document.querySelectorAll('.page');

var currentPage = 0;

const surveyedData = {
    caregiver: '',
    formal: '',
    typeOfCaregiver: '',
    dateOfBirth: '',
    gender: '',
    education: '',
    profession: '',
    background: '',
    computersFamiliarity: '',
    techSysFamiliarity: '',
    sectionA: {
        A1: { answer: '', comment: '' },
        A2: { answer: '', comment: '' },
        A3: { answer: '', comment: '' },
        A4: { answer: '', comment: '' },
        A5: { answer: '', comment: '' },
        A6: { answer: '', comment: '' },
        A7: { answer: '', comment: '' },
        A8: { answer: '', comment: '' },
        A9: { answer: '', comment: '' },
        A10: { answer: '', comment: '' },
    },
    sectionB: {
        B1: { answer: '', comment: '' },
        B2: { answer: '', comment: '' },
        B3: { answer: '', comment: '' },
        B4: { answer: '', comment: '' },
        B5: { answer: '', comment: '' },
        B6: { answer: '', comment: '' },
        B7: { answer: '', comment: '' },
        B8: { answer: '', comment: '' },
        B9: { answer: '', comment: '' },
        B10: { answer: '', comment: '' },
        B11: { answer: '', comment: '' },
        B12: { answer: '', comment: '' },
        B13: { answer: '', comment: '' },
    },
    sectionC: {
        C1: { answer: '', comment: '' },
        C2: { answer: '', comment: '' },
        C3: { answer: '', comment: '' },
        C4: { answer: '', comment: '' },
        C5: { answer: '', comment: '' },
        C6: { answer: '', comment: '' },
    },
    sectionD: {
        D1: { answer: '', comment: '' },
        D2: { answer: '', comment: '' },
        D3: { answer: '', comment: '' },
        D4: { answer: '', comment: '' },
        D5: { answer: '', comment: '' },
    },
    creativityBox: '',
};

async function sendPostReq(data) {
    const res = await fetch('http://localhost:3000/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const response = await res.json();
    console.log(response);
}

// EVENT LISTENERS
// Yes No buttons
button_yes.addEventListener('click', () => {
    questionsOneSection.classList.remove('hidden');
    button_yes.classList.remove('btn-inactive');
    button_yes.classList.add('btn-active');
    button_no.classList.remove('btn-active');
    button_no.classList.add('btn-inactive');
    surveyedData.caregiver = 'yes';
});

button_no.addEventListener('click', () => {
    questionsOneSection.classList.add('hidden');
    informalSection.classList.add('hidden');
    formalSection.classList.add('hidden');
    button_no.classList.remove('btn-inactive');
    button_no.classList.add('btn-active');
    button_yes.classList.remove('btn-active');
    button_yes.classList.add('btn-inactive');
    caregiverForm.classList.add('hidden');

    button_formal.classList.remove('btn-active');
    button_formal.classList.add('btn-inactive');
    informalButtons.forEach(e => {
        e.classList.remove('btn-active');
        e.classList.add('btn-inactive');
    });

    button_informal.classList.remove('btn-active');
    button_informal.classList.add('btn-inactive');
    formalButtons.forEach(e => {
        e.classList.remove('btn-active');
        e.classList.add('btn-inactive');
    });

    surveyedData.caregiver = 'no';
    surveyedData.formal = '';
    surveyedData.typeOfCaregiver = '';
});

// Formal Informal buttons
button_formal.addEventListener('click', () => {
    formalSection.classList.remove('hidden');
    informalSection.classList.add('hidden');
    button_formal.classList.remove('btn-inactive');
    button_formal.classList.add('btn-active');
    button_informal.classList.remove('btn-active');
    button_informal.classList.add('btn-inactive');
    caregiverForm.classList.remove('hidden');
    informalButtons.forEach(e => {
        e.classList.remove('btn-active');
        e.classList.add('btn-inactive');
    });
    surveyedData.formal = 'yes';
});

button_informal.addEventListener('click', () => {
    informalSection.classList.remove('hidden');
    formalSection.classList.add('hidden');
    button_informal.classList.remove('btn-inactive');
    button_informal.classList.add('btn-active');
    button_formal.classList.remove('btn-active');
    button_formal.classList.add('btn-inactive');
    caregiverForm.classList.remove('hidden');
    formalButtons.forEach(e => {
        e.classList.remove('btn-active');
        e.classList.add('btn-inactive');
    });
    surveyedData.formal = 'no';
});

// Caregiver type choosing/submiting your own
informalSection.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.classList.contains('informal')) {
        surveyedData.typeOfCaregiver = e.target.textContent;
        informalButtons.forEach(e => {
            e.classList.remove('btn-active');
            e.classList.add('btn-inactive');
        });
        e.target.classList.add('btn-active');
    }
});

formalSection.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.classList.contains('formal')) {
        surveyedData.typeOfCaregiver = e.target.textContent;
        formalButtons.forEach(e => {
            e.classList.remove('btn-active');
            e.classList.add('btn-inactive');
        });
        e.target.classList.add('btn-active');
    }
});

caregiverForm.addEventListener('submit', e => e.preventDefault());

caregiverSubmitBtn.addEventListener('click', () => {
    Array.from(caregiverForm.children).forEach(e => {
        if (e.tagName.toLowerCase() === 'input') {
            surveyedData.typeOfCaregiver = e.value;
        }
    });

    informalButtons.forEach(e => {
        e.classList.remove('btn-active');
        e.classList.add('btn-inactive');
    });

    formalButtons.forEach(e => {
        e.classList.remove('btn-active');
        e.classList.add('btn-inactive');
    });
});

// Birth date
birthDateForm.addEventListener('submit', e => e.preventDefault());

birthDateSubmitBtn.addEventListener('click', () => {
    Array.from(birthDateForm.children).forEach(e => {
        if (e.tagName.toLowerCase() === 'input') {
            surveyedData.dateOfBirth = e.value;
        }
    });
});

// Gender
genderSection.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.classList.contains('gender')) {
        surveyedData.gender = e.target.textContent.trim().toLowerCase();
        genderButtons.forEach(e => {
            e.classList.remove('btn-active');
            e.classList.add('btn-inactive');
        });
        e.target.classList.add('btn-active');
    }
});

// Education
educationForm.addEventListener('submit', e => e.preventDefault());

educationSubmitBtn.addEventListener('click', () => {
    Array.from(educationForm.children).forEach(e => {
        if (e.tagName.toLowerCase() === 'input') {
            surveyedData.education = e.value;
        }
    });
});

// Profession
professionForm.addEventListener('submit', e => e.preventDefault());

professionSubmitBtn.addEventListener('click', () => {
    Array.from(professionForm.children).forEach(e => {
        if (e.tagName.toLowerCase() === 'input') {
            surveyedData.profession = e.value;
        }
    });
});

// Background
backgroundSection.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.classList.contains('background')) {
        surveyedData.background = e.target.textContent.trim().toLowerCase();
        backgroundSectionButtons.forEach(e => {
            e.classList.remove('btn-active');
            e.classList.add('btn-inactive');
        });
        e.target.classList.add('btn-active');
    }
});

// Computers and technological systems familiarity
computersSection.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.classList.contains('computers')) {
        surveyedData.computersFamiliarity = e.target.textContent
            .trim()
            .toLowerCase();
        computersSectionButtons.forEach(e => {
            e.classList.remove('btn-active');
            e.classList.add('btn-inactive');
        });
        e.target.classList.add('btn-active');
    }
});

techSystemsSection.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.classList.contains('tech-systems')) {
        surveyedData.techSysFamiliarity = e.target.textContent
            .trim()
            .toLowerCase();
        techSystemsSectionButtons.forEach(e => {
            e.classList.remove('btn-active');
            e.classList.add('btn-inactive');
        });
        e.target.classList.add('btn-active');
    }
});

// Questionare handling
function tableHandler(e) {
    e.preventDefault();
    const button = e.target.closest('button');

    if (button) {
        const allButtons = button.closest('tr').querySelectorAll('button');
        const rowId = button.closest('tr').id;
        const sectionName = `section${String.fromCharCode(currentPage + 64)}`;

        surveyedData[sectionName][rowId].answer = button.name;

        allButtons.forEach(el => {
            el.classList.remove('table-btn-active');
            el.classList.add('table-btn');
        });
        button.classList.remove('table-btn');
        button.classList.add('table-btn-active');
    }
}

tables.forEach(table => {
    table.addEventListener('click', tableHandler);
});

// Creativity Box
textarea.addEventListener('keyup', e => {
    textarea.style.height = '176px';
    const textareaHeight = e.target.scrollHeight;
    textarea.style.height = `${textareaHeight + 2}px`;
});

// Submit all Button
submitAllButton.addEventListener('click', () => {
    surveyedData.creativityBox = textarea.value;

    sendPostReq(surveyedData);
});

// Pages
nextPageBtn.addEventListener('click', () => {
    // Retriving data form questions comments every time page is changed
    if (currentPage > 0 && currentPage < 6) {
        const comments = document
            .getElementById(`${currentPage}`)
            .querySelectorAll('input');

        comments.forEach((comment, index) => {
            const sectionLetter = String.fromCharCode(currentPage + 64);
            const questionID = `${sectionLetter}${index + 1}`;
            const sectionName = `section${sectionLetter}`;
            surveyedData[sectionName][questionID].comment = comment.value;
        });
    }

    // Do nothing in case of last page
    if (currentPage > pages.length - 2) return;
    else {
        currentPage++;
        app.classList.remove('max-w-xl');
        app.classList.add('max-w-4xl');
        prevPageBtn.classList.remove('cursor-not-allowed');
        goal_section.classList.add('hidden');
        if (currentPage === pages.length - 1) {
            nextPageBtn.classList.add('cursor-not-allowed');
        }
        pages.forEach(page => {
            page.classList.add('hidden');
        });
        document.getElementById(`${currentPage}`).classList.remove('hidden');
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
});

prevPageBtn.addEventListener('click', () => {
    // Retriving data form questions comments every time page is changed
    if (currentPage > 0 && currentPage < 6) {
        const inputs = document
            .getElementById(`${currentPage}`)
            .querySelectorAll('input');

        inputs.forEach((input, index) => {
            const sectionLetter = String.fromCharCode(currentPage + 64);
            const questionID = `${sectionLetter}${index + 1}`;
            const sectionName = `section${sectionLetter}`;
            surveyedData[sectionName][questionID].comment = input.value;
        });
    }

    // Do nothing in case of first page
    if (currentPage < 1) return;
    else {
        currentPage--;
        nextPageBtn.classList.remove('cursor-not-allowed');
        if (currentPage === 0) {
            prevPageBtn.classList.add('cursor-not-allowed');
            app.classList.add('max-w-xl');
            app.classList.remove('max-w-4xl');
            goal_section.classList.remove('hidden');
        }
        pages.forEach(page => {
            page.classList.add('hidden');
        });
        document.getElementById(`${currentPage}`).classList.remove('hidden');
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
});
