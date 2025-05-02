import {
  renderHomePage,
  bindLoginBtn,
  bindRegisterbtn,
  showPostForm,
} from "./dom.js";

document.addEventListener("DOMContentLoaded", () => {
  renderHomePage();
  bindLoginBtn();
  bindRegisterbtn();
  showPostForm();
});
