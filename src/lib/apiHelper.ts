export async function safeApiCall<T = any>(url: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch (err: any) {
    throw new Error(`Network error: ${err?.message || 'Unable to connect to the server'}`);
  }

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    if (isJson) {
      const data = await res.json();
      throw new Error(data.details || data.error || `Server returned status ${res.status}`);
    } else {
      const text = await res.text();
      if (text.includes('GEMINI_API_KEY')) {
        throw new Error('GEMINI_API_KEY environment variable is missing on Vercel.');
      }
      if (res.status === 500 || text.toLowerCase().includes('server error')) {
        throw new Error('Vercel 500 Error: Make sure GEMINI_API_KEY is added in your Vercel Project Settings > Environment Variables.');
      }
      if (res.status === 404) {
        throw new Error('API route not found (404). Please verify your deployment settings.');
      }
      throw new Error(`Server returned status ${res.status}`);
    }
  }

  if (isJson) {
    return await res.json();
  } else {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Invalid response format received from server.`);
    }
  }
}
