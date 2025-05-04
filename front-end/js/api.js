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
          // renderHomePage();
          // showLoginForm();
          location.reload();
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

    console.log(postData, "befor submition post");

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
        console.log(errorData.UserErrors,"from api");
        if (errorData.UserErrors.HasError) {
          showPostForm(errorData.UserErrors);
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
        location.reload();
      }, 3000);
    } catch (err) {
      showErrorPage(err);
    }
  });
}

export { isAouth, logOut, createPost };
