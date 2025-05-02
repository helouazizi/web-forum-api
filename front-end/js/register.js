function register() {
  ///////////////
  const registerFormElement = document.getElementById("register_form_element");
  registerFormElement.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stop regular form submission

    const formData = new FormData(registerFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    data.age = parseInt(data.age)
    

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
        // Redirect to homepage
        window.location.href = "/front-end/";
      } else {
        const errorData = await response.json();
        alert("Registration failed: " + errorData.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  });
}

export { register };
