// Инициализация AOS (анимации при скролле)
AOS.init({
  duration: 800,
  once: true
});

// Анимация чисел
function animateValue(id, start, end, duration) {
  const obj = document.getElementById(id);
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    obj.innerText = Math.floor(progress * (end - start) + start);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', () => {
  animateValue("years", 0, 39, 1500);
  animateValue("countries", 0, 18, 1800);
  animateValue("chefs", 0, 400, 2000);
});

// ===== Смена фоновых видео =====
document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('.hero-video');
  let index = 0;

  setInterval(() => {
    videos[index].classList.remove('active');
    index = (index + 1) % videos.length;
    videos[index].classList.add('active');
  }, 8000); // смена каждые 8 секунд
});
