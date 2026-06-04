<?php

namespace App\Http\Controllers;

use App\Services\AgentTools;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AgentToolController extends Controller
{
    public function __construct(private readonly AgentTools $tools)
    {
    }

    /**
     * Run a tool call coming from the voice/text agent.
     * Read tools run immediately. Write tools return needs_confirmation unless
     * mutations are explicitly allowed.
     */
    public function execute(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string'],
            'args' => ['array'],
        ]);

        $name = $validated['name'];
        $args = $validated['args'] ?? [];

        if ($this->tools->isWriteTool($name) && ! config('services.gemini.allow_mutations')) {
            return response()->json([
                'status' => 'needs_confirmation',
                'name' => $name,
                'args' => $args,
                'message' => 'This will change data. Confirm to proceed.',
            ]);
        }

        return response()->json([
            'status' => 'ok',
            'result' => $this->tools->execute($name, $args),
        ]);
    }

    /**
     * Confirm and run a previously-gated write tool.
     */
    public function confirm(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string'],
            'args' => ['array'],
        ]);

        return response()->json([
            'status' => 'ok',
            'result' => $this->tools->execute($validated['name'], $validated['args'] ?? []),
        ]);
    }
}
