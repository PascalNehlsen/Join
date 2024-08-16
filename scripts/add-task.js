let selectedButtonId = null;
let priority = '';
let contacts = [];
let tasksNumber = '';
let taskSelection = '0';
let formHasErrorTask = false;
let assignedTo = [
   {
      contactImageBgColor: [],
      name: [],
      nameInitials: [],
   },
];
let subtasksTest = [
   {
      subtask: [],
      subtaskStatus: [],
   },
];

/**
 * Renders the contacts to the list.
 */
function renderToList() {
   let list = document.getElementById('contacts');
   for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i].name;
      list.innerHTML += renderToListHTML(i, contact);
   }
}

/**
 * Fetches the contacts from the API and populates the contacts array.
 */
async function onloadContacts() {
   contacts = [];
   let userResponse = await getAllContacts('contacts');
   for (let i = 0; i < userResponse.contactImageBgColor.length; i++) {
      contacts.push({
         contactImageBgColor: userResponse.contactImageBgColor[i],
         email: userResponse.email[i],
         name: userResponse.name[i],
         nameInitials: userResponse.nameInitials[i],
         phoneNumber: userResponse.phoneNumber[i],
      });
   }
   renderToList();
}

/**
 * Loads the task values into the edit form.
 *
 * @param {number} i - The index of the task in the tasks array.
 */
function onloadFormValue(i) {
   let inputFields = document.getElementsByClassName('my-inputs-edit');
   inputFields[0].value = tasks.title[i];
   inputFields[1].value = tasks.description[i];
   inputFields[2].value = tasks.dueDate[i];
   inputFields[3].value = tasks.categoryName[i];
   getSelectedContactsEdit(i);
   getSubtasksEdit(i);
   getProBtnClick(i);
}

/**
 * Sets the priority button based on the task priority.
 *
 * @param {number} i - The index of the task.
 */
function getProBtnClick(i) {
   let prio = tasks.priority[i];
   let capitalizedPrio = prio.charAt(0).toUpperCase() + prio.slice(1);
   if (prio == '') {
      return;
   } else {
      let functionName = `handle${capitalizedPrio}ClickEdit`;
      window[functionName](event);
   }
}

/**
 * Fetches data from the API.
 *
 * @param {string} path - The endpoint to fetch data from.
 * @returns {Promise<Object>} The JSON response from the API.
 */
async function getAllContacts(path) {
   let response = await fetch(BASE_URL + path + '.json');
   if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
   }
   return await response.json();
}

/**
 * Collects selected contacts and pushes them to the assignedTo object.
 */
function getSelectedContacts() {
   let placeholder = document.getElementById('placeholder').childNodes;
   for (let i = 0; i < placeholder.length; i++) {
      let initials = placeholder[i].innerHTML;
      let inlineStyle = placeholder[i].style.backgroundColor;
      let fullName = placeholder[i].getAttribute('name');
      assignedTo[0].nameInitials.push(initials);
      assignedTo[0].contactImageBgColor.push(inlineStyle);
      assignedTo[0].name.push(fullName);
   }
}

/**
 * Collects selected subtasks and pushes them to the subtasks object.
 */
function getSelectedSubtasks() {
   let liElements = document.querySelectorAll('#subtask-placeholder li.subtask-link');
   for (let i = 0; i < liElements.length; i++) {
      let subtaskTextElement = liElements[i].querySelector('.subtask-text');
      let subtaskText = subtaskTextElement.textContent;
      let status = liElements[i].getAttribute('status');
      subtasksTest[0].subtask.push(subtaskText);
      subtasksTest[0].subtaskStatus.push(status);
   }
}

/**
 * Sets the selected task category.
 *
 * @param {number} parameter - The category index.
 */
function taskCategory(parameter) {
   if (parameter == null) {
      return;
   } else {
      taskSelection = parameter;
   }
}

/**
 * Saves the task after validation.
 */
