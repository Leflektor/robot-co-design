const axios = require('axios');
const pool = require('../utils/db');
const fs = require('fs');
const { log } = require('console');

const rawData = fs.readFileSync('questions.json', 'utf8');
const questionsData = JSON.parse(rawData);

async function generateRobotPicture(req, res) {
    const url = 'https://api.openai.com/v1/images/generations';
    const apiKey = process.env.API_KEY;
    const size = '1024x1024';

    const query = 'SELECT * FROM robot_co_creation_answers WHERE ID = ?';

    const id = req.body.answerID;
    console.log(id);

    try {
        const [results] = await pool.query(query, [id]);

        const userAnswers = JSON.parse(results[0].S1);

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

        // const response = await axios.post(
        //     url,
        //     {
        //         model: 'dall-e-3',
        //         prompt: prompt, // Opis obrazu, który chcesz wygenerować
        //         n: 1, // Liczba obrazów do wygenerowania
        //         size: size, // Rozmiar obrazu
        //     },
        //     {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             Authorization: `Bearer ${apiKey}`,
        //         },
        //     },
        // );

        // console.log(response.data.data[0].url);
        console.log(prompt);

        res.status(201).send({
            status: 'success',
            data: prompt,
            message: 'Image generated succesfully',
            // imageLink: response.data.data[0].url,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            status: 'error',
            message: error,
        });
    }
}

module.exports = generateRobotPicture;
