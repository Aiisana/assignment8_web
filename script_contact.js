AOS.init({ duration: 800, once: true });

// ===== Карта с несколькими филиалами =====
document.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map').setView([48.8566, 2.3522], 2); // начальный зум

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const locations = [
    { city: 'Париж', coords: [48.8686, 2.3319], text: 'Maison Douce — Rue Saint-Honoré 12' },
    { city: 'Алматы', coords: [43.2389, 76.8897], text: 'Maison Douce — Абылай Хана 45' },
    { city: 'Токио', coords: [35.6673, 139.7089], text: 'Maison Douce — Omotesando Hills 3F' }
  ];

  locations.forEach(loc => {
    L.marker(loc.coords).addTo(map).bindPopup(`<b>${loc.city}</b><br>${loc.text}`);
  });
});

// ===== Валидация формы =====
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  let valid = true;

  if (name.value.trim().length < 2) {
    name.classList.add('is-invalid');
    valid = false;
  } else {
    name.classList.remove('is-invalid');
    name.classList.add('is-valid');
  }

  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email.value.trim())) {
    email.classList.add('is-invalid');
    valid = false;
  } else {
    email.classList.remove('is-invalid');
    email.classList.add('is-valid');
  }

  if (message.value.trim().length < 10) {
    message.classList.add('is-invalid');
    valid = false;
  } else {
    message.classList.remove('is-invalid');
    message.classList.add('is-valid');
  }

  if (valid) {
    showToast('Спасибо, ваше сообщение отправлено!', 'success');
    this.reset();
    name.classList.remove('is-valid');
    email.classList.remove('is-valid');
    message.classList.remove('is-valid');
  }
});

// ===== Toast (всплывающее сообщение) =====
function showToast(message, type) {
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-white bg-${type} border-0 position-fixed bottom-0 end-0 m-4`;
  toast.style.zIndex = '2000';
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  document.body.appendChild(toast);
  const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
  bsToast.show();
  toast.addEventListener('hidden.bs.toast', () => toast.remove());
}
