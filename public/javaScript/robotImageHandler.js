const btn = document.getElementById('btn1');
const imageElement = document.getElementById('robotImage');

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

const url = '/generateImage';

const answerID = localStorage.getItem('answerID');
const data = { answerID };

btn.addEventListener('click', async () => {
    console.log('clicked');
    console.log(answerID, url);
    try {
        const response = await sendPostReq(data, url);

        console.log(response);

        imageElement.src = response.imageLink;
        imageElement.style.visibility = 'visible';
    } catch (err) {
        console.log(err);
    }

    sendPostReq(data, url);
});
