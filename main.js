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
    const addCommentReply = document.createElement("div");
    addCommentReply.classList.add(
      "add-comment",
      "add-comment--reply",
      "inactive"
    );

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
          <a class="comment-box__reply">
            <img src="images/icon-reply.svg" alt="" />
            <span>Reply</span>
          </a>
        </div>
    `;

    addCommentReply.innerHTML = `
            <textarea
              name="comment"
              class="add-comment__text-input"
              cols=""
              rows="3"
              placeholder="Add a comment..."
            ></textarea>
            <div class="add-comment__user-img-wrap">
              <img src="images/avatars/image-juliusomo.webp" alt="user image" />
            </div>
            <button class="add-comment__send-btn add-comment__send-btn--reply">reply</button>
    `;

    commentsContainer.appendChild(commentBox);
    commentsContainer.appendChild(addCommentReply);

    // CHECK IF A COMMENT HAS REPLIES AND RENDER THEM IF IT DOES
    if (comment.replies.length > 0) {
      const replyWrap = document.createElement("div");
      const verticalLine = document.createElement("div");

      replyWrap.classList.add("reply-wrap");
      verticalLine.classList.add("vertical-line");

      commentsContainer.appendChild(replyWrap);
      replyWrap.appendChild(verticalLine);

      for (const reply of comment.replies) {
        const addCommentReply = document.createElement("div");
        addCommentReply.classList.add(
          "add-comment",
          "add-comment--reply",
          "inactive"
        );

        addCommentReply.innerHTML = `
              <textarea
                name="comment"
                class="add-comment__text-input"
                cols=""
                rows="3"
                placeholder="Add a comment..."
              ></textarea>
              <div class="add-comment__user-img-wrap">
                <img src="images/avatars/image-juliusomo.webp" alt="user image" />
              </div>
              <button class="add-comment__send-btn add-comment__send-btn--reply">reply</button>
      `;

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
        replyWrap.appendChild(addCommentReply);
      }
    }
  }
}

function deployEventListeners(data) {
  let comments = JSON.parse(data).comments;
  const curUserButtons = document.querySelectorAll(
    ".comment-box__cur-user-buttons"
  );
  const commentReplyBtns = document.querySelectorAll(".comment-box__reply");
  const addCommentSendBtns = document.querySelectorAll(
    ".add-comment__send-btn"
  );
  const commentRateBtns = document.querySelectorAll(".comment-box__rate-btn");
  let replyingTo = "";
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
  if (curUserButtons) {
    curUserButtons.forEach((curUserBtns) => {
      curUserBtns.addEventListener("click", (e) => {
        idToDelete = e.target.closest(".comment-box").getAttribute("id");

        if (
          e.target.closest("a").classList.contains("comment-box__delete-btn")
        ) {
          modal.showModal();
        }
        if (e.target.closest("a").classList.contains("comment-box__edit-btn")) {
          console.log("edit button clicked");
        }
      });
    });
  }

  // EVENT LISTENERS FOR COMMENT REPLY BUTTONS
  commentReplyBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const addCommentReplies = document.querySelectorAll(
        ".add-comment--reply"
      );
      addCommentReplies.forEach((replyInput) => {
        replyInput.classList.add("inactive");
      });

      e.target.closest(".comment-box").nextSibling.classList.remove("inactive");
      replyingTo = e.target
        .closest(".comment-box")
        .querySelector(".comment-box__user-name").textContent;
      e.target
        .closest(".comment-box")
        .nextSibling.querySelector("textarea").value = `@${replyingTo}, `;
      e.target
        .closest(".comment-box")
        .nextSibling.querySelector("textarea")
        .focus();
    });
  });

  // EVENT LISTENERS FOR SEND/REPLY COMMENT BUTTONS
  addCommentSendBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      // TAKE THE MAIN COMMENT TEXT,FILTER OUT REPLYING TO TAG
      const newCommentText = e.target
        .closest(".add-comment")
        .querySelector("textarea")
        .value.split(", ")
        .pop();
      // HIDE THE REPLY BOX
      e.target.closest(".add-comment").classList.add("inactive");
      // SELECT THE PREVIOUS COMMENT BOX AND ADD A NEW ONE JUST BENEATH

      comments = JSON.parse(data).comments;

      const repliedCommentId = +e.target
        .closest(".add-comment")
        .previousSibling.getAttribute("id");

      const replyingToUser = e.target
        .closest(".add-comment")
        .previousSibling.querySelector(".comment-box__user-name").textContent;

      const newReply = {
        id: "",
        content: newCommentText,
        createdAt: "just now",
        score: 0,
        replyingTo: replyingToUser,
        user: {
          image: {
            webp: JSON.parse(data).currentUser.image.webp,
          },
          username: JSON.parse(data).currentUser.username,
        },
      };

      comments.forEach((comment) => {
        if (comment.id === repliedCommentId) {
          comment.replies.push(newReply);
        }
        if (comment.replies.length > 0) {
          comment.replies.forEach((reply) => {
            if (reply.id === repliedCommentId) {
              comment.replies.push(newReply);
            }
          });
        }
      });

      let commentIndexId = 1;
      comments.forEach((comment) => {
        comment.id = commentIndexId;
        commentIndexId += 1;
        if (comment.replies.length > 0) {
          comment.replies.forEach((reply) => {
            reply.id = commentIndexId;
            commentIndexId += 1;
          });
        }
      });

      const newDataObj = {
        currentUser: JSON.parse(data).currentUser,
        comments: comments,
      };

      localStorage.setItem("data", JSON.stringify(newDataObj));

      // REMOVE AND RE-RENDER ALL COMMENTS AND REPLIES
      commentsContainer.innerHTML = "";
      renderComments(localStorage.getItem("data"));
      deployEventListeners(localStorage.getItem("data"));
      // e.target
      //   .closest(".add-comment")
      //   .previousSibling.insertAdjacentHTML("afterend",newComment);
    });
  });

  // EVENT LISTENERS FOR COMMENT RATING BUTTONS
  commentRateBtns.forEach((rateBtn) =>
    rateBtn.addEventListener("click", updateCommentScore)
  );

  // COMMENT RATING FUNCTION
  function updateCommentScore(e) {
    const newData = {
      currentUser: JSON.parse(data).currentUser,
      comments: comments,
    };

    const ratedCommentId = +e.target.closest(".comment-box").getAttribute("id");
    const ratingVal = this.closest(".comment-box__rate").querySelector(
      ".comment-box__rate-value"
    );
    const rateActionBtn = e.target.closest(".comment-box__rate-btn");

    if (rateActionBtn.classList.contains("comment-box__rate--plus-wrap")) {
      ratingVal.textContent = +ratingVal.textContent + 1;

      comments.forEach(function (comment, i) {
        if (comment.id === ratedCommentId) {
          comment.score += 1;
          localStorage.setItem("data", JSON.stringify(newData));
        }
        comment.replies.forEach(function (reply, i) {
          if (reply.id === ratedCommentId) {
            reply.score += 1;
            localStorage.setItem("data", JSON.stringify(newData));
          }
        });
      });
    }

    if (rateActionBtn.classList.contains("comment-box__rate--minus-wrap")) {
      ratingVal.textContent = +ratingVal.textContent - 1;

      comments.forEach(function (comment, i) {
        if (comment.id === ratedCommentId) {
          comment.score -= 1;
          localStorage.setItem("data", JSON.stringify(newData));
        }
        comment.replies.forEach(function (reply, i) {
          if (reply.id === ratedCommentId) {
            reply.score -= 1;
            localStorage.setItem("data", JSON.stringify(newData));
          }
        });
      });
    }
  }
}
