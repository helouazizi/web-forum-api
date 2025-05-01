function login() {
  const login_btn = document.getElementById("login_btn");
  login_btn.addEventListener("click", (e) => {
    const container = document.getElementById("container");
    container.classList.add("modal-active");

    // let careate our form
    let form = document.createElement("div");
    form.setAttribute("class", "modal-overlay");
    form.setAttribute("id", "login-modal");
    form.innerHTML = `
            <div class="modal-content">
            <button class="close-btn" id="close-form">&times;</button>
                <!-- Login Form -->
            <form action="/login" method="POST">
            <h2><i class="fas fa-sign-in-alt"></i> Login</h2>

            <label for="login_id">Nickname or E-mail</label>
            <input type="text" id="login_id" name="login_id" required />

            <label for="login_password">Password</label>
            <input type="password" id="login_password" name="password" required />

            <button type="submit">Login</button>
            <div class="register_action"> 
                <p>Don't have an account ? </p>
                <button class="primary-btn " value="register"><i class="fas fa-user-plus"></i> register</button >
            </div>
            </form>
            </div>
        `;

    form.classList.add("active");
    document.body.appendChild(form);

    /////////////////// handle the form caancling
    const close_btn = document.getElementById("close-form");
    close_btn.addEventListener("click", () => {
      form.remove();
      container.classList.remove("modal-active");
    });
    // }
  });
}

export { login };
