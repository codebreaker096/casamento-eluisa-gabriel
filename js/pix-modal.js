/**
 * GERENCIADOR DA LISTA DE PRESENTES & MODAL PIX COM QR CODE
 */

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('pix-modal');
  const modalClose = document.getElementById('pix-modal-close');
  const pixItemTitle = document.getElementById('pix-item-title');
  const pixItemValue = document.getElementById('pix-item-value');
  const pixKeyText = document.getElementById('pix-key-text');
  const btnCopyPix = document.getElementById('btn-copy-pix');
  const qrContainer = document.getElementById('pix-qrcode');

  const defaultPixKey = 'casamento.eluisagabriel@gmail.com';

  // Abre o modal ao clicar em qualquer botão de presentear
  const giftButtons = document.querySelectorAll('.btn-gift-action');
  giftButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-gift-title') || 'Cota de Casamento';
      const val = btn.getAttribute('data-gift-value') || 'Qualquer valor';

      if (pixItemTitle) pixItemTitle.textContent = title;
      if (pixItemValue) pixItemValue.textContent = val;
      if (pixKeyText) pixKeyText.textContent = defaultPixKey;

      generatePixQRCode(defaultPixKey);

      if (modal) modal.classList.add('active');
    });
  });

  // Fecha o modal
  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // Copia a Chave PIX
  if (btnCopyPix) {
    btnCopyPix.addEventListener('click', () => {
      const keyToCopy = pixKeyText ? pixKeyText.textContent : defaultPixKey;
      navigator.clipboard.writeText(keyToCopy).then(() => {
        showToast('Chave PIX copiada com sucesso! Muito obrigado pelo carinho!');
      }).catch(() => {
        // Fallback
        const temp = document.createElement('textarea');
        temp.value = keyToCopy;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast('Chave PIX copiada!');
      });
    });
  }

  // Gera o QR Code com a biblioteca QRCode ou renderizador SVG
  function generatePixQRCode(text) {
    if (!qrContainer) return;
    qrContainer.innerHTML = '';

    if (typeof QRCode !== 'undefined') {
      new QRCode(qrContainer, {
        text: `00020126580014BR.GOV.BCB.PIX0136${text}5204000053039865802BR5916ELUISA E GABRIEL6009RIO TINTO62070503***6304E8A2`,
        width: 170,
        height: 170,
        colorDark: '#2C3627',
        colorLight: '#FFFFFF',
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      // Fallback elegante com SVG
      qrContainer.innerHTML = `
        <svg width="160" height="160" viewBox="0 0 160 160">
          <rect width="160" height="160" fill="#FFFFFF" rx="8"/>
          <path d="M20,20 h40 v40 h-40 Z M28,28 h24 v24 h-24 Z M100,20 h40 v40 h-40 Z M108,28 h24 v24 h-24 Z M20,100 h40 v40 h-40 Z M28,108 h24 v24 h-24 Z M75,25 h10 v10 h-10 Z M75,45 h10 v20 h-10 Z M25,75 h20 v10 h-20 Z M55,75 h50 v10 h-50 Z M115,75 h25 v10 h-25 Z M75,95 h20 v30 h-10 v20 h-10 Z M105,95 h35 v15 h-20 v15 h15 v20 h-30 Z" fill="#2C3627"/>
        </svg>
      `;
    }
  }
});
