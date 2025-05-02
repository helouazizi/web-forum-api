import { register } from "./register.js";

function login() {
  const login_btn = document.getElementById("login_btn");
  const login_btn_1 = document.getElementById("login_btn_1");
  let result_btn = login_btn;
  if (login_btn_1) {
    result_btn = login_btn_1;
  }
  result_btn.addEventListener("click", (e) => {
    const container = document.getElementById("container");
    container.classList.add("modal-active");

    // let remove the previoiise form
    let prevform = document.getElementById("register_form");
    if (prevform) {
      prevform.remove();
    }
    // let careate our form
    let form = document.createElement("div");
    form.setAttribute("class", "modal-overlay");
    form.setAttribute("id", "login_form");
    form.innerHTML = `
            <div class="modal-content">
            <button class="close-btn" id="close-form">&times;</button>
                <!-- Login Form -->
            <form action="/api/v1/users/login" method="POST">
            <h2><i class="fas fa-sign-in-alt"></i> Login</h2>
            
            <label for="login_id">Nickname or E-mail</label>
            <input type="text" id="login_id" name="login_id" required />

            <label for="login_password">Password</label>
            <input type="password" id="login_password" name="password" required />

            <button type="submit">Login</button>
            </form>
            <div class="register_action"> 
                <p>Don't have an account ? </p>
                <button class="primary-btn" id="register_btn"><i class="fas fa-user-plus"></i> register</button >
            </div>
            </div>
        `;

    form.classList.add("active");
    document.body.appendChild(form);

    /////////////////////////////
    register();
    /////////////////////////////

    /////////////////// handle the form caancling
    const close_btn = document.getElementById("close-form");
    close_btn.addEventListener("click", () => {
      form.remove();
      container.classList.remove("modal-active");
    });
  });
}

export { login };
