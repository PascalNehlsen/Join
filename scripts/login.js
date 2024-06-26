let showSignup = document.getElementById('signup-dialog');
const BASE_URL = 'https://join-2024-default-rtdb.europe-west1.firebasedatabase.app/';
let user = [];
let toggleIcon = document.getElementById('togglePassword');
let loginName = document.getElementById('loginEmail');
let loginPassword = document.getElementById('loginPassword');
let checkboxLogin = document.getElementById('checkbox');

let password = document.getElementById('passwordSignup');
let confirm_password = document.getElementById('confirmSignup');

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;

setupToggle('loginPassword', 'togglePassword');
setupToggle('passwordSignup', 'toggleSignupPassword');
setupToggle('confirmSignup', 'confirmSignupPassword');

document.addEventListener('DOMContentLoaded', () => {
  initializeCheckboxListeners('checkbox');
  initializeCheckboxListeners('checkboxSignup');
});

function initializeCheckboxListeners(checkboxId) {
  const checkbox = document.getElementById(checkboxId);
  const toggleCheckboxState = () => {
    checkbox.classList.toggle('checked');
    checkbox.src = checkbox.classList.contains('checked')
      ? './assets/img/login/checkbox-checked.svg'
      : './assets/img/login/checkbox.svg';
    if (checkboxId === 'checkboxSignup' && checkbox.classList.contains('checked')) {
      enableBtn();
    } else {
      enableBtn();
    }
    if (checkboxId === 'checkbox' && checkbox.classList.contains('checked')) {
      localStorage.setItem('login', loginName.value);
      localStorage.setItem('password', loginPassword.value);
    }
  };
  checkbox.addEventListener('mouseover', () => checkbox.classList.add('hovering'));
  checkbox.addEventListener('mouseout', () => checkbox.classList.remove('hovering'));
  checkbox.addEventListener('click', toggleCheckboxState);
}

function enableBtn() {
  let btn = document.getElementById('blue-btn');
  btn.disabled = !btn.disabled;
}

function showSignupPage() {
  showSignup.show();
}

function closeSignupPage() {
  showSignup.close();
  document.getElementById('signup-form').reset();
}

function updateIcon(inputField, iconElement) {
  iconElement.src =
    inputField.value.length > 0
      ? '../assets/img/login/visibility_off.svg'
      : '../assets/img/login/lock.svg';
}

function setupToggle(inputFieldId, iconElementId) {
  let inputField = document.getElementById(inputFieldId);
  let iconElement = document.getElementById(iconElementId);

  inputField.addEventListener('input', () => updateIcon(inputField, iconElement));
  inputField.addEventListener('focus', () => updateIcon(inputField, iconElement));

  iconElement.addEventListener('click', () => {
    if (inputField.type === 'password') {
      inputField.type = 'text';
      iconElement.src = '../assets/img/login/visibility.svg';
    } else {
      inputField.type = 'password';
      updateIcon(inputField, iconElement);
    }
  });
}

function getLocalStorage() {
  let storageName = localStorage.getItem('login');
  let storagePassword = localStorage.getItem('password');

  loginName.value = storageName;
  loginPassword.value = storagePassword;
}

async function onloadFunc() {
  user = [];
  getLocalStorage();
  try {
    let userResponse = await getAllUser('users');
    if (Array.isArray(userResponse)) {
      for (let i = 0; i < userResponse.length; i++) {
        user.push({
          id: userResponse[i].id,
          email: userResponse[i].email,
          name: userResponse[i].name,
          password: userResponse[i].password,
        });
      }
    } else {
      console.error('userResponse is not in the expected array format');
    }
  } catch (error) {
    console.error('Failed to load users:', error);
  }
}

