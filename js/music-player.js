/**
 * SISTEMA DE ÁUDIO NUPCIAL DUPLO:
 * 1. Prelúdio de Expectativa / Ansiedade Romântica (Fundo Verde do Envelope)
 * 2. Abertura Exuberante & Delicada ao Romper o Selo (Glissando em Cascata de Harpa e Sino)
 * 3. Trilha Sonora Romântica Oficial (Canon in D - Harpa, Violoncelo & Piano Clássico)
 */

class WeddingAudioController {
  constructor() {
    this.audioCtx = null;
    this.isPlayingMain = false;
    this.isPlayingPrelude = false;
    this.timerId = null;
    this.preludeTimerId = null;
    this.preludeBar = 0;

    // Nodes de Áudio
    this.masterGain = null;
    this.eqFilter = null;
    this.delayNode = null;
    this.reverbGain = null;

    // Elementos da UI
    this.playBtn = document.getElementById('music-toggle-btn');
    this.visualizer = document.getElementById('visualizer-bars');
    this.songTitle = document.getElementById('music-title');
    this.songAuthor = document.getElementById('music-author');

    // Frequências (Temperamento Igual A4 = 440Hz)
    this.N = {
      B1: 61.74,   D2: 73.42,   E2: 82.41,   Fs2: 92.50,  G2: 98.00,   A2: 110.00,  B2: 123.47,  Cs3: 138.59,
      D3: 146.83,  E3: 164.81,  Fs3: 185.00, G3: 196.00,  A3: 220.00,  B3: 246.94,  Cs4: 277.18,
      D4: 293.66,  E4: 329.63,  Fs4: 369.99, G4: 392.00,  A4: 440.00,  B4: 493.88,  Cs5: 554.37,
      D5: 587.33,  E5: 659.25,  Fs5: 739.99, G5: 783.99,  A5: 880.00,  B5: 987.77,  Cs6: 1108.73, D6: 1174.66, Fs6: 1479.98
    };

    // 1. Progressão do Prelúdio de Expectativa / Ansiedade (Bm -> G -> Em -> Asus4)
    this.preludeProgression = [
      {
        bass: this.N.B2,
        pulse: [this.N.Fs3, this.N.B3, this.N.D4, this.N.Fs4]
      },
      {
        bass: this.N.G2,
        pulse: [this.N.D3, this.N.G3, this.N.B3, this.N.D4]
      },
      {
        bass: this.N.E2,
        pulse: [this.N.B2, this.N.E3, this.N.G3, this.N.B3]
      },
      {
        bass: this.N.A2,
        pulse: [this.N.E3, this.N.A3, this.N.D4, this.N.E4]
      }
    ];

    // 2. Progressão Harmônica Principal (D - A - Bm - F#m - G - D - G - A)
    this.progression = [
      { bass: this.N.D3, harp: [this.N.A3, this.N.D4, this.N.Fs4, this.N.A4] },
      { bass: this.N.A2, harp: [this.N.E3, this.N.A3, this.N.Cs4, this.N.E4] },
      { bass: this.N.B2, harp: [this.N.Fs3, this.N.B3, this.N.D4, this.N.Fs4] },
      { bass: this.N.Fs2, harp: [this.N.Cs3, this.N.Fs3, this.N.A3, this.N.Cs4] },
      { bass: this.N.G2, harp: [this.N.D3, this.N.G3, this.N.B3, this.N.D4] },
      { bass: this.N.D3, harp: [this.N.A3, this.N.D4, this.N.Fs4, this.N.A4] },
      { bass: this.N.G2, harp: [this.N.D3, this.N.G3, this.N.B3, this.N.D4] },
      { bass: this.N.A2, harp: [this.N.E3, this.N.A3, this.N.Cs4, this.N.G4] }
    ];

    // Melodia Lírica Principal
    this.melodyTheme = [
      [{ n: this.N.Fs5, t: 0.0, d: 0.9 }, { n: this.N.E5,  t: 0.5, d: 0.9 }],
      [{ n: this.N.D5,  t: 0.0, d: 0.9 }, { n: this.N.Cs5, t: 0.5, d: 0.9 }],
      [{ n: this.N.B4,  t: 0.0, d: 0.9 }, { n: this.N.A4,  t: 0.5, d: 0.9 }],
      [{ n: this.N.B4,  t: 0.0, d: 0.9 }, { n: this.N.Cs5, t: 0.5, d: 0.9 }],
      [{ n: this.N.D5,  t: 0.0, d: 0.9 }, { n: this.N.Cs5, t: 0.5, d: 0.9 }],
      [{ n: this.N.B4,  t: 0.0, d: 0.9 }, { n: this.N.A4,  t: 0.5, d: 0.9 }],
      [{ n: this.N.G4,  t: 0.0, d: 0.9 }, { n: this.N.Fs4, t: 0.5, d: 0.9 }],
      [{ n: this.N.G4,  t: 0.0, d: 0.9 }, { n: this.N.A4,  t: 0.5, d: 0.9 }]
    ];

    this.initEvents();
    this.setupPreludeAutoStart();
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();

      // Master Gain
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.24, this.audioCtx.currentTime);

