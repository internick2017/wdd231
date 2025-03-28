document.addEventListener("DOMContentLoaded", function () {
  const now = new Date();
  document.getElementById("timestamp").value = now.toISOString();
  setupModals();
  setupFormValidation();
});

function setupModals() {
  const modals = document.querySelectorAll(".modal");
  const infoLinks = document.querySelectorAll(".info-link");
  const closeButtons = document.querySelectorAll(".close-modal");

  infoLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const modalId = this.getAttribute("data-modal");
      document.getElementById(modalId).style.display = "block";
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal");
      modal.style.display = "none";
    });
  });

  window.addEventListener("click", function (e) {
    modals.forEach((modal) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });
}

function setupFormValidation() {
  const form = document.querySelector("form");
  const errorContainer = document.createElement("div");
  errorContainer.classList.add("form-error-container");
  form.appendChild(errorContainer);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const errors = [];
    errorContainer.innerHTML = "";
    errorContainer.classList.remove("active");

    const firstName = form.querySelector("input[name='first-name']");
    const lastName = form.querySelector("input[name='last-name']");
    const position = form.querySelector("input[name='position']");
    const email = form.querySelector("input[name='email']");
    const phone = form.querySelector("input[name='phone']");
    const businessName = form.querySelector("input[name='business-name']");

    removeErrorStyles([
      firstName,
      lastName,
      position,
      email,
      phone,
      businessName,
    ]);

    if (!firstName.value.trim()) {
      addError(firstName, "First name is required");
      errors.push("First name is required");
    }

    if (!lastName.value.trim()) {
      addError(lastName, "Last name is required");
      errors.push("Last name is required");
    }

    if (
      position.value.trim() &&
      !/^[a-zA-Z\s\-]{7,}$/.test(position.value.trim())
    ) {
      addError(
        position,
        "Position must be at least 7 characters with only letters, spaces, and hyphens"
      );
      errors.push(
        "Position must be at least 7 characters with only letters, spaces, and hyphens"
      );
    }

    if (!email.value.trim()) {
      addError(email, "Email is required");
      errors.push("Email is required");
    } else if (!isValidEmail(email.value.trim())) {
      addError(email, "Please enter a valid email address");
      errors.push("Please enter a valid email address");
    }

    if (!phone.value.trim()) {
      addError(phone, "Phone number is required");
      errors.push("Phone number is required");
    } else if (!isValidPhone(phone.value.trim())) {
      addError(phone, "Please enter a valid phone number");
      errors.push("Please enter a valid phone number");
    }

    if (!businessName.value.trim()) {
      addError(businessName, "Business name is required");
      errors.push("Business name is required");
    }

    if (errors.length > 0) {
      showErrors(errors, errorContainer);
    } else {
      form.submit();
    }
  });
}

function addError(element, message) {
  element.classList.add("error-input");
  const errorMessage = document.createElement("span");
  errorMessage.classList.add("error-message");
  errorMessage.textContent = message;
  element.parentNode.appendChild(errorMessage);
}

function removeErrorStyles(elements) {
  elements.forEach((element) => {
    if (element) {
      element.classList.remove("error-input");
      const errorMessages =
        element.parentNode.querySelectorAll(".error-message");
      errorMessages.forEach((msg) => msg.remove());
    }
  });
}

function showErrors(errors, container) {
  container.classList.add("active");
  const heading = document.createElement("h4");
  heading.textContent = "Please correct the following errors:";
  container.appendChild(heading);

  const list = document.createElement("ul");
  errors.forEach((error) => {
    const item = document.createElement("li");
    item.textContent = error;
    list.appendChild(item);
  });

  container.appendChild(list);
  container.scrollIntoView({ behavior: "smooth" });
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function isValidPhone(phone) {
  const phonePattern = /^[0-9\-\(\)\s\+\.]+$/;
  return phonePattern.test(phone) && phone.replace(/[^0-9]/g, "").length >= 10;
}
