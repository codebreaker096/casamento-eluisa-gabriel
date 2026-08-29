/**
 * INTEGRAÇÃO COM CALENDÁRIO (.ICS & GOOGLE CALENDAR)
 */

document.addEventListener('DOMContentLoaded', () => {
  const btnCeremonyCalendar = document.getElementById('btn-ceremony-calendar');
  const btnReceptionCalendar = document.getElementById('btn-reception-calendar');

  const weddingEvent = {
    title: 'Casamento de Eluisa & Gabriel',
    description: 'Celebração do Matrimônio de Eluisa e Gabriel na Capela Sagrada Família e Recepção no Brizola Halls, Bairro de Salema, Rio Tinto - PB.',
    location: 'Capela Sagrada Família & Brizola Halls, Bairro de Salema, Rio Tinto - PB, Brasil',
    start: '20270117T100000',
    end: '20270117T220000'
  };

  function downloadIcs() {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Eluisa e Gabriel//Casamento//PT',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${weddingEvent.title}`,
      `DESCRIPTION:${weddingEvent.description}`,
      `LOCATION:${weddingEvent.location}`,
      `DTSTART;TZID=America/Fortaleza:${weddingEvent.start}`,
      `DTEND;TZID=America/Fortaleza:${weddingEvent.end}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Casamento-Eluisa-e-Gabriel.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('📅 Convite adicionado ao seu calendário!');
  }

  function openGoogleCalendar() {
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(weddingEvent.title)}&dates=${weddingEvent.start}/${weddingEvent.end}&details=${encodeURIComponent(weddingEvent.description)}&location=${encodeURIComponent(weddingEvent.location)}`;
    window.open(googleUrl, '_blank');
  }

  if (btnCeremonyCalendar) {
    btnCeremonyCalendar.addEventListener('click', (e) => {
      e.preventDefault();
      downloadIcs();
    });
  }

  if (btnReceptionCalendar) {
    btnReceptionCalendar.addEventListener('click', (e) => {
      e.preventDefault();
      openGoogleCalendar();
    });
  }
});
