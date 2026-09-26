import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { deductCredits, addCredits } from "@/lib/credits";
import { generateWithMoonshot } from "@/lib/voice-provider-router";
import type { ProficiencyLevel } from "@/lib/language-personas";

const CREDIT_COST_PLACEMENT = 5;

interface PlacementQuestion {
  id: string;
  level: ProficiencyLevel;
  type: 'text' | 'voice';
  question: string;
  expectedConcepts: string[];
  sampleCorrectAnswers: string[];
}

/**
 * POST /api/language/placement/start
 * 
 * Start a new placement test for a language.
 * Returns the first set of questions.
 * Cost: 5 credits (one-time per language)
 */
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { language, nativeLanguage = 'en' } = body;

  if (!language) {
    return NextResponse.json(
      { error: "Missing required field: language" },
      { status: 400 }
    );
  }

  // Check if user already has a placement result for this language
  const { data: existingResult } = await supabase
    .from('placement_results')
    .select('*')
    .eq('user_id', user.id)
    .eq('target_language', language)
    .single();

  if (existingResult) {
    return NextResponse.json({
      alreadyCompleted: true,
      assessedLevel: existingResult.assessed_level,
      message: "You have already completed the placement test for this language.",
    });
  }

  // Deduct credits
  const ok = await deductCredits(user.id, CREDIT_COST_PLACEMENT, "placement_test");
  if (!ok) {
    return NextResponse.json(
      { error: "Insufficient credits. Placement tests cost 5 credits." },
      { status: 402 }
    );
  }

  // Generate placement questions
  const questions = generatePlacementQuestions(language, nativeLanguage);

  // Store test session in database
  const { data: testSession, error: insertError } = await supabase
    .from('placement_tests')
    .insert({
      user_id: user.id,
      target_language: language,
      questions: questions,
      current_question_index: 0,
      answers: [],
      status: 'in_progress',
    })
    .select()
    .single();

  if (insertError) {
    // Refund credits on error
    await addCredits(user.id, CREDIT_COST_PLACEMENT, "placement_test_refund");
    
    return NextResponse.json(
      { error: "Failed to start placement test" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    testId: testSession.id,
    totalQuestions: questions.length,
    currentQuestion: 1,
    question: questions[0],
    credits: {
      deducted: CREDIT_COST_PLACEMENT,
    },
  });
}

/**
 * PUT /api/language/placement/answer
 * 
 * Submit an answer and get the next question or results
 */
export async function PUT(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { testId, answer, isVoice = false } = body;

  if (!testId || answer === undefined) {
    return NextResponse.json(
      { error: "Missing required fields: testId, answer" },
      { status: 400 }
    );
  }

  // Get current test session
  const { data: testSession } = await supabase
    .from('placement_tests')
    .select('*')
    .eq('id', testId)
    .eq('user_id', user.id)
    .single();

  if (!testSession) {
    return NextResponse.json(
      { error: "Test session not found" },
      { status: 404 }
    );
  }

  if (testSession.status !== 'in_progress') {
    return NextResponse.json(
      { error: "Test already completed" },
      { status: 400 }
    );
  }

  const questions = testSession.questions as PlacementQuestion[];
  const currentIndex = testSession.current_question_index;
  const currentQuestion = questions[currentIndex];

  // Evaluate answer using LLM with fallback to heuristic
  const isCorrect = await evaluateAnswer(answer, currentQuestion);

  // Update test session
  const answers = [...(testSession.answers as { questionId: string; answer: string; correct: boolean }[]), {
    questionId: currentQuestion.id,
    answer,
    correct: isCorrect,
  }];

  const nextIndex = currentIndex + 1;
  const isComplete = nextIndex >= questions.length;

  if (isComplete) {
    // Calculate results
    const result = calculatePlacementResult(questions, answers);
    
    // Save result
    await supabase.from('placement_results').insert({
      user_id: user.id,
      target_language: testSession.target_language,
      assessed_level: result.level,
      text_score: result.textScore,
      voice_score: result.voiceScore,
      details: { questions, answers },
    });

    // Create or update user language profile
    await supabase.from('user_language_profiles').upsert({
      user_id: user.id,
      target_language: testSession.target_language,
      native_language: testSession.native_language || 'en',
      proficiency_level: result.level,
    }, {
      onConflict: 'user_id,target_language',
    });

    // Update test status
    await supabase
      .from('placement_tests')
      .update({ status: 'completed', answers, completed_at: new Date().toISOString() })
      .eq('id', testId);

    return NextResponse.json({
      complete: true,
      result: {
        assessedLevel: result.level,
        textScore: result.textScore,
        voiceScore: result.voiceScore,
        recommendations: result.recommendations,
      },
      // B1+ gating: Only A1-A2 content exists in Phase 1
      contentAvailable: ['A1', 'A2'].includes(result.level),
      nextSteps: ['A1', 'A2'].includes(result.level)
        ? `Start with ${result.level} courses!`
        : `You placed at ${result.level} - impressive! A2 review content is available now. B1+ courses are coming soon.`,
    });
  }

  // Update progress and return next question
  await supabase
    .from('placement_tests')
    .update({
      current_question_index: nextIndex,
      answers,
    })
    .eq('id', testId);

  return NextResponse.json({
    complete: false,
    currentQuestion: nextIndex + 1,
    totalQuestions: questions.length,
    question: questions[nextIndex],
    progress: {
      answered: nextIndex,
      correct: answers.filter((a: { correct: boolean }) => a.correct).length,
    },
  });
}