function saveTask() {
   const rows = ['first-row', 'second-row'];
   rows.forEach((rowId) => {
      let form = document.getElementById(rowId);
      form.querySelectorAll('*').forEach((element) => {
         if (element.classList.contains('error')) {
            formHasErrorTask = true;
         }
      });
   });
   if (formHasErrorTask) {
      formHasErrorTask = false;
      return;
   } else {
      saveTaskElse();
   }
}

/**
 * Creates a new task if form validation passes.
 */
function saveTaskElse() {
   getSelectedSubtasks();
   getSelectedContacts();
   let bgColor = document.getElementById('category');
   let selectedIndex = bgColor.selectedIndex;
   let selectedOption = (bgColor = bgColor.options[selectedIndex]);
   let result = selectedOption.getAttribute('bgColor');
   let inputFields = document.getElementsByClassName('my-inputs');
   let newTask = {
      title: inputFields[0].value,
      description: inputFields[1].value,
      assignedTo: assignedTo,
      dueDate: inputFields[2].value,
      priority: priority,
      categoryName: inputFields[3].value,
      subtasksTest: subtasksTest,
      taskStatus: taskSelection,
      categoryBGColor: result,
   };
   mergeObjects(tasks, newTask);
   saveTasks();
   showLogoAddTask();
   setTimeout(() => {
      loadBoardContent();
   }, 2000);
   closeTaskDialog();
}

/**
 * Merges the new task into the existing tasks object.
 *
 * @param {Object} tasks - The existing tasks object.
 * @param {Object} newTask - The new task object.
 */
function mergeObjects(tasks, newTask) {
   newTask.assignedTo.forEach((item) => tasks.assignedTo.push(item));
   tasks.categoryBgColor.push(newTask.categoryBGColor);
   tasks.categoryName.push(newTask.categoryName);
   tasks.description.push(newTask.description);
   tasks.dueDate.push(newTask.dueDate);
   tasks.priority.push(newTask.priority);
   tasks.taskStatus.push(newTask.taskStatus);
   tasks.title.push(newTask.title);
   newTask.subtasksTest.forEach((item) => tasks.subtasksTest.push(item));
   clearObjects();
}

/**
 * Toggles the color of the button in the add-task form.
 *
 * @param {string} buttonId - The ID of the button.
 * @param {string} color - The new background color.
 * @param {string} idOne - The ID of the first SVG path.
 * @param {string} idTwo - The ID of the second SVG path.
 */
function toggleColor(buttonId, color, idOne, idTwo) {
   if (selectedButtonId) {
      let prev = document.getElementById(selectedButtonId);
      if (prev) {
         prev.style = '';
         let prevSvgOne = document.getElementById(prev.getAttribute('data-svg-one'));
         let prevSvgTwo = document.getElementById(prev.getAttribute('data-svg-two'));
         if (prevSvgOne) prevSvgOne.style.fill = prev.getAttribute('data-original-color');
         if (prevSvgTwo) prevSvgTwo.style.fill = prev.getAttribute('data-original-color');
      }
   }
   toggleColorIf(buttonId, color, idOne, idTwo);
}

/**
 * Helper function to toggle the color of the button.
 *
 * @param {string} buttonId - The ID of the button.
 * @param {string} color - The new background color.
 * @param {string} idOne - The ID of the first SVG path.
 * @param {string} idTwo - The ID of the second SVG path.
 * @returns {null} - Returns null if the buttonId is not the selectedButtonId.
 */
function toggleColorIf(buttonId, color, idOne, idTwo) {
   if (buttonId === selectedButtonId) return (selectedButtonId = null);
   let button = document.getElementById(buttonId);
   if (button) {
      button.style = `background-color:${color};color:#fff;border-bottom:unset`;
      let svgOne = document.getElementById(idOne);
      let svgTwo = document.getElementById(idTwo);
      if (svgOne && svgTwo) {
         svgOne.style.fill = svgTwo.style.fill = '#fff';
         button.setAttribute('data-svg-one', idOne);
         button.setAttribute('data-svg-two', idTwo);
      }
      selectedButtonId = buttonId;
   }
}

