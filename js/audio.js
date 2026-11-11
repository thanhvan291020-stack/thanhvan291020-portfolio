const AudioController = {
  enabled: false,
  context: null,
  lastTrigger: 0,

  ensureContext() {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    if (!this.context) {
      this.context = new AudioCtor();
    }
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
    return this.context;
  },

  setEnabled(value) {
    this.enabled = Boolean(value);
    if (!this.enabled && this.context && this.context.state !== 'closed') {
      this.context.suspend();
    }
  },

  playTone() {
    if (!this.enabled) return;
    const now = Date.now();
    if (now - this.lastTrigger < 120) return;
    this.lastTrigger = now;

    const context = this.ensureContext();
    if (!context) return;

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const start = context.currentTime;

    const tones = [523.25, 659.25, 783.99];
    const note = tones[Math.floor(Math.random() * tones.length)];

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(note, start);
    oscillator.frequency.exponentialRampToValueAtTime(note * 1.18, start + 0.12);

    gainNode.gain.setValueAtTime(0.0001, start);
    gainNode.gain.linearRampToValueAtTime(0.05, start + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, start + 0.24);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.24);
  }
};