/**
 * Generate placement questions for a language
 */
function generatePlacementQuestions(language: string, nativeLanguage: string): PlacementQuestion[] {
  const questions: PlacementQuestion[] = [
    // A1 Level Questions
    {
      id: `${language}-q1`,
      level: 'A1',
      type: 'text',
      question: getQuestionText(language, 'A1', 1),
      expectedConcepts: ['greeting', 'basic_phrase'],
      sampleCorrectAnswers: getSampleAnswers(language, 'A1', 1),
    },
    {
      id: `${language}-q2`,
      level: 'A1',
      type: 'text',
      question: getQuestionText(language, 'A1', 2),
      expectedConcepts: ['numbers', 'counting'],
      sampleCorrectAnswers: getSampleAnswers(language, 'A1', 2),
    },
    {
      id: `${language}-q3`,
      level: 'A1',
      type: 'voice',
      question: getQuestionText(language, 'A1', 3),
      expectedConcepts: ['pronunciation', 'self_introduction'],
      sampleCorrectAnswers: getSampleAnswers(language, 'A1', 3),
    },
    // A2 Level Questions
    {
      id: `${language}-q4`,
      level: 'A2',
      type: 'text',
      question: getQuestionText(language, 'A2', 1),
      expectedConcepts: ['past_tense', 'description'],
      sampleCorrectAnswers: getSampleAnswers(language, 'A2', 1),
    },
    {
      id: `${language}-q5`,
      level: 'A2',
      type: 'voice',
      question: getQuestionText(language, 'A2', 2),
      expectedConcepts: ['opinion', 'expression'],
      sampleCorrectAnswers: getSampleAnswers(language, 'A2', 2),
    },
    // B1 Level Questions
    {
      id: `${language}-q6`,
      level: 'B1',
      type: 'text',
      question: getQuestionText(language, 'B1', 1),
      expectedConcepts: ['complex_sentence', 'hypothetical'],
      sampleCorrectAnswers: getSampleAnswers(language, 'B1', 1),
    },
    {
      id: `${language}-q7`,
      level: 'B1',
      type: 'voice',
      question: getQuestionText(language, 'B1', 2),
      expectedConcepts: ['narrative', 'sequence'],
      sampleCorrectAnswers: getSampleAnswers(language, 'B1', 2),
    },
    // B2+ Level Questions
    {
      id: `${language}-q8`,
      level: 'B2',
      type: 'text',
      question: getQuestionText(language, 'B2', 1),
      expectedConcepts: ['abstract', 'argumentation'],
      sampleCorrectAnswers: getSampleAnswers(language, 'B2', 1),
    },
    {
      id: `${language}-q9`,
      level: 'C1',
      type: 'voice',
      question: getQuestionText(language, 'C1', 1),
      expectedConcepts: ['nuanced', 'cultural_reference'],
      sampleCorrectAnswers: getSampleAnswers(language, 'C1', 1),
    },
  ];

  return questions;
}

function getQuestionText(language: string, level: string, num: number): string {
  // Simplified - in production, these would be localized
  const questions: Record<string, Record<string, string[]>> = {
    es: {
      A1: [
        "How do you say 'Hello, my name is...' in Spanish?",
        "Count from 1 to 10 in Spanish.",
        "Introduce yourself: Say your name and where you're from.",
      ],
      A2: [
        "Describe what you did yesterday using past tense.",
        "Give your opinion about your favorite food.",
      ],
      B1: [
        "Explain what you would do if you won the lottery.",
        "Tell a story about a memorable trip you took.",
      ],
      B2: [
        "Discuss the advantages and disadvantages of social media.",
      ],
      C1: [
        "Explain the cultural significance of a traditional festival in your country.",
      ],
    },
    fr: {
      A1: [
        "How do you say 'Hello, my name is...' in French?",
        "Count from 1 to 10 in French.",
        "Introduce yourself: Say your name and where you're from.",
      ],
      A2: [
        "Describe what you did yesterday using passé composé.",
        "Give your opinion about your favorite hobby.",
      ],
      B1: [
        "Explain what you would do if you could travel anywhere.",
        "Tell a story about an interesting experience you had.",
      ],
      B2: [
        "Discuss the impact of technology on modern society.",
      ],
      C1: [
        "Analyze the themes in a French literary work or film.",
      ],
    },
    ur: {
      A1: [
        "How do you say 'Hello, my name is...' in Urdu?",
        "Count from 1 to 10 in Urdu.",
        "Introduce yourself: Say your name and where you're from.",
      ],
      A2: [
        "Describe what you did yesterday.",
        "Give your opinion about your favorite dish.",
      ],
      B1: [
        "Explain what you would do if you had more free time.",
        "Tell a story about your childhood.",
      ],
      B2: [
        "Discuss the importance of education in society.",
      ],
      C1: [
        "Explain the evolution of Urdu poetry and its cultural impact.",
      ],
    },
  };

  return questions[language]?.[level]?.[num - 1] || "Please demonstrate your language skills.";
}

