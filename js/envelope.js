/**
 * LÓGICA DE ABERTURA DO ENVELOPE 3D & LACRE DE CERA (TIMING MAJESTOSO)
 */

document.addEventListener('DOMContentLoaded', () => {
  const envelopeScreen = document.getElementById('envelope-screen');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const waxSeal = document.getElementById('wax-seal-btn');
  const hintBtn = document.getElementById('envelope-hint-btn');
  const mainInvitation = document.getElementById('main-invitation');

  if (!waxSeal || !envelopeScreen) return;

  let isOpening = false;

  // Bloqueia scroll do body enquanto o envelope estiver fechado
  document.body.style.overflow = 'hidden';

  const openEnvelope = (e) => {
    if (isOpening) return;
    isOpening = true;

    // Abertura exuberante e delicada de harpa e sino celestial
    if (window.weddingAudio) {
      window.weddingAudio.playExuberantOpening();
      setTimeout(() => {
        window.weddingAudio.playBGM();
      }, 2200);
    }

    // Explosão suave de confetes dourados e folhas de oliveira
    triggerWaxConfetti();

    // Dispara a sequência no CSS (1. Lacre rompe -> 2. Aba abre -> 3. Carta sobe)
    if (envelopeScreen) {
      envelopeScreen.classList.add('opening');
    }
    if (envelopeWrapper) {
      envelopeWrapper.classList.add('opening');
    }

    // Revela suavemente o convite principal quando a carta terminar de subir (aos 4.2s)
    setTimeout(() => {
      if (mainInvitation) {
        mainInvitation.classList.add('visible');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }, 4200);

    // Desvanece a tela do envelope e libera a rolagem (aos 4.8s)
    setTimeout(() => {
      if (envelopeScreen) {
        envelopeScreen.style.opacity = '0';
      }
    }, 4800);

    // Remove o envelope do fluxo (aos 5.8s)
    setTimeout(() => {
      if (envelopeScreen) {
        envelopeScreen.classList.add('opened');
      }
      document.body.style.overflow = '';
      document.body.style.overflowX = 'hidden';
    }, 5800);
  };

  // Listeners nos elementos de interação
  waxSeal.addEventListener('click', (e) => {
    e.stopPropagation();
    openEnvelope(e);
  });

  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', openEnvelope);
  }

  if (hintBtn) {
    hintBtn.addEventListener('click', openEnvelope);
  }

  // Partículas cintilantes douradas e verde oliva
  function triggerWaxConfetti() {
    if (typeof confetti === 'function') {
      const rect = waxSeal.getBoundingClientRect();
      const originX = (rect.left + rect.width / 2) / window.innerWidth;
      const originY = (rect.top + rect.height / 2) / window.innerHeight;

      // Rajada inicial de pétalas brancas e ouro
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { x: originX, y: originY },
        colors: ['#FFFFFF', '#FAF7F2', '#F5EFEB', '#D4AF37', '#E8DCC4'],
        ticks: 260,
        gravity: 0.70,
        scalar: 1.25,
        disableForReducedMotion: true
      });

      // Chuva secundária de pétalas brancas
      setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 65,
          origin: { x: 0.15, y: 0.55 },
          colors: ['#FFFFFF', '#FAF7F2', '#D4AF37', '#E8DCC4']
        });
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 65,
          origin: { x: 0.85, y: 0.55 },
          colors: ['#FFFFFF', '#FAF7F2', '#D4AF37', '#E8DCC4']
        });
      }, 600);
    }
  }
});
