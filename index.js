
import express, { json } from 'express';
import { saveFile, getGPT4Translation } from './AudioHelper.js';
import cors from 'cors';


const app = express();
const port = 3000;
app.use(json());
app.use(cors());

// Route to handle text translation and audio file saving
app.post('/translate', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }


    try {
        // Get translation
        const translatedText = await getGPT4Translation(text);

        // Save audio file
        const saveFileResult = await saveFile(translatedText, "pa");

        res.json({ saveFileResult });
    } catch (error) {
        console.error("Error in processing:", error);
        res.status(500).json({ error: error.message });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
