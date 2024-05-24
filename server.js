const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const app = express();

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(con => console.log('DB connections successfull'));

const surveyEntrySchema = new mongoose.Schema({
    caregiver: String,
    formal: String,
    typeOfCaregiver: String,
    dateOfBirth: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    education: {
        type: String,
        required: true,
    },
    profession: {
        type: String,
        required: true,
    },
    background: {
        type: String,
        required: true,
    },
    computersFamiliarity: {
        type: String,
        required: true,
    },
    techSysFamiliarity: {
        type: String,
        required: true,
    },
    sectionA: {
        A1: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        A2: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        A3: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        A4: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        A5: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        A6: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        A7: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        A8: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        A9: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        A10: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
    },
    sectionB: {
        B1: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        B2: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        B3: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        B4: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        B5: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        B6: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        B7: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        B8: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        B9: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        B10: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        B11: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        B12: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        B13: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
    },
    sectionC: {
        C1: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        C2: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        C3: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        C4: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        C5: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        C6: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
    },
    sectionD: {
        D1: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        D2: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        D3: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        D4: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
        D5: {
            answer: {
                type: String,
                required: true,
            },
            comment: String,
        },
    },
    creativityBox: String,
});

const SurveyEntry = mongoose.model('SurveyEntry', surveyEntrySchema);

// Middlewares
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
//

const port = process.env.PORT || 3000;

// Endpoints
app.post('/', (req, res) => {
    const data = req.body;
    const newSurveyEntry = new SurveyEntry(data);

    newSurveyEntry
        .save()
        .then(doc => {
            console.log(doc);
        })
        .catch(err => {
            console.log('ERROR💥💥💥: ', err);
        });

    // console.log(data);
    res.status(201).send(JSON.stringify(data));
});

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
