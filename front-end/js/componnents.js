let Header = (user) => {
  let header = document.createElement("header");
  if (user) {
    header.innerHTML = `
        <h1 class="logo"><a href="/front-end/">Forum</a></h1>
        <nav class="navigation-links">
              <button class="primary-btn new_post_btn" id="craete_post_btn"><i class="fas fa-plus"></i><span>New Post</span></button>
              <div class="user-profile " id="user-profile" >
                <img
                  src="./assets/avatar.png"
                  alt="User Profile"
                  class="profile-pic"
                />
              </div>
        </nav>
        
    `;
    header.appendChild(userProfile(user))
  } else {
    header.innerHTML = `
          <h1 class="logo"><a href="/front-end/">Forum</a></h1>
          <nav class="navigation-links">
                <button class="primary-btn" id="login_btn"><i class="fas fa-sign-in-alt"></i> Login</button>
          </nav>
      `;
  }

  return header;
};


let userProfile = (user) => {
  let underProfile = document.createElement("div");
  underProfile.setAttribute("class", "underProfile hidden");
  underProfile.setAttribute("id", "underProfile");

  underProfile.innerHTML = `
    <div class="profile-card">
      <div class="profile-header">
        <img src="./assets/avatar.png" alt="User Profile" class="profile-pic" />
        <div>
          <h2>${user.nickname}</h2>
          <p>${user.email}</p>
        </div>
      </div>

      <div class="profile-details">
        <div class="detail-item"><strong>First Name:</strong> ${user.first_name}</div>
        <div class="detail-item"><strong>Last Name:</strong> ${user.last_name}</div>
        <div class="detail-item"><strong>Gender:</strong> ${user.gender}</div>
        <div class="detail-item"><strong>Age:</strong> ${user.age}</div>
        <div class="detail-item"><strong>Created At:</strong> ${new Date(user.created_at).toLocaleString()}</div>
        <div class="detail-item"><strong>Updated At:</strong> ${new Date(user.updated_at).toLocaleString()}</div>
      </div>

      <div class="profile-actions">
        <button class="primary-btn" id="settings">Settings</button>
        <button class="primary-btn" id="log_out">Log Out</button>
      </div>
    </div>
  `;

  return underProfile;
};


let loginForm = (errrors = {}) => {
  let form = document.createElement("div");
  form.setAttribute("class", "modal-overlay");
  form.setAttribute("id", "login_form");
  form.innerHTML = `
                <div class="modal-content">
                <button class="close-btn" id="close-form">&times;</button>
                    <!-- Login Form -->
                <form action="http://localhost:3000/api/v1/users/login" method="POST" id="login_form_element">
                <h2><i class="fas fa-sign-in-alt"></i> Login</h2>
    
                <label for="login_id">Nickname or E-mail</label>
                <input type="text" id="login_id" name="login_id" required />
                <span>${errrors.Nickname ? errrors.Nickname : ""}</span>
    
                <label for="login_password">Password</label>
                <input type="password" id="login_password" name="password" required />
                <span>${errrors.Pass ? errrors.Pass : ""}</span>
    
                <button type="submit">Login</button>
                </form>
                <div class="register_action"> 
                    <p>Don't have an account ? </p>
                    <button class="primary-btn" id="register_btn"><i class="fas fa-user-plus"></i> register</button >
                </div>
                </div>
            `;
  return form;
};

let registerForm = (errrors = {}) => {
  let form = document.createElement("div");
  form.setAttribute("class", "modal-overlay");
  form.setAttribute("id", "register_form");
  form.innerHTML = `
                <div class="modal-content">
                <button class="close-btn" id="close-form">&times;</button>
                    <!-- Login Form -->
                <form action="http://localhost:3000/api/v1/users/register" method="POST" id="register_form_element">
                <h2><i class="fas fa-user-plus"></i> Register</h2>
                
                <label for="nickname">Nickname</label>
                <input type="text" id="nickname" name="nickname" required>
                <span>${errrors.Nickname ? errrors.Nickname : ""}</span>

                <label for="age">Age</label>
                <input type="number" id="age" name="age" min="1" max="120" required>
                <span>${errrors.Age ? errrors.Age : ""}</span>

                <label for="gender">Gender</label>
                <select id="gender" name="gender" required>
                <option value="" disabled selected>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                </select>
                <span>${errrors.Gender ? errrors.Gender : ""}</span>

      
                <label for="first_name">First Name</label>
                <input type="text" id="first_name" name="first_name" required>
                <span>${errrors.LastName ? errrors.FirstName : ""}</span>
      
                <label for="last_name">Last Name</label>
                <input type="text" id="last_name" name="last_name" required>
                <span>${errrors.LastName ? errrors.LastName : ""}</span>
      
                <label for="email">E-mail</label>
                <input type="email" id="email" name="email" required>
                <span>${errrors.Email ? errrors.Email : ""}</span>
      
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
                <span>${errrors.Pass ? errrors.Pass : ""}</span>
      
                <button type="submit">Register</button>
                </form>
                <div class="register_action"> 
                    <p>Alredy have an acoount ? </p>
                    <button class="primary-btn" id="login_btn_1"><i class="fas fa-sign-in-alt"></i> login</button >
                </div>
                </div>
            `;

  return form;
};

let postCard = () => {
  let post = document.createElement("div");
  post.setAttribute("class", "post-card");
  post.innerHTML = `
            <div class="post-header">
              <img
                src="./assets/avatar.png"
                alt="User Profile"
                class="profile-pic"
              />
              <div class="user-info">
                <h4 class="username">John Doe</h4>
                <span class="post-date">Posted on 2025-05-02</span>
              </div>
            </div>

            <div class="post-body">
              <h3 class="post-title">Post Title Here</h3>
              <p class="post-content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                lacinia odio vitae vestibulum.
              </p>
            </div>
            <div class="post-categories">
              <span class="category-tag">Technology</span>
              <span class="category-tag">Science</span>
              <span class="category-tag">Health</span>
            </div>            
            <div class="comment-section">
              <input type="text" placeholder="Write a comment..." class="comment-input" />
              <button class="comment-button"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
            <div class="post-footer">
              <span><i class="fa-solid fa-thumbs-up"></i> 12</span>
              <span><i class="fa-solid fa-thumbs-down"></i> 3</span>
              <span><i class="fa-solid fa-comment"></i> 5</span>
            </div>
    `;
  return post;
};

let postForm = () => {
  // let careate our form
  let form = document.createElement("div");
  form.setAttribute("class", "modal-overlay");
  form.setAttribute("id", "post_form");
  form.innerHTML = `
       <div class="modal-content">
         <button class="close-btn" id="close-form">&times;</button>
         <form action="/create_post" method="POST" createPost_form_element>
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
  return form;
};

let Footer = () => {
  let footer = document.createElement("footer");
  footer.innerHTML = `
    <p>&copy; 2025 Forum. All rights reserved.</p>
    `;
  return footer;
};

export { Footer, Header, loginForm, registerForm, postCard, postForm };
