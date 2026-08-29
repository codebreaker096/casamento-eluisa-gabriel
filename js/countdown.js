/**
 * CONTAGEM REGRESSIVA DO CASAMENTO
 * Data Sagrada: 17 de Janeiro de 2027 às 10:00:00 (Horário de Brasília / Rio Tinto - PB)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Alvo: 17 de Janeiro de 2027 10:00:00 GMT-0300
  const weddingDate = new Date('2027-01-17T10:00:00-03:00').getTime();

  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');

  if (!elDays) return;

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance <= 0) {
      if (elDays) elDays.textContent = '00';
      if (elHours) elHours.textContent = '00';
      if (elMinutes) elMinutes.textContent = '00';
      if (elSeconds) elSeconds.textContent = '00';
      const label = document.getElementById('countdown-status-text');
      if (label) label.textContent = 'É HOJE! O GRANDE DIA CHEGOU!';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    if (elDays.textContent !== pad(days)) elDays.textContent = pad(days);
    if (elHours.textContent !== pad(hours)) elHours.textContent = pad(hours);
    if (elMinutes.textContent !== pad(minutes)) elMinutes.textContent = pad(minutes);
    if (elSeconds.textContent !== pad(seconds)) elSeconds.textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});
