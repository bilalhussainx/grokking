'use client';

import { useState } from 'react';
import AICoachOpenClaw from '@/components/ai/AICoachOpenClaw';

/**
 * OpenClaw Voice Coach Test Page
 * 
 * This page demonstrates the full integration:
 * Next.js Website → MCP Bridge → OpenClaw Gateway → SuperCore AI
 * 
 * Navigate to: http://localhost:3000/test-openclaw
 * 
 * Prerequisites:
 * 1. OpenClaw Gateway running (openclaw gateway start)
 * 2. MCP Bridge running (cd mcp-bridge && npm start)
 * 3. This page (npm run dev)
 * 
 * Or use the launcher: LAUNCH_OPENCLAW_COACH.bat
 */
export default function TestOpenClawPage() {
  const [code, setCode] = useState(`def two_sum(nums, target):
    # Your solution here
    pass
`);

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Left Side: Problem Description */}
      <div className="w-1/3 p-8 bg-gray-800 overflow-y-auto border-r border-gray-700">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-full mb-2">
            🤖 OpenClaw Connected
          </span>
          <h1 className="text-3xl font-bold text-white mt-2">Two Sum</h1>
          <p className="text-sm text-gray-400 mt-1">Powered by SuperCore AI</p>
        </div>

        <div className="space-y-4 text-gray-300">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Problem</h2>
            <p>
              Given an array of integers <code className="bg-gray-700 px-2 py-1 rounded">nums</code> and 
              an integer <code className="bg-gray-700 px-2 py-1 rounded">target</code>, return indices 
              of the two numbers such that they add up to <code className="bg-gray-700 px-2 py-1 rounded">target</code>.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Example</h3>
            <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm">
              <div className="text-gray-400">Input:</div>
              <div className="text-green-400">nums = [2,7,11,15], target = 9</div>
              <div className="text-gray-400 mt-2">Output:</div>
              <div className="text-green-400">[0,1]</div>
              <div className="text-gray-400 mt-2">Explanation:</div>
              <div className="text-gray-300">Because nums[0] + nums[1] == 9, we return [0, 1].</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Constraints</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>2 ≤ nums.length ≤ 10⁴</li>
              <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
              <li>-10⁹ ≤ target ≤ 10⁹</li>
              <li>Only one valid answer exists</li>
            </ul>
          </div>

          <div className="mt-8 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500 rounded-lg">
            <h3 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
              🤖 OpenClaw Integration Active
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 animate-pulse"></div>
                <div>
                  <div className="text-white font-medium">Real AI Coaching</div>
                  <div className="text-gray-400">Responses from SuperCore AI via OpenClaw Gateway</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                <div>
                  <div className="text-white font-medium">Voice Interaction</div>
                  <div className="text-gray-400">Speak questions, hear AI responses</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                <div>
                  <div className="text-white font-medium">Context-Aware</div>
                  <div className="text-gray-400">AI sees your code and progress</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-500/30">
              <p className="text-xs text-gray-400 mb-2">🎤 Try saying:</p>
              <ul className="text-xs space-y-1 text-gray-300">
                <li>• "Give me a hint for Two Sum"</li>
                <li>• "Explain the hash map approach"</li>
                <li>• "I'm stuck, what should I do?"</li>
                <li>• "I got it! That makes sense now!"</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500 rounded-lg">
            <h3 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
              ⚡ Quick Setup Check
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-gray-400">1. OpenClaw Gateway:</span>
                <code className="ml-2 bg-gray-900 px-2 py-1 rounded text-green-400">openclaw status</code>
              </div>
              <div>
                <span className="text-gray-400">2. MCP Bridge:</span>
                <a href="http://localhost:3001/health" target="_blank" className="ml-2 text-blue-400 hover:underline">
                  localhost:3001/health
                </a>
              </div>
              <div>
                <span className="text-gray-400">3. Grokking:</span>
                <span className="ml-2 text-green-400">✓ Running (you're here!)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Code Editor */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-gray-800 border-b border-gray-700">
          <h2 className="text-white font-semibold">Code Editor</h2>
          <p className="text-sm text-gray-400">
            Write your solution • AI Coach watches and helps in real-time
          </p>
        </div>
        
        <div className="flex-1 p-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full bg-gray-900 text-gray-100 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
            placeholder="Write your code here..."
            spellCheck={false}
          />
        </div>

        <div className="p-4 bg-gray-800 border-t border-gray-700 flex gap-2">
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
            ▶ Run Code
          </button>
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
            Submit
          </button>
          <div className="flex-1"></div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>OpenClaw Connected</span>
          </div>
        </div>
      </div>

      {/* Right Side: OpenClaw Voice Coach */}
      <div className="w-96">
        <AICoachOpenClaw
          currentProblem="Two Sum"
          userCode={code}
          userId="test-user"
          enableVoice={true}
          bridgeUrl="ws://localhost:3001"
        />
      </div>
    </div>
  );
}
