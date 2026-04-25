import fetch from 'node-fetch';

// @desc    Generate insights for a dataset
// @route   POST /api/ai/summary
// @access  Private
export const generateSummary = async (req, res) => {
  const { headers } = req.body;

  if (!headers || headers.length === 0) {
    return res.status(400).json({ message: 'No data headers provided.' });
  }

  const prompt = `
    Given the following data columns from an Excel file: [${headers.join(', ')}].
    1.  Provide a brief, one-paragraph summary of what this dataset is likely about.
    2.  Suggest the single best 2D chart type (e.g., 'Bar Chart', 'Line Chart', 'Pie Chart') to visualize the relationship between "${headers[0]}" and "${headers[1]}".
    3.  Explain your chart choice in one sentence.
    Format your response clearly.
  `;

  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  // --- THIS IS THE KEY CHANGE ---
  // We now use your personal API key from the .env file.
  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseData = await apiResponse.json();

    if (responseData.candidates && responseData.candidates.length > 0) {
      const summaryText = responseData.candidates[0].content.parts[0].text;
      res.json({ summary: summaryText });
    } else {
      console.error('Gemini API Error:', responseData);
      res.status(500).json({ message: 'Failed to get a response from the AI model.' });
    }

  } catch (error) {
    console.error('Error calling AI service:', error);
    res.status(500).json({ message: 'Server error while contacting AI service.' });
  }
};