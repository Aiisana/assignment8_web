// ======== Добавление в корзину ========
function addToCart(name, price, image) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      image: image,
      quantity: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  // Визуальное уведомление
  alert(`${name} добавлен в корзину!`);
}

// ======== Модалки “Подробнее” ========
// Генерация динамических модалок для всех десертов
document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".btn-outline-dark[data-description]");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const modalTitle = document.getElementById("modalTitle");
      const modalBodyImg = document.getElementById("modalImg");
      const modalBodyText = document.getElementById("modalText");

      modalTitle.textContent = btn.dataset.title;
      modalBodyImg.src = btn.dataset.image;
      modalBodyText.textContent = btn.dataset.description;

      const modal = new bootstrap.Modal(document.getElementById("detailsModal"));
      modal.show();
    });
  });
});
