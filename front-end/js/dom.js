import { register } from "./register.js";
import { login } from "./login.js";

// this function diplay the login form 

function displayLoginForm() {
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
                <form action="/api/v1/users/login" method="POST" id="login_form_element">
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
      displayRegistrationForm();
      login()
      /////////////////////////////
  
      /////////////////// handle the form caancling
      const close_btn = document.getElementById("close-form");
      close_btn.addEventListener("click", () => {
        form.remove();
        container.classList.remove("modal-active");
      });
    });
  }


// this function dipay the registration form
function displayRegistrationForm() {
  const register_btn = document.getElementById("register_btn");

  if (register_btn) {
    register_btn.addEventListener("click", (e) => {
      const container = document.getElementById("container");
      container.classList.add("modal-active");

      // remove the previouse form
      const prevform = document.getElementById("login_form");
      if (prevform) {
        prevform.remove();
      }

      // let careate our form
      let form = document.createElement("div");
      form.setAttribute("class", "modal-overlay");
      form.setAttribute("id", "register_form");
      form.innerHTML = `
                  <div class="modal-content">
                  <button class="close-btn" id="close-form">&times;</button>
                      <!-- Login Form -->
                  <form action="http://localhost:3000/api/v1/users/register" method="POST" id="register_form_element">
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
      displayLoginForm();
      register()
      /////////////////// handle the form caancling
      const close_btn = document.getElementById("close-form");
      close_btn.addEventListener("click", () => {
        form.remove();
        container.classList.remove("modal-active");
      });
    });
  }
}




// this function diplay the craete post form
function displayPostForm() {
    const craete_post_btn = document.getElementById("craete_post_btn");
    craete_post_btn.addEventListener("click", () => {
      const container = document.getElementById("container");
      container.classList.add("modal-active");
  
      // let careate our form
      let form = document.createElement("div");
      form.setAttribute("class", "modal-overlay");
      form.setAttribute("id", "post_form");
      form.innerHTML = `
      <div class="modal-content">
        <button class="close-btn" id="close-form">&times;</button>
        <form action="/create_post" method="POST" createPost_form_element>
          <h2><i class="fas fa-plus"> </i>New Post</h2>
      
          <label for="title">Title:</label>
          <input type="text" id="title" name="title" maxlength="255" required />
        
          <label for="content">Content:</label>
          <textarea id="content" name="content" rows="6" required></textarea>
        
          <label>Select Categories:</label>
          <div class="category-container">
          <div class="category-checkbox">
              <input type="checkbox" id="cat-tech" name="categories" value="Technology" />
              <label for="cat-tech">Technology</label>
          </div>
          <div class="category-checkbox">
              <input type="checkbox" id="cat-sci" name="categories" value="Science" />
              <label for="cat-sci">Science</label>
          </div>
          <div class="category-checkbox">
              <input type="checkbox" id="cat-health" name="categories" value="Health" />
              <label for="cat-health">Health</label>
          </div>
          <div class="category-checkbox">
              <input type="checkbox" id="cat-life" name="categories" value="Lifestyle" />
              <label for="cat-life">Lifestyle</label>
          </div>
          <div class="category-checkbox">
              <input type="checkbox" id="cat-edu" name="categories" value="Education" />
              <label for="cat-edu">Education</label>
          </div>
          <div class="category-checkbox">
              <input type="checkbox" id="cat-game" name="categories" value="Gaming" />
              <label for="cat-game">Gaming</label>
          </div>
          <div class="category-checkbox">
              <input type="checkbox" id="cat-biz" name="categories" value="Business" />
              <label for="cat-biz">Business</label>
          </div>
          </div>
  
        
          <button type="submit">Create Post</button>
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
    });
  }


export { displayRegistrationForm, displayLoginForm,displayPostForm };
