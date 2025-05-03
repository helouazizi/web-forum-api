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
      return null;
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
}

function logOut() {
  let log_out_btn = document.getElementById("log_out");
  console.log(log_out_btn,"hhhh");
  if (log_out_btn) {
    
    log_out_btn.addEventListener('click',async()=>{
      try {
        const response = await fetch("http://localhost:3000/api/v1/users/logout");
        if (response.ok) {
          renderHomePage();
        }
      } catch (err) {
        alert("Error: " + err.message);
      }
    })
  }
}

export { isAouth,logOut };
