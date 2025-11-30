
export const recommendSimilar = async (req, res) => {
  const { make, model } = req.query;
  // mock — in real app query DB for similar cars. We'll respond with query echo.
  res.json({
    message: `Recommendation placeholder: return cars similar to ${make || 'any make'} ${model || ''}`,
    suggestedQuery: { make, model }
  });
};

export const summarize = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'No text provided' });
  // naive summarization: return first 100 chars with ellipsis
  const summary = text.length > 100 ? text.slice(0, 100) + '...' : text;
  res.json({ summary });
};
