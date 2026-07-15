const VALID_MOODS = ['Very Happy', 'Happy', 'Neutral', 'Tired', 'Sad', 'Stressed', 'Angry', 'Anxious'];
const VALID_COLORS = ['Yellow', 'Blue', 'Purple', 'Green', 'Pink', 'Orange', 'Gray', 'Red'];

/**
 * Middleware to validate mood entry submissions
 */
export const validateMoodEntry = (req, res, next) => {
  const { mood, color, tags, note } = req.body;
  const errors = [];

  // Validate mood
  if (!mood) {
    errors.push('Mood is required.');
  } else if (!VALID_MOODS.includes(mood)) {
    errors.push(`Invalid mood. Must be one of: ${VALID_MOODS.join(', ')}`);
  }

  // Validate color
  if (!color) {
    errors.push('Color is required.');
  } else if (!VALID_COLORS.includes(color)) {
    errors.push(`Invalid color. Must be one of: ${VALID_COLORS.join(', ')}`);
  }

  // Validate tags
  if (!tags) {
    errors.push('Tags array is required.');
  } else if (!Array.isArray(tags)) {
    errors.push('Tags must be an array of strings.');
  } else if (tags.some(tag => typeof tag !== 'string')) {
    errors.push('All tags must be string values.');
  }

  // Validate note length (capped at 200 characters)
  if (note && typeof note !== 'string') {
    errors.push('Note must be a string.');
  } else if (note && note.length > 200) {
    errors.push('Note is too long. Maximum length is 200 characters.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

/**
 * Middleware to validate user profile updates
 */
export const validateProfileUpdate = (req, res, next) => {
  const { name, avatar } = req.body;
  const errors = [];

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      errors.push('Name must be a non-empty string.');
    } else if (name.length > 50) {
      errors.push('Name cannot exceed 50 characters.');
    }
  }

  if (avatar !== undefined) {
    if (typeof avatar !== 'string' || avatar.trim().length === 0) {
      errors.push('Avatar must be a non-empty string.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};
