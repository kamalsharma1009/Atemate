import axios from 'axios';
import { GeminiAPI_KEY } from '../config';

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GeminiAPI_KEY}`;

export const getGeminiResponse = async (prompt) => {
  const requestData = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  const maxRetries = 3; // Try maximum 3 times
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await axios.post(GEMINI_API_URL, requestData, {
        headers: { 'Content-Type': 'application/json' }
      });

      const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) {
        return reply.trim();
      } else {
        throw new Error('No response from Gemini.');
      }

    } catch (error) {
      if (error.response?.status === 503) {
        console.warn('Gemini model overloaded. Retrying... ⏳');
        await new Promise(res => setTimeout(res, 2000)); // wait 2 sec
        attempt++;
      } else {
        console.error('Gemini API Error:', error.response?.data || error.message);
        throw error; // Some other error, don't retry
      }
    }
  }

  throw new Error('Failed after retries.');
};
