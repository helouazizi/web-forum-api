// import { showLoginForm } from "./dom.js";
async function isAouth() {
  try {
    const response = await fetch("http://localhost:3000/api/v1/users/info");    
    if (response.ok) {
      let data = await response.json();
      console.log(data,"from api quth");
      return data;
    } else {
      const errorData = await response.json();
      console.log(errorData,"from api err");
    //   showLoginForm();
    }
  } catch (err) {
    // render page error
    alert("Error: " + err.message);
  }
}

export {  isAouth};
