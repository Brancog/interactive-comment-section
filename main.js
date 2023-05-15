"use strict";

//  VARIABLE DECLARATIONS
const mainContainer = document.querySelector(".container");
const commentsContainer = document.querySelector(".comments");
const body = document.querySelector("body");
let idToDelete;

init();

async function init() {
  // CHECK IF THERE IS NO DATA STORED IN LOCAL STORAGE,IF NOT,FETCH DATA FROM DATA.JSON AND STORE IT INSIDE LOCALSTORAGE
  if (!localStorage.getItem("data")) {
    await fetchData("data.json");
  }

  let data = localStorage.getItem("data");

  // GENERATE MODAL ELEMENT
  if (!document.querySelector(".modal")) {
    const modal = document.createElement("dialog");
    modal.innerHTML = `<span class="modal__heading">Delete comment</span>
    <p class="modal__text-content">
      Are you sure you want to delete this comment? This will remove the
      comment and can't be undone.
    </p>
    <div class="modal__buttons">
      <a href="" class="modal__btn modal__btn--no">no, cancel</a>
      <a href="" class="modal__btn modal__btn--yes">yes, delete</a>
    </div>`;

    modal.classList.add("modal");
    modal.setAttribute("id", "modal");

    mainContainer.appendChild(modal);
  }
  // EVENT LISTENER FOR MODAL BUTTONS

  const modal = document.querySelector(".modal");
  const modalButtons = document.querySelector(".modal__buttons");
  modalButtons.addEventListener("click", (e) => {
    let comments = JSON.parse(localStorage.getItem("data")).comments;
    if (e.target.classList.contains("modal__btn--no")) {
      e.preventDefault();
      modal.close();
    }
    if (e.target.classList.contains("modal__btn--yes")) {
      e.preventDefault();

      if (document.getElementById(idToDelete))
        document.getElementById(idToDelete).remove();

      // DELETE THE COMMENT FROM DATA OBJECT AND UPDATE LOCAL STORAGE
      comments.forEach(function (comment, i) {
        if (comment.id === +idToDelete) {
          console.log(idToDelete);
          comments.splice(i, 1);
        }
        comment.replies.forEach(function (reply, i) {
          if (reply.id === +idToDelete) {
            console.log(idToDelete);
            comment.replies.splice(i, 1);
          }
        });
      });

      // GIVE NEW ID TO COMMENTS
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

      const newData = {
        currentUser: JSON.parse(data).currentUser,
        comments: comments,
      };
      localStorage.setItem("data", JSON.stringify(newData));
      e.preventDefault();
      modal.close();
      commentsContainer.innerHTML = "";
      renderComments(localStorage.getItem("data"));
      deployEventListeners(localStorage.getItem("data"));
    }
  });

  // GENERATE NEW COMMENT INPUT BOX
  if (!document.querySelector(".add-comment")) {
    const addNewCommentBox = document.createElement("div");
    addNewCommentBox.innerHTML = `<textarea
  name="comment"
  class="add-comment__text-input"
  cols=""
  rows="3"
  placeholder="Add a comment..."
></textarea>
<div class="add-comment__user-img-wrap">
  <img src="images/avatars/image-juliusomo.webp" alt="user image" />
</div>
<button class="add-comment__new-comment-btn">send</button>`;

    addNewCommentBox.classList.add("add-comment");
    mainContainer.appendChild(addNewCommentBox);
  }
  const addNewComment = document.querySelector(".add-comment__new-comment-btn");

  // EVENT LISTENER FOR ADD NEW COMMENT SEND BUTTON
  addNewComment.addEventListener("click", (e) => {
    e.preventDefault();

    const newCommentText = e.target
      .closest(".add-comment")
      .querySelector("textarea").value;

    let comments = JSON.parse(localStorage.getItem("data")).comments;

    const newComment = {
      id: "",
      content: newCommentText,
      createdAt: "just now",
      replies: [],
      score: 0,
      user: {
        image: {
          webp: JSON.parse(data).currentUser.image.webp,
        },
        username: JSON.parse(data).currentUser.username,
      },
    };

    comments.push(newComment);

    // GIVE NEW ID TO COMMENTS
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

    // console.log(newDataObj);

    localStorage.setItem("data", JSON.stringify(newDataObj));

    // REMOVE AND RE-RENDER ALL COMMENTS AND REPLIES
    commentsContainer.innerHTML = "";

    renderComments(localStorage.getItem("data"));
    deployEventListeners(localStorage.getItem("data"));
    // RESET TEXT INPUT
    e.target.closest(".add-comment").querySelector("textarea").value = "";
    // location.reload();
  });
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
    if (comment.user.username === curUser.username) {
      commentBox.classList.add("comment-box--admin");

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
          <span class="comment-box__you-badge">you</span>
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
    }

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
  const commentScoreVal = document.querySelectorAll(".comment-box__rate-value");
  const editCommentBtns = document.querySelectorAll(".comment-box__edit-btn");

  const commentReplyBtns = document.querySelectorAll(".comment-box__reply");
  const addCommentSendBtns = document.querySelectorAll(
    ".add-comment__send-btn"
  );
  const commentRateBtns = document.querySelectorAll(".comment-box__rate-btn");
  let replyingTo = "";

  // EVENT LISTENER FOR COMMENT DELETE BUTTON
  if (curUserButtons) {
    curUserButtons.forEach((curUserBtns) => {
      curUserBtns.addEventListener("click", (e) => {
        idToDelete = e.target.closest(".comment-box").getAttribute("id");

        if (e.target.closest("a")) {
          if (
            e.target.closest("a").classList.contains("comment-box__delete-btn")
          ) {
            modal.showModal();
          }
        }
      });
    });
  }

  // EVENT LISTENER FOR EDIT COMMENT BUTTON

  editCommentBtns.forEach((editBtn) => {
    editBtn.addEventListener("click", (e) => {
      e.preventDefault();
      comments = JSON.parse(localStorage.getItem("data")).comments;
      // GET ID OF ELEMENT TO BE EDITED
      const id = +e.target.closest(".comment-box").getAttribute("id");

      // comments = JSON.parse(data).comments;
      let commentToEdit = {};

      // SEARCH FOR THE ID OF THE COMMENT TO BE EDITED AND SAVE IT
      comments.forEach((comment) => {
        if (comment.id === id) {
          commentToEdit = comment;
        }
        if (comment.replies.length > 0) {
          comment.replies.forEach((reply) => {
            if (reply.id === id) {
              commentToEdit = reply;
            }
          });
        }
      });

      // REMOVE COMMENT BOX AND INTRODUCE EDIT BOX
      e.target.closest(".comment-box").insertAdjacentHTML(
        "afterend",
        `
      <div class="comment-edit-box">
        <div class="comment-box__title">
          <a href="" class="comment-box__user">
            <div class="comment-box__user-img-wrap">
              <img src='${commentToEdit.user.image.webp}' alt="user image" />
            </div>
            <span class="comment-box__user-name">${commentToEdit.user.username}</span>
          </a>
          <span class="comment-box__you-badge">you</span>
          <span class="comment-box__time-ago">${commentToEdit.createdAt}</span>
        </div>
        <div class="comment-edit-box__text-content">
          <textarea class="comment-edit-box__text-input" name="" id="" cols="" rows="">@${commentToEdit.replyingTo}, ${commentToEdit.content}</textarea>
        </div>
        <div class="comment-box__rate">
          <div class="comment-box__rate-btn comment-box__rate--plus-wrap">
            <img
              src="images/icon-plus.svg"
              alt=""
              class="comment-box__rate--plus"
            />
          </div>
          <span class="comment-box__rate-value">${commentToEdit.score}</span>
          <div class="comment-box__rate-btn comment-box__rate--minus-wrap">
            <img
              src="images/icon-minus.svg"
              alt=""
              class="comment-box__rate--minus"
            />
          </div>
        </div>
        
        <button class="comment-box__edit-update-btn">update</button>
      </div>
      `
      );

      // FIND AND FOCUS ON THE INPUT FIELD
      e.target
        .closest(".comment-box")
        .nextElementSibling.querySelector(".comment-edit-box__text-input")
        .setSelectionRange(-1, -1);

      e.target
        .closest(".comment-box")
        .nextElementSibling.querySelector(".comment-edit-box__text-input")
        .focus();

      e.target.closest(".comment-box").remove();

      // EVENT LISTENER FOR UPDATE COMMENT BUTTON
      let updateBtns = document.querySelectorAll(
        ".comment-box__edit-update-btn"
      );

      updateBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const updatedCommentText = e.target
            .closest(".comment-edit-box")
            .querySelector("textarea")
            .value.split(", ")
            .pop();

          const commentEditBox = document.querySelector(".comment-edit-box");
          commentEditBox.remove();

          const editedReply = {
            id: commentToEdit.id,
            content: updatedCommentText,
            createdAt: "just now",
            score: commentToEdit.score,
            replyingTo: commentToEdit.replyingTo,
            replies: [],
            user: {
              image: {
                webp: JSON.parse(data).currentUser.image.webp,
              },
              username: JSON.parse(data).currentUser.username,
            },
          };
          comments.forEach((comment, i) => {
            if (comment.id === commentToEdit.id) {
              comments.splice(i, 1);
              comments.splice(i, 0, editedReply);
            }
            if (comment.replies.length > 0) {
              comment.replies.forEach((reply, j) => {
                if (reply.id === commentToEdit.id) {
                  comment.replies.splice(j, 1);
                  comment.replies.splice(j, 0, editedReply);
                }
              });
            }
          });
          const newDataObj = {
            currentUser: JSON.parse(data).currentUser,
            comments: comments,
          };
          localStorage.setItem("data", JSON.stringify(newDataObj));
          commentsContainer.innerHTML = "";
          renderComments(localStorage.getItem("data"));
          deployEventListeners(localStorage.getItem("data"));
        });
      });
    });
  });

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

  // EVENT LISTENERS FOR REPLY COMMENT BUTTONS
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

      comments = JSON.parse(localStorage.getItem("data")).comments;

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

      console.log(newDataObj);

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

  // EVENT LISTENER FOR COMMENT SCORE VALUE

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

      newData.comments.forEach(function (comment, i) {
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
