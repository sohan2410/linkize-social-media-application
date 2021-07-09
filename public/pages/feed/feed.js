const checkbox = document.querySelector(".checkbox");
const likeIcon = document.querySelector(".likeIcon");
let clicked = false;
let count = 0;
const Likes = document.querySelector(".LikeNumber");
const body = document.querySelector("body");
const sharePostButton = document.querySelector(".startPostButton");
const cross = document.querySelector(".fa-times");
const logOut = document.querySelector(".LogOut");
const hamburgerLogOut = document.querySelector(".logOut");
const dropDownContainer = document.querySelector(".dropDownContainer");
let image_compressed = "";
let usersArray = [];
//hamburger
const HamburgerMenuLinks = document.querySelector(".HamburgerMenuLinks");
const Hamburger = document.querySelector(".HamLine");
const Links = document.querySelector(".Links");
const Link2 = document.querySelector(".Link2");
const Link3 = document.querySelector(".Link3");
const Link4 = document.querySelector(".Link4");
Hamburger.addEventListener("click", () => {
  HamburgerMenuLinks.classList.toggle("open");
  Links.classList.toggle("fade");
  Link2.classList.toggle("fade");
  Link3.classList.toggle("fade");
  Link4.classList.toggle("fade");
});

function getCookie(name) {
  function escape(s) {
    return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, "\\$1");
  }
  var match = document.cookie.match(
    RegExp("(?:^|;\\s*)" + escape(name) + "=([^;]*)")
  );
  return match ? match[1] : null;
}

function getToken() {
  if (localStorage.getItem("jwt")) {
    return localStorage.getItem("jwt");
  } else {
    return getCookie("linkize");
  }
}
const token = getToken();
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
  fetch(`/posts/createnewpost`, {
    method: "POST",
    headers: {
      authorization: token,
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
      Swal.fire({
        icon: "success",
        title: "Post Uploaded Successful...",
      }).then(() => {
        location.reload();
      });
    })
    .catch((err) => {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Server Error Occured, Please Try Again Later !!",
      });
    });
}

