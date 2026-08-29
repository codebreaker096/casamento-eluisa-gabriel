/**
 * MURAL DE RECADOS AOS NOIVOS (GUESTBOOK INTERATIVO)
 */

class GuestbookManager {
  constructor() {
    this.container = document.getElementById('guestbook-list');
    this.form = document.getElementById('guestbook-form');
    this.storageKey = 'eluisa_gabriel_guestbook_msgs';

    this.defaultMessages = [
      {
        name: 'Dona Teresa & Seu José (Pais da Noiva)',
        message: 'Filhos queridos, ver esse amor florescer é a maior bênção de nossas vidas. Que a Capela Sagrada Família sele uma união eterna de paz, respeito e cumplicidade!',
        date: '28 de Agosto de 2026'
      },
      {
        name: 'Mariana & Lucas (Padrinhos)',
        message: 'Contando os segundos para o dia 17 de Janeiro de 2027! Vamos celebrar muito no Brizola Halls. Vocês são perfeitos juntos!',
        date: '20 de Agosto de 2026'
      },
      {
        name: 'Vovó Francisca',
        message: 'Deus abençoe cada passo dessa nova família. Meu coração transborda de alegria por meus netos amados!',
        date: '15 de Agosto de 2026'
      }
    ];

    this.init();
  }

  init() {
    this.render();

    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('gb-name');
        const msgInput = document.getElementById('gb-message');

        const name = nameInput ? nameInput.value.trim() : '';
        const msg = msgInput ? msgInput.value.trim() : '';

        if (!name || !msg) {
          showToast('Preencha seu nome e mensagem para publicar.');
          return;
        }

        this.addMessage(name, msg);

        if (nameInput) nameInput.value = '';
        if (msgInput) msgInput.value = '';

        showToast('✨ Seu recado foi publicado com carinho!');
      });
    }
  }

  getMessages() {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      return this.defaultMessages;
    }
    try {
      return JSON.parse(stored);
    } catch (e) {
      return this.defaultMessages;
    }
  }

  addMessage(name, message) {
    const current = this.getMessages();
    const newMsg = {
      name,
      message,
      date: 'Hoje'
    };
    current.unshift(newMsg);
    localStorage.setItem(this.storageKey, JSON.stringify(current));
    this.render();
  }

  render() {
    if (!this.container) return;
    const msgs = this.getMessages();
    this.container.innerHTML = '';

    msgs.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'guestbook-card';
      card.innerHTML = `
        <div class="guestbook-card-author">
          <span>${this.escapeHtml(item.name)}</span>
          <span class="guestbook-card-date">${this.escapeHtml(item.date)}</span>
        </div>
        <p class="guestbook-card-msg">“${this.escapeHtml(item.message)}”</p>
      `;
      this.container.appendChild(card);
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.guestbookManager = new GuestbookManager();
});