      // Filtro Acústico Balanceado (3800Hz)
      this.eqFilter = this.audioCtx.createBiquadFilter();
      this.eqFilter.type = 'lowpass';
      this.eqFilter.frequency.setValueAtTime(3800, this.audioCtx.currentTime);
      this.eqFilter.Q.setValueAtTime(0.4, this.audioCtx.currentTime);

      // Ambiência de Catedral / Capela
      this.delayNode = this.audioCtx.createDelay();
      this.delayNode.delayTime.setValueAtTime(0.30, this.audioCtx.currentTime);

      this.reverbGain = this.audioCtx.createGain();
      this.reverbGain.gain.setValueAtTime(0.20, this.audioCtx.currentTime);

      // Conexões
      this.masterGain.connect(this.eqFilter);
      this.eqFilter.connect(this.audioCtx.destination);

      this.masterGain.connect(this.delayNode);
      this.delayNode.connect(this.reverbGain);
      this.reverbGain.connect(this.eqFilter);
      this.reverbGain.connect(this.delayNode);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playAcoustic(freq, duration = 2.0, volume = 0.12, isLead = false) {
    if (!this.audioCtx || !freq) return;

    const now = this.audioCtx.currentTime;
    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc1.type = isLead ? 'sine' : 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(volume * 0.5, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  // =========================================================================
  // 1. PRELÚDIO DE EXPECTATIVA / ANSIEDADE ROMÂNTICA (FUNDO DO ENVELOPE)
  // =========================================================================
  playPreludeMeasure(barIdx) {
    if (!this.isPlayingPrelude) return;

    const barData = this.preludeProgression[barIdx];
    const measureDuration = 1.6; // Ritmo sutil de batimento cardíaco / antecipação

    // Baixo misterioso e profundo
    this.playAcoustic(barData.bass, measureDuration * 1.3, 0.14, false);

    // Arpejo staccato suave de harpa gerando expectativa
    if (barData.pulse) {
      barData.pulse.forEach((freq, idx) => {
        setTimeout(() => {
          if (this.isPlayingPrelude) {
            this.playAcoustic(freq, 0.9, 0.07, true);
          }
        }, idx * 280);
      });
    }

    const nextBar = (barIdx + 1) % this.preludeProgression.length;
    this.preludeTimerId = setTimeout(() => {
      this.playPreludeMeasure(nextBar);
    }, measureDuration * 1000);
  }

  startPrelude() {
    if (this.isPlayingPrelude || this.isPlayingMain) return;
    this.initContext();
    this.isPlayingPrelude = true;
    this.playPreludeMeasure(0);
  }

  stopPrelude() {
    this.isPlayingPrelude = false;
    if (this.preludeTimerId) clearTimeout(this.preludeTimerId);
  }

  // =========================================================================
  // 2. ABERTURA EXUBERANTE & DELICADA AO ROMPER O LACRE
  // =========================================================================
  playExuberantOpening() {
    this.stopPrelude();
    this.initContext();

    // Cascata celestial ascendente de Harpa Dourada (Glissando triunfal de 12 notas)
    const harpGlissando = [
      this.N.D3, this.N.A3, this.N.D4, this.N.Fs4,
      this.N.A4, this.N.Cs5, this.N.D5, this.N.Fs5,
      this.N.A5, this.N.D6, this.N.Fs6
    ];

    harpGlissando.forEach((freq, index) => {
      setTimeout(() => {
        this.playAcoustic(freq, 2.2, 0.14, true);
      }, index * 55);
    });

    // Acorde ressonante de sino e piano perolado de sustentação
    setTimeout(() => {
      [this.N.D3, this.N.A3, this.N.D4, this.N.Fs4, this.N.A4, this.N.D5].forEach(f => {
        this.playAcoustic(f, 3.2, 0.16, false);
      });
    }, 450);
  }

  // =========================================================================
  // 3. TRILHA PRINCIPAL NUPCIAL (CANON IN D)
  // =========================================================================
  playMeasure(barIndex) {
    if (!this.isPlayingMain) return;

    const barData = this.progression[barIndex];
    const measureDuration = 1.9; // Andamento nobre e romântico (~63 BPM)

    // Baixo
    this.playAcoustic(barData.bass, measureDuration * 1.5, 0.16, false);

    // Dedilhado de Harpa
    if (barData.harp) {
      barData.harp.forEach((f, i) => {
        setTimeout(() => {
          if (this.isPlayingMain) this.playAcoustic(f, measureDuration * 1.1, 0.08, false);
        }, (i + 1) * 160);
      });
    }

    // Melodia Solista Clara
    const melodyNotes = this.melodyTheme[barIndex];
    if (melodyNotes) {
      melodyNotes.forEach(m => {
        setTimeout(() => {
          if (this.isPlayingMain) {
            this.playAcoustic(m.n, m.d * measureDuration * 1.3, 0.15, true);
          }
        }, m.t * measureDuration * 1000);
      });
    }

    const nextBar = (barIndex + 1) % 8;
    this.timerId = setTimeout(() => {
      this.playMeasure(nextBar);
    }, measureDuration * 1000);
  }

  playBGM() {
    this.stopPrelude();
    this.initContext();
    if (this.isPlayingMain) return;

    this.isPlayingMain = true;
    if (this.visualizer) this.visualizer.classList.add('playing');
    if (this.songTitle) this.songTitle.textContent = "Melodia Nupcial Romântica";
    if (this.songAuthor) this.songAuthor.textContent = "Harpa & Piano Clássico";
    if (this.playBtn) {
      this.playBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      `;
    }
    this.playMeasure(0);
  }

  pauseBGM() {
    this.isPlayingMain = false;
    if (this.timerId) clearTimeout(this.timerId);
    if (this.visualizer) this.visualizer.classList.remove('playing');
    if (this.playBtn) {
      this.playBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      `;
    }
  }

  toggle() {
    if (this.isPlayingMain) {
      this.pauseBGM();
    } else {
      this.playBGM();
    }
  }

  setupPreludeAutoStart() {
    const startPreludeOnGesture = () => {
      if (!this.isPlayingMain && !this.isPlayingPrelude) {
        this.startPrelude();
      }
      document.removeEventListener('pointerdown', startPreludeOnGesture);
      document.removeEventListener('scroll', startPreludeOnGesture);
    };

    document.addEventListener('pointerdown', startPreludeOnGesture, { once: true });
    document.addEventListener('scroll', startPreludeOnGesture, { once: true });

    // Tenta iniciar suavemente ao carregar
    setTimeout(() => {
      try {
        this.startPrelude();
      } catch (e) {}
    }, 400);
  }

  initEvents() {
    if (this.playBtn) {
      this.playBtn.parentElement.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.weddingAudio = new WeddingAudioController();
});
