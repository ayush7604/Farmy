document
  .getElementById("subscribe-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;

    const response = await fetch("http://localhost:5000/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    document.getElementById("subscribe-msg").innerText =
      data.message || "Error";
  });

