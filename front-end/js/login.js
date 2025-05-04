import { renderHomePage } from "./dom.js";
function login() {
  const loginFormElement = document.getElementById("login_form_element");
  loginFormElement.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stop regular form submission

    const formData = new FormData(loginFormElement);
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("http://localhost:3000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Very important
        body: JSON.stringify(data),
      });
      if (response.ok) {
        // renderHomePage();
        location.reload()
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  });
}

export { login };
