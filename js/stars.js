const StarField = {
  field: document.getElementById('starField'),
  motionPaused: false,
  stars: [],

  init() {
    if (!this.field) return;

    const count = window.innerWidth <= 700 ? 6 : 10;
    this.field.innerHTML = '';
    this.stars = [];

    for (let i = 0; i < count; i += 1) {
      const star = this.createStar(i, count);
      this.field.appendChild(star);
      this.stars.push(star);
    }

    this.bindInteraction();
    this.applyMotionState();
  },

  createStar(index, total) {
    const star = document.createElement('button');
    star.type = 'button';
    star.className = 'star-point';
    star.setAttribute('aria-label', `Ngôi sao tương tác ${index + 1}`);

    const shapeId = index % 3;
    const size = 32 + ((index * 7) % 18);
    const left = 8 + (index * 13 % 78);
    const top = 8 + ((index * 17) % 72);

    star.style.setProperty('--size', `${size}px`);
    star.style.setProperty('--x', `${left}%`);
    star.style.setProperty('--y', `${top}%`);
    star.style.setProperty('--duration', `${11 + (index % 5) * 2.2}s`);
    star.style.setProperty('--delay', `${(index / total) * 2.2}s`);
    star.style.setProperty('--rotate', `${(index * 22) % 180}deg`);

    star.innerHTML = this.renderShape(shapeId);
    return star;
  },

  renderShape(shapeId) {
    if (shapeId === 0) {
      return `
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path class="star-body outline" d="M32 8l7 18 18 7-18 7-7 18-7-18-18-7 18-7 7-18z" />
          <path class="star-body" d="M32 16l5 13 13 5-13 5-5 13-5-13-13-5 13-5 5-13z" />
        </svg>
      `;
    }

    if (shapeId === 1) {
      return `
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path class="star-body outline" d="M32 9l7 18 18 7-18 7-7 18-7-18-18-7 18-7 7-18z" transform="rotate(45 32 32)"/>
          <path class="star-body" d="M32 15l5 12 12 5-12 5-5 12-5-12-12-5 12-5 5-12z" transform="rotate(45 32 32)"/>
        </svg>
      `;
    }

    return `
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path class="star-body outline" d="M32 8l6 18 18 6-18 6-6 18-6-18-18-6 18-6 6-18z"/>
        <path class="star-body" d="M32 14l4 12 12 4-12 4-4 12-4-12-12-4 12-4 4-12z"/>
      </svg>
    `;
  },

  bindInteraction() {
    this.stars.forEach((star) => {
      const trigger = () => {
        star.classList.remove('is-active');
        void star.offsetWidth;
        star.classList.add('is-active');
        setTimeout(() => star.classList.remove('is-active'), 440);
        AudioController.playTone();
      };

      star.addEventListener('mouseenter', () => {
        if (this.motionPaused) return;
        star.classList.add('motion-paused');
      });

      star.addEventListener('mouseleave', () => {
        star.classList.remove('motion-paused');
      });

      star.addEventListener('focus', () => {
        star.classList.add('motion-paused');
      });

      star.addEventListener('blur', () => {
        star.classList.remove('motion-paused');
      });

      star.addEventListener('click', trigger);
      star.addEventListener('pointerdown', () => {
        star.classList.add('motion-paused');
      });
      star.addEventListener('pointerup', () => {
        star.classList.remove('motion-paused');
      });
    });
  },

  applyMotionState() {
    this.stars.forEach((star) => {
      star.classList.toggle('motion-paused', this.motionPaused);
    });
  },

  setMotionPaused(value) {
    this.motionPaused = Boolean(value);
    this.applyMotionState();
  }
};

window.addEventListener('DOMContentLoaded', () => {
  StarField.init();
  const onResize = () => StarField.init();
  window.addEventListener('resize', onResize);
});
