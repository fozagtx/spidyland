import * as Tone from 'tone';

class SoundManager {
  constructor() {
    this.initialized = false;
    this.synths = {};
    this.loops = {};
  }

  async init() {
    if (this.initialized) return;
    
    await Tone.start();
    this.initialized = true;

    this.synths.footstep = new Tone.MembraneSynth({
      pitchDecay: 0.008,
      octaves: 2,
      envelope: {
        attack: 0.001,
        decay: 0.3,
        sustain: 0,
        release: 0.2
      }
    }).toDestination();

    this.synths.spider = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.1,
        release: 0.2
      }
    }).toDestination();

    this.synths.treasure = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.3,
        release: 1
      }
    }).toDestination();

    this.synths.ambient = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 2,
        decay: 1,
        sustain: 0.8,
        release: 3
      }
    }).toDestination();

    this.filter = new Tone.Filter({
      frequency: 1000,
      type: 'lowpass',
      rolloff: -12
    }).toDestination();

    this.reverb = new Tone.Reverb({
      decay: 3,
      wet: 0.3
    }).toDestination();

    this.synths.ambient.connect(this.reverb);
    this.synths.spider.connect(this.filter);

    this.startAmbience();
  }

  startAmbience() {
    if (this.loops.ambient) return;

    this.loops.ambient = new Tone.Loop((time) => {
      this.synths.ambient.triggerAttackRelease('C2', '4n', time, 0.05);
      this.synths.ambient.triggerAttackRelease('G2', '4n', time + 0.5, 0.03);
    }, '4s').start(0);

    Tone.Transport.start();
  }

  playFootstep() {
    if (!this.initialized) return;
    const note = ['C2', 'C#2', 'D2'][Math.floor(Math.random() * 3)];
    this.synths.footstep.triggerAttackRelease(note, '32n', undefined, 0.3);
  }

  playSpiderScuttle() {
    if (!this.initialized) return;
    const notes = ['E3', 'F#3', 'G3', 'A3'];
    const note = notes[Math.floor(Math.random() * notes.length)];
    this.synths.spider.triggerAttackRelease(note, '64n', undefined, 0.2);
  }

  playTreasureCollect() {
    if (!this.initialized) return;
    const melody = ['C5', 'E5', 'G5', 'C6'];
    melody.forEach((note, i) => {
      this.synths.treasure.triggerAttackRelease(note, '8n', `+${i * 0.1}`, 0.5);
    });
  }

  playChase() {
    if (!this.initialized) return;
    this.synths.spider.triggerAttackRelease('A4', '16n', undefined, 0.4);
  }

  playDanger() {
    if (!this.initialized) return;
    this.synths.spider.triggerAttackRelease('C3', '8n', undefined, 0.6);
  }

  stopAmbience() {
    if (this.loops.ambient) {
      this.loops.ambient.stop();
      this.loops.ambient = null;
    }
    Tone.Transport.stop();
  }

  cleanup() {
    this.stopAmbience();
    Object.values(this.synths).forEach(synth => synth.dispose());
    if (this.filter) this.filter.dispose();
    if (this.reverb) this.reverb.dispose();
    this.initialized = false;
  }
}

export const soundManager = new SoundManager();
