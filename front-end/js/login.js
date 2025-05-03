import { showLoginForm, renderHomePage } from "./dom.js";

async function login() {
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
      console.log(response,"here resoonse");
      

      if (response.ok) {
        // const data = await response.json();
        // console.log(data, "user.dta");
        document.getElementById("login_form")?.remove();
        await renderHomePage();
      } else {
        const errorData = await response.json();
        console.log(errorData, "eeeeeeeeeeee");
        showLoginForm(errorData);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  });
}

export { login };