async function getAllUser(path) {
  let response = await fetch(BASE_URL + path + '.json');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

function loginUser() {
  let loginEmail = document.getElementById('loginEmail');
  let loginPassword = document.getElementById('loginPassword');

  let result = user.filter((user) => user.email === loginEmail.value);

  if (result.length > 0) {
    if (result[0]['email'] === loginEmail.value && result[0]['password'] === loginPassword.value) {
      setSessionStorage(loginEmail, loginPassword);
      window.location.href = 'index-main.html';
    } else {
      loginEmail.value = '';
      loginPassword.value = '';
      toggleIcon.src = '../assets/img/login/lock.svg';
    }
  } else {
    loginEmail.value = '';
    loginPassword.value = '';
    toggleIcon.src = '../assets/img/login/lock.svg';
  }
}

function setSessionStorage(loginEmail) {
  let result = user.filter((user) => user.email === loginEmail.value);
  let name = result[0].name;
  let initials = name
    .split(' ')
    .map((word) => word[0])
    .join('');
  sessionStorage.setItem('initials', initials);
  sessionStorage.setItem('name', name);
}

async function createUser() {
  let signupName = document.getElementById('signupName').value;
  let signupEmail = document.getElementById('signupEmail').value;
  let signupPassword = document.getElementById('passwordSignup').value;
  let form = document.getElementById('formvalidation');
  form.querySelectorAll('*').forEach((element) => {
    if (element.classList.contains('error')) {
      formHasError = true;
      return;
    }
  });
  if (formHasError) {
    showLogo();
  } else {
    let newId = user.length.toString();
    let newUser = {
      id: newId,
      email: signupEmail,
      name: signupName,
      password: signupPassword,
    };
    user.push(newUser);
    await putData('/users', user);
    document.getElementById('signup-form').reset();
    window.location.href = 'index.html';
  }
}

function showLogo() {
  const logo = document.getElementById('form-failed');
  logo.style.display = 'flex';
  setTimeout(function () {
    logo.style.display = 'none';
  }, 2000);
}

async function putData(path = '', data = {}) {
  let response = await fetch(BASE_URL + path + '.json', {
    method: 'PUT',
    header: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

function validatePassword() {
  if (password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity('');
  }
}

function guestLogin() {
  sessionStorage.setItem('initials', 'G');
  sessionStorage.setItem('name', 'Guest');
  window.location.href = 'index-main.html';
}

function addValidationListeners(inputField, type, passwordField) {
  inputField.addEventListener('blur', () => validateInput(inputField, type, passwordField));
  inputField.addEventListener('input', () => clearError(inputField));
}

function validateInput(inputField, type, passwordField) {
  const value = inputField.value.trim();
  const parentNode = inputField.parentNode;
  const errorClass = 'error';
  let errorMessage = '';

  if (type === 'confirmPassword') {
    validateConfirmPassword(inputField, passwordField);
    return;
  }

  if (type === 'name') {
    if (value === '') {
      errorMessage = 'This field is required';
    } else if (!value.includes(' ')) {
      errorMessage = 'Please enter both first name and last name';
    }
  } else if (type === 'email' && !isValidEmail(value)) {
    errorMessage = 'Please enter a valid email address';
  } else if (type === 'password' && value.length < 8) {
    errorMessage = 'Password must be at least 8 characters';
  }

  if (errorMessage) {
    inputField.classList.add(errorClass);
    showErrorMessage(parentNode, errorMessage);
  } else {
    inputField.classList.remove(errorClass);
    hideErrorMessage(parentNode);
  }
}

function validateConfirmPassword(confirmInput, passwordInput) {
  const confirmValue = confirmInput.value.trim();
  const parent = confirmInput.parentNode;
  const errorClass = 'error';
  let errorMessage = '';

  if (confirmValue === '') {
    errorMessage = 'This field is required';
  } else if (confirmValue !== passwordInput.value.trim()) {
    errorMessage = 'Passwords do not match';
  }

  if (errorMessage) {
    confirmInput.classList.add(errorClass);
    showErrorMessage(parent, errorMessage);
  } else {
    confirmInput.classList.remove(errorClass);
    hideErrorMessage(parent);
  }
}

function validateCheckbox(checkboxInput) {
  const parent = checkboxInput.parentNode.parentNode;
  const errorClass = 'error';

  if (!checkboxInput.checked) {
    showErrorMessage(parent, 'You must accept the Privacy policy');
  } else {
    hideErrorMessage(parent);
  }
}

function showErrorMessage(parentNode, message) {
  let errorMessage = parentNode.querySelector('.error-message');
  if (!errorMessage) {
    errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    parentNode.appendChild(errorMessage);
  }
  errorMessage.textContent = message;
}

function hideErrorMessage(parentNode) {
  const errorMessage = parentNode.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.remove();
  }
}

function clearError(inputField) {
  inputField.classList.remove('error');
  hideErrorMessage(inputField.parentNode);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  const loginEmailInput = document.getElementById('loginEmail');
  const loginPasswordInput = document.getElementById('loginPassword');

  addValidationListeners(loginEmailInput, 'email');
  addValidationListeners(loginPasswordInput, 'password');

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    validateInput(loginEmailInput, 'email');
    validateInput(loginPasswordInput, 'password');
  });

  const signupForm = document.getElementById('signup-form');
  const signupNameInput = document.getElementById('signupName');
  const signupEmailInput = document.getElementById('signupEmail');
  const signupPasswordInput = document.getElementById('passwordSignup');
  const confirmSignupInput = document.getElementById('confirmSignup');
  const signupCheckboxInput = document.getElementById('checkboxSignup');

  addValidationListeners(signupNameInput, 'name');
  addValidationListeners(signupEmailInput, 'email');
  addValidationListeners(signupPasswordInput, 'password');
  addValidationListeners(confirmSignupInput, 'confirmPassword', signupPasswordInput);
  signupCheckboxInput.addEventListener('change', () => validateCheckbox(signupCheckboxInput));

  signupForm.addEventListener('submit', function (event) {
    event.preventDefault();
    validateInput(signupNameInput, 'name');
    validateInput(signupEmailInput, 'email');
    validateInput(signupPasswordInput, 'password');
    validateConfirmPassword(confirmSignupInput, signupPasswordInput);
    validateCheckbox(signupCheckboxInput);
  });
});
