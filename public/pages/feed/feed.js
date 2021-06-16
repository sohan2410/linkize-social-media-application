const apiURL = "http://localhost:8000";
// const apiURL = "https://still-fortress-53995.herokuapp.com";
const checkbox = document.querySelector(".checkbox");
const likeIcon = document.querySelector(".likeIcon");
let clicked = false;
let count = 0;
const Likes = document.querySelector(".LikeNumber");
const body = document.querySelector("body");
const sharePostButton = document.querySelector(".startPostButton");
const cross = document.querySelector(".fa-times");
const token = localStorage.getItem("jwt");
const googleauthtoken = localStorage.getItem("googleauthtoken");
// const logOut = document.querySelector(".LogOut");
let image_compressed = "";

async function handleImageUpload(event) {
  event.preventDefault();
  console.log(event);
  // const email = event.target[0].value;
  const content = event.target[0].value;
  const imageFile = event.target[1].files[0];
  const name = event.target[1].files[0].name;
  // console.log(email,name);
  console.log(content, name);
  console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
  const options = {
    maxSizeMB: 0.04,
    maxWidthOrHeight: 300,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);
    console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
    compressedFile.name = name;
    uploadToServer(compressedFile, content, name);
  } catch (error) {
    console.log(error);
  }
}

function uploadToServer(file, content, name) {
  console.log(content);
  var formData = new FormData();
  formData.append("image", file, name);
  formData.append("content", content);
  console.log(file, content, name);
  fetch(`${apiURL}/posts/createnewpost`, {
    method: "POST",
    headers: {
      authorization: token,
      googleauthtoken: googleauthtoken,
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const navBar = document.querySelector("nav");
      const container = document.querySelector(".superContainer");
      const popUp = document.querySelector(".popUpMakeAPostContainer");
      popUp.classList.remove("visible");
      navBar.classList.remove("afterPopUp");
      container.classList.remove("afterPopUp");
    });
}

checkbox.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

likeIcon.addEventListener("click", () => {
  if (!clicked) {
    clicked = true;
    likeIcon.innerHTML = `<i class="fas fa-lightbulb fill"></i>`;
    count++;
    Likes.innerHTML = `${count}`;
  } else {
    clicked = false;
    likeIcon.innerHTML = `<i class="far fa-lightbulb"></i>`;
    count--;
    Likes.innerHTML = `${count}`;
  }
});
window.addEventListener("load", () => {
  body.classList.add("visible");
    const fullname = document.querySelector(".nameBackend");

    const token = localStorage.getItem("jwt");
    const googleauthtoken = localStorage.getItem("googleauthtoken");
    if (token === null && googleauthtoken === null) {
      location.href = "/pages/signin/signin.html";
    } else {
      const token = localStorage.getItem("jwt");
      const googleauthtoken = localStorage.getItem("googleauthtoken");
      fetch(`${apiURL}/posts/getpics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
          googleauthtoken: googleauthtoken,
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          fullname.innerHTML = data.firstname + " " + data.lastname;
          const img = document.querySelectorAll(".profileImageBackend");
          var i;
          for (i = 0; i < img.length; i++) {
            img[i].src = data.data;
          }
        })
        .catch((err) => {
          alert("Error Fetching data");
          console.log(err);
        });
    }
});

sharePostButton.addEventListener("click", () => {
  const navBar = document.querySelector("nav");
  const container = document.querySelector(".superContainer");
  const popUp = document.querySelector(".popUpMakeAPostContainer");
  popUp.classList.add("visible");
  navBar.classList.add("afterPopUp");
  container.classList.add("afterPopUp");

  const submit_profile = document.querySelector("#image_submit");
  submit_profile.addEventListener("submit", handleImageUpload);
});
cross.addEventListener("click", () => {
  const navBar = document.querySelector("nav");
  const container = document.querySelector(".superContainer");
  const popUp = document.querySelector(".popUpMakeAPostContainer");
  popUp.classList.remove("visible");
  navBar.classList.remove("afterPopUp");
  container.classList.remove("afterPopUp");
});

const profileImageTopBarContainer = document.querySelector(
  ".profileImageTopBarContainer"
);
profileImageTopBarContainer.addEventListener("click", () => {
  const dropDownContainer = document.querySelector(".dropDownContainer");
  dropDownContainer.classList.toggle("visible");
});

// logOut.addEventListener("click", () => {
//   console.log("clicking on logout");
//   const token = localStorage.getItem("jwt");
//   const googleauthtoken = localStorage.getItem("googleauthtoken");
//   if (token) {
//     localStorage.removeItem("jwt");
//   } else if (googleauthtoken) {
//     localStorage.removeItem("googleauthtoken");
//     var auth2 = gapi.auth2.getAuthInstance();
//     auth2.signOut().then(function () {
//       console.log("User signed out.");
//     });
//   }
// });

async function myposts() {
  fetch(`${apiURL}/posts/getallposts`, {
    method: "GET",
  })
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data.temp);
      const xyz = data.temp;
      xyz.forEach((obj) => {
        // console.log(obj.firstname);
        const left = document.querySelector(".left");

        const displayPost = document.createElement("div");
        displayPost.className = "DisplayPost";

        const navDisplayPost = document.createElement("div");
        navDisplayPost.className = "navDisplayPost";

        const profilePic = document.createElement("div");
        profilePic.className =
          "profileImageTopBarContainer makePostProfileImage displayPostProfileImage";

        
        navDisplayPost.append(profilePic);

        const ProfileDescription = document.createElement("div");
        ProfileDescription.className = "ProfileDescription";

        const profileName = document.createElement("h1");
        profileName.className = "profileName";
        profileName.innerHTML =" Sohan bro"
        ProfileDescription.appendChild(profileName);
        ProfileDescription.innerHTML =`<h1>${obj.firstname} ${obj.lastname}</h1>`

        ProfileDescription.innerHTML += `<p>Founder | Amazon</p>`;

        navDisplayPost.append(ProfileDescription);
        const img = document.createElement("img");
        profilePic.append(img);

        
        // PostImageContainer
        const PostImageContainer = document.createElement("div");
        PostImageContainer.className = "PostImageContainer";

        const img2 = document.createElement("img");
        PostImageContainer.append(img2);
        img2.src=obj.postspic;

        const captionContainer = document.createElement("div");
        captionContainer.className = "captionContainer";

        const caption = document.createElement("div");
        caption.className = "caption";
        caption.innerHTML=`${obj.content}`;
        captionContainer.appendChild(caption);

        const readMore = document.createElement("div");
        readMore.className = "readMore";
        captionContainer.appendChild(readMore);

        const lineSeperation = document.createElement("div");
        lineSeperation.className = "lineSeperation";

        const likeSection = document.createElement("div");
        likeSection.className = "likeSection";

        const like = document.createElement("div");
        like.className = "like";

        const likeIcon = document.createElement("span");
        likeIcon.className = "likeIcon";
        likeIcon.innerHTML = `<i class="far fa-lightbulb"></i>`;
        like.appendChild(likeIcon);

        const LikeNumber = document.createElement("div");
        LikeNumber.className = "LikeNumber";
        LikeNumber.innerText = "0";
        like.appendChild(LikeNumber);

        const commentSection = document.createElement("div");
        commentSection.className = "commentSection";
        commentSection.innerHTML = `<i class="far fa-comment"></i>`;

        likeSection.appendChild(like);

        likeSection.appendChild(commentSection);

        displayPost.append(navDisplayPost);
        displayPost.append(PostImageContainer);
        displayPost.append(captionContainer);
        displayPost.append(lineSeperation);
        displayPost.append(likeSection);
        left.appendChild(displayPost);

        img.src=obj.profilepic;
      });
    });
  // const left = document.querySelector(".left");

  // const displayPost = document.createElement("div");
  // displayPost.className = "DisplayPost";

  // const navDisplayPost = document.createElement("div");
  // navDisplayPost.className = "navDisplayPost";

  // const profilePic = document.createElement("div");
  // profilePic.className =
  //   "profileImageTopBarContainer makePostProfileImage displayPostProfileImage";
  // navDisplayPost.append(profilePic);

  // const ProfileDescription = document.createElement("div");
  // ProfileDescription.className = "ProfileDescription";

  // const profileName = document.createElement("h1");
  // profileName.className = "profileName";
  // ProfileDescription.appendChild(profileName);
  // ProfileDescription.innerHTML = `Founder | Amazon`;

  // navDisplayPost.append(ProfileDescription);
  // const img = document.createElement("img");
  // profilePic.append(img);

  // // PostImageContainer
  // const PostImageContainer = document.createElement("div");
  // PostImageContainer.className = "PostImageContainer";

  // const img2 = document.createElement("img");
  // PostImageContainer.append(img2);

  // const captionContainer = document.createElement("div");
  // captionContainer.className = "captionContainer";

  // const caption = document.createElement("div");
  // caption.className = "caption";
  // captionContainer.appendChild(caption);

  // const readMore = document.createElement("div");
  // readMore.className = "readMore";
  // captionContainer.appendChild(readMore);

  // const lineSeperation = document.createElement("div");
  // lineSeperation.className = "lineSeperation";

  // const likeSection = document.createElement("div");
  // likeSection.className = "likeSection";

  // const like = document.createElement("div");
  // like.className = "like";

  // const likeIcon = document.createElement("span");
  // likeIcon.className = "likeIcon";
  // likeIcon.innerHTML = `<i class="far fa-lightbulb"></i>`;
  // like.appendChild(likeIcon);

  // const LikeNumber = document.createElement("div");
  // LikeNumber.className = "LikeNumber";
  // LikeNumber.innerText = "0";
  // like.appendChild(LikeNumber);

  // const commentSection = document.createElement("div");
  // commentSection.className = "commentSection";
  // commentSection.innerHTML = `<i class="far fa-comment"></i>`;

  // likeSection.appendChild(like);

  // likeSection.appendChild(commentSection);

  // displayPost.append(navDisplayPost);
  // displayPost.append(PostImageContainer);
  // displayPost.append(captionContainer);
  // displayPost.append(lineSeperation);
  // displayPost.append(likeSection);
  // left.append(displayPost);
}
myposts();
