// =========================================================
// 🧁 Maison Douce — Корзина и оплата
// ---------------------------------------------------------
// В этом файле:
//  1. Управление корзиной (добавление, изменение, удаление)
//  2. Сохранение в localStorage
//  3. Рендеринг корзины на странице
//  4. Реактивная валидация формы оплаты
//  5. Всплывающие уведомления (Bootstrap Toast)
// =========================================================


document.addEventListener('DOMContentLoaded', () => {

  // =====================================================
  // 🔸 1. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  // =====================================================

  const STORAGE_KEY = 'cart';

  // Получение и сохранение корзины
  function loadCart() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  // Уведомления (Bootstrap Toast)
  function showToast(message, type = 'success') {
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


  // =====================================================
  // 🍬 2. ЛОГИКА КОРЗИНЫ
  // =====================================================

  let cart = loadCart();

  const cartContainer = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');

  // --- Отрисовка корзины ---
  function renderCart() {
    if (!cartContainer || !cartTotalEl) return;

    cartContainer.innerHTML = '';
    let total = 0;

    // Пустая корзина
    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <p class="text-center text-muted py-5">Ваша корзина пуста.</p>
      `;
      cartTotalEl.textContent = '₸0';
      return;
    }

    // Перебор всех товаров
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      cartContainer.innerHTML += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-info">
            <h5>${item.name}</h5>
            <p class="text-muted mb-0">₸${item.price} / шт</p>
          </div>
          <div class="cart-controls">
            <button class="btn btn-outline-dark btn-sm" onclick="changeQuantity(${index}, -1)">−</button>
            <input type="number" min="1" value="${item.quantity}" onchange="manualChange(${index}, this.value)">
            <button class="btn btn-outline-dark btn-sm" onclick="changeQuantity(${index}, 1)">+</button>
            <strong>₸${itemTotal}</strong>
            <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${index})">✖</button>
          </div>
        </div>
      `;
    });

    cartTotalEl.textContent = '₸' + total.toLocaleString();
  }

  // --- Изменение количества товара ---
  window.changeQuantity = function (index, delta) {
    cart[index].quantity = Math.max(1, cart[index].quantity + delta);
    saveCart(cart);
    renderCart();
  };

  // --- Ручной ввод количества ---
  window.manualChange = function (index, value) {
    cart[index].quantity = Math.max(1, parseInt(value));
    saveCart(cart);
    renderCart();
  };

  // --- Удаление товара ---
  window.removeItem = function (index) {
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
    showToast('Товар удалён из корзины', 'danger');
  };

  // --- Очистка корзины ---
  function clearCart() {
    cart = [];
    saveCart(cart);
    renderCart();
  }

  // --- Добавление товара из меню ---
  window.addToCart = function (name, price, image) {
    const existing = cart.find(item => item.name === name);

    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }

    saveCart(cart);
    renderCart();
    showToast(`${name} добавлен в корзину!`, 'success');
  };


  // =====================================================
  // 💳 3. ВАЛИДАЦИЯ ФОРМЫ ОПЛАТЫ
  // =====================================================

  const paymentForm = document.getElementById('paymentForm');

  if (paymentForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const cardInput = document.getElementById('cardNumber');
    const expInput = document.getElementById('expDate');
    const cvvInput = document.getElementById('cvv');
    const submitBtn = paymentForm.querySelector('button[type="submit"]');

    // ---- Подсветка и текст ошибок ----
    function setValidation(input, valid, message = '') {
      input.classList.toggle('is-valid', valid);
      input.classList.toggle('is-invalid', !valid);

      let fb = input.parentElement.querySelector('.invalid-feedback');
      if (!fb) {
        fb = document.createElement('div');
        fb.className = 'invalid-feedback';
        input.parentElement.appendChild(fb);
      }
      fb.textContent = valid ? '' : message;
    }

    // ---- Проверки ----
    function validateName() {
      const ok = nameInput.value.trim().length >= 3;
      setValidation(nameInput, ok, 'Введите имя и фамилию (минимум 3 символа)');
      return ok;
    }

    function validateEmail() {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
      setValidation(emailInput, ok, 'Введите корректный email');
      return ok;
    }

    function validateCard() {
      const val = cardInput.value.replace(/\s+/g, '');
      const ok = /^\d{16}$/.test(val);
      setValidation(cardInput, ok, 'Введите 16 цифр номера карты');
      return ok;
    }

    function validateExp() {
      const ok = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expInput.value.trim());
      setValidation(expInput, ok, 'Введите срок действия в формате MM/YY');
      return ok;
    }

    function validateCVV() {
      const ok = /^\d{3}$/.test(cvvInput.value.trim());
      setValidation(cvvInput, ok, 'Введите 3 цифры CVV');
      return ok;
    }

    function validateForm() {
      const valid =
        validateName() &&
        validateEmail() &&
        validateCard() &&
        validateExp() &&
        validateCVV();

      submitBtn.disabled = !valid;
      return valid;
    }

    // ---- Форматирование полей ----
    cardInput.addEventListener('input', function () {
      const digits = this.value.replace(/\D/g, '').slice(0, 16);
      const parts = digits.match(/.{1,4}/g);
      this.value = parts ? parts.join(' ') : digits;
      validateForm();
    });

    expInput.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '').slice(0, 4);
      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
      this.value = v;
      validateForm();
    });

    cvvInput.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '').slice(0, 3);
      validateForm();
    });

    nameInput.addEventListener('input', validateForm);
    emailInput.addEventListener('input', validateForm);

    // ---- Отправка формы ----
    paymentForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm()) {
        showToast('Пожалуйста, заполните все поля корректно.', 'danger');
        return;
      }

      showToast('Спасибо за покупку! Ваш заказ оформлен.', 'success');
      clearCart();

      // Закрыть модал
      const modalEl = document.getElementById('paymentModal');
      if (modalEl) {
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();
      }

      paymentForm.reset();
      submitBtn.disabled = true;
      [nameInput, emailInput, cardInput, expInput, cvvInput].forEach(i =>
        i.classList.remove('is-valid')
      );
    });
  }


  // =====================================================
  // 🧾 4. ИНИЦИАЛИЗАЦИЯ
  // =====================================================

  renderCart(); // первичный рендер при загрузке

  // Экспортируем функции (на случай, если нужно вызвать извне)
  window.cartModule = {
    renderCart,
    addToCart,
    clearCart
  };
});
