// ========================================
// PROMPT DATA MANAGEMENT
// ========================================

const promptsDataElement = document.getElementById('prompts-data');
const promptsData = JSON.parse(promptsDataElement.textContent);

// ========================================
// FILTER FUNCTIONALITY
// ========================================

const filterBtns = document.querySelectorAll('.filter-btn');
const promptCards = document.querySelectorAll('.prompt-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;

    // Update active state
    filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');

    // Filter cards
    promptCards.forEach(card => {
      const cardCategory = card.dataset.category;
      if (category === 'all' || cardCategory === category) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 200);
      }
    });
  });
});

// ========================================
// MODAL FUNCTIONALITY
// ========================================

const modal = document.getElementById('modal');
const modalOverlay = document.querySelector('.modal__overlay');
const modalClose = document.querySelector('.modal__close');
const modalCategory = document.getElementById('modal-category');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalPromptText = document.getElementById('modal-prompt-text');
const modalCopyBtn = document.getElementById('modal-copy-btn');

// Open modal on card button click
const promptCardBtns = document.querySelectorAll('.prompt-card-btn');
promptCardBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const promptId = btn.dataset.promptId;
    openModal(promptId);
  });
});

// Copy to clipboard for card copy buttons
const promptCardCopyBtns = document.querySelectorAll('.prompt-card-copy');
promptCardCopyBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const promptId = btn.dataset.promptId;
    const prompt = promptsData[promptId];
    copyToClipboard(prompt.prompt, btn);
  });
});

function openModal(promptId) {
  const prompt = promptsData[promptId];

  if (!prompt) return;

  modalCategory.textContent = prompt.category;
  modalTitle.textContent = prompt.title;
  modalDesc.textContent = prompt.desc;
  modalPromptText.textContent = prompt.prompt;

  modal.classList.add('active');
  document.body.classList.add('no-scroll');

  // Store current prompt ID for copy functionality
  modalCopyBtn.dataset.promptId = promptId;
}

function closeModal() {
  modal.classList.remove('active');
  document.body.classList.remove('no-scroll');
}

// Close modal events
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

// Modal copy button
modalCopyBtn.addEventListener('click', () => {
  const promptId = modalCopyBtn.dataset.promptId;
  const prompt = promptsData[promptId];
  copyToClipboard(prompt.prompt, modalCopyBtn);
});

// ========================================
// COPY TO CLIPBOARD
// ========================================

function copyToClipboard(text, buttonElement) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = buttonElement.textContent;
    buttonElement.textContent = '✅ コピー完了!';
    buttonElement.classList.add('copied');

    setTimeout(() => {
      buttonElement.textContent = originalText;
      buttonElement.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    const originalText = buttonElement.textContent;
    buttonElement.textContent = '✅ コピー完了!';
    buttonElement.classList.add('copied');

    setTimeout(() => {
      buttonElement.textContent = originalText;
      buttonElement.classList.remove('copied');
    }, 2000);
  });
}

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all prompt cards
promptCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(10px)';
  card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  observer.observe(card);
});

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // Skip if it's a modal trigger or filter button
    if (href === '#' || href === '#modal') {
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ========================================
// PREVENT FORM SUBMISSION IF EMAIL LINK
// ========================================

// (Already handled by mailto: links, but here for reference)

console.log('✅ Prompt Library initialized');
