const surveyedData = JSON.parse(localStorage.getItem('surveyedData'));

const sectionText = document.querySelector('.section');
const subSectionText = document.querySelector('.sub-section');
const questionText = document.querySelector('.question');

const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

const submitSection = document.querySelector('.submit-sec');
const submitButton = document.querySelector('.submit-btn');

const errorMessage = document.querySelector('.error');

const sectionDescDiv = document.getElementById('sec-div');

const textarea = document.querySelector('textarea');

const thankYouSection = document.getElementById('thank_you');

let sId = 0;
let qId = 0;

const comments = document.querySelectorAll('.co-creation-comment');

const sections = [
    'Section 1: Physical Features',
    'Section 2: Functional Features',
    'Section 3: Social Functions',
    'Section 4: Security, Privacy, and Smart Home Integration',
    'Section 5: Deployment Considerations',
    '5.1. Deployment in a Private Home:',
    '5.2. Deployment in a Nursing Home:',
];

const questionsDescriptions = [
    [
        '1.1. Height of the Robot:',
        '1.2. Mobility:',
        '1.3. Appearance:',
        '1.4. Color Scheme:',
        '1.5. Size:',
        '1.6. Facial Features:',
        '1.7. Arms and Hands:',
        '1.8. Manipulative Functionality:',
        '1.9. Physical Support:',
        '1.10. User Interface:',
    ],
    [
        '2.1. Personality:',
        '2.2. Communication Style:',
        '2.3. Interaction Level:',
        '2.4. Assistive Functions:',
        '2.5. Social Engagement:',
        '2.6. Emotional Support:',
        '2.7. Customization:',
        '2.8. Physical Exercise Reminders:',
        '2.9. Dietary Monitoring:',
        '2.10. Dietary Recommendations:',
    ],
    [
        '3.1. Companionship Role:',
        '3.2. Mood Detection:',
        '3.3. Social Interaction Encouragement:',
        '3.4. Emotional Expression:',
        '3.5. Entertainment Functions:',
        '3.6. Cognitive Engagement:',
        '3.7. Social Connection:',
        '3.8. Behavioral Monitoring:',
    ],
    [
        '4.1. Privacy Settings:',
        '4.2. Smart Home Integration:',
        '4.3. Security Monitoring:',
        '4.4. Data Sharing:',
        '4.5. Emergency Response:',
    ],
    [
        '5.1.1. Technical Support of the Social Robot:',
        '5.1.2. Training for the Elderly User:',
        '5.1.3. Involvement of Informal Caregivers/Families:',
        '5.1.4. Individual Training:',
    ],
    ['5.2.1. Technical Support:', '5.2.2. Training for Nursing Home Staff:'],
];

const questions = [];

for (let i = 0; i < questionsDescriptions.length; i++) {
    const temp = [];
    for (let j = 0; j < questionsDescriptions[i].length; j++)
        temp.push(document.getElementById(`${i}${j}`));
    questions.push(temp);
}

const answers = {
    S0: {
        Q0: { ans: '', com: '' },
        Q1: { ans: '', com: '' },
        Q2: { ans: '', com: '' },
        Q3: { ans: '', com: '' },
        Q4: { ans: '', com: '' },
        Q5: { ans: '', com: '' },
        Q6: { ans: '', com: '' },
        Q7: { ans: '', com: '' },
        Q8: { ans: '', com: '' },
        Q9: { ans: '', com: '' },
    },
    S1: {
        Q0: { ans: '', com: '' },
        Q1: { ans: '', com: '' },
        Q2: { ans: '', com: '' },
        Q3: { ans: '', com: '' },
        Q4: { ans: '', com: '' },
        Q5: { ans: '', com: '' },
        Q6: { ans: '', com: '' },
        Q7: { ans: '', com: '' },
        Q8: { ans: '', com: '' },
        Q9: { ans: '', com: '' },
    },
    S2: {
        Q0: { ans: '', com: '' },
        Q1: { ans: '', com: '' },
        Q2: { ans: '', com: '' },
        Q3: { ans: '', com: '' },
        Q4: { ans: '', com: '' },
        Q5: { ans: '', com: '' },
        Q6: { ans: '', com: '' },
        Q7: { ans: '', com: '' },
    },
    S3: {
        Q0: { ans: '', com: '' },
        Q1: { ans: '', com: '' },
        Q2: { ans: '', com: '' },
        Q3: { ans: '', com: '' },
        Q4: { ans: '', com: '' },
    },
    S4: {
        Q0: { ans: '', com: '' },
        Q1: { ans: '', com: '' },
        Q2: { ans: '', com: '' },
        Q3: { ans: '', com: '' },
    },
    S5: {
        Q0: { ans: '', com: '' },
        Q1: { ans: '', com: '' },
    },
};

