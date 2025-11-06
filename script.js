// ===== Проверка email при подписке (своё сообщение) =====
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".subscribe-section form");
  const emailInput = form.querySelector("input[type='email']");
  const errorMsg = document.getElementById("emailError");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // отменяем стандартное поведение
    errorMsg.textContent = ""; // очищаем прошлое сообщение

    const emailValue = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === "") {
      errorMsg.textContent = "❗ Пожалуйста, введите адрес электронной почты.";
      emailInput.classList.add("is-invalid");
    } else if (!emailPattern.test(emailValue)) {
      errorMsg.textContent = "⚠️ Введите корректный email, например: name@gmail.com.";
      emailInput.classList.add("is-invalid");
    } else {
      emailInput.classList.remove("is-invalid");
      errorMsg.style.color = "green";
      errorMsg.textContent = "✅ Спасибо за подписку на Maison Douce!";
      form.reset();
    }
  });
});
