/**
 * GERENCIADOR DE ACEITE & CONFIRMAÇÃO DOS PADRINHOS (RSVP EXCLUSIVO)
 * Integração com WhatsApp & Armazenamento Local
 */

document.addEventListener('DOMContentLoaded', () => {
  const padrinhosForm = document.getElementById('padrinhos-rsvp-form');

  if (padrinhosForm) {
    padrinhosForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const roleType = document.querySelector('input[name="padrinho_role"]:checked')?.value || 'Casal de Padrinhos';
      const name = document.getElementById('padrinho-name')?.value.trim();
      const phone = document.getElementById('padrinho-phone')?.value.trim();
      const acceptance = document.querySelector('input[name="padrinho_acceptance"]:checked')?.value || 'Sim, aceito com todo o coração e muita honra! 💍';
      const dietary = document.getElementById('padrinho-dietary')?.value || 'Nenhuma restrição';
      const message = document.getElementById('padrinho-message')?.value.trim();

      if (!name) {
        showToast('Por favor, informe seu nome completo.');
        return;
      }

      // Salva no LocalStorage
      const padrinhoData = {
        roleType,
        name,
        phone,
        acceptance,
        dietary,
        message,
        date: new Date().toISOString()
      };

      const existing = JSON.parse(localStorage.getItem('eluisa_gabriel_padrinhos_rsvp') || '[]');
      existing.push(padrinhoData);
      localStorage.setItem('eluisa_gabriel_padrinhos_rsvp', JSON.stringify(existing));

      // Explosão de confetes dourados e pétalas de rosas
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#E8C87A', '#FFFFFF', '#4D5D43', '#FAF7F2']
        });
      }

      showToast('✨ Aceite confirmado com sucesso! Abrindo WhatsApp de Gabriel...');

      // WhatsApp de Gabriel Alexandre da Silva (DDD 83)
      const whatsappNumber = '5583989146965';
      const textMsg =
        `🕊️ *RESPOSTA OFICIAL DOS PADRINHOS — CASAMENTO ELUISA & GABRIEL*\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n` +
        `🗓 *Data:* 17 de Janeiro de 2027 às 10:00h\n` +
        `⏰ *Horário Especial dos Padrinhos:* 09:15h (Chegada & Cortejo)\n` +
        `⛪ *Cerimônia:* Capela Sagrada Família (Bairro de Salema, Rio Tinto - PB)\n` +
        `🏰 *Recepção:* Brizola Halls (Bairro de Salema, Rio Tinto - PB)\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `✨ *Função de Honra:* ${roleType}\n` +
        `👤 *Nome(s):* ${name}\n` +
        `📱 *WhatsApp:* ${phone || 'Não informado'}\n` +
        `💍 *Resposta ao Convite:* ${acceptance}\n` +
        `🥗 *Restrição Alimentar:* ${dietary}\n` +
        (message ? `💌 *Mensagem para os Noivos:* "${message}"\n` : '') +
        `\nCom muito amor, carinho e honra por estar no altar com vocês! ✨🌿`;

      const waUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(textMsg)}`;

      setTimeout(() => {
        window.open(waUrl, '_blank');
        padrinhosForm.reset();
      }, 1200);
    });
  }
});
