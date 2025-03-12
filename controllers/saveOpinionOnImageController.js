const pool = require('../utils/db');

async function saveOpinionOnImage(req, res) {
    const { id, matchRating, aligningAspects, missingAspects } = req.body;

    const query = `
        UPDATE images_and_opinions 
        SET match_rating = ?, aligning_aspects = ?, missing_aspects = ?
        WHERE id = ?;
    `;

    try {
        const [result] = await pool.query(query, [
            matchRating,
            aligningAspects,
            missingAspects,
            id,
        ]);

        console.log('Record updated successfully!', result);

        return res.status(201).send({
            status: 'success',
            message: 'Opinion saved succesfully',
        });
    } catch (error) {
        console.error('Error updating record:', error);
        return res.status(500).send({
            status: 'error',
            message: error,
        });
    }
}

module.exports = saveOpinionOnImage;
