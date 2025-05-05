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

import {
  isAouth,
  logOut,
  createPost,
  fetchPosts,
  reactToPost,
  sendPostCommen,
  showComments
} from "./api.js";

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
  removeOldeForms();
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
  removeOldeForms();

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
function showPostForm(errors = {}, openImmediately = false) {
  const craete_post_btn = document.getElementById("craete_post_btn");
  if (!craete_post_btn && !openImmediately) return;

  const openForm = () => {
    const container = document.getElementById("container");
    container.classList.add("modal-active");

    // Remove any existing form first
    removeOldeForms();

    const form = postForm(errors);
    form.classList.add("active");
    document.body.appendChild(form);
    createPost();

    const close_btn = document.getElementById("close-form");
    close_btn.addEventListener("click", () => {
      form.remove();
      container.classList.remove("modal-active");
    });
  };

  // If we're calling this after a failed submit, open form immediately
  if (openImmediately) {
    openForm();
  } else {
    craete_post_btn.addEventListener("click", openForm);
  }
}

function removeOldeForms() {
  let allforms = document.querySelectorAll(".modal-overlay"); // add dot to select by class
  if (allforms.length > 0) {
    allforms.forEach((form) => {
      form.remove();
    });
  }
}

async function renderHomePage() {
  let user = await isAouth();
  document.body.innerHTML = "";
  document.getElementById("login_form")?.remove();
  document.getElementById("register_form")?.remove();
  document.getElementById("container")?.classList.remove("modal-active");
  document.body.appendChild(Header(user));
  bindLoginBtn();
  bindRegisterbtn();
  showPostForm();
  if (user) {
    showProfile();
    logOut();
  }

  let postsFromdb = await fetchPosts();

  let main = document.createElement("main");
  let section = document.createElement("section");
  section.setAttribute("class", "container");
  section.setAttribute("id", "container");
  let posts = document.createElement("div");
  posts.setAttribute("class", "posts");

  if (!postsFromdb) {
    posts.textContent = "No posts yet.";
  } else {
    postsFromdb.forEach((post) => {
      posts.appendChild(postCard(post));
    });
  }

  section.appendChild(posts);
  main.appendChild(section);
  document.body.appendChild(main);
  document.body.appendChild(Footer());

  postActions();
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

function showProfile() {
  let userProfile = document.getElementById("user-profile");
  if (userProfile) {
    userProfile.addEventListener("click", () => {
      let underProfile = document.getElementById("underProfile");
      underProfile.classList.toggle("hidden");
    });
  }
}

function showErrorPage(error) {
  document.body.innerHTML = `
    <div class="error-container">
      <h1 class="error-code">${error.code}</h1>
      <p class="error-message">${error.message}</p>
      <button class="back-home-btn" onclick="location.href='/'">Back Home</button>
    </div>
  `;
}

function postActions() {
  document.querySelectorAll(".post-card").forEach((postCard) => {
    const postId = postCard.querySelector("#post-id")?.textContent;

    // Like
    postCard.querySelector(".fa-thumbs-up")?.addEventListener("click", () => {
      console.log("User liked post:", postId);
      reactToPost(postId, "like");
      renderHomePage();
    });

    // Dislike
    postCard.querySelector(".fa-thumbs-down")?.addEventListener("click", () => {
      console.log("User disliked post:", postId);
      // callDislikeAPI(postId);
      reactToPost(postId, "dislike");
      renderHomePage();
    });

    // Show comments
    postCard.querySelector(".fa-comment")?.addEventListener("click", () => {
      console.log("User wants to view comments for post:", postId);
      showComments(postId,postCard);
    });

    // Send comment
    const sendBtn = postCard.querySelector(".comment-button");
    const input = postCard.querySelector(".comment-input");

    sendBtn?.addEventListener("click", () => {
      const comment = input.value.trim();
      if (comment !== "") {
        console.log("User commented on post:", postId, "Comment:", comment);
        input.value = "";
        sendPostCommen(postId, comment);
        renderHomePage();
      }
    });
  });
}

export {
  renderHomePage,
  showLoginForm,
  showRegisterForm,
  showPostForm,
  bindRegisterbtn,
  bindLoginBtn,
  showMessage,
  showErrorPage,
  postActions,
};
