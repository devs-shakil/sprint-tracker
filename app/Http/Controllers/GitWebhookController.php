<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\CommitParserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GitWebhookController extends Controller
{
    protected $parser;

    public function __construct(CommitParserService $parser)
    {
        $this->parser = $parser;
    }

    public function handleGitLab(Request $request, Project $project)
    {
        $token = $request->header('X-Gitlab-Token');

        if (!$token || $token !== $project->webhook_secret) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $payload = $request->all();
        $commits = $payload['commits'] ?? [];

        foreach ($commits as $commit) {
            $this->parser->parse($project, $commit);
        }

        return response()->json(['message' => 'Processed ' . count($commits) . ' commits']);
    }

    public function handleGitHub(Request $request, Project $project)
    {
        $signature = $request->header('X-Hub-Signature-256');
        $payload = $request->getContent();

        if (!$signature || !$this->verifyGitHubSignature($signature, $payload, $project->webhook_secret)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $data = json_decode($payload, true);
        $commits = $data['commits'] ?? [];

        foreach ($commits as $commit) {
            // Standardize GitHub commit data for the parser
            $commitData = [
                'id' => $commit['id'],
                'message' => $commit['message'],
                'author' => $commit['author']['name'],
                'timestamp' => $commit['timestamp'],
            ];
            $this->parser->parse($project, $commitData);
        }

        return response()->json(['message' => 'Processed ' . count($commits) . ' commits']);
    }

    protected function verifyGitHubSignature($signature, $payload, $secret)
    {
        $hash = 'sha256=' . hash_hmac('sha256', $payload, $secret);
        return hash_equals($hash, $signature);
    }
}
