// Voice coaching service using ElevenLabs TTS

const ELEVENLABS_API_KEY = 'sk_2a8f0960d0208b1530971cec2247c779c5794989deb4987f';
const ELEVENLABS_VOICE_ID = 'Cz0K1kOv9tD8l0b5Qu53'; // Professional interviewer voice

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
}

export type EmotionType = 'encouraging' | 'teaching' | 'celebrating' | 'gentle_nudge' | 'neutral';

const emotionSettings: Record<EmotionType, VoiceSettings> = {
  encouraging: { stability: 0.6, similarity_boost: 0.8 },
  teaching: { stability: 0.7, similarity_boost: 0.75 },
  celebrating: { stability: 0.5, similarity_boost: 0.9 },
  gentle_nudge: { stability: 0.65, similarity_boost: 0.7 },
  neutral: { stability: 0.5, similarity_boost: 0.75 },
};

export class VoiceCoach {
  private audioContext: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Convert text to speech with emotion-based voice settings
   */
  async speak(text: string, emotion: EmotionType = 'neutral'): Promise<void> {
    try {
      const settings = emotionSettings[emotion];
      
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: settings,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play audio
      await this.playAudio(audioUrl);
    } catch (error) {
      console.error('Voice coaching error:', error);
      // Fallback to text-only if voice fails
    }
  }

  /**
   * Play audio from URL
   */
  private async playAudio(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Stop current audio if playing
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      const audio = new Audio(url);
      this.currentAudio = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        this.currentAudio = null;
        resolve();
      };

      audio.onerror = (error) => {
        URL.revokeObjectURL(url);
        this.currentAudio = null;
        reject(error);
      };

      audio.play().catch(reject);
    });
  }

  /**
   * Stop current audio
   */
  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
  }

  /**
   * Check if audio is currently playing
   */
  isPlaying(): boolean {
    return this.currentAudio !== null && !this.currentAudio.paused;
  }
}

// Singleton instance
let voiceCoachInstance: VoiceCoach | null = null;

export function getVoiceCoach(): VoiceCoach {
  if (!voiceCoachInstance) {
    voiceCoachInstance = new VoiceCoach();
  }
  return voiceCoachInstance;
}

// Helper function for quick voice messages
export async function coachSpeak(
  text: string,
  emotion: EmotionType = 'neutral'
): Promise<void> {
  const coach = getVoiceCoach();
  await coach.speak(text, emotion);
}