async function sendPostReq(data) {
    const res = await fetch('/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const response = await res.json();
    console.log(response);
    return response;
}

function questionHandler(e) {
    e.preventDefault();

    const choice = e.target.closest('.answer');

    prevButton.classList.remove('cursor-not-allowed');

    if (choice) {
        answers[`S${sId}`][`Q${qId}`]['ans'] = choice.getAttribute('name');

        const buttons = choice.parentElement.querySelectorAll('.answer');
        const answerType = choice.classList[1].includes('image')
            ? 'image'
            : 'text';

        buttons.forEach(el => {
            el.classList.remove(`answer-${answerType}-chosen`);
            el.classList.add(`answer-${answerType}`);
        });
        choice.classList.remove(`answer-${answerType}`);
        choice.classList.add(`answer-${answerType}-chosen`);

        if (qId >= questionsDescriptions[`${sId}`].length - 1) {
            if (sId >= questionsDescriptions.length - 1) {
                questions[sId][qId].classList.add('hidden');
                sectionText.classList.add('hidden');
                questionText.classList.add('hidden');
                subSectionText.classList.add('hidden');
                nextButton.classList.add('cursor-not-allowed');
                submitSection.classList.remove('hidden');
                sectionDescDiv.classList.add('hidden');
                sId++;
                qId = 0;
            } else {
                questions[sId][qId].classList.add('hidden');
                qId = 0;
                sId++;
                questions[sId][qId].classList.remove('hidden');
            }
        } else {
            questions[sId][qId].classList.add('hidden');
            qId++;
            questions[sId][qId].classList.remove('hidden');
        }

        if (sId == 6) return;

        sectionText.textContent = sections[sId];
        questionText.textContent = questionsDescriptions[sId][qId];
        if (sId == 4) {
            subSectionText.classList.remove('hidden');
            subSectionText.textContent = sections[5];
        }
        if (sId == 5) {
            subSectionText.textContent = sections[6];
            sectionText.textContent = sections[4];
        }
    }
}

questions.forEach(el =>
    el.forEach(ell => ell.addEventListener('click', questionHandler)),
);

prevButton.addEventListener('click', () => {
    if (sId == 0 && qId == 0) return;
    if (sId == 0 && qId == 1) prevButton.classList.add('cursor-not-allowed');

    if (sId == 6) {
        sectionText.classList.remove('hidden');
        questionText.classList.remove('hidden');
        subSectionText.classList.remove('hidden');
        sectionDescDiv.classList.remove('hidden');
        submitSection.classList.add('hidden');
        sId--;
        qId = questionsDescriptions[sId].length - 1;
        questions[sId][qId].classList.remove('hidden');
        nextButton.classList.remove('cursor-not-allowed');
        return;
    }

    questions[sId][qId].classList.add('hidden');
    if (qId == 0) {
        if (sId == 5) {
            subSectionText.textContent = sections[5];
        }

        if (sId == 4) {
            subSectionText.classList.add('hidden');
        }
        sId--;
        qId = questionsDescriptions[sId].length - 1;
    } else {
        if (sId == 5) {
            qId--;
            questions[sId][qId].classList.remove('hidden');
            sectionText.textContent = sections[4];
            questionText.textContent = questionsDescriptions[sId][qId];
            return;
        }
        qId--;
    }
    questions[sId][qId].classList.remove('hidden');
    sectionText.textContent = sections[sId];
    questionText.textContent = questionsDescriptions[sId][qId];
});

nextButton.addEventListener('click', () => {
    prevButton.classList.remove('cursor-not-allowed');
    if (sId == 6) return;
    if (qId >= questionsDescriptions[`${sId}`].length - 1) {
        if (sId >= questionsDescriptions.length - 1) {
            questions[sId][qId].classList.add('hidden');
            sectionText.classList.add('hidden');
            questionText.classList.add('hidden');
            subSectionText.classList.add('hidden');
            sectionDescDiv.classList.add('hidden');

            nextButton.classList.add('cursor-not-allowed');
            submitSection.classList.remove('hidden');
            sId++;
            qId = 0;
        } else {
            questions[sId][qId].classList.add('hidden');
            qId = 0;
            sId++;
            questions[sId][qId].classList.remove('hidden');
        }
    } else {
        questions[sId][qId].classList.add('hidden');
        qId++;
        questions[sId][qId].classList.remove('hidden');
    }
    if (sId == 6) return;

    sectionText.textContent = sections[sId];
    questionText.textContent = questionsDescriptions[sId][qId];
    if (sId == 4) {
        subSectionText.classList.remove('hidden');
        subSectionText.textContent = sections[5];
    }
    if (sId == 5) {
        subSectionText.textContent = sections[6];
        sectionText.textContent = sections[4];
    }
});

submitButton.addEventListener('click', submitButtonHandler);

async function submitButtonHandler() {
    if (
        Object.values(answers).some(el =>
            Object.values(el).some(value => value.ans == ''),
        )
    ) {
        errorMessage.classList.remove('hidden');
    } else {
        let temp = 0;
        const commentsValue = [...comments].map(val => val.value);
        for (let i = 0; i < questionsDescriptions.length; i++) {
            for (let j = 0; j < questionsDescriptions[i].length; j++) {
                answers[`S${i}`][`Q${j}`]['com'] = commentsValue[temp];
                temp++;
            }
        }

        answers['date'] = new Date()
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');
        answers['surveyedData'] = surveyedData;
        answers['surveyedData'].creativityBox = textarea.value;
        const response = await sendPostReq(answers);
        console.log(response.status);

        if (response.status === 'success') {
            submitSection.classList.add('hidden');
            thankYouSection.classList.remove('hidden');
            prevButton.classList.add('hidden');
            nextButton.classList.add('hidden');
        } else if (response.status === 'error') {
            alert('Error occured, try submitiing again!'); // Informacja dla użytkownika o błędzie
        }
    }
}
