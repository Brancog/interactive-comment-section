const commentsContainer = document.querySelector(".comments");

init();

async function init() {
  // CHECK IF THERE IS NO DATA STORED IN LOCAL STORAGE,IF NOT,FETCH DATA FROM DATA.JSON AND STORE IT INSIDE LOCALSTORAGE
  if (!localStorage.getItem("data")) {
    await fetchData("data.json");
  }

  const data = await localStorage.getItem("data");
  renderComments(data);
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
              <a class="comment-box__delete">
                <img
                  class="comment-box__delete-btn"
                  src="images/icon-delete.svg"
                  alt=""
                />
                <span class="comment-box__delete-btn">Delete</span>
              </a>
              <div class="comment-box__edit">
                <img
                  class="comment-box__edit-btn"
                  src="images/icon-edit.svg"
                  alt=""
                />
                <span class="comment-box__edit-btn">Edit</span>
              </div>
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
