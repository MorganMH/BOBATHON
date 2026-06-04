import { GoogleGenAI, Modality } from '@google/genai';
import { readFileSync } from 'fs';

const env = readFileSync('.env', 'utf8');
const key = (env.match(/^GEMINI_API_KEY=(.*)$/m) || [])[1]?.trim();
const model = (env.match(/^GEMINI_LIVE_MODEL=(.*)$/m) || [])[1]?.trim();
const voice = (env.match(/^GEMINI_VOICE=(.*)$/m) || [])[1]?.trim() || 'Aoede';
console.log(`Testing ${model} (voice ${voice}) with full config…`);

const tools = [{ functionDeclarations: [{ name: 'who_to_chase', description: 'List who to chase today.' }] }];

let audioChunks = 0, transcript = '', toolCalls = 0, err = null, opened = false;

const ai = new GoogleGenAI({ apiKey: key });
const session = await ai.live.connect({
    model,
    config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: 'You are Atlas, a concise assistant. Keep replies to one short sentence.',
        tools,
        inputAudioTranscription: {},
        outputAudioTranscription: {},
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
    },
    callbacks: {
        onopen: () => { opened = true; },
        onmessage: (m) => {
            const sc = m.serverContent;
            if (m.toolCall?.functionCalls?.length) toolCalls += m.toolCall.functionCalls.length;
            if (sc?.outputTranscription?.text) transcript += sc.outputTranscription.text;
            for (const p of sc?.modelTurn?.parts ?? []) if (p.inlineData?.data) audioChunks++;
        },
        onerror: (e) => { err = e?.message || e?.reason || String(e); },
        onclose: (e) => { if (e?.reason && !opened) err = e.reason; },
    },
});

session.sendClientContent({ turns: 'Say hello and tell me you are ready, in one short sentence.', turnComplete: true });

await new Promise((r) => setTimeout(r, 9000));
try { session.close(); } catch {}

console.log(`opened=${opened} audioChunks=${audioChunks} toolCalls=${toolCalls}`);
console.log(`transcript="${transcript.trim()}"`);
if (err) console.log(`ERROR: ${err}`);
console.log(audioChunks > 0 ? 'RESULT: ✅ voice responds with audio' : 'RESULT: ⚠️ no audio received');
process.exit(0);
