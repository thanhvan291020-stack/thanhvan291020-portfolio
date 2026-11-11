const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('siteNav');
const audioToggle = document.getElementById('audioToggle');
const motionToggle = document.getElementById('motionToggle');
const copyButton = document.querySelector('.copy-email');
const yearNode = document.getElementById('year');
const revealNodes = document.querySelectorAll('.reveal');

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const setNavState = () => {
  if (!siteNav || !navToggle) return;
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  siteNav.classList.toggle('is-open', expanded);
};

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('is-open', !expanded);
    document.body.classList.toggle('no-scroll', !expanded && window.innerWidth <= 700);
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && siteNav.classList.contains('is-open')) {
      navToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      navToggle.focus();
    }
  });
}

const setAudioButton = () => {
  if (!audioToggle) return;
  audioToggle.textContent = AudioController.enabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt';
  audioToggle.setAttribute('aria-pressed', String(AudioController.enabled));
};

const setMotionButton = () => {
  if (!motionToggle) return;
  const active = StarField.motionPaused;
  motionToggle.textContent = active ? 'Tiếp tục sao' : 'Tạm dừng sao';
  motionToggle.setAttribute('aria-pressed', String(active));
  document.body.classList.toggle('motion-paused', active);
};

if (audioToggle) {
  audioToggle.addEventListener('click', () => {
    AudioController.setEnabled(!AudioController.enabled);
    setAudioButton();
    if (AudioController.enabled) {
      AudioController.ensureContext();
    }
  });
}

if (motionToggle) {
  motionToggle.addEventListener('click', () => {
    StarField.setMotionPaused(!StarField.motionPaused);
    setMotionButton();
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.16 });

revealNodes.forEach((node) => observer.observe(node));

if (copyButton) {
  const emailLink = document.querySelector('.email-link');
  const fallbackSelectEmail = () => {
    if (!emailLink) return;
    const range = document.createRange();
    range.selectNodeContents(emailLink);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    emailLink.focus();
    copyButton.textContent = 'Chọn rồi nhấn Ctrl/Cmd + C';
    setTimeout(() => {
      copyButton.textContent = 'Sao chép email';
    }, 1800);
  };

  copyButton.addEventListener('click', async () => {
    const email = 'thanhvan291020@gmail.com';
    try {
      if (!navigator.clipboard || !window.isSecureContext) {
        throw new Error('Clipboard unavailable');
      }
      await navigator.clipboard.writeText(email);
      copyButton.textContent = 'Đã sao chép';
      setTimeout(() => {
        copyButton.textContent = 'Sao chép email';
      }, 1200);
    } catch (error) {
      fallbackSelectEmail();
    }
  });
}

const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
if (mediaQuery.matches) {
  StarField.setMotionPaused(true);
}

setAudioButton();
setMotionButton();
setNavState();
window.addEventListener('resize', () => {
  if (window.innerWidth > 700) {
    document.body.classList.remove('no-scroll');
    siteNav?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
});
