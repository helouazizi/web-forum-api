import {
  renderHomePage,
  showErrorPage,
  showLoginForm,
  showMessage,
  showPostForm,
} from "./dom.js";
async function isAouth() {
  try {
    const response = await fetch("http://localhost:3000/api/v1/users/info", {
      method: "GET",
      credentials: "include", // 👈 This tells the browser to send cookies
    });
    if (response.ok) {
      let data = await response.json();
      return data;
    } else {
      // const errorData = await response.json();
      // console.log(errorData, "from api err");
      // showLoginForm();
      return null;
    }
  } catch (err) {
    // alert("Error: " + err.message);
    console.log(err);
  }
}

function logOut() {
  let log_out_btn = document.getElementById("log_out");
  if (log_out_btn) {
    log_out_btn.addEventListener("click", async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/users/logout",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          renderHomePage();
          // showLoginForm();
          // location.reload();
        } else {
          const errorData = await response.json();
          console.error(
            "Logout failed:",
            errorData.message || response.statusText
          );
          alert("Logout failed: " + (errorData.message || response.statusText));
        }
      } catch (err) {
        console.error("Network error:", err);
        alert("Network error: " + err.message);
      }
    });
  }
}

function createPost() {
  const formElement = document.querySelector("[createPost_form_element]");
  if (!formElement) return;

  formElement.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = formElement.querySelector("#title").value.trim();
    const content = formElement.querySelector("#content").value.trim();
    const categoryCheckboxes = formElement.querySelectorAll(
      'input[name="categories"]:checked'
    );
    const categories = Array.from(categoryCheckboxes).map((cb) => cb.value);

    const postData = {
      title,
      content,
      categories,
    };
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/posts/create",
        {
          method: "POST",
          credentials: "include", // Very important
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.UserErrors.HasError) {
          showPostForm(errorData.UserErrors, true);
          return;
        }
        if (errorData.Code === 401) {
          showLoginForm();
          return;
        }
        const error = {
          code: errorData.Code,
          message: errorData.Message,
        };
        throw error;
      }
      const result = await response.json();
      showMessage(result.Message);
      setTimeout(() => {
        renderHomePage();
      }, 2000);
    } catch (err) {
      showErrorPage(err);
    }
  });
}

async function fetchPosts() {
  try {
    const response = await fetch("http://localhost:3000/");
    if (!response.ok) {
      let err = {
        code: response.status,
        message: response.statusText,
      };
      throw err;
    }

    const posts = await response.json();

    return posts;
  } catch (error) {
    showErrorPage(error);
  }
}

async function reactToPost(postId, reaction) {
  try {
    const response = await fetch("http://localhost:3000/api/v1/posts/react", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_id: parseInt(postId),
        reaction: reaction,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      let err = {
        code: errData.Code,
        message: errData.Message,
      };
      throw err;
    }
    console.log("reaction handleed seccefully");

    // const data = await response.json();
    // console.log("Like registered:", data);
    // // Optionally update UI here
  } catch (error) {
    showErrorPage(error);
  }
}
async function sendPostCommen(postId, commenttext) {
  console.log(postId, commenttext, "hhhh");

  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/posts/addComment",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: parseInt(postId),
          comment: commenttext,
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      let err = {
        code: errData.Code,
        message: errData.Message,
      };
      throw err;
    }
    let res = await response.json();
    showMessage(res.Message);

    console.log("Comment submitted successfully:");
    // Optionally update the UI here
  } catch (error) {
    showErrorPage(error);
  }
}

async function showComments(postId, container) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/posts/fetchComments?postId=${postId}`,
      {
        credentials: "include",
      }
    );
    if (!response.ok) {
      const errData = await response.json();
      let err = {
        code: errData.Code,
        message: errData.Message,
      };
      throw err;
    }
    const comments = await response.json();
    console.log(comments, "comments");
    if (!comments) return;
    const commentsContainer = document.createElement("div");
    commentsContainer.className = "comments-list";
    container.getElementsByClassName("comments-list")[0]?.remove();
    comments.forEach((comment) => {
      const commentEl = document.createElement("div");
      commentEl.className = "comment-item";
      commentEl.textContent = `${comment.Creator}: ${comment.Content}`;
      commentsContainer.appendChild(commentEl);
    });

    container.appendChild(commentsContainer);
  } catch (error) {
    showErrorPage(error);
  }
}

export {
  isAouth,
  logOut,
  createPost,
  fetchPosts,
  reactToPost,
  sendPostCommen,
  showComments,
};
