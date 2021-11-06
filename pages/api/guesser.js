const vision = require('@google-cloud/vision');


import multipart from "../../middleware/multipart";
import nextConnect from 'next-connect'

const handler = nextConnect()
handler.use(multipart)


async function guessIngredient(image) {

    const gcsKey = JSON.parse(
        Buffer.from(process.env.GCP_CRED_FILE, 'base64').toString()
    );

    const visionClient = new vision.ImageAnnotatorClient({credentials: gcsKey});


    // Performs label detection on the image file
    const [result] = await visionClient.labelDetection(image);
    const labels = result.labelAnnotations;
    const possibleMatches = labels.filter((label) => {
        //throw all guesses below then 70%
        return label.score > 0.7
    });

    return possibleMatches.map((match) => {
        return match.description;
    });
}

handler.post(async (req, res) => {
    const files = req.files;
    if (files && files.length === 0) {
        return res.status(400).json({success: false, code: 400, reason: 'Failed to process your request'});
    }

    guessIngredient(files['files'][0].path).then((result) => {
        res.status(200).json({success: true, code: 200, guesses: result});
    }).catch((_) => {
        res.status(400).json({success: false, code: 400, reason: 'Failed to process your request'});
    });
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default handler




