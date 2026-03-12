// Voice input service - Speech-to-Text using Web Speech API and Whisper fallback

export interface VoiceInputOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
}

export type VoiceInputCallback = (transcript: string, isFinal: boolean) => void;

export class VoiceInput {
  private recognition: any = null;
  private isListening = false;
  private onTranscript: VoiceInputCallback | null = null;
  private useWhisper = false;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor() {
    // Check for Web Speech API support (works in Chrome, Edge, Safari)
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.setupRecognition();
      } else {
        console.warn('Web Speech API not supported, will use Whisper fallback');
        this.useWhisper = true;
      }
    }
  }

  private setupRecognition(): void {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript && this.onTranscript) {
        this.onTranscript(finalTranscript.trim(), true);
      } else if (interimTranscript && this.onTranscript) {
        this.onTranscript(interimTranscript, false);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // Auto-restart on no-speech
        if (this.isListening) {
          setTimeout(() => this.start(), 100);
        }
      }
    };

    this.recognition.onend = () => {
      // Auto-restart if still supposed to be listening
      if (this.isListening && !this.useWhisper) {
        setTimeout(() => this.recognition?.start(), 100);
      }
    };
  }

  /**
   * Start listening for voice input
   */
  async start(callback: VoiceInputCallback): Promise<void> {
    this.onTranscript = callback;
    this.isListening = true;

    if (this.useWhisper) {
      await this.startWhisperRecording();
    } else if (this.recognition) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
        // Fallback to Whisper
        this.useWhisper = true;
        await this.startWhisperRecording();
      }
    }
  }

  /**
   * Stop listening
   */
  stop(): void {
    this.isListening = false;

    if (this.useWhisper) {
      this.stopWhisperRecording();
    } else if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Failed to stop recognition:', error);
      }
    }
  }

  /**
   * Check if currently listening
   */
  listening(): boolean {
    return this.isListening;
  }

  /**
   * Whisper API fallback - record audio and transcribe
   */
  private async startWhisperRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        await this.transcribeWithWhisper(audioBlob);
        this.audioChunks = [];
      };

      // Record in 3-second chunks
      this.mediaRecorder.start();
      const chunkInterval = setInterval(() => {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
          this.mediaRecorder.stop();
          if (this.isListening) {
            this.mediaRecorder.start();
          } else {
            clearInterval(chunkInterval);
          }
        } else {
          clearInterval(chunkInterval);
        }
      }, 3000);
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw new Error('Microphone access denied');
    }
  }

  private stopWhisperRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }

  private async transcribeWithWhisper(audioBlob: Blob): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Whisper transcription failed');
      }

      const data = await response.json();
      if (data.text && this.onTranscript) {
        this.onTranscript(data.text, true);
      }
    } catch (error) {
      console.error('Whisper transcription error:', error);
    }
  }
}

// Singleton instance
let voiceInputInstance: VoiceInput | null = null;

export function getVoiceInput(): VoiceInput {
  if (!voiceInputInstance) {
    voiceInputInstance = new VoiceInput();
  }
  return voiceInputInstance;
}
