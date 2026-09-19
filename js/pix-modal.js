/**
 * GERENCIADOR DA LISTA DE PRESENTES & MODAL PIX COM QR CODE DINÂMICO
 * Casamento Eluisa & Gabriel — Chave PIX: 83987009529 (+5583987009529)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Configuração Oficial do PIX (Padrão Banco Central do Brasil - BACEN)
  const PIX_CONFIG = {
    key: '83987009529',
    formattedKey: '(83) 98700-9529',
    name: 'ELUISA E GABRIEL',
    city: 'RIO TINTO',
    whatsappNumber: '5583989146965' // WhatsApp para envio de comprovantes / mensagens
  };

  // Elementos do Modal
  const modal = document.getElementById('pix-modal');
  const modalClose = document.getElementById('pix-modal-close');
  const pixItemTitle = document.getElementById('pix-item-title');
  const pixItemValue = document.getElementById('pix-item-value');
  const pixItemDesc = document.getElementById('pix-item-desc');
  const pixKeyText = document.getElementById('pix-key-text');
  const pixCodeText = document.getElementById('pix-copia-cola-text');
  const btnCopyPixKey = document.getElementById('btn-copy-pix-key');
  const btnCopyPixCode = document.getElementById('btn-copy-pix-code');
  const btnSendWhatsApp = document.getElementById('btn-pix-whatsapp');
  const qrContainer = document.getElementById('pix-modal-qrcode');

  // Elementos do Card Fixo
  const fixedQrContainer = document.getElementById('fixed-pix-qrcode');
  const fixedKeyDisplay = document.getElementById('fixed-pix-key-display');
  const btnCopyFixedKey = document.getElementById('btn-copy-fixed-key');
  const btnFixedCustomGift = document.getElementById('btn-fixed-custom-gift');

  // 1. GERAÇÃO DE PAYLOAD PIX PADRÃO OFICIAL BACEN (EMV COM CRC16-CCITT)
  function formatEMV(id, value) {
    const len = String(value.length).padStart(2, '0');
    return `${id}${len}${value}`;
  }

  function computeCRC16(payload) {
    let polinomio = 0x1021;
    let resultado = 0xFFFF;

    for (let i = 0; i < payload.length; i++) {
      resultado ^= (payload.charCodeAt(i) << 8);
      for (let bitwise = 0; bitwise < 8; bitwise++) {
        if ((resultado <<= 1) & 0x10000) {
          resultado ^= polinomio;
        }
        resultado &= 0xFFFF;
      }
    }
    return resultado.toString(16).toUpperCase().padStart(4, '0');
  }

  function generatePixPayload(key, name, city, amount, txid = '***') {
    let cleanKey = String(key).trim();
    // No padrão BACEN, chave de telefone/celular DEVE conter o prefixo internacional +55
    const digitsOnly = cleanKey.replace(/\D/g, '');
    if ((digitsOnly.length === 10 || digitsOnly.length === 11) && !cleanKey.startsWith('+')) {
      cleanKey = '+55' + digitsOnly;
    }

    const cleanName = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, '')
      .trim()
      .substring(0, 25);

    const cleanCity = city
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, '')
      .trim()
      .substring(0, 15);
    
    // Tag 26 - Merchant Account Information (PIX)
    // 00: br.gov.bcb.pix (obrigatório em letras minúsculas pelo Bacen)
    // 01: chave pix com +55
    const mai = formatEMV('00', 'br.gov.bcb.pix') + formatEMV('01', cleanKey);
    const tag26 = formatEMV('26', mai);

    // Estrutura Base BACEN
    let payload = 
      formatEMV('00', '01') + // Payload Format Indicator
      tag26 +
      formatEMV('52', '0000') + // Merchant Category Code
      formatEMV('53', '986');   // Currency Code (986 = BRL)

    // Valor da Transação (Tag 54) - Apenas se > 0
    if (amount && Number(amount) > 0) {
      payload += formatEMV('54', Number(amount).toFixed(2));
    }

    payload += 
      formatEMV('58', 'BR') + // Country Code
      formatEMV('59', cleanName) + // Merchant Name
      formatEMV('60', cleanCity);  // Merchant City

    // Tag 62 - Additional Data Field Template (TxID)
    const cleanTxId = (txid || '***').substring(0, 25);
    payload += formatEMV('62', formatEMV('05', cleanTxId));

    // Tag 63 - CRC16
    const payloadWithCRCId = payload + '6304';
    const crc = computeCRC16(payloadWithCRCId);
    return payloadWithCRCId + crc;
  }

  // 2. RENDERIZADOR DE QR CODE EM ALTA DEFINIÇÃO E MÁXIMO CONTRASTE
  function renderQRCode(container, text, size = 190) {
    if (!container) return;
    container.innerHTML = '';

    if (typeof QRCode !== 'undefined') {
      try {
        new QRCode(container, {
          text: text,
          width: size,
          height: size,
          colorDark: '#000000',
          colorLight: '#FFFFFF',
          correctLevel: QRCode.CorrectLevel.M
        });

        // Garante que o canvas ou imagem fiquem limpos e proporcionais
        setTimeout(() => {
          const img = container.querySelector('img');
          const canvas = container.querySelector('canvas');
          if (img && canvas) {
            canvas.style.display = 'none';
            img.style.display = 'block';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
          } else if (canvas) {
            canvas.style.display = 'block';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
          }
        }, 30);
        return;
      } catch (err) {
        console.warn('QRCode library error, using fallback:', err);
      }
    }

    // Fallback garantido via imagem de alta resolução
    renderFallbackQR(container, text, size);
  }

  function renderFallbackQR(container, text, size = 190) {
    const qrImg = document.createElement('img');
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(text)}&color=000000&bgcolor=FFFFFF`;
    qrImg.alt = 'QR Code PIX';
    qrImg.style.width = '100%';
    qrImg.style.height = '100%';
    qrImg.style.objectFit = 'contain';
    qrImg.style.borderRadius = '8px';
    container.appendChild(qrImg);
  }

  // 3. INICIALIZA QR CODE FIXO NO CARD PRINCIPAL
  const fixedPayload = generatePixPayload(PIX_CONFIG.key, PIX_CONFIG.name, PIX_CONFIG.city, 0);
  if (fixedQrContainer) {
    renderQRCode(fixedQrContainer, fixedPayload, 200);
  }
  if (fixedKeyDisplay) {
    fixedKeyDisplay.textContent = PIX_CONFIG.formattedKey;
  }

  // 4. COPIAR CHAVE FIXA & CÓDIGO FIXO
  if (btnCopyFixedKey) {
    btnCopyFixedKey.addEventListener('click', () => {
      copyToClipboard(PIX_CONFIG.key, 'Chave PIX (Celular) copiada com sucesso! ✨');
      triggerConfetti();
    });
  }

  const btnCopyFixedPayload = document.getElementById('btn-copy-fixed-payload');
  if (btnCopyFixedPayload) {
    btnCopyFixedPayload.addEventListener('click', () => {
      copyToClipboard(fixedPayload, 'Código Pix Copia e Cola copiado! Cole no app do seu banco. ✨');
      triggerConfetti();
    });
  }

  // 5. DINÂMICA: BOTÕES DA LISTA DE PRESENTES
  let currentGiftData = {
    title: 'Cota de Casamento',
    value: 0,
    formattedValue: 'Qualquer Valor',
    desc: 'Contribuição com muito amor para os noivos.'
  };

  function openGiftModal(title, valueNum, formattedVal, desc) {
    currentGiftData = {
      title: title || 'Cota de Casamento',
      value: valueNum || 0,
      formattedValue: formattedVal || 'Qualquer valor',
      desc: desc || 'Sua bênção e carinho para nossa nova vida.'
    };

    if (pixItemTitle) pixItemTitle.textContent = currentGiftData.title;
    if (pixItemValue) pixItemValue.textContent = currentGiftData.formattedValue;
    if (pixItemDesc) pixItemDesc.textContent = currentGiftData.desc;
    if (pixKeyText) pixKeyText.textContent = PIX_CONFIG.key;

    // Gera payload específico com o valor padrão BACEN
    const payload = generatePixPayload(
      PIX_CONFIG.key,
      PIX_CONFIG.name,
      PIX_CONFIG.city,
      currentGiftData.value
    );

    if (pixCodeText) {
      pixCodeText.value = payload;
    }

    if (qrContainer) {
      renderQRCode(qrContainer, payload, 190);
    }

    // Configura link do WhatsApp com padrão universal wa.me para compatibilidade total com iOS / Apple e Android
    if (btnSendWhatsApp) {
      const waMsg = 
        `💍 *PRESENTE DE CASAMENTO — ELUISA & GABRIEL*\n` +
        `🎁 *Item Escolhido:* ${currentGiftData.title}\n` +
        `💰 *Valor:* ${currentGiftData.formattedValue}\n` +
        `✨ *Chave PIX:* ${PIX_CONFIG.key}\n\n` +
        `Acabei de enviar meu presente com muito carinho para abençoar a união de vocês! Muitas felicidades! 🥂❤️`;
      
      const waUrl = `https://wa.me/${PIX_CONFIG.whatsappNumber}?text=${encodeURIComponent(waMsg)}`;
      btnSendWhatsApp.href = waUrl;
      btnSendWhatsApp.setAttribute('target', '_blank');
      btnSendWhatsApp.setAttribute('rel', 'noopener noreferrer');
    }

    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    triggerConfetti();
  }

  // Listener direto no botão WhatsApp para garantir abertura em dispositivos Apple
  if (btnSendWhatsApp) {
    btnSendWhatsApp.addEventListener('click', (e) => {
      const isApple = /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
      const url = btnSendWhatsApp.getAttribute('href');
      if (isApple && url && url !== '#') {
        window.location.href = url;
      }
    });
  }

  // Evento em todos os botões de presente
  document.querySelectorAll('.btn-gift-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-gift-title');
      const valNum = parseFloat(btn.getAttribute('data-gift-val-num') || '0');
      const valText = btn.getAttribute('data-gift-value');
      const desc = btn.getAttribute('data-gift-desc');
      openGiftModal(title, valNum, valText, desc);
    });
  });

  // Botão no Card Fixo para Valor Personalizado
  if (btnFixedCustomGift) {
    btnFixedCustomGift.addEventListener('click', (e) => {
      e.preventDefault();
      const customSection = document.getElementById('custom-gift-calculator');
      if (customSection) {
        customSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = document.getElementById('custom-amount-input');
        if (input) {
          input.focus();
          input.classList.add('pulse-highlight');
          setTimeout(() => input.classList.remove('pulse-highlight'), 1500);
        }
      } else {
        openGiftModal('Cota Livre de Casamento', 0, 'Qualquer Valor', 'Contribua com o valor que seu coração desejar!');
      }
    });
  }

  // 6. DINÂMICA: CALCULADORA / SIMULADOR DE VALOR LIVRE
  const customInput = document.getElementById('custom-amount-input');
  const btnCustomSubmit = document.getElementById('btn-submit-custom-gift');
  const quickAmountBtns = document.querySelectorAll('.btn-quick-amount');

  if (quickAmountBtns.length > 0) {
    quickAmountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        quickAmountBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const amount = btn.getAttribute('data-amount');
        if (customInput) {
          customInput.value = amount;
        }
      });
    });
  }

  if (btnCustomSubmit) {
    btnCustomSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      let rawVal = customInput ? customInput.value.replace(',', '.') : '50';
      let numVal = parseFloat(rawVal);
      if (isNaN(numVal) || numVal <= 0) {
        numVal = 50;
      }
      const formatted = `R$ ${numVal.toFixed(2).replace('.', ',')}`;
      openGiftModal('Cota Especial Personalizada', numVal, formatted, 'Presente personalizado escolhido com todo o carinho!');
    });
  }

  // 7. FECHAR MODAL
  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // 8. COPIAR DADOS DENTRO DO MODAL
  if (btnCopyPixKey) {
    btnCopyPixKey.addEventListener('click', () => {
      copyToClipboard(PIX_CONFIG.key, 'Chave PIX (Celular) copiada com sucesso!');
      triggerConfetti();
    });
  }

  if (btnCopyPixCode) {
    btnCopyPixCode.addEventListener('click', () => {
      const code = pixCodeText ? pixCodeText.value : '';
      if (code) {
        copyToClipboard(code, 'Código Pix Copia e Cola copiado! Cole no app do seu banco.');
        triggerConfetti();
      }
    });
  }

  // 9. DINÂMICA: FILTROS DE CATEGORIA
  const filterPills = document.querySelectorAll('.gift-filter-pill');
  const giftCards = document.querySelectorAll('.gift-card[data-category]');

  if (filterPills.length > 0) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const category = pill.getAttribute('data-filter');

        giftCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
            card.style.animation = 'fadeInUp 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 10. UTILITÁRIOS: CLIPBOARD & CONFETTI
  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const temp = document.createElement('textarea');
    temp.value = text;
    temp.style.position = 'fixed';
    temp.style.opacity = '0';
    document.body.appendChild(temp);
    temp.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (err) {
      showToast('Chave PIX: ' + text);
    }
    document.body.removeChild(temp);
  }

  function triggerConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#E8C87A', '#4D5D43', '#FFFFFF', '#FAF7F2']
      });
    }
  }
});
