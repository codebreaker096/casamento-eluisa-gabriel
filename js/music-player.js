/**
 * TRILHA SONORA NUPCIAL EQUILIBRADA, DOCE & EMOCIONANTE
 * Timbre acústico balanceado de Harpa Dourada e Piano de Cauda Romântico
 * Faixa de frequência clara e cristalina, sem graves abafados e sem agudos estridentes.
 */

class WeddingAudioController {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.timerId = null;
    this.currentBar = 0;

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

    // Frequências Balanceadas & Claras (Temperamento Igual A4 = 440Hz)
    this.N = {
      D2: 73.42,   Fs2: 92.50,  G2: 98.00,   A2: 110.00,  B2: 123.47,  Cs3: 138.59,
      D3: 146.83,  E3: 164.81,  Fs3: 185.00, G3: 196.00,  A3: 220.00,  B3: 246.94,  Cs4: 277.18,
      D4: 293.66,  E4: 329.63,  Fs4: 369.99, G4: 392.00,  A4: 440.00,  B4: 493.88,  Cs5: 554.37,
      D5: 587.33,  E5: 659.25,  Fs5: 739.99, G5: 783.99,  A5: 880.00
    };

    // Progressão Harmônica Equilibrada e Serena (D - A - Bm - F#m - G - D - G - A)
    this.progression = [
      // 1. Ré Maior (D)
      {
        bass: this.N.D3,
        harp: [this.N.A3, this.N.D4, this.N.Fs4, this.N.A4]
      },
      // 2. Lá Maior (A)
      {
        bass: this.N.A2,
        harp: [this.N.E3, this.N.A3, this.N.Cs4, this.N.E4]
      },
      // 3. Si Menor (Bm)
      {
        bass: this.N.B2,
        harp: [this.N.Fs3, this.N.B3, this.N.D4, this.N.Fs4]
      },
      // 4. Fá# Menor (F#m)
      {
        bass: this.N.Fs2,
        harp: [this.N.Cs3, this.N.Fs3, this.N.A3, this.N.Cs4]
      },
      // 5. Sol Maior (G)
      {
        bass: this.N.G2,
        harp: [this.N.D3, this.N.G3, this.N.B3, this.N.D4]
      },
      // 6. Ré Maior (D)
      {
        bass: this.N.D3,
        harp: [this.N.A3, this.N.D4, this.N.Fs4, this.N.A4]
      },
      // 7. Sol Maior (G)
      {
        bass: this.N.G2,
        harp: [this.N.D3, this.N.G3, this.N.B3, this.N.D4]
      },
      // 8. Lá Maior (A)
      {
        bass: this.N.A2,
        harp: [this.N.E3, this.N.A3, this.N.Cs4, this.N.G4]
      }
    ];

    // Melodia Doce, Romântica & Nítida (Canon in D clássico)
    this.melodyTheme = [
      // Compasso 1: Fá#5 -> Mi5
      [{ n: this.N.Fs5, t: 0.0, d: 0.9 }, { n: this.N.E5,  t: 0.5, d: 0.9 }],
      // Compasso 2: Ré5 -> Dó#5
      [{ n: this.N.D5,  t: 0.0, d: 0.9 }, { n: this.N.Cs5, t: 0.5, d: 0.9 }],
      // Compasso 3: Si4 -> Lá4
      [{ n: this.N.B4,  t: 0.0, d: 0.9 }, { n: this.N.A4,  t: 0.5, d: 0.9 }],
      // Compasso 4: Si4 -> Dó#5
      [{ n: this.N.B4,  t: 0.0, d: 0.9 }, { n: this.N.Cs5, t: 0.5, d: 0.9 }],
      // Compasso 5: Ré5 -> Dó#5
      [{ n: this.N.D5,  t: 0.0, d: 0.9 }, { n: this.N.Cs5, t: 0.5, d: 0.9 }],
      // Compasso 6: Si4 -> Lá4
      [{ n: this.N.B4,  t: 0.0, d: 0.9 }, { n: this.N.A4,  t: 0.5, d: 0.9 }],
      // Compasso 7: Sol4 -> Fá#4
      [{ n: this.N.G4,  t: 0.0, d: 0.9 }, { n: this.N.Fs4, t: 0.5, d: 0.9 }],
      // Compasso 8: Sol4 -> Lá4
      [{ n: this.N.G4,  t: 0.0, d: 0.9 }, { n: this.N.A4,  t: 0.5, d: 0.9 }]
    ];

