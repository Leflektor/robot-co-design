const generateImagebutton = document.getElementById('generate-button');
const placeHolderDiv = document.getElementById('image-placeholder');
const placeHolderText = document.getElementById('placeholder-text');
const placeHolderSpinner = document.getElementById('placeholder-spinner');

const imageElement = document.getElementById('robot-image');

const opinionSection = document.getElementById('opinion-section');
const promptSection = document.getElementById('prompt');

const aligningAspectsInput = document.getElementById('aligning-aspects');
const missingAspectsInput = document.getElementById('missing-aspects');
const submitButton = document.getElementById('submit-btn');
const slider = document.getElementById('slider');
const output = document.getElementById('slider-value');

slider.addEventListener('input', () => {
    output.textContent = slider.value;
});

async function sendPostReq(data, url) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const res = await response.json();
    return res;
}

const answerId = localStorage.getItem('answerId');

generateImagebutton.addEventListener('click', async () => {
    const url = '/generateImage';
    const data = { answerId };

    if (!answerId) return;

    placeHolderText.classList.add('hidden');
    placeHolderSpinner.classList.remove('hidden');

    try {
        const res = await sendPostReq(data, url);

        if ((res.status = 'success')) {
            console.log(res.prompt); // Delete later

            imageElement.src = res.imageLink;
            placeHolderDiv.classList.add('hidden');
            imageElement.classList.remove('hidden');
            opinionSection.classList.remove('hidden');
            promptSection.textContent = res.prompt;
        }
    } catch (err) {
        console.log(err);
    }
});

submitButton.addEventListener('click', async () => {
    const url = '/saveOpinionOnImage';
    const data = {
        id: answerId,
        matchRating: slider.value,
        aligningAspects: aligningAspectsInput.value,
        missingAspects: missingAspectsInput.value,
    };

    try {
        const res = await sendPostReq(data, url);
        if ((res.status = 'success')) {
            localStorage.setItem('allCompleted', true);
            window.location.href = '/mainPage';
        }
    } catch (err) {
        console.log(err);
        window.location.href = '/mainPage';
    }
});
