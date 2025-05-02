import { login } from "./login.js";

function register() {
  const register_btn = document.getElementById("register_btn");
  
  if (register_btn) {
    
    register_btn.addEventListener("click", (e) => {
        
      const container = document.getElementById("container");
      container.classList.add("modal-active");

      // remove the previouse form
      const prevform = document.getElementById("login_form");
      if (prevform){
        prevform.remove()
      }
    
      // let careate our form
      let form = document.createElement("div");
      form.setAttribute("class", "modal-overlay");
      form.setAttribute("id", "register_form");
      form.innerHTML = `
                <div class="modal-content">
                <button class="close-btn" id="close-form">&times;</button>
                    <!-- Login Form -->
                <form action="/api/v1/users/register" method="POST">
                <h2><i class="fas fa-user-plus"></i> Register</h2>
                
                <label for="nickname">Nickname</label>
                <input type="text" id="nickname" name="nickname" required>
      
                <label for="age">Age</label>
                <input type="number" id="age" name="age" min="1" max="120" required>
      
                <label for="gender">Gender</label>
                <select id="gender" name="gender" required>
                <option value="" disabled selected>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                </select>
      
                <label for="first_name">First Name</label>
                <input type="text" id="first_name" name="first_name" required>
      
                <label for="last_name">Last Name</label>
                <input type="text" id="last_name" name="last_name" required>
      
                <label for="email">E-mail</label>
                <input type="email" id="email" name="email" required>
      
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
      
                <button type="submit">Register</button>
                </form>
                <div class="register_action"> 
                    <p>Alredy have an acoount ? </p>
                    <button class="primary-btn" id="login_btn_1"><i class="fas fa-sign-in-alt"></i> login</button >
                </div>
                </div>
            `;

      form.classList.add("active");
      document.body.appendChild(form);
      login()
      /////////////////// handle the form caancling
      const close_btn = document.getElementById("close-form");
      close_btn.addEventListener("click", () => {
        form.remove();
        container.classList.remove("modal-active");
      });
    });
  }
}



export { register };