/**
 * Handles the click event for the urgent button.
 *
 * @param {Event} event - The event object.
 */
function handleUrgentClick(event) {
   event.preventDefault();
   toggleColor('buttonUrgent', '#FF3D00', 'UrgentOne', 'UrgentTwo');
   if (selectedButtonId == null) {
      priority = '';
   } else {
      priority = 'urgent';
   }
}

/**
 * Handles the click event for the medium button.
 *
 * @param {Event} event - The event object.
 */
function handleMediumClick(event) {
   event.preventDefault();
   toggleColor('buttonMedium', '#FFA800', 'MediumOne', 'MediumTwo');
   if (selectedButtonId == null) {
      priority = '';
   } else {
      priority = 'medium';
   }
}

/**
 * Handles the click event for the low button.
 *
 * @param {Event} event - The event object.
 */
function handleLowClick(event) {
   event.preventDefault();
   toggleColor('buttonLow', '#7AE229', 'LowOne', 'LowTwo');
   priority = 'low';
   if (selectedButtonId == null) {
      priority = '';
   } else {
      priority = 'low';
   }
}

/**
 * Toggles the selection of a contact in the dropdown menu.
 *
 * @param {number} i - The index of the contact.
 */
function selectContact(i) {
   let icon = document.getElementById('checkbox-' + i);
   let input = document.getElementById('contact-' + i);
   let symbol = document.getElementById('symbol-' + i).cloneNode(true);
   let placeholder = document.getElementById('placeholder');

   function removeSymbol() {
      let symbolInPlaceholder = placeholder.querySelector(`#symbol-${i}`);
      if (symbolInPlaceholder) {
         placeholder.removeChild(symbolInPlaceholder);
         icon.src = './assets/img/login/checkbox.svg';
         input.style.background = '';
      }
   }

   if (icon.src.endsWith('checkbox-checked-white.svg')) {
      input.style.background = '';
      icon.src = './assets/img/login/checkbox.svg';

      let symbolInPlaceholder = placeholder.querySelector(`#symbol-${i}`);
      if (symbolInPlaceholder) {
         placeholder.removeChild(symbolInPlaceholder);
      }
   } else {
      icon.src = './assets/img/login/checkbox-checked-white.svg';
      input.style.background = '#4589FF';
      symbol.onclick = removeSymbol;
      document.getElementById('placeholder').appendChild(symbol);
   }
}

/**
 * Adds the onclick function to remove the symbol.
 *
 * @param {number} i - The index of the symbol.
 */
function addLoadedContact(i) {
   let symbol = document.getElementById('symbol-' + i + '-edit');
   if (symbol) {
      symbol.onclick = function () {
         let placeholder = document.getElementById('placeholder-edit');
         placeholder.removeChild(symbol);
      };
   }
}

/**
 * Shows the input fields for adding a new subtask.
 */
function newSubtaskInput() {
   document.getElementById('cancel-button').classList.remove('d-none');
   document.getElementById('check-blue').classList.remove('d-none');
   document.getElementById('mini-seperator').style.display = 'unset';
   document.getElementById('subtasks').style.backgroundImage = 'unset';
}

/**
 * Edits the subtask when clicked.
 *
 * @param {Element} element - The subtask element.
 */
function changeSubtask(element) {
   let imgElements = element.querySelectorAll('img');
   imgElements.forEach(function (img) {
      img.classList.remove('d-none');
   });
   let innerDivContainer = element.querySelector('div');
   if (innerDivContainer) {
      innerDivContainer.style.display = 'unset';
   }
   element.style.backgroundColor = '#E3EEFF';
}

/**
 * Adds a new subtask.
 */
