// ================================
// 🛒 Cart Functionality
// ================================
let cartItems = [];

// ➕ Add to Cart
function addToCart(item) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first to add items to your cart.");
    return;
  }

  cartItems.push(item);
  document.getElementById("cart-count").innerText = cartItems.length;
  saveCartToBackend(cartItems);
}

// 💾 Save Cart to Backend
function saveCartToBackend(items) {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5500/api/cart/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items }),
  })
    .then((res) => res.json())
    .then((data) => console.log("🧾", data.message))
    .catch(() => alert("❌ Failed to save cart."));
}

// 👀 Show Cart
function showCart() {
  if (cartItems.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const itemList = cartItems.map((item) => `• ${item}`).join("\n");
  alert("You have added:\n" + itemList);
}

// ================================
// 🔔 Newsletter Subscribe
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const subscribeForm = document.getElementById("subscribeForm");

  if (subscribeForm) {
    subscribeForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("emailInput").value;
      const message = document.getElementById("responseMsg");

      try {
        const res = await fetch("http://localhost:5500/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        message.textContent = data.message;
        message.style.display = "block";
        message.style.color = res.status === 201 ? "green" : "orange";
        document.getElementById("emailInput").value = "";
      } catch (err) {
        message.textContent = "Something went wrong. Try again.";
        message.style.display = "block";
        message.style.color = "red";
      }
    });
  }

  // ✅ Update UI if already logged in
  const token = localStorage.getItem("token");
  if (token) {
    document.getElementById("auth-msg").textContent = "✅ Logged in";
    document.getElementById("logout-btn").style.display = "inline-block";
  }
});

// ================================
// 🔐 Authentication (Register/Login/Logout)
// ================================

// 👁 Toggle Auth Form
function toggleAuthForm() {
  const form = document.getElementById("auth-form");
  form.classList.toggle("hidden");
}

// 📝 Register
function register() {
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;
  const msg = document.getElementById("auth-msg");

  fetch("http://localhost:5500/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then(async (res) => {
      const data = await res.json();

      if (res.status === 201) {
        msg.textContent = "✅ Registered successfully!";
        msg.style.color = "green";
      } else if (res.status === 409) {
        msg.textContent = "⚠️ Email already registered!";
        msg.style.color = "orange";
      } else {
        msg.textContent = data.message || "Registration failed.";
        msg.style.color = "red";
      }
    })
    .catch(() => {
      msg.textContent = "Something went wrong.";
      msg.style.color = "red";
    });
}

// 🔐 Login
function login() {
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;
  const msg = document.getElementById("auth-msg");

  fetch("http://localhost:5500/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        msg.textContent = "✅ Login successful!";
        msg.style.color = "green";
        document.getElementById("logout-btn").style.display = "inline-block";
      } else {
        msg.textContent = data.message || "Login failed.";
        msg.style.color = "red";
      }
    })
    .catch(() => {
      msg.textContent = "Something went wrong.";
      msg.style.color = "red";
    });
}

// 🔓 Logout
function logout() {
  localStorage.removeItem("token");
  document.getElementById("auth-msg").textContent = "Logged out!";
  document.getElementById("auth-msg").style.color = "black";
  document.getElementById("logout-btn").style.display = "none";
  document.getElementById("cart-count").innerText = "0";
  cartItems = [];
}
