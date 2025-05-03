import { showLoginForm } from "./dom.js";
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
      return null
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
}

export { isAouth };