function addSubtasks() {
   newSubtaskInput();
   let subtasks = document.getElementById('subtasks');

   let placeholder = document.getElementById('subtask-placeholder');
   if (subtasks.value.length >= 1) {
      placeholder.innerHTML += addSubtasksHTML(subtasks);
      subtasks.value = '';
      let container = document.getElementById('addTask');
      container.scrollTop = container.scrollHeight;
      resetSubtaskInput();
      if (placeholder.querySelectorAll('li').length >= 3) {
         placeholder.style.overflowY = 'scroll';
         placeholder.scrollTop = container.scrollHeight;
         resetSubtaskInput();
      }
   }
}

/**
 * Selects a category and closes the dropdown menu.
 *
 * @param {string} category - The selected category.
 */
function selectCategory(category) {
   let summaryHeadline = document.getElementById('categoy-headline');
   summaryHeadline.textContent = category;
   summaryHeadline.closest('details').removeAttribute('open');
}

document.addEventListener('click', function (event) {
   let details = document.getElementById('details');

   if (!details.contains(event.target) && details.open) {
      details.open = false;
      resetSearch();
   }
});

/**
 * Loads the add task content.
 */
function loadAddTaskContent() {
   let mainContent = document.getElementById('mainContent');
   mainContent.innerHTML = '';
   mainContent.innerHTML += loadAddTaskContentHTML();
   removeBackgroundLowerSidebar();
   onloadContacts();
   removeButtonBackground();
   changeAddTaskButtonBackground();
   removeColorSideBar();
   changeColorSideAddTask();
   selectedButtonId = '';
   priority = '';
   handleMediumClick(event);
   minDate();
   addTaskValidation();
}

/**
 * Changes the background color in the sidebar for the add task section.
 */
function changeColorSideAddTask() {
   document.getElementById('sidebarImgAddTask').classList.add('color-img-sidebar');
   document.getElementById('fontAddTaskSidebar').classList.add('menu-row-font');
}

/**
 * Filters contacts based on the search input.
 */
function filterContacts() {
   let input = document.getElementById('contact-search').value.toLowerCase();
   let contactElements = document.querySelectorAll('.contactShow');
   contactElements.forEach((contact) => {
      let name = contact.getAttribute('name');
      if (name.toLowerCase().includes(input)) {
         let container = contact.parentNode;
         container.parentNode.style.display = '';
      } else {
         let container = contact.parentNode;
         container.parentNode.style.display = 'none';
      }
   });
}

/**
 * Adds the onclick event to remove symbols.
 */
function onclickRender() {
   let symbols = document.querySelectorAll('[id^=symbol-][id$=-edit]');
   symbols.forEach((symbol) => {
      let i = symbol.id.match(/\d+/)[0];
      symbol.onclick = function () {
         removeSymbol(i);
      };
   });
}

/**
 * Sets the minimum date for date input fields.
 */
function minDate() {
   const today = new Date();
   const year = today.getFullYear();
   let month = (today.getMonth() + 1).toString().padStart(2, '0');
   let day = today.getDate().toString().padStart(2, '0');

   const minDate = `${year}-${month}-${day}`;
   const dateInput = document.getElementById('custom-date');
   dateInput.setAttribute('min', minDate);

   dateInput.oninvalid = function (event) {
      event.target.setCustomValidity('The date cannot be earlier than todays date.');
   };
   dateInput.oninput = function (event) {
      event.target.setCustomValidity('');
   };

   dateInput.addEventListener('input', function () {
      let value = dateInput.value;
      if (value.length > 10) {
         value = value.substring(0, 10);
         dateInput.value = value;
      }
   });
}

/**
 * Shows a confirmation logo when a new task is added.
 */
function showLogoAddTask() {
   const logo = document.getElementById('form-failed-task');
   logo.style.display = 'flex';
   setTimeout(function () {
      logo.style.display = 'none';
   }, 2000);
}
