'use client';

import { useState } from 'react';
import AICoachFullVoice from '@/components/ai/AICoachFullVoice';

/**
 * Voice Coach Test Page
 * 
 * Quick test page to verify voice features are working
 * Navigate to: http://localhost:3000/test-voice
 * 
 * What to test:
 * 1. Click the blue mic button
 * 2. Allow microphone access when prompted
 * 3. Say "Give me a hint"
 * 4. Coach should respond with voice
 */
export default function TestVoicePage() {
  const [code, setCode] = useState(`def two_sum(nums, target):
    # Your solution here
    pass
`);

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Left Side: Problem Description */}
      <div className="w-1/3 p-8 bg-gray-800 overflow-y-auto border-r border-gray-700">
        <div className="mb-6">
          <span className="text-blue-400 text-sm font-semibold">Array • Easy</span>
          <h1 className="text-3xl font-bold text-white mt-2">Two Sum</h1>
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

          <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500 rounded-lg">
            <h3 className="text-blue-400 font-semibold mb-2">🎤 Voice Testing</h3>
            <p className="text-sm mb-3">Try saying these to your coach:</p>
            <ul className="text-sm space-y-1">
              <li className="text-gray-300">• "Give me a hint"</li>
              <li className="text-gray-300">• "Explain this pattern"</li>
              <li className="text-gray-300">• "I'm stuck on this problem"</li>
              <li className="text-gray-300">• "I got it!"</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Center: Code Editor (Simple Textarea for Demo) */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-gray-800 border-b border-gray-700">
          <h2 className="text-white font-semibold">Code Editor</h2>
          <p className="text-sm text-gray-400">Write your solution here (or just test the voice coach)</p>
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
        </div>
      </div>

      {/* Right Side: Voice-Enabled AI Coach */}
      <div className="w-96">
        <AICoachFullVoice
          currentProblem="Two Sum"
          userCode={code}
          enableVoice={true}
        />
      </div>
    </div>
  );
}
