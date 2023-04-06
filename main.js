"use strict";

//  VARIABLE DECLARATIONS
const commentsContainer = document.querySelector(".comments");
const body = document.querySelector("body");
const modal = document.querySelector(".modal");
const modalButtons = document.querySelector(".modal__buttons");

init();

async function init() {
  // CHECK IF THERE IS NO DATA STORED IN LOCAL STORAGE,IF NOT,FETCH DATA FROM DATA.JSON AND STORE IT INSIDE LOCALSTORAGE
  if (!localStorage.getItem("data")) {
    await fetchData("data.json");
  }

  let data = localStorage.getItem("data");
  renderComments(data);
  deployEventListeners(data);
}

async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();

  localStorage.setItem("data", JSON.stringify(data));
}

function renderComments(data) {
  const dataObj = JSON.parse(data);
  const comments = dataObj.comments;
  const curUser = dataObj.currentUser;

  //  LOOP OVER THE COMMENTS ARRAY AND GENERATE HTML ELEMENTS
  for (const comment of comments) {
    const commentBox = document.createElement("div");
    commentBox.classList.add("comment-box");

    commentBox.setAttribute("id", `${comment.id}`);
    commentBox.innerHTML = `
    <div class="comment-box__title">
            <a href="" class="comment-box__user">
              <div class="comment-box__user-img-wrap">
                <img
                  src="${comment.user.image.webp}"
                  alt="user image"
                />
              </div>
              <span class="comment-box__user-name">${comment.user.username}</span>
            </a>
            <span class="comment-box__time-ago">${comment.createdAt}</span>
          </div>
          <div class="comment-box__text-content">
            <p>
              ${comment.content}
            </p>
          </div>
          <div class="comment-box__rate">
            <div class="comment-box__rate-btn comment-box__rate--plus-wrap">
              <img
                src="images/icon-plus.svg"
                alt=""
                class="comment-box__rate--plus"
              />
            </div>
            <span class="comment-box__rate-value">${comment.score}</span>
            <div class="comment-box__rate-btn comment-box__rate--minus-wrap">
              <img
                src="images/icon-minus.svg"
                alt=""
                class="comment-box__rate--minus"
              />
            </div>
          </div>
          <div class="comment-box__reply">
            <img src="images/icon-reply.svg" alt="" />
            <span>Reply</span>
          </div>
        </div>
    `;

    commentsContainer.appendChild(commentBox);

    // CHECK IF A COMMENT HAS REPLIES AND RENDER THEM IF IT DOES
    if (comment.replies.length > 0) {
      const replyWrap = document.createElement("div");
      const verticalLine = document.createElement("div");

      replyWrap.classList.add("reply-wrap");
      verticalLine.classList.add("vertical-line");

      commentsContainer.appendChild(replyWrap);
      replyWrap.appendChild(verticalLine);

      for (const reply of comment.replies) {
        const commentBoxReply = document.createElement("div");
        commentBoxReply.setAttribute("id", `${reply.id}`);

        if (reply.user.username === curUser.username) {
          commentBoxReply.classList.add(
            "comment-box",
            "comment-box--reply",
            "comment-box--reply--admin"
          );
          commentBoxReply.innerHTML = `
<div class="comment-box__title">
              <a href="" class="comment-box__user">
                <div class="comment-box__user-img-wrap">
                  <img
                    src="${reply.user.image.webp}"
                    alt="user image"
                  />
                </div>
                <span class="comment-box__user-name">${reply.user.username}</span>
              </a>
              <span class="comment-box__you-badge">you</span>
              <span class="comment-box__time-ago">${reply.createdAt}</span>
            </div>
            <div class="comment-box__text-content">
              <p>
                <a href="#">@${reply.replyingTo}</a> ${reply.content}
              </p>
            </div>
            <div class="comment-box__rate">
              <div class="comment-box__rate-btn comment-box__rate--plus-wrap">
                <img
                  src="images/icon-plus.svg"
                  alt=""
                  class="comment-box__rate--plus"
                />
              </div>
              <span class="comment-box__rate-value">${reply.score}</span>
              <div class="comment-box__rate-btn comment-box__rate--minus-wrap">
                <img
                  src="images/icon-minus.svg"
                  alt=""
                  class="comment-box__rate--minus"
                />
              </div>
            </div>
            <div class="comment-box__cur-user-buttons">
              <a class="comment-box__delete comment-box__delete-btn">
                <img
                  class=""
                  src="images/icon-delete.svg"
                  alt=""
                />
                <span class="">Delete</span>
              </a>
              <a class="comment-box__edit-btn">
                <img
                  class=""
                  src="images/icon-edit.svg"
                  alt=""
                />
                <span class="">Edit</span>
              </a>
            </div>
`;
        } else {
          commentBoxReply.classList.add("comment-box", "comment-box--reply");

          commentBoxReply.innerHTML = `
        <div class="comment-box__title">
              <a href="" class="comment-box__user">
                <div class="comment-box__user-img-wrap">
                  <img
                    src="${reply.user.image.webp}"
                    alt="user image"
                  />
                </div>
                <span class="comment-box__user-name">${reply.user.username}</span>
              </a>
              <span class="comment-box__time-ago">${reply.createdAt}</span>
            </div>
            <div class="comment-box__text-content">
              <p>
                <a href="#">@${reply.replyingTo}</a> ${reply.content}
              </p>
            </div>
            <div class="comment-box__rate">
              <div class="comment-box__rate-btn comment-box__rate--plus-wrap">
                <img
                  src="images/icon-plus.svg"
                  alt=""
                  class="comment-box__rate--plus"
                />
              </div>
              <span class="comment-box__rate-value">${reply.score}</span>
              <div class="comment-box__rate-btn comment-box__rate--minus-wrap">
                <img
                  src="images/icon-minus.svg"
                  alt=""
                  class="comment-box__rate--minus"
                />
              </div>
            </div>
            <div class="comment-box__reply">
              <img src="images/icon-reply.svg" alt="" />
              <span>Reply</span>
            </div>
        `;
        }

        replyWrap.appendChild(commentBoxReply);
      }
    }
  }
}