checkbox.addEventListener("click", () => {
  if (localStorage.getItem("theme") === "dark") {
    localStorage.setItem("theme", "light");
    document.body.classList.toggle("dark");
  } else if (localStorage.getItem("theme") === "light") {
    localStorage.setItem("theme", "dark");
    document.body.classList.toggle("dark");
  }
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

  if (localStorage.getItem("theme") === null) {
    localStorage.setItem("theme", "light");
    localStorage.getItem("theme");
  } else if (localStorage.getItem("theme") === "dark") {
    console.log(localStorage.getItem("theme"));
    document.body.classList.toggle("dark");
  }

  console.log(token);
  if (token === null) {
    location.href = "/pages/signin";
  } else {
    fetch(`/posts/getpics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        fullname.innerHTML = data.firstname + " " + data.lastname;
        const img = document.querySelectorAll(".profileImageBackend");
        if (data.mime === null) {
          var i;
          for (i = 0; i < img.length; i++) {
            img[i].src = "../../images/default-profile-picture1.jpg";
          }
        } else {
          var i;
          for (i = 0; i < img.length; i++) {
            img[i].src = data.data;
          }
        }

        //changing the href for view your profile
        document.querySelector(".viewYourProfile").href =
          "/pages/viewProfile?userid=" + data.userid + "&self=true";
        Link2.addEventListener("click", (e) => {
          location.href =
            "/pages/viewProfile?userid=" + data.userid + "&self=true";
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Server Error Occured, Please Try Again Later !!",
        });
      });

    fetch(`/details/search`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        data = data.data;
        usersArray = data;
        console.log(usersArray);
        // searchUsers(data);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Server Error Occured, Please Try Again Later !!",
        });
      });
  }
});

sharePostButton.addEventListener("click", () => {
  const navBar = document.querySelector("nav");
  const container = document.querySelector(".superContainer");
  const popUp = document.querySelector(".popUpMakeAPostContainer");
  const body = document.querySelector("body");
  body.style.overflow = "hidden";
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
  const body = document.querySelector("body");
  body.style.overflow = "scroll";
  navBar.classList.remove("afterPopUp");
  container.classList.remove("afterPopUp");
});

const profileImageTopBarContainer = document.querySelector(
  ".profileImageTopBarContainer"
);
profileImageTopBarContainer.addEventListener("click", () => {
  dropDownContainer.classList.toggle("visible");
});

function logOutButton() {
  console.log("clicking on logout");
  const cookie = getCookie("linkize");

  console.log(token);
  // if (token) {
  localStorage.removeItem("jwt");
  // location.href = "/pages/signin";
  // } else {
  document.cookie = "linkize=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  location.href = "/pages/signin";
  // }
}

logOut.addEventListener("click", () => {
  logOutButton();
});
hamburgerLogOut.addEventListener("click", () => {
  console.log("clicking on logout");
  const cookie = getCookie("linkize");

  console.log(token);
  if (token) {
    localStorage.removeItem("jwt");
    location.href = "/pages/signin";
  } else {
    document.cookie = "linkize=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    location.href = "/pages/signin";
  }
});

async function myposts() {
  fetch(`/posts/getallposts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
  })
    .then((resp) => resp.json())
    .then((data) => {
      const mainContainer = document.querySelector(".mainContainer");
      mainContainer.classList.add("visible");

      const loadingAnimation = document.querySelector(".loadingAnimation");
      loadingAnimation.classList.add("visible");

      // console.log(data.temp);
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
        profileName.className = "profileName ";
        profileName.innerHTML = " Sohan bro";
        ProfileDescription.appendChild(profileName);
        ProfileDescription.innerHTML = `<a href="../viewProfile/?userid=${obj.userid}"><h1 class=displayPostName>${obj.firstname} ${obj.lastname}</h1></a>`;

        if (obj.designation === "" || obj.designation === "") {
          ProfileDescription.innerHTML += ` `;
        } else {
          ProfileDescription.innerHTML += `<p>${obj.designation} | ${obj.company}</p>`;
        }

        navDisplayPost.append(ProfileDescription);
        const img = document.createElement("img");
        profilePic.append(img);

        // PostImageContainer
        const PostImageContainer = document.createElement("div");
        PostImageContainer.className = "PostImageContainer";

        const img2 = document.createElement("img");
        PostImageContainer.append(img2);
        img2.src = obj.postspic;

        const captionContainer = document.createElement("div");
        captionContainer.className = "captionContainer";

        const caption = document.createElement("div");
        caption.className = "caption";
        caption.innerHTML = `${obj.content}`;
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

        const likeIcon = document.createElement("div");
        likeIcon.className = "likeIcon";
        const likes = obj.likes;
        const tempEmail = obj.logemail;

        const bulb = document.createElement("div");
        bulb.className = `far fa-lightbulb likebtn postid=${obj.postid} likes=${likes.length} logemail=${obj.logemail} likedBy=${obj.likes}`;

        likeIcon.append(bulb);
        // likeIcon.innerHTML = `<i class="far fa-lightbulb likebtn postid=${obj.postid} likes=${likes.length} logemail=${obj.logemail} likedBy=${obj.likes}"></i>`;

        if (likes.includes(tempEmail)) {
          var temp = bulb.className;
          bulb.className = "fill " + temp;
        } else {
          // bulb.innerHTML = `<i class="far fa-lightbulb"></i>`;
        }
        like.appendChild(likeIcon);

        const LikeNumber = document.createElement("div");
        LikeNumber.className = `LikeNumber postid=${obj.postid}`;
        if (obj.likes.length > 0) {
          LikeNumber.innerText = obj.likes.length;
        } else {
          LikeNumber.innerText = 0;
        }
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
        left.append(displayPost);

        if (obj.mime === null) {
          img.src = "../../images/Icon.png";
        } else {
          img.src = obj.profilepic;
        }
      });
      const likebtn = document.querySelectorAll(".likebtn");
      for (var i = 0; i < likebtn.length; i++) {
        likebtn[i].addEventListener("click", (event) => {
          var temp = event.target.className.split(" ");
          var postid, noOfLikes, logEmail, likedBy;
          for (var j = 0; j < temp.length; j++) {
            if (temp[j].startsWith("postid")) {
              postid = temp[j].split("=")[1];
            }

            if (temp[j].startsWith("likes")) {
              noOfLikes = temp[j].split("=")[1];
            }

            if (temp[j].startsWith("logemail")) {
              logEmail = temp[j].split("=")[1];
            }

            if (temp[j].startsWith("likedBy")) {
              likedBy = temp[j].split("=")[1];
            }
          }
          var likedByUsers = likedBy.split(",");

          if (likedByUsers.includes(logEmail)) {
            //then dislike it
            const likeIconInner = document.getElementsByClassName(
              "postid=" + postid
            );
            var noOfLikes = parseInt(likeIconInner[1].innerText);
            likeIconInner[1].innerText = noOfLikes - 1;
            fetch(`/posts/updatedislike/${postid}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                authorization: token,
              },
            })
              .then((res) => res.json())
              .then((data) => {
                console.log(data);
                location.reload();
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            // like it
            const likeIconInner = document.getElementsByClassName(
              "postid=" + postid
            );
            var noOfLikes = parseInt(likeIconInner[1].innerText);
            likeIconInner[1].innerText = noOfLikes + 1;
            fetch(`/posts/updatelike/${postid}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                authorization: token,
              },
            })
              .then((res) => res.json())
              .then((data) => {
                console.log(data);
                location.reload();
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Server Error Occured, Please Try Again Later !!",
      });
    });
}
myposts();

const feedbackButton = document.querySelector(".feedback");
feedbackButton.addEventListener("click", () => {
  const { value: text } = Swal.fire({
    input: "textarea",
    inputLabel: "Message",
    inputPlaceholder: "Type your message here...",
    inputAttributes: {
      "aria-label": "Type your message here",
    },
    showCancelButton: true,
    width: '800px'
  }).then((result) => {
    if (result.value) {
      console.log(result.value);
      var feedback = result.value;
      fetch(`/feedback/sendmail`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({
          feedback: feedback,
        }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          if (data.message === "feedback sent successful") {
            Swal.fire({
              icon: "success",
              title: "Feedback sent successful...",
              text: "Thanks for your feedback :)",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Server Error Occured, Please Try Again Later !!",
          });
        });
    }
  });
});

//Getting position of dropdown element
const topBarProfileImage = document.querySelector(".topBarProfile");
let xPos = 0;
let yPos = 0;
xPos +=
  topBarProfileImage.offsetLeft -
  topBarProfileImage.scrollLeft +
  topBarProfileImage.clientLeft;
yPos +=
  topBarProfileImage.offsetTop -
  topBarProfileImage.scrollTop +
  topBarProfileImage.clientTop;

//Setting dropDown in this position
dropDownContainer.style.top = `${yPos + 56}px`;
dropDownContainer.style.left = `${xPos - 175}px`;

//Getting position of search div
const searchDiv = document.querySelector(".searchDiv");
let xPosSearch = 0;
let yPosSearch = 0;
xPosSearch +=
  searchDiv.offsetLeft - searchDiv.scrollLeft + searchDiv.clientLeft;
yPosSearch += searchDiv.offsetTop - searchDiv.scrollTop + searchDiv.clientTop;
console.log(xPosSearch, yPosSearch);

const dropDownSearchBox = document.querySelector(".dropDownSearchBox");
dropDownSearchBox.style.top = `${yPosSearch+40}px`;
dropDownSearchBox.style.left = `${xPosSearch}px`;

const searchInput = document.querySelector(".searchInput");

const createCardList = (obj) => {
  if (obj.length === usersArray.length) {
    dropDownSearchBox.classList.remove("visible");
  }
  if (obj.length > 0) {
    dropDownSearchBox.innerHTML = "";
    dropDownSearchBox.classList.add("visible");

    for (var i = 0; i < obj.length; i++) {
      dropDownSearchBox.innerHTML += `<div class="elementsDropDown after"><a class="drowDownLink" href="/pages/viewProfile?userid=${obj[i].userid}">${obj[i].firstname} ${obj[i].lastname}</a></div>`;
    }
  }
};
searchInput.addEventListener("input", (e) => {
  const searchStr = e.target.value.toLowerCase();
  // console.log(searchStr);
  if (searchStr.length > 0) {
    const filteredArray = usersArray.filter((ele) => {
      return (
        ele.firstname.toLowerCase().includes(searchStr) ||
        ele.lastname.toLowerCase().includes(searchStr)
      );
    });
    createCardList(filteredArray);
  } else if(searchStr.length===0){
    dropDownSearchBox.classList.remove("visible");

  }
});
