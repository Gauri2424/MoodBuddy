import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

let genAI = null;

if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} else {
  console.warn('WARNING: GEMINI_API_KEY is not set or has placeholder value. MoodBuddy will operate in mock-streaming fallback mode.');
}

/**
 * Builds the prompt template for the Gemini model
 */
const buildPrompt = (mood, color, tags, note) => {
  const tagList = tags && tags.length > 0 ? tags.join(', ') : 'None';
  const userNote = note ? `"${note}"` : 'No additional details provided.';

  return `
You are MoodBuddy, a warm, supportive, and casual AI mood companion. You are part of a lightweight mood tracker application. Your goal is to make the user feel heard, validated, and comforted.

Here is the user's mood check-in data:
- Primary Mood: ${mood}
- Selected Vibe Color: ${color}
- Mood Tags: ${tagList}
- Personal Note: ${userNote}

Please write a brief, encouraging response. You MUST follow these guidelines strictly:
1. **Mood Validation**: Validate their feeling in a warm, peer-like, casual tone. Keep it to 1-2 sentences.
2. **Encouragement**: Share a soft, comforting line of encouragement.
3. **Suggested Activity**: Suggest ONE specific activity to try. Frame it around one of MoodBuddy's built-in activities:
   - **Breathing Rainbow**: A gentle deep breathing exercise.
   - **Music Suggestions**: Listening to calming Lo-Fi music or nature sounds.
   - **Mood Doodle**: Drawing their feelings out on a digital canvas.
   - **Color Match Rush**: Playing a quick, light-hearted color reaction game.
4. **Short Affirmation**: End with a single, short, uplifting positive affirmation.

CRITICAL RULES:
- DO NOT mention any clinical terms, mental illnesses, diagnoses, or treatments (e.g., no "depression", "anxiety disorder", "therapy", "clinical", "PTSD", "medical", "patient", "symptoms").
- Keep the language friendly, warm, casual, and supportive.
- Do not write a long essay. Keep the entire response under 150 words.
- Format the output beautifully with clear spacing. Use soft Markdown like bold text or brief bullet points.
`;
};

// Target the single confirmed working model for your project
const ACTIVE_MODEL = 'gemini-2.0-flash';

/**
 * Streams the mood analysis response from Gemini API,
 * or falls back to a realistic mock stream.
 */
export const streamMoodAnalysis = async (data, onChunk, onDone, onError) => {
  const { mood, color, tags, note } = data;
  const prompt = buildPrompt(mood, color, tags, note);

  if (!genAI) {
    return handleMockStream(data, onChunk, onDone);
  }

  try {
    console.log(`Sending mood stream analysis request using: ${ACTIVE_MODEL}...`);
    const model = genAI.getGenerativeModel({ model: ACTIVE_MODEL });
    const result = await model.generateContentStream(prompt);

    let fullText = '';
    for await (const chunk of result.stream) {
      const text = chunk.text();
      fullText += text;
      onChunk(text);
    }
    
    onDone(fullText);
    console.log(`Streaming analysis successfully completed using model: ${ACTIVE_MODEL}`);
  } catch (error) {
    console.error(`Gemini API Error with ${ACTIVE_MODEL}:`, error.message);
    
    // Check if it is a quota/rate limit error
    if (error.message.includes('Quota') || error.message.includes('429') || error.message.includes('ResourceExhausted')) {
      console.warn('Rate limit exceeded. Try waiting 30 seconds.');
    }
    
    console.log('Switching to mock stream fallback due to error...');
    handleMockStream(data, onChunk, onDone);
  }
};

/**
 * Generates an appropriate mock response for fallback mode
 */
const generateMockResponse = (mood, tags, note) => {
  const tagsStr = tags && tags.length > 0 ? ` [${tags.join(', ')}]` : '';
  const lowercaseMood = mood.toLowerCase();

  let response = '';

  if (['sad', 'stressed', 'angry', 'anxious'].includes(lowercaseMood)) {
    response = `Hey buddy, I hear you. It sounds like you are carrying a lot of weight today, especially with feeling ${mood}${tagsStr ? ' and dealing with ' + tagsStr : ''}. It is completely okay to feel this way, and your feelings are entirely valid. 

Remember, it is okay to take things one step at a time today. Why not pause for a moment and give the **Breathing Rainbow** activity a try? Just a few slow breaths can help center you. 

*Today's Affirmation:* "I am allowed to feel, I am allowed to rest, and I am doing the best I can."`;
  } else if (['very happy', 'happy', 'neutral'].includes(lowercaseMood)) {
    response = `Hey there! It's wonderful to hear that you are feeling ${mood} today. Celebrating those warm moments ${tagsStr ? 'of ' + tagsStr : ''} is such a great way to build positivity!

Keep riding this good wave. Since your energy is high, why not check out the **Color Match Rush** game to keep those reflexes sharp, or try **Mood Doodle** to express your creative side?

*Today's Affirmation:* "I welcome joy, gratitude, and peace into my day, and I share this light with others."`;
  } else { // Tired, etc.
    response = `Hello! Checking in on you. Feeling ${mood} is a clear sign that your body and mind are asking for a little gentleness. It's important to listen to that signal.

Give yourself permission to slow down. I highly suggest relaxing with the **Music Suggestions** activity—put on some peaceful piano or rain sounds and let yourself drift.

*Today's Affirmation:* "I honor my energy levels and trust my body's need to recharge."`;
  }

  return response;
};

/**
 * Simulates SSE character/word-by-word streaming for local fallback
 */
const handleMockStream = (data, onChunk, onDone) => {
  const { mood, tags } = data;
  const fullText = generateMockResponse(mood, tags, data.note);
  
  // Split text by small chunks to simulate streaming
  const words = fullText.split(' ');
  let currentIndex = 0;

  const interval = setInterval(() => {
    if (currentIndex < words.length) {
      const chunk = words[currentIndex] + (currentIndex === words.length - 1 ? '' : ' ');
      onChunk(chunk);
      currentIndex++;
    } else {
      clearInterval(interval);
      onDone(fullText);
    }
  }, 80); // Speed of mock text streaming
};
