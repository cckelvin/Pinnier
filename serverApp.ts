import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

export const app = express();

app.use(express.json({ limit: '10mb' }));

// Lazy initialization helper for Gemini AI client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. If you deployed to Vercel, add GEMINI_API_KEY in your Vercel Project Settings > Environment Variables.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const router = express.Router();

// API Health Check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Wave Social API' });
});

// AI Post Generator Endpoint
router.post('/ai/generate-post', async (req, res) => {
  try {
    const { topic, tone = 'engaging', format = 'standard', includeHashtags = true } = req.body;
    
    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const ai = getGeminiClient();

    const prompt = `Write a viral, modern social media post for Wave Social platform about: "${topic}".
Tone: ${tone}
Format: ${format} (options: standard post, thread starter, question/poll style, concise insight)
Target audience: Tech creators, designers, AI enthusiasts, digital innovators.
${includeHashtags ? 'Include 3 to 5 trending hashtags.' : 'Do not include hashtags.'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            postContent: { type: Type.STRING },
            suggestedHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            imagePrompt: { type: Type.STRING },
            catchyTitle: { type: Type.STRING },
          },
          required: ['postContent', 'suggestedHashtags'],
        },
      },
    });

    const text = response.text || '{}';
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        postContent: text,
        suggestedHashtags: ['AI', 'Tech', 'WaveSocial'],
        imagePrompt: topic,
        catchyTitle: topic,
      };
    }

    res.json({ success: true, ...data });
  } catch (error: any) {
    console.error('AI Post Generator error:', error?.message || error);
    res.status(500).json({
      error: 'Failed to generate post with Gemini AI.',
      details: error?.message || String(error),
    });
  }
});

// AI Assistant Chat Endpoint
router.post('/ai/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are Wave AI, an intelligent assistant embedded in the Wave Social platform.
You are friendly, creative, concise, and helpful.
You assist users with writing posts, refining ideas, explaining complex tech topics, suggesting hashtags, designing channels, and giving strategy tips for growing on social media.
Keep responses concise, formatted nicely with markdown or bullet points when applicable, and use emojis tastefully.`;

    const chat = ai.chats.create({
      model: 'gemini-3.6-flash',
      config: {
        systemInstruction,
      },
    });

    const response = await chat.sendMessage({ message });

    res.json({
      success: true,
      reply: response.text,
    });
  } catch (error: any) {
    console.error('AI Chat error:', error?.message || error);
    res.status(500).json({
      error: 'Failed to communicate with Wave AI.',
      details: error?.message || String(error),
    });
  }
});

// AI Text Polish / Enhancer Endpoint
router.post('/ai/enhance-post', async (req, res) => {
  try {
    const { draftText, action = 'enhance' } = req.body;

    if (!draftText || typeof draftText !== 'string') {
      return res.status(400).json({ error: 'Draft text is required' });
    }

    const ai = getGeminiClient();

    let instruction = 'Enhance this social post to be punchier, add proper emojis and 3 relevant hashtags.';
    if (action === 'summarize') {
      instruction = 'Summarize this text into 2 concise key takeaway sentences for a social post.';
    } else if (action === 'thread') {
      instruction = 'Break this draft into a 3-part twitter/wave social thread numbered 1/3, 2/3, 3/3.';
    } else if (action === 'professional') {
      instruction = 'Rewrite this draft in a polished, professional tech leader tone.';
    }

    const prompt = `${instruction}\n\nDraft:\n"${draftText}"\n\nReturn ONLY the enhanced text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({
      success: true,
      enhancedText: response.text?.trim() || draftText,
    });
  } catch (error: any) {
    console.error('AI Polish error:', error?.message || error);
    res.status(500).json({
      error: 'Failed to enhance post.',
      details: error?.message || String(error),
    });
  }
});

// AI Smart Reply / Comment Suggester
router.post('/ai/smart-reply', async (req, res) => {
  try {
    const { postContent } = req.body;
    if (!postContent) {
      return res.status(400).json({ error: 'postContent is required' });
    }

    const ai = getGeminiClient();

    const prompt = `Given the following social media post:\n"${postContent}"\n\nProvide 3 quick, natural, engaging comment suggestions for a user.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['suggestions'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{"suggestions":[]}');
    res.json({ success: true, suggestions: parsed.suggestions || [] });
  } catch (error: any) {
    console.error('Smart reply error:', error?.message || error);
    res.status(500).json({
      error: 'Failed to get smart replies.',
      details: error?.message || String(error),
    });
  }
});

// Mount router on both /api and / to handle Vercel rewrite paths automatically
app.use('/api', router);
app.use('/', router);

// Global Error Handler to guarantee JSON responses
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'An internal server error occurred',
    details: err?.message || String(err),
  });
});

export default app;
