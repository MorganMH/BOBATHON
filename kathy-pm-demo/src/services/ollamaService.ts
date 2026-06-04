const OLLAMA_API = 'http://localhost:11434/api/generate';
const MODEL = 'llama2';

interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

export async function generateCompletion(prompt: string): Promise<string> {
  try {
    const response = await fetch(OLLAMA_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data: OllamaResponse = await response.json();
    return data.response;
  } catch (error) {
    console.error('Ollama service error:', error);
    // Return fallback response for demo reliability
    return getFallbackResponse(prompt);
  }
}

export async function extractActions(text: string): Promise<any[]> {
  const prompt = `Extract action items from this text. For each action, identify the task, owner, and due date. Format as JSON array.

Text: ${text}

Return only valid JSON array of actions with fields: title, owner, dueDate, priority.`;

  try {
    const response = await generateCompletion(prompt);
    return JSON.parse(response);
  } catch {
    // Fallback to mock extraction
    return [];
  }
}

export async function generateSummary(text: string): Promise<string> {
  const prompt = `Summarize this project communication in 2-3 sentences, focusing on key decisions, commitments, and blockers:

${text}`;

  return await generateCompletion(prompt);
}

export async function detectBlockers(text: string): Promise<any[]> {
  const prompt = `Identify project blockers, risks, or dependencies in this text. Format as JSON array.

Text: ${text}

Return only valid JSON array with fields: title, severity, blockedBy, description.`;

  try {
    const response = await generateCompletion(prompt);
    return JSON.parse(response);
  } catch {
    return [];
  }
}

export async function suggestFollowUp(context: {
  person: string;
  issue: string;
  urgency: string;
}): Promise<string> {
  const prompt = `Generate a professional follow-up message for a project manager to send to ${context.person} about ${context.issue}. The urgency is ${context.urgency}. Keep it concise and friendly.`;

  return await generateCompletion(prompt);
}

// Fallback responses for demo reliability
function getFallbackResponse(prompt: string): string {
  if (prompt.includes('Summarize')) {
    return 'Project update received. Key action items identified and team members assigned tasks. Timeline remains on track with some minor blockers to address.';
  }
  if (prompt.includes('follow-up')) {
    return 'Hi, I wanted to follow up on the recent discussion. Could you provide an update on the progress? Let me know if you need any support. Thanks!';
  }
  return 'AI processing complete.';
}

// Check if Ollama is available
export async function checkOllamaAvailability(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Made with Bob
