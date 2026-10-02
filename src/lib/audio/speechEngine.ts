/* ===================================================================
   AXONPASS — Speech Synthesis & Read Aloud Engine (Audio on the Go)
   100% Free, Native Web Speech API | Offline Capable | Zero API Cost
   =================================================================== */

export interface SpeechVoiceOption {
  name: string;
  lang: string;
  voiceURI: string;
  default: boolean;
}

export interface SpeechPlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentIndex: number;
  totalSentences: number;
  currentSentence: string;
  rate: number;
  selectedVoiceURI: string | null;
}

type SentenceCallback = (index: number, sentence: string) => void;
type StateCallback = (state: SpeechPlaybackState) => void;

class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private sentences: string[] = [];
  private currentIndex: number = 0;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private rate: number = 1.0;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  private onSentenceChangeCallbacks: Set<SentenceCallback> = new Set();
  private onStateChangeCallbacks: Set<StateCallback> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
    }
  }

  private initVoices(): void {
    if (!this.synth) return;

    const load = () => {
      this.voices = this.synth?.getVoices() || [];
      // Pick best default English voice if available
      if (!this.selectedVoice && this.voices.length > 0) {
        const preferred =
          this.voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural'))) ||
          this.voices.find((v) => v.lang.startsWith('en')) ||
          this.voices[0];
        this.selectedVoice = preferred || null;
      }
    };

    load();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = load;
    }
  }

  public getAvailableVoices(): SpeechVoiceOption[] {
    if (!this.voices || this.voices.length === 0) {
      this.voices = this.synth?.getVoices() || [];
    }
    return this.voices
      .filter((v) => v.lang.startsWith('en'))
      .map((v) => ({
        name: v.name,
        lang: v.lang,
        voiceURI: v.voiceURI,
        default: v.default,
      }));
  }

  /**
   * Cleans raw Markdown, LaTeX, and technical annotations into smooth, natural spoken prose.
   */
  public cleanProseForSpeech(rawMarkdown: string): string[] {
    if (!rawMarkdown) return [];

    let clean = rawMarkdown
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      // Remove inline code
      .replace(/`([^`]+)`/g, '$1')
      // Remove markdown images
      .replace(/!\[.*?\]\(.*?\)/g, '')
      // Remove markdown links but keep anchor text
      .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
      // Remove math formulas
      .replace(/\$\$[\s\S]*?\$\$/g, '')
      .replace(/\$([^$]+)\$/g, '$1')
      // Remove markdown headers
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold/italics
      .replace(/[*_]{1,3}(.*?)[*_]{1,3}/g, '$1')
      // Remove blockquotes
      .replace(/^>\s+/gm, '')
      // Remove horizontal rules
      .replace(/^---+$/gm, '')
      // Replace bullet points with pause
      .replace(/^[-*+]\s+/gm, '. ')
      // Normalize whitespace
      .replace(/\r?\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Split into sentences using punctuation boundaries
    const rawSentences = clean.match(/[^.!?]+[.!?]+(\s|$)/g) || [clean];
    const filtered = rawSentences
      .map((s) => s.trim())
      .filter((s) => s.length > 5);

    return filtered.length > 0 ? filtered : [clean];
  }

  public loadText(rawMarkdown: string): void {
    this.stop();
    this.sentences = this.cleanProseForSpeech(rawMarkdown);
    this.currentIndex = 0;
    this.notifyState();
  }

  public play(rawMarkdown?: string, startIndex?: number): void {
    if (!this.synth) return;

    if (rawMarkdown) {
      this.loadText(rawMarkdown);
    }

    if (this.sentences.length === 0) return;

    if (startIndex !== undefined && startIndex >= 0 && startIndex < this.sentences.length) {
      this.currentIndex = startIndex;
    }

    this.isPlaying = true;
    this.isPaused = false;
    this.speakCurrent();
  }

  private speakCurrent(): void {
    if (!this.synth || !this.isPlaying || this.currentIndex >= this.sentences.length) {
      this.isPlaying = false;
      this.isPaused = false;
      this.notifyState();
      return;
    }

    // Cancel any previous speech
    this.synth.cancel();

    const sentence = this.sentences[this.currentIndex];
    this.utterance = new SpeechSynthesisUtterance(sentence);
    this.utterance.rate = this.rate;

    if (this.selectedVoice) {
      this.utterance.voice = this.selectedVoice;
    }

    this.utterance.onstart = () => {
      this.notifySentence(this.currentIndex, sentence);
      this.notifyState();
    };

    this.utterance.onend = () => {
      if (this.isPlaying && !this.isPaused) {
        if (this.currentIndex < this.sentences.length - 1) {
          this.currentIndex++;
          this.speakCurrent();
        } else {
          this.isPlaying = false;
          this.isPaused = false;
          this.currentIndex = 0;
          this.notifyState();
        }
      }
    };

    this.utterance.onerror = (e) => {
      // If manually canceled, ignore
      if (e.error === 'canceled' || e.error === 'interrupted') return;
      console.warn('SpeechSynthesis error:', e);
      this.isPlaying = false;
      this.notifyState();
    };

    this.synth.speak(this.utterance);
  }

  public pause(): void {
    if (!this.synth || !this.isPlaying) return;
    this.synth.pause();
    this.isPaused = true;
    this.notifyState();
  }

  public resume(): void {
    if (!this.synth) return;
    if (this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notifyState();
    } else {
      this.speakCurrent();
    }
  }

  public stop(): void {
    if (!this.synth) return;
    this.synth.cancel();
    this.isPlaying = false;
    this.isPaused = false;
    this.currentIndex = 0;
    this.notifyState();
  }

  public skipNext(): void {
    if (this.currentIndex < this.sentences.length - 1) {
      this.currentIndex++;
      if (this.isPlaying) {
        this.speakCurrent();
      } else {
        this.notifyState();
      }
    }
  }

  public skipPrev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      if (this.isPlaying) {
        this.speakCurrent();
      } else {
        this.notifyState();
      }
    }
  }

  public seekTo(index: number): void {
    if (index >= 0 && index < this.sentences.length) {
      this.currentIndex = index;
      if (this.isPlaying) {
        this.speakCurrent();
      } else {
        this.notifyState();
      }
    }
  }

  public setRate(rate: number): void {
    this.rate = Math.max(0.5, Math.min(2.5, rate));
    if (this.isPlaying && !this.isPaused) {
      // Re-trigger current sentence with new rate
      this.speakCurrent();
    } else {
      this.notifyState();
    }
  }

  public setVoiceByURI(voiceURI: string): void {
    const found = this.voices.find((v) => v.voiceURI === voiceURI);
    if (found) {
      this.selectedVoice = found;
      if (this.isPlaying && !this.isPaused) {
        this.speakCurrent();
      } else {
        this.notifyState();
      }
    }
  }

  public getState(): SpeechPlaybackState {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      currentIndex: this.currentIndex,
      totalSentences: this.sentences.length,
      currentSentence: this.sentences[this.currentIndex] || '',
      rate: this.rate,
      selectedVoiceURI: this.selectedVoice?.voiceURI || null,
    };
  }

  public onSentenceChange(cb: SentenceCallback): () => void {
    this.onSentenceChangeCallbacks.add(cb);
    return () => this.onSentenceChangeCallbacks.delete(cb);
  }

  public onStateChange(cb: StateCallback): () => void {
    this.onStateChangeCallbacks.add(cb);
    cb(this.getState());
    return () => this.onStateChangeCallbacks.delete(cb);
  }

  private notifySentence(index: number, sentence: string): void {
    this.onSentenceChangeCallbacks.forEach((cb) => cb(index, sentence));
  }

  private notifyState(): void {
    const s = this.getState();
    this.onStateChangeCallbacks.forEach((cb) => cb(s));
  }
}

export const speechEngine = new SpeechEngine();
