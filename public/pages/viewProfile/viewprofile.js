checkbox.addEventListener("click", () => {
  if (localStorage.getItem("theme") === "dark") {
    localStorage.setItem("theme", "light");
    document.body.classList.toggle("dark");
  } else if (localStorage.getItem("theme") === "light") {
    localStorage.setItem("theme", "dark");
    document.body.classList.toggle("dark");
  }
});
const EditPostPopUp = document.querySelector(".EditPostPopupContainer");
const body = document.querySelector("body");
const cross = document.querySelector(".fa-times");

const post = document.querySelectorAll(".post");
cross.addEventListener("click", () => {
  EditPostPopUp.classList.remove("visible");
  body.style.overflow = "scroll";
});

// dom manipulation

const username = document.querySelectorAll(".username");
const editProfileButton = document.querySelector(".editProfileButton");
const name = document.querySelector(".name");
const yourBio = document.querySelector(".yourBio");
const profileImageBackend = document.querySelector(".profileImageBackend");

const urlParams = new URLSearchParams(window.location.search);
const userid = urlParams.get("userid");
const self = urlParams.get("self");
var buserid = "";
const deletePostButton = document.querySelector(".deletePostButton");
const saveChangesButton2 = document.querySelector(".saveChangesButton2");

console.log(userid, self);

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

window.addEventListener("load", () => {
  const body = document.querySelector("body");
  body.classList.add("visible");
  if (localStorage.getItem("theme") === null) {
    localStorage.setItem("theme", "light");
    localStorage.getItem("theme");
  } else if (localStorage.getItem("theme") === "dark") {
    console.log(localStorage.getItem("theme"));
    document.body.classList.toggle("dark");
  }

  if (userid === null) {
    location.href = "/pages/feed/";

    //or else display a popup where user doesn't exists :(
  } else {
    fetch(`/details/profile/${userid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const mainContainer = document.querySelector(".mainContainer");
        mainContainer.classList.add("visible");

        const loadingAnimation = document.querySelector(".loadingAnimation");
        loadingAnimation.classList.add("visible");
        console.log(data);
        const profileImage = document.querySelector(".profileImage");
        profileImage.src = data[1].profilepic;
        for (var i = 0; i < username.length; i++) {
          username[i].innerText = data[0].firstname + " " + data[0].lastname;
        }
        yourBio.innerText = data[0].bio;
        if (data[0].designation === "" || data[0].company === "") {
          document.querySelector(".designationCompany").innerHTML = `<p></p>`;
        } else {
          document.querySelector(".designationCompany").innerText =
            data[0].designation + " | " + data[0].company;
        }
        // dom manipulation for profile image, name, bio of user
        const img = document.querySelectorAll(".leftProfileImageBackend");
        if (data[0].mime === null) {
          var i;
          for (i = 0; i < img.length; i++) {
            img[i].src = "../../images/default-profile-picture1.jpg";
          }
        } else {
          var i;
          for (i = 0; i < img.length; i++) {
            img[i].src = data[0].profilepic;
          }
        }
        //dom manipulation for all posts
        const displayPostGrid = document.querySelector(".displayPostGrid");

        const posts = data[2];
        posts.forEach((obj) => {
          // console.log(obj);

          const post = document.createElement("div");
          post.className = "post ";

          const postImageBackend = document.createElement("img");
          postImageBackend.className =
            "profileImageBackend postImageBackend postid=" + obj.postid;

          postImageBackend.src = obj.postspic;

          post.appendChild(postImageBackend);

          displayPostGrid.appendChild(post);
        });

        // checking if user is viewing its profile or not. If so, display edit profile button
        // if the user's id and the one which user is viewing profile is same, then
        // console.log(data[1].userid, userid);
        buserid = data[1].userid;
        if (data[1].userid == userid) {
          console.log("user is viewing it's own profile");
          document.querySelector(".editProfileButton").classList.add("visible");
        }

        //post edit or delete functionality
        const postImageBackend = document.querySelectorAll(".postImageBackend");
        for (var i = 0; i < postImageBackend.length; i++) {
          postImageBackend[i].addEventListener("click", (event) => {
            var temp = event.target.className.split(" ");
            // console.log(temp);

            for (var j = 0; j < temp.length; j++) {
              if (temp[j].startsWith("postid")) {
                postid = temp[j].split("=")[1];
                // console.log(postid);

                var tempPost = data[2];
                // console.log(tempPost);
                var index = tempPost.findIndex((x) => x.postid == postid);
                var editDelete = [data[2][index]];
                // console.log(editDelete);

                if (userid == buserid) {
                  editDeletePost(editDelete);
                }
              }
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
});

function editDeletePost(data) {
  console.log(data);
  data = data[0];

  const PostImage = document.querySelector(".PostImage");
  PostImage.src = data.postspic;

  const caption = document.querySelector(".caption");
  caption.value = data.content;
  EditPostPopUp.classList.add("visible");
  body.style.overflow = "hidden";

  deletePostButton.addEventListener("click", () => {
    console.log("clicking deletePostButton");
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/posts/deletepost/${data.postid}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data.message === "Post deleted successful") {
              EditPostPopUp.classList.remove("visible");
              body.style.overflow = "scroll";
              Swal.fire(
                "Deleted!",
                "Your post has been deleted.",
                "success"
              ).then(() => {
                location.reload();
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

  saveChangesButton2.addEventListener("click", () => {
    console.log("clicking saveChangesButton2");
    const captionValue = caption.value;
    console.log(caption.value);
    fetch(`/posts/updatepost/${data.postid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({ captionValue }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.message === "Post updated successfully") {
          EditPostPopUp.classList.remove("visible");
          body.style.overflow = "scroll";
          Swal.fire({
            icon: "success",
            title: "Post Updated Successful...",
          }).then(() => {
            location.reload();
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
  });
}

const homeButton = document.querySelector(".homeButton");
homeButton.addEventListener("click", () => {
  location.href = "/pages/feed/";
});
