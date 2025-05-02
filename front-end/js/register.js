import { showRegisterForm, showLoginForm, showMessage } from "./dom.js";

function register() {
  ///////////////
  const registerFormElement = document.getElementById("register_form_element");
  registerFormElement.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stop regular form submission

    const formData = new FormData(registerFormElement);
    const data = Object.fromEntries(formData.entries());
    data.age = parseInt(data.age);

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        setTimeout(() => {
          showMessage(data.Message);
        }, 2000);
        setTimeout(() => {
          showLoginForm();
        }, 1000);
        
      } else {
        const errorData = await response.json();
        showRegisterForm(errorData);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  });
}

export { register };