    this.initEvents();
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();

      // Master Gain Equilibrado
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.24, this.audioCtx.currentTime);

      // Filtro Acústico Balanceado (Claro e Doce - 3800Hz)
      this.eqFilter = this.audioCtx.createBiquadFilter();
      this.eqFilter.type = 'lowpass';
      this.eqFilter.frequency.setValueAtTime(3800, this.audioCtx.currentTime);
      this.eqFilter.Q.setValueAtTime(0.4, this.audioCtx.currentTime);

      // Ambiência Suave de Capela (Reverb / Delay)
      this.delayNode = this.audioCtx.createDelay();
      this.delayNode.delayTime.setValueAtTime(0.30, this.audioCtx.currentTime);

      this.reverbGain = this.audioCtx.createGain();
      this.reverbGain.gain.setValueAtTime(0.20, this.audioCtx.currentTime);

      // Conexões
      this.masterGain.connect(this.eqFilter);
      this.eqFilter.connect(this.audioCtx.destination);

      // Loop suave de reverberação
      this.masterGain.connect(this.delayNode);
      this.delayNode.connect(this.reverbGain);
      this.reverbGain.connect(this.eqFilter);
      this.reverbGain.connect(this.delayNode);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Toca nota acústica balanceada com sino harmônico suave
  playAcoustic(freq, duration = 2.0, volume = 0.12, isLead = false) {
    if (!this.audioCtx || !freq) return;

    const now = this.audioCtx.currentTime;
    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc1.type = isLead ? 'sine' : 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    // Overtone suave para brilho sedoso
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    // Envelope suave de sino/piano acústico
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

  // Acorde suave de celebração ao quebrar o lacre
  playChime() {
    this.initContext();
    const chimeNotes = [this.N.D4, this.N.Fs4, this.N.A4, this.N.D5, this.N.Fs5];
    chimeNotes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playAcoustic(freq, 1.8, 0.10, true);
      }, idx * 90);
    });
  }

  // Execução fluida de cada compasso da melodia
  playMeasure(barIndex) {
    if (!this.isPlaying) return;

    const barData = this.progression[barIndex];
    const measureDuration = 1.9; // Andamento nobre, fluido e aconchegante (~63 BPM)

    // 1. Baixo Limpo e Definido
    this.playAcoustic(barData.bass, measureDuration * 1.5, 0.16, false);

    // 2. Dedilhado Cristalino de Harpa
    if (barData.harp) {
      barData.harp.forEach((f, i) => {
        setTimeout(() => {
          if (this.isPlaying) this.playAcoustic(f, measureDuration * 1.1, 0.08, false);
        }, (i + 1) * 160);
      });
    }

    // 3. Melodia Solista Clara e Doce no Topo
    const melodyNotes = this.melodyTheme[barIndex];
    if (melodyNotes) {
      melodyNotes.forEach(m => {
        setTimeout(() => {
          if (this.isPlaying) {
            this.playAcoustic(m.n, m.d * measureDuration * 1.3, 0.15, true);
          }
        }, m.t * measureDuration * 1000);
      });
    }

    // Avança para o próximo compasso
    const nextBar = (barIndex + 1) % 8;

    this.timerId = setTimeout(() => {
      this.playMeasure(nextBar);
    }, measureDuration * 1000);
  }

  playBGM() {
    this.initContext();
    if (this.isPlaying) return;

    this.isPlaying = true;
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
    this.isPlaying = false;
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
    if (this.isPlaying) {
      this.pauseBGM();
    } else {
      this.playBGM();
    }
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
