import axios from 'axios';
import { encode } from 'base64-arraybuffer';
import GPT4js from 'gpt4js';
import userAgents from './user-agents.json' assert { type: 'json' };

// Helper function to save TTS audio file
export const saveFile = async (text, lang) => {
    if (!text) throw new Error('Provide the text!');
    if (!lang) throw new Error('Provide language codes! e.g Indonesian = ID, English = EN. This is used for the sound type.');
    if (lang.length > 2) throw new Error('Invalid Language codes (must 2 string length).');

    const encodedText = encodeURIComponent(text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${lang}&total=1&idx=0&textlen=${text.length}&client=tw-ob&prev=input&ttsspeed=1`;

    const response = await axios(url, {
        method: "get",
        headers: { "User-Agent": userAgents[Math.floor(Math.random() * userAgents.length)] },
        responseType: 'arraybuffer'
    });
    const data = encode(response.data);

    return data;
}

// Helper function to get GPT-4 translation
export const getGPT4Translation = async (inputText) => {
    const messages = [{ role: "user", content: `Please convert the following Punjabi-English text into Punjabi, ensuring the text is primarily in Punjabi: ${inputText}` }];
    const options = {
        provider: "Aryahcr",
        model: "gpt-4o-free",
    };

    const provider = GPT4js.createProvider(options.provider);
    try {
        // const response = await provider.chatCompletion(messages, options);
        const response = await provider.chatCompletion(messages, options, (data) => {
            console.log(data);
        });
        return response;
        // return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};
