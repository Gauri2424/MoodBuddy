import { query } from '../database/db.js';
import { streamMoodAnalysis } from '../services/geminiService.js';

/**
 * Endpoint to analyze mood and stream back the AI response.
 * Saves the completed mood record in the database once the stream ends.
 */
export const analyzeMood = async (req, res, next) => {
  const { mood, color, tags, note } = req.body;

  // Set SSE Headers with Nginx compression and buffering bypass
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform', // 'no-transform' prevents Nginx/CloudFront gzip compression
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no', // Prevents buffering issues with Nginx reverse proxies
    'Content-Encoding': 'identity', // Explicitly tells Nginx not to compress this response
  });

  // Flush headers if the platform supports it
  if (typeof res.flush === 'function') {
    res.flush();
  }

  let accumulatedResponse = '';

  try {
    await streamMoodAnalysis(
      { mood, color, tags, note },
      // On chunk callback
      (chunk) => {
        accumulatedResponse += chunk;
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      },
      // On completed callback
      async (fullText) => {
        try {
          // Save to PostgreSQL DB
          const insertQuery = `
            INSERT INTO mood_entries (mood, color, tags, note, ai_summary)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, created_at as "createdAt", mood, color, tags, note, ai_summary as "aiSummary";
          `;
          
          const result = await query(insertQuery, [
            mood,
            color,
            tags,
            note || null,
            fullText,
          ]);

          const savedEntry = result.rows[0];

          // Send final event with saved database record details
          res.write(`data: ${JSON.stringify({ done: true, entry: savedEntry })}\n\n`);
          res.end();
        } catch (dbError) {
          console.error('Error saving mood entry to database:', dbError);
          // Still finish the stream so the client gets the full message
          res.write(`data: ${JSON.stringify({ done: true, error: 'Database save failed, but message streamed.' })}\n\n`);
          res.end();
        }
      },
      // On error callback
      (error) => {
        console.error('Streaming error callback:', error);
        res.write(`data: ${JSON.stringify({ error: 'Failed to complete stream analysis.' })}\n\n`);
        res.end();
      }
    );
  } catch (error) {
    console.error('Analyze mood controller error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Server controller encountered an error.' })}\n\n`);
    res.end();
  }
};

/**
 * Retrieves the history of mood check-ins.
 * Query parameter 'days' can filter the results (7, 30, or all).
 */
export const getMoodHistory = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days, 10) || 30;
    
    let dbQuery = `
      SELECT id, created_at as "createdAt", mood, color, tags, note, ai_summary as "aiSummary"
      FROM mood_entries
      ORDER BY created_at DESC
      LIMIT $1;
    `;
    
    // Default cap limit to avoid database congestion
    const limit = days === 7 ? 7 : days === 30 ? 30 : 100;
    
    const result = await query(dbQuery, [limit]);

    res.status(200).json({
      success: true,
      history: result.rows,
    });
  } catch (error) {
    next(error);
  }
};
