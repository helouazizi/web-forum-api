import { register } from "./register.js";
import { login } from "./login.js";
import {
  registerForm,
  loginForm,
  postForm,
  postCard,
  Header,
  Footer,
} from "./componnents.js";

import { isAouth } from "./api.js";

// this function diplay the login form
function bindLoginBtn() {
  const login_btn = document.getElementById("login_btn");
  const login_btn_1 = document.getElementById("login_btn_1");
  let result_btn = login_btn;
  if (login_btn_1) {
    result_btn = login_btn_1;
  }
  if (result_btn) {
    result_btn.addEventListener("click", (e) => {
      showLoginForm();
    });
  }
}
function showLoginForm(errors) {
  const container = document.getElementById("container");
  container.classList.add("modal-active");

  // remove the previouse form
  document.getElementById("login_form")?.remove();
  document.getElementById("register_form")?.remove();
  let form = loginForm(errors);
  form.classList.add("active");
  document.body.appendChild(form);

  bindRegisterbtn();
  login();
  /////////////////// handle the form caancling
  const close_btn = document.getElementById("close-form");
  close_btn.addEventListener("click", () => {
    form.remove();
    container.classList.remove("modal-active");
  });
}

// this function dipay the registration form
function bindRegisterbtn() {
  const register_btn = document.getElementById("register_btn");

  if (register_btn) {
    register_btn.addEventListener("click", (e) => {
      showRegisterForm();
    });
  }
}
function showRegisterForm(errors = {}) {
  const container = document.getElementById("container");
  container.classList.add("modal-active");
  // remove the previouse form
  document.getElementById("login_form")?.remove();
  document.getElementById("register_form")?.remove();

  let form = registerForm(errors);
  form.classList.add("active");
  document.body.appendChild(form);

  bindLoginBtn();
  register();

  const close_btn = document.getElementById("close-form");
  close_btn.addEventListener("click", () => {
    form.remove();
    container.classList.remove("modal-active");
  });
}

// this function diplay the craete post form
function showPostForm() {
  const craete_post_btn = document.getElementById("craete_post_btn");
  if (craete_post_btn) {
    craete_post_btn.addEventListener("click", () => {
      const container = document.getElementById("container");
      container.classList.add("modal-active");

      // let careate our form
      let form = postForm();
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
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

async function renderHomePage() {
  let user = await isAouth()
  console.log(user,"from dom");

  document.body.innerHTML = "";
  document.getElementById("login_form")?.remove();
  document.getElementById("register_form")?.remove();
  document.getElementById("container")?.classList.remove("modal-active");

  document.body.appendChild(Header(user));
  let main = document.createElement("main");
  let section = document.createElement("section");
  section.setAttribute("class", "container");
  section.setAttribute("id", "container");
  let posts = document.createElement("div");
  posts.setAttribute("class", "posts");
  for (let i = 0; i < 10; i++) {
    posts.appendChild(postCard());
  }
  section.appendChild(posts);
  main.appendChild(section);
  document.body.appendChild(main);
  document.body.appendChild(Footer());
}

function showMessage(message) {
  const popup = document.createElement("div");
  popup.setAttribute("id", "message_popup");
  popup.innerHTML = `<h2>${message}</h2>`;
  document.body.appendChild(popup);

  // Automatically hide after 3 seconds
  setTimeout(() => {
    popup.remove();
  }, 3000);
}

export {
  renderHomePage,
  showLoginForm,
  showRegisterForm,
  showPostForm,
  bindRegisterbtn,
  bindLoginBtn,
  showMessage,
};