function deployEventListeners(data) {
  const curUserButtons = document.querySelector(
    ".comment-box__cur-user-buttons"
  );
  const commentRateBtns = document.querySelectorAll(".comment-box__rate-btn");
  let idToDelete;
  // EVENT LISTENER FOR MODAL BUTTONS
  modalButtons.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal__btn--no")) {
      e.preventDefault();
      modal.close();
    }
    if (e.target.classList.contains("modal__btn--yes")) {
      e.preventDefault();
      document.getElementById(idToDelete).remove();
      const comments = JSON.parse(data).comments;

      // DELETE THE COMMENT FROM DATA OBJECT AND UPDATE LOCAL STORAGE
      comments.forEach(function (comment, i) {
        if (comment.id === +idToDelete) {
          comments[i].splice(i, 1);
        }
        comment.replies.forEach(function (reply, i) {
          if (reply.id === +idToDelete) {
            comment.replies.splice(i, 1);
          }
        });
      });
      console.log(JSON.parse(data));
      console.log(comments);
      const newData = {
        currentUser: JSON.parse(data).currentUser,
        comments: comments,
      };
      localStorage.setItem("data", JSON.stringify(newData));
      e.preventDefault();
      modal.close();
    }
  });
  // EVENT LISTENER FOR COMMENT DELETE BUTTON
  if (!curUserButtons) return;
  curUserButtons.addEventListener("click", (e) => {
    idToDelete = e.target.closest(".comment-box").getAttribute("id");

    if (e.target.closest("a").classList.contains("comment-box__delete-btn")) {
      modal.showModal();
    }
    if (e.target.closest("a").classList.contains("comment-box__edit-btn")) {
      console.log("edit button clicked");
    }
  });

  // EVENT LISTENERS FOR COMMENT RATING BUTTONS
  commentRateBtns.forEach((rateBtn) =>
    rateBtn.addEventListener("click", rateComment)
  );

  // COMMENT RATING FUNCTION
  function rateComment(e) {
    const ratingVal = this.closest(".comment-box__rate").querySelector(
      ".comment-box__rate-value"
    );
    const rateActionBtn = e.target.closest(".comment-box__rate-btn");

    if (rateActionBtn.classList.contains("comment-box__rate--plus-wrap")) {
      ratingVal.textContent = +ratingVal.textContent + 1;
    }

    if (rateActionBtn.classList.contains("comment-box__rate--minus-wrap")) {
      ratingVal.textContent = +ratingVal.textContent - 1;
    }
  }
}
