function craete_post() {
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
      <form action="/create_post" method="POST">
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

export { craete_post };
