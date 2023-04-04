// VARIABLE DECLARATIONS
const body = document.querySelector("body");
const commentRateBtns = document.querySelectorAll(".comment-box__rate-btn");
const curUserButtons = document.querySelector(".comment-box__cur-user-buttons");
const modal = document.querySelector(".modal");
const modalButtons = document.querySelector(".modal__buttons");

// EVENT LISTENERS

// EVENT LISTENER FOR MODAL BUTTONS
modalButtons.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal__btn--no")) {
    e.preventDefault();
    modal.close();
  }
});
// EVENT LISTENER FOR COMMENT DELETE BUTTON
curUserButtons.addEventListener("click", (e) => {
  if (e.target.classList.contains("comment-box__delete-btn")) {
    console.log("delete clicked");
    modal.showModal();
  }
  if (e.target.classList.contains("comment-box__edit-btn")) {
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
