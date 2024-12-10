const hiddenFormStep = document.querySelector("#form-step-1");
const visibleFormStep = document.querySelector("#form-step-2");
const submitBtn = document.getElementById("submit-form-btn");
const nextBtn = document.getElementById("next-step-btn");
const form = document.forms.namedItem("contact-form");

let currentStep = 1; 
let validInput = 0;
let inputInSteps = -1;

function showStep({ target: { id } }) {
  const isNextStep = id === "next-step-btn";
hiddenFormStep.style.display = isNextStep ? "none" : "block";
  visibleFormStep.style.display = isNextStep ? "block" : "none";
  nextBtn.style.display = isNextStep ? "none" : "block";
  document.getElementById("prev-step-btn").style.display = isNextStep
    ? "block"
    : "none";
  setButtonEnabled();
}

const nav = document.querySelector(".steps");
nav.addEventListener("click", (event) => {
  if (!validateStep()) return;
  unsubscribeInputChange();
  showStep(event);
  subscribeInputChange();
});

function validateInput(input) {
  const errorTextContainer = document.querySelector(
    `p#${input.getAttribute("name")}-error`
  );
  let isInputValid = true;
  if (!input.checkValidity()) {
    isInputValid = false;
    errorTextContainer.textContent = input.validationMessage;
  } else {
    errorTextContainer.textContent = "";
  }
  return isInputValid;
}

function validateStep() {
  const inputs = document.querySelectorAll(`#form-step-${currentStep} .input`);
  let isValid = true;
  inputs.forEach((input) => {
    isValid = validateInput(input) && isValid;
  });
  return isValid;
}

subscribeInputChange();
function onInputChange(event) {
  if (validateInput(event.target)) {
    validInput++;
  }
  setButtonEnabled();
}

function setButtonEnabled() {
  const showBeEnabled = validInput === inputInSteps;
  const btn = submitBtn.style.display != "none" ? submitBtn : nextBtn;
  showBeEnabled
    ? btn.removeAttribute("disabled")
    : btn.setAttribute("disabled", "");
}

function subscribeInputChange() {
  const inputs = document.querySelectorAll(`#form-step-${currentStep} .input`);
  inputInSteps = inputs.length;
  validInput = 0;
  inputs.forEach((input) => {
    input.addEventListener("change", onInputChange);
  });
}

function unsubscribeInputChange() {
  const inputs = document.querySelectorAll(`#form-step-${currentStep} .input`);
  inputs.forEach((input) => {
    input.removeEventListener("change", onInputChange);
  });
}

function sendForm(event) {
  event.preventDefault();
const data = new FormData(event.target);
  fetch("http//localhost:3002/", { method: "POST", body: data })
    .then((res) => res.json())
    .then(console.log(data))
    .catch(console.error);
}

form.addEventListener("submit", sendForm);
