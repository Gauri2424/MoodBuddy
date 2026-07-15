// Automatically switch URLs depending on environment:
// - Local development (dev server on 5173): Uses VITE_API_BASE_URL (http://localhost:5000/api)
// - Production build (deployed on AWS): Uses relative path '/api' to avoid cross-domain issues
const API_BASE_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api')
  : '/api';

/**
 * Standard fetch helper for JSON APIs
 */
async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.errors?.join(', ') || errorData.message || 'API request failed';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export const profileService = {
  get: () => apiRequest('/profile'),
  update: (data) => apiRequest('/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

export const moodService = {
  getHistory: (days = 30) => apiRequest(`/moods/history?days=${days}`),
  
  /**
   * Connects to POST SSE endpoint and streams responses chunk-by-chunk.
   * Uses standard ReadableStream reader for streaming POST request results.
   */
  streamAnalysis: async (moodData, onChunk, onDone, onError) => {
    try {
      const response = await fetch(`${API_BASE_URL}/moods/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(moodData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.errors?.join(', ') || errorData.message || 'Streaming failed';
        throw new Error(message);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // The last line may be incomplete, hold it in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('data: ')) {
            const dataContent = trimmedLine.slice(6).trim();
            if (!dataContent) continue;

            try {
              const data = JSON.parse(dataContent);
              
              if (data.chunk) {
                onChunk(data.chunk);
              }
              if (data.done) {
                onDone(data.entry || null);
              }
              if (data.error) {
                onError(new Error(data.error));
              }
            } catch (parseError) {
              console.error('Failed to parse SSE data block:', parseError);
            }
          }
        }
      }
    } catch (error) {
      onError(error);
    }
  }
};
