/**
 * GERENCIADOR DE CONFIRMAÇÃO DE PRESENÇA (RSVP)
 * Integração com WhatsApp & Armazenamento Local
 */

document.addEventListener('DOMContentLoaded', () => {
  const rsvpForm = document.getElementById('wedding-rsvp-form');
  const btnMinus = document.getElementById('btn-guest-minus');
  const btnPlus = document.getElementById('btn-guest-plus');
  const displayGuests = document.getElementById('display-guests-count');
  const inputGuests = document.getElementById('input-guests-count');

  let guestsCount = 1;

  if (btnMinus && btnPlus && displayGuests && inputGuests) {
    btnMinus.addEventListener('click', (e) => {
      e.preventDefault();
      if (guestsCount > 1) {
        guestsCount--;
        displayGuests.textContent = guestsCount;
        inputGuests.value = guestsCount;
      }
    });

    btnPlus.addEventListener('click', (e) => {
      e.preventDefault();
      if (guestsCount < 10) {
        guestsCount++;
        displayGuests.textContent = guestsCount;
        inputGuests.value = guestsCount;
      }
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('rsvp-name').value.trim();
      const phone = document.getElementById('rsvp-phone').value.trim();
      const presence = document.querySelector('input[name="presence"]:checked')?.value || 'Sim, com certeza estarei lá!';
      const dietary = document.getElementById('rsvp-dietary').value;
      const message = document.getElementById('rsvp-message').value.trim();
      const totalGuests = inputGuests ? inputGuests.value : 1;

      if (!name) {
        showToast('Por favor, informe seu nome completo.');
        return;
      }

      // Salva no LocalStorage
      const rsvpData = {
        name,
        phone,
        presence,
        totalGuests,
        dietary,
        message,
        date: new Date().toISOString()
      };

      const existing = JSON.parse(localStorage.getItem('eluisa_gabriel_rsvp') || '[]');
      existing.push(rsvpData);
      localStorage.setItem('eluisa_gabriel_rsvp', JSON.stringify(existing));

      // Chuva de pétalas de rosas brancas e ouro
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 95,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#FFFFFF', '#FAF7F2', '#F5EFEB', '#D4AF37', '#E8C87A']
        });
      }

      showToast('✨ Presença confirmada com sucesso! Abrindo WhatsApp de Gabriel...');

      // Formata mensagem para o WhatsApp do Noivo (Gabriel Alexandre da Silva)
      const whatsappNumber = '5583989146965'; // Gabriel Alexandre da Silva - DDD 83
      const textMsg = 
        `💍 *CONFIRMAÇÃO DE PRESENÇA - CASAMENTO ELUISA & GABRIEL*\n` +
        `🗓 *Data:* 17 de Janeiro de 2027 às 10:00h\n` +
        `⛪ *Cerimônia:* Capela Sagrada Família (Bairro de Salema, Rio Tinto - PB)\n` +
        `🏰 *Recepção:* Brizola Halls (Bairro de Salema, Rio Tinto - PB)\n\n` +
        `👤 *Convidado(a):* ${name}\n` +
        `📱 *WhatsApp do Convidado:* ${phone || 'Não informado'}\n` +
        `✨ *Status:* ${presence}\n` +
        `👥 *Total de Pessoas:* ${totalGuests}\n` +
        `🥗 *Restrição Alimentar:* ${dietary}\n` +
        (message ? `💌 *Mensagem carinhosa:* "${message}"\n` : '') +
        `\nCom muito amor e carinho! ✨`;

      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(textMsg)}`;

      // Reseta formulário
      rsvpForm.reset();
      if (displayGuests) displayGuests.textContent = '1';
      if (inputGuests) inputGuests.value = '1';
      guestsCount = 1;

      // Compatibilidade Apple (iOS / Safari) e Android
      const isApple = /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
      if (isApple) {
        window.location.href = waUrl;
      } else {
        const newTab = window.open(waUrl, '_blank');
        if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
          window.location.href = waUrl;
        }
      }
    });
  }
});

// Utilitário de Toast global
function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