function getSampleAnswers(language: string, level: string, num: number): string[] {
  // Simplified - in production, these would be comprehensive
  return [];
}

async function evaluateAnswer(answer: string, question: PlacementQuestion): Promise<boolean> {
  if (!answer || answer.trim().length < 3) return false;

  try {
    const result = await generateWithMoonshot([
      {
        role: 'system',
        content: `You are a language proficiency evaluator. Given a question and a student's answer, determine if the answer demonstrates the expected ${question.level}-level language skills.

Expected concepts: ${question.expectedConcepts.join(', ')}
Sample correct answers: ${question.sampleCorrectAnswers.join(' | ') || 'N/A'}

Respond with ONLY valid JSON: { "correct": true/false, "score": 0-100, "feedback": "brief reason" }`,
      },
      {
        role: 'user',
        content: `Question: "${question.question}"\nStudent's answer: "${answer}"`,
      },
    ], { temperature: 0.1, maxTokens: 150 });

    const cleaned = result.replace(/```json\n?/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return parsed.correct === true || (parsed.score && parsed.score >= 50);
  } catch {
    // Fallback to length heuristic if LLM fails
    const minLength: Record<string, number> = { A1: 5, A2: 10, B1: 20, B2: 40, C1: 60 };
    return answer.trim().length >= (minLength[question.level] || 5);
  }
}

function calculatePlacementResult(
  questions: PlacementQuestion[],
  answers: { questionId: string; answer: string; correct: boolean }[]
): {
  level: ProficiencyLevel;
  textScore: number;
  voiceScore: number;
  recommendations: string[];
} {
  // Calculate scores per level
  const levelScores: Record<string, { correct: number; total: number }> = {
    A1: { correct: 0, total: 0 },
    A2: { correct: 0, total: 0 },
    B1: { correct: 0, total: 0 },
    B2: { correct: 0, total: 0 },
    C1: { correct: 0, total: 0 },
  };

  answers.forEach((answer, index) => {
    const question = questions[index];
    if (question) {
      levelScores[question.level].total++;
      if (answer.correct) {
        levelScores[question.level].correct++;
      }
    }
  });

  // Determine level based on performance
  let assessedLevel: ProficiencyLevel = 'A1';
  const recommendations: string[] = [];

  if (levelScores.C1.correct > 0 || levelScores.B2.correct >= 1) {
    assessedLevel = 'C1';
    recommendations.push("Focus on advanced grammar and nuanced expressions");
  } else if (levelScores.B2.correct > 0 || levelScores.B1.correct >= 2) {
    assessedLevel = 'B2';
    recommendations.push("Practice complex sentence structures");
  } else if (levelScores.B1.correct > 0 || levelScores.A2.correct >= 2) {
    assessedLevel = 'B1';
    recommendations.push("Work on conversational fluency");
  } else if (levelScores.A2.correct > 0 || levelScores.A1.correct >= 2) {
    assessedLevel = 'A2';
    recommendations.push("Review basic grammar and expand vocabulary");
  } else {
    assessedLevel = 'A1';
    recommendations.push("Start with foundational vocabulary and phrases");
  }

  // Calculate overall scores
  const textQuestions = answers.filter((_, i) => questions[i]?.type === 'text');
  const voiceQuestions = answers.filter((_, i) => questions[i]?.type === 'voice');
  
  const textCorrect = textQuestions.filter(a => a.correct).length;
  const voiceCorrect = voiceQuestions.filter(a => a.correct).length;
  
  const textScore = textQuestions.length > 0 ? (textCorrect / textQuestions.length) * 100 : 0;
  const voiceScore = voiceQuestions.length > 0 ? (voiceCorrect / voiceQuestions.length) * 100 : 0;

  return {
    level: assessedLevel,
    textScore,
    voiceScore,
    recommendations,
  };
}
