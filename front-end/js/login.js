// import { register } from "./register.js";

function login() {
  const loginFormElement = document.getElementById("login_form_element");
  loginFormElement.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stop regular form submission

    const formData = new FormData(loginFormElement);
    const data = Object.fromEntries(formData.entries());
    //   data.age = parseInt(data.age);

    try {
      const response = await fetch("http://localhost:3000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        let logBtn = document.getElementById('login_btn')
        logBtn.classList.add('hidden')
        let profile = document.getElementById('user-profile')
        profile.classList.add("show")
        console.log(logBtn,profile,"here");
        
        //   setTimeout(() => {
        //     showMessage(data.Message);
        //   }, 2000);
        //   setTimeout(() => {
        //     showLoginForm();
        //   }, 1000);
        console.log(data, "hhhhhhhhh");

        // window.location.href = "/front-end/";
      } else {
        const errorData = await response.json();
        console.log(errorData);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  });
}

export { login };
