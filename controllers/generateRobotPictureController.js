const axios = require('axios');
const pool = require('../utils/db');
const fs = require('fs');

const rawData = fs.readFileSync('questions.json', 'utf8');

const questionsData = JSON.parse(rawData);

async function saveImage(imageId, imageURL) {
    try {
        const fileName = `robot_${imageId}.png`;
        const filePath = `${__dirname.replace('controllers', 'generated_images')}\\${fileName}`;

        const response = await axios({
            url: imageURL,
            method: 'GET',
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on('finish', async () => {
            console.log('Image saved at:', filePath); //DELETE LATER

            const query = `INSERT INTO images_and_opinions (id, file_name) VALUES (?, ?)`;
            await pool.query(query, [imageId, fileName]);
        });

        writer.on('error', err => {
            console.error('Error saving image:', err);
        });
    } catch (err) {
        console.error('Error downloading image:', error);
    }
}

async function generateRobotPicture(req, res) {
    const url = 'https://api.openai.com/v1/images/generations';
    const apiKey = process.env.API_KEY;
    const size = '1024x1024';

    const query = 'SELECT S0 FROM robot_co_creation_answers WHERE ID = ?';

    const id = req.body.answerId;

    if (!req.session.user.recordId == id) {
        return res.status(500).send({
            status: 'error',
            message: 'Missmatching ids',
        });
    }

    // In case user spams button or they refreshed and the page, they still can get image without genereting new one
    if (req.session.user.imageLink) {
        return res.status(201).send({
            status: 'success',
            message: 'Image generated succesfully',
            imageLink: req.session.user.imageLink,
            prompt: req.session.user.prompt,
        });
    }

    try {
        const [results] = await pool.query(query, [id]);

        const userAnswers = JSON.parse(results[0].S0);

        const questions = [];
        const userAnswersText = [];
        const userAnswersComments = [];

        Object.keys(userAnswers).forEach(key => {
            userAnswersText.push(
                questionsData[key]['answers'][userAnswers[key]['ans']],
            );
            userAnswersComments.push(userAnswers[key]['com']);
        });

        Object.keys(questionsData).forEach(key => {
            questions.push(questionsData[key]['question']);
        });

        const userAnswersMerged = [];

        for (let i = 0; i < questions.length; i++) {
            userAnswersMerged[i] =
                `${questions[i]}: ${userAnswersText[i]} ${userAnswersComments[i]}`;
        }

        const prompt = `Generate image of a robot with consecutive features: \n${userAnswersMerged.join('\n')}`;
        const fullPrompt = `${prompt}. Generate robot on just a plain background and no text on the image.`;

        const response = await axios.post(
            url,
            {
                model: 'dall-e-3',
                prompt: fullPrompt,
                n: 1, // images count
                size: size,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            },
        );

        // const imageLink = 'randomlink';
        const imageLink = response.data.data[0].url;

        req.session.user.imageLink = imageLink;
        req.session.user.prompt = prompt;

        res.status(201).send({
            status: 'success',
            message: 'Image generated succesfully',
            imageLink: imageLink,
            prompt: prompt,
        });

        saveImage(id, imageLink);
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            status: 'error',
            message: error,
        });
    }
}

module.exports = generateRobotPicture;
