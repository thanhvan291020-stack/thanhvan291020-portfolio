const toolMap = {
  gear: {
    name: 'Bánh răng',
    description: 'Dụng cụ quen thuộc trong máy móc và quy trình sản xuất cơ khí.'
  },
  caliper: {
    name: 'Thước cặp',
    description: 'Dụng cụ đo quen thuộc trong công việc kiểm tra kích thước chi tiết.'
  },
  micrometer: {
    name: 'Panme',
    description: 'Dụng cụ phục vụ đo kích thước trong công việc QC cơ khí.'
  },
  fastener: {
    name: 'Bu lông & đai ốc',
    description: 'Chi tiết quan trọng trong lắp ráp và kiểm tra độ tin cậy của sản phẩm.'
  },
  part: {
    name: 'Chi tiết cơ khí',
    description: 'Các bộ phận cơ khí cần được kiểm tra độ chính xác và độ bền.'
  },
  drawing: {
    name: 'Bản vẽ kỹ thuật',
    description: 'Thông tin tham chiếu để đối chiếu các yêu cầu của chi tiết.'
  },
  magnifier: {
    name: 'Kính lúp kiểm tra',
    description: 'Dụng cụ giúp quan sát chi tiết và phát hiện sai lệch nhỏ trong gia công.'
  },
  check: {
    name: 'Dấu kiểm',
    description: 'Sự chỉn chu bắt đầu từ việc kiểm tra từng chi tiết.'
  }
};

const toolItems = [...document.querySelectorAll('.tool-item')];
const selectedToolLabel = document.getElementById('selectedTool');
const selectedDescription = document.getElementById('selectedDescription');
const toggleAudioButton = document.getElementById('toggleAudio');
const toggleMotionButton = document.getElementById('toggleMotion');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');

let audioEnabled = false;
let audioContext = null;
let lastSoundAt = 0;
let motionPaused = false;

function setInteractionPause(active) {
  document.body.classList.toggle('interaction-paused', active);
}

function applySelection(key) {
  toolItems.forEach((button) => {
    const isActive = button.dataset.key === key;
    button.classList.toggle('is-active', isActive);
    if (isActive) {
      button.setAttribute('aria-pressed', 'true');
    } else {
      button.setAttribute('aria-pressed', 'false');
    }
  });

  const item = toolMap[key];
  if (!item) return;
  selectedToolLabel.textContent = item.name;
  selectedDescription.textContent = item.description;
}

function ensureAudioContext() {
  if (!audioEnabled || !window.AudioContext && !window.webkitAudioContext) {
    return null;
  }

  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!audioContext) {
    audioContext = new AudioCtor();
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  return audioContext;
}

function playInteractionSound() {
  if (!audioEnabled) return;

  const now = Date.now();
  if (now - lastSoundAt < 180) return;
  lastSoundAt = now;

  const context = ensureAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const nowTime = context.currentTime;

  const tones = [420, 540, 610];
  const pitch = tones[Math.floor(Math.random() * tones.length)];

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(pitch, nowTime);
  oscillator.frequency.exponentialRampToValueAtTime(pitch * 1.18, nowTime + 0.08);

  gainNode.gain.setValueAtTime(0.0001, nowTime);
  gainNode.gain.linearRampToValueAtTime(0.06, nowTime + 0.025);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, nowTime + 0.18);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(nowTime);
  oscillator.stop(nowTime + 0.18);
}

function setAudioLabel() {
  toggleAudioButton.textContent = audioEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt';
  toggleAudioButton.setAttribute('aria-pressed', String(audioEnabled));
}

function setMotionLabel() {
  toggleMotionButton.textContent = motionPaused ? 'Tiếp tục chuyển động' : 'Tạm dừng chuyển động';
  toggleMotionButton.setAttribute('aria-pressed', String(motionPaused));
  document.body.classList.toggle('motion-paused', motionPaused);
}

function toggleAudio() {
  audioEnabled = !audioEnabled;
  if (audioEnabled) {
    ensureAudioContext();
  }
  setAudioLabel();
}

function toggleMotion() {
  motionPaused = !motionPaused;
  setMotionLabel();
}

function bindToolInteractions() {
  toolItems.forEach((button) => {
    const key = button.dataset.key;

    button.addEventListener('mouseenter', () => {
      applySelection(key);
      setInteractionPause(true);
    });

    button.addEventListener('mouseleave', () => {
      setInteractionPause(false);
    });

    button.addEventListener('focus', () => {
      applySelection(key);
      setInteractionPause(true);
    });

    button.addEventListener('blur', () => {
      setInteractionPause(false);
    });

    button.addEventListener('pointerdown', () => {
      setInteractionPause(true);
    });

    button.addEventListener('pointerup', () => {
      setInteractionPause(false);
    });

    button.addEventListener('click', (event) => {
      event.preventDefault();
      applySelection(key);
      if (audioEnabled) {
        playInteractionSound();
      }
      button.classList.remove('is-active');
      requestAnimationFrame(() => button.classList.add('is-active'));
    });
  });
}

function setMobileState() {
  const isMobile = window.innerWidth <= 700;
  document.body.classList.toggle('is-mobile', isMobile);
}

function bindNavigation() {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initReducedMotion() {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (media.matches) {
    motionPaused = true;
    setMotionLabel();
  }
}

function init() {
  applySelection('caliper');
  setAudioLabel();
  setMotionLabel();
  bindToolInteractions();
  bindNavigation();
  initReducedMotion();
  setMobileState();

  toggleAudioButton.addEventListener('click', toggleAudio);
  toggleMotionButton.addEventListener('click', toggleMotion);
  window.addEventListener('resize', setMobileState);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      setInteractionPause(false);
      document.body.classList.add('motion-paused');
    } else if (!motionPaused) {
      document.body.classList.remove('motion-paused');
    }
  });
}

init();
