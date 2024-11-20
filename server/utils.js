// Input validation
const validatePrompt = (prompt) => {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Invalid prompt: must be a non-empty string');
  }
  return prompt.trim();
};

// Input sanitization
const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return '';
  }
  // Remove any potentially dangerous characters
  return input.replace(/[<>]/g, '');
};

// Format recipe response
const formatRecipeResponse = (rawResponse) => {
  try {
    const parsed = JSON.parse(rawResponse);
    return {
      title: parsed.title || 'Untitled Recipe',
      ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : [],
      instructions: Array.isArray(parsed.instructions) ? parsed.instructions : []
    };
  } catch (e) {
    throw new Error('Failed to parse recipe response');
  }
};

module.exports = {
  validatePrompt,
  sanitizeInput,
  formatRecipeResponse
};
