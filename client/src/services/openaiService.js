import axios from 'axios';

const apiKey = process.env.REACT_APP_OPENROUTER_API_KEY;

export const askAI = async (prompt) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemma-3n-e2b-it:free',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenRouter AI Error:', error.response || error);
    throw new Error("AI couldn't respond. Try again.");
  }
};
