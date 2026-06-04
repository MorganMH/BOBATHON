<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Thin wrapper over the Google Gemini API.
 *
 * - Text generation (summaries, extraction, stakeholder finder) via generateContent.
 * - A "live session" descriptor the browser uses to open the realtime voice socket.
 *
 * Everything degrades gracefully: with no GEMINI_API_KEY set, isConfigured() is
 * false and callers fall back to deterministic local logic so the demo still runs.
 */
class GeminiService
{
    private const BASE = 'https://generativelanguage.googleapis.com';

    public function isConfigured(): bool
    {
        return filled($this->key());
    }

    public function key(): ?string
    {
        return config('services.gemini.key');
    }

    public function textModel(): string
    {
        return config('services.gemini.text_model', 'gemini-2.0-flash');
    }

    public function liveModel(): string
    {
        return config('services.gemini.live_model', 'gemini-2.0-flash-live-001');
    }

    /**
     * Generate plain text. Returns null on any failure (caller should fall back).
     */
    public function generateText(string $prompt, ?string $system = null, bool $json = false): ?string
    {
        if (! $this->isConfigured()) {
            return null;
        }

        $body = [
            'contents' => [
                ['role' => 'user', 'parts' => [['text' => $prompt]]],
            ],
            'generationConfig' => [
                'temperature' => 0.4,
                // 2.5-flash is a reasoning model; disable extended thinking so these
                // utility calls (summarise / extract / find) return in ~1-2s instead
                // of 15s+ — fast enough for the UI and well under the request timeout.
                'thinkingConfig' => ['thinkingBudget' => 0],
            ],
        ];

        if ($system) {
            $body['system_instruction'] = ['parts' => [['text' => $system]]];
        }

        if ($json) {
            $body['generationConfig']['responseMimeType'] = 'application/json';
        }

        try {
            $response = Http::timeout(20)
                ->withHeaders(['x-goog-api-key' => $this->key()])
                ->post(self::BASE."/v1beta/models/{$this->textModel()}:generateContent", $body);

            if (! $response->successful()) {
                Log::warning('Gemini generateText failed', ['status' => $response->status(), 'body' => $response->body()]);

                return null;
            }

            $parts = $response->json('candidates.0.content.parts', []);

            return collect($parts)->pluck('text')->filter()->implode("\n") ?: null;
        } catch (\Throwable $e) {
            Log::warning('Gemini generateText exception', ['message' => $e->getMessage()]);

            return null;
        }
    }

    /**
     * Multi-turn generate with optional tools. Returns the model's `content`
     * message ({role, parts:[...]}) so callers can inspect functionCall parts.
     * Returns null on failure.
     */
    public function chat(array $contents, ?array $tools = null, ?string $system = null): ?array
    {
        if (! $this->isConfigured()) {
            return null;
        }

        $body = [
            'contents' => $contents,
            'generationConfig' => [
                'temperature' => 0.4,
                'thinkingConfig' => ['thinkingBudget' => 0],
            ],
        ];

        if ($system) {
            $body['system_instruction'] = ['parts' => [['text' => $system]]];
        }

        if ($tools) {
            $body['tools'] = $tools;
        }

        try {
            $response = Http::timeout(25)
                ->withHeaders(['x-goog-api-key' => $this->key()])
                ->post(self::BASE."/v1beta/models/{$this->textModel()}:generateContent", $body);

            if (! $response->successful()) {
                Log::warning('Gemini chat failed', ['status' => $response->status(), 'body' => $response->body()]);

                return null;
            }

            return $response->json('candidates.0.content');
        } catch (\Throwable $e) {
            Log::warning('Gemini chat exception', ['message' => $e->getMessage()]);

            return null;
        }
    }

    /**
     * Generate and decode a JSON response. Returns null on failure.
     */
    public function generateJson(string $prompt, ?string $system = null): ?array
    {
        $raw = $this->generateText($prompt, $system, json: true);

        if (! $raw) {
            return null;
        }

        // Strip ```json fences if the model added them.
        $raw = trim(Str::of($raw)->replaceMatches('/^```(json)?|```$/m', '')->toString());

        try {
            $decoded = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);

            return is_array($decoded) ? $decoded : null;
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Descriptor the frontend uses to open the realtime voice (Live API) socket.
     *
     * On localhost we hand the key directly (VOICE_ALLOW_DIRECT_KEY=true). In a
     * shared/hosted environment, set that false and we mint a short-lived
     * ephemeral token instead so the real key never reaches the browser.
     */
    public function liveSession(): array
    {
        if (! $this->isConfigured()) {
            return ['available' => false, 'reason' => 'no_key', 'model' => $this->liveModel()];
        }

        if (config('services.gemini.allow_direct_key')) {
            return [
                'available' => true,
                'mode' => 'direct',
                'apiKey' => $this->key(),
                'model' => $this->liveModel(),
            ];
        }

        $token = $this->mintEphemeralToken();

        if ($token) {
            return [
                'available' => true,
                'mode' => 'ephemeral',
                'token' => $token,
                'model' => $this->liveModel(),
            ];
        }

        return ['available' => false, 'reason' => 'token_failed', 'model' => $this->liveModel()];
    }

    /**
     * Best-effort ephemeral auth token for the Live API (v1alpha). Returns null
     * if the endpoint is unavailable; caller surfaces a clear "voice unavailable".
     */
    private function mintEphemeralToken(): ?string
    {
        try {
            $response = Http::timeout(15)
                ->withHeaders(['x-goog-api-key' => $this->key()])
                ->post(self::BASE.'/v1alpha/auth_tokens', [
                    'uses' => 1,
                ]);

            if (! $response->successful()) {
                Log::warning('Gemini ephemeral token failed', ['status' => $response->status(), 'body' => $response->body()]);

                return null;
            }

            // The API returns a resource named "auth_tokens/XXXX"; the name itself
            // is the token the client passes as its API key.
            return $response->json('name') ?? $response->json('token');
        } catch (\Throwable $e) {
            Log::warning('Gemini ephemeral token exception', ['message' => $e->getMessage()]);

            return null;
        }
    }
}
