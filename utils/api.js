import axios from 'axios';
import { GEMINI_API_KEY } from '../config'; // You should store your Gemini key safely

// Fetch Product Info from OpenFoodFacts API
export const fetchProductInfo = async (barcode) => {
  const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
  const response = await axios.get(url);
  return response.data;
};

// Get Nutritional Info using Gemini
export const getNutritionInfoFromGemini = async (productName) => {
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{
          parts: [{
            text: `Give me the nutritional information of "${productName}" in a simple way.`,
          }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        params: { key: GEMINI_API_KEY }
      }
    );

    const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return result || 'No nutrition information available.';
  } catch (error) {
    console.error('Error fetching nutrition info:', error);
    return 'Error fetching nutritional info.';
  }
};
