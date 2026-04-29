/** Minimal JS for mock interactions */

/* =========================================
   VOCAB CARD FLIP
   ========================================= */
document.querySelectorAll('.vocab-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});

/* =========================================
   AUDIO BUTTON PLAY STATE
   ========================================= */
document.querySelectorAll('.audio-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.classList.toggle('playing');
  });
});

/* =========================================
   READING MODE TOGGLE ON READER PANEL
   ========================================= */
const readerPanel = document.querySelector('.reader-panel');
const modeBtns = document.querySelectorAll('.reader-mode-btn');
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (readerPanel) {
      if (btn.dataset.mode === 'reading') {
        readerPanel.classList.add('reading-mode');
        readerPanel.classList.remove('reading-mode-container'); // legacy cleanup
      } else {
        readerPanel.classList.remove('reading-mode');
      }
    }
  });
});

/* =========================================
   SIDEBAR TOGGLE (mobile)
   ========================================= */
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
if (menuToggle && sidebar) {
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

/* =========================================
   SIDEBAR STAGE EXPAND/COLLAPSE
   ========================================= */
document.querySelectorAll('.sidebar-stage-title').forEach(title => {
  title.addEventListener('click', () => {
    const stage = title.closest('.sidebar-stage');
    if (stage) {
      stage.classList.toggle('open');
    }
  });
});

/* =========================================
   SETTINGS SHEET
   ========================================= */
const settingsBtn = document.querySelector('.reader-settings-btn');
const settingsSheet = document.getElementById('settings-sheet');
const closeSheetBtn = document.querySelector('.sheet-close');
if (settingsBtn && settingsSheet) {
  settingsBtn.addEventListener('click', () => {
    settingsSheet.classList.add('open');
  });
}
if (closeSheetBtn && settingsSheet) {
  closeSheetBtn.addEventListener('click', () => {
    settingsSheet.classList.remove('open');
  });
}
/* Close sheet on backdrop click */
settingsSheet?.addEventListener('click', (e) => {
  if (e.target === settingsSheet) {
    settingsSheet.classList.remove('open');
  }
});

/* =========================================
   CLOZE BLANK SELECTION
   ========================================= */
document.querySelectorAll('.cloze-blank').forEach(blank => {
  blank.addEventListener('click', () => {
    document.querySelectorAll('.cloze-blank').forEach(b => b.classList.remove('chip-selected'));
    blank.classList.add('chip-selected');
  });
});

/* =========================================
   GLOBAL READING MODE TOGGLE (kitchen sink)
   ========================================= */
const globalModeToggle = document.getElementById('global-mode-toggle');
if (globalModeToggle) {
  globalModeToggle.addEventListener('change', () => {
    document.documentElement.classList.toggle('reading-mode', globalModeToggle.checked);
  });
}

/* =========================================
   FONT SWITCHER (kitchen sink)
   ========================================= */
const fontSwitcher = document.getElementById('font-switcher');
if (fontSwitcher) {
  fontSwitcher.addEventListener('change', (e) => {
    const val = e.target.value;
    document.body.classList.remove('font-serif-source', 'font-serif-news', 'font-serif-fraunces');
    document.body.classList.remove('font-sans-inter', 'font-sans-geist', 'font-sans-pretendard');
    
    const [serif, sans] = val.split(',');
    if (serif) document.body.classList.add(`font-serif-${serif}`);
    if (sans) document.body.classList.add(`font-sans-${sans}`);
  });
}

/* =========================================
   FLASHCARD KEYBOARD SUPPORT
   ========================================= */
const flashcard = document.querySelector('.flashcard-activity .vocab-card');
if (flashcard) {
  document.addEventListener('keydown', (e) => {
    // Only if we're not typing in an input
    if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
    
    if (e.code === 'Space') {
      e.preventDefault();
      flashcard.classList.toggle('flipped');
    }
    if (e.code === 'ArrowLeft') {
      e.preventDefault();
      // Simulate previous card
      showToast('← Previous card');
    }
    if (e.code === 'ArrowRight') {
      e.preventDefault();
      // Simulate next card
      showToast('Next card →');
    }
  });
}

/* =========================================
   TYPE-SIZE SLIDER WIRING
   ========================================= */
const typeSizeSlider = document.getElementById('type-size-slider');
const tokenizedProseElements = document.querySelectorAll('.tokenized-prose');
if (typeSizeSlider) {
  typeSizeSlider.addEventListener('input', (e) => {
    const size = e.target.value + 'px';
    tokenizedProseElements.forEach(el => {
      el.style.fontSize = size;
    });
  });
}

/* =========================================
   READER MODE FROM SETTINGS SHEET
   ========================================= */
const readerModeCheck = document.getElementById('reader-mode-check');
if (readerModeCheck && readerPanel) {
  readerModeCheck.addEventListener('change', () => {
    readerPanel.classList.toggle('reading-mode', readerModeCheck.checked);
    // Sync toggle buttons
    modeBtns.forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.reader-mode-btn[data-mode="${readerModeCheck.checked ? 'reading' : 'default'}"]`);
    if (activeBtn) activeBtn.classList.add('active');
  });
}

/* =========================================
   TOAST HELPER
   ========================================= */
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1100);
}
