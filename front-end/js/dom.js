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
  showComments,
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
function renderComments(comments, postId,post) {
  // Remove existing panel if open
  document.getElementById("comment-panel")?.remove();

  // Create panel
  const panel = document.createElement("div");
  panel.id = "comment-panel";
  panel.className = "comment-panel";

  // Header with close button
  const header = document.createElement("div");
  header.className = "comment-header";

  const title = document.createElement("h3");
  title.textContent = `Comments for Post #${postId}`;
  header.appendChild(title);

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✖";
  closeBtn.className = "close-comment-panel";
  closeBtn.addEventListener("click", () => panel.remove());
  header.appendChild(closeBtn);

  panel.appendChild(header);

  // Comment list
  const list = document.createElement("div");
  list.className = "comment-container";

  if (comments.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No comments yet.";
    empty.className = "no-comments";
    list.appendChild(empty);
  } else {
    comments.forEach((comment) => {
      const commentEl = document.createElement("div");
      commentEl.className = "comment-item";
      commentEl.innerHTML = `<strong>${comment.Creator}</strong>: ${comment.Content}`;
      list.appendChild(commentEl);
    });
  }

  panel.appendChild(list);
  post.appendChild(panel);
}

function postActions() {
  document.querySelectorAll(".post-card").forEach((postCard) => {
    const postId = postCard.querySelector("#post-id")?.textContent;
    // Like
    postCard.querySelector(".fa-thumbs-up")?.addEventListener("click", () => {
      const likeIcon = postCard.querySelector(".fa-thumbs-up");
      const countSpan = postCard.querySelector(".like-count");
      let currentCount = parseInt(countSpan.textContent, 10) || 0;

      const alreadyLiked = likeIcon.classList.contains("liked");

      if (alreadyLiked) {
        let unlike = reactToPost(postId, "dislike");
        if (unlike) {
          likeIcon.classList.remove("liked");
          countSpan.textContent = Math.max(0, currentCount - 1);
        }
      } else {
        let like = reactToPost(postId, "like");
        if (like) {
          likeIcon.classList.add("liked");
          countSpan.textContent = currentCount + 1;
        }
      }
    });

    // Dislike
    postCard.querySelector(".fa-thumbs-down")?.addEventListener("click", () => {
      const dislikeIcon = postCard.querySelector(".fa-thumbs-down");
      const countSpan = postCard.querySelector(".dislike-count");
      let currentCount = parseInt(countSpan.textContent, 10) || 0;

      const alreadyDisliked = dislikeIcon.classList.contains("disliked");

      if (alreadyDisliked) {
        let undo = reactToPost(postId, "dislike");
        if (undo) {
          dislikeIcon.classList.remove("disliked");
          countSpan.textContent = Math.max(0, currentCount - 1);
        }
      } else {
        let dislike = reactToPost(postId, "dislike");
        if (dislike) {
          dislikeIcon.classList.add("disliked");
          countSpan.textContent = currentCount + 1;
        }
      }
    });

    // Show comments
    postCard.querySelector(".fa-comment")?.addEventListener("click", () => {
      console.log("User wants to view comments for post:", postId);
      showComments(postId, postCard);
    });

    // Send comment
    const sendBtn = postCard.querySelector(".comment-button");
    const input = postCard.querySelector(".comment-input");

    sendBtn?.addEventListener("click", () => {
      const comment = input.value.trim();
      if (comment !== "") {
        console.log("User commented on post:", postId, "Comment:", comment);
        input.value = "";
        let commented = sendPostCommen(postId, comment);
        if (commented) {
          let commentCount = postCard.querySelector(".comment-count");
          let currentCount = parseInt(commentCount.textContent, 10) || 0;
          commentCount.textContent = currentCount + 1;
        }
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
  renderComments,
};
