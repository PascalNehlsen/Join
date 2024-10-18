let contactsData = [
   {
      initials: 'AM',
      name: 'Anton Mayer',
      email: 'antom@gmail.com',
      phone: '+4911111111111',
      color: '#ffab00',
      id: '0',
   },
   {
      initials: 'AS',
      name: 'Anja Schulz',
      email: 'schulz@hotmail.com',
      phone: '+4911111111112',
      color: '#ff4081',
      id: '1',
   },
   {
      initials: 'BZ',
      name: 'Benedikt Ziegler',
      email: 'benedikt@gmail.com',
      phone: '+4911111111113',
      color: '#536dfe',
      id: '2',
   },
   {
      initials: 'DE',
      name: 'David Eisenberg',
      email: 'davidberg@gmail.com',
      phone: '+4911111111114',
      color: '#e040fb',
      id: '3',
   },
   {
      initials: 'EF',
      name: 'Eva Fischer',
      email: 'eva@gmail.com',
      phone: '+4911111111115',
      color: '#ffab00',
      id: '4',
   },
   {
      initials: 'EM',
      name: 'Emmanuel Mauer',
      email: 'emmanuelma@gmail.com',
      phone: '+4911111111116',
      color: '#00bfa5',
      id: '5',
   },
   {
      initials: 'MA',
      name: 'Maximilian Arnold',
      email: 'maxarnold@gmail.com',
      phone: '+4911111111117',
      color: '#ff4081',
      id: '6',
   },
   {
      initials: 'PN',
      name: 'Pascal Nehlsen',
      email: 'mail@pascal-nehlsen.de',
      phone: '01702371470',
      color: '#FFA800',
      id: '7',
   },
   {
      initials: 'VS',
      name: 'Vanessa Sachs',
      email: 'vanessa@test.de',
      phone: '+4911111111118',
      color: '#9327FF',
      id: '8',
   },
   {
      initials: 'RL',
      name: 'Rene Lochschmidt',
      email: 'rene@test.de',
      phone: '+4911111111118',
      color: '#0223CF',
      id: '9',
   },
];

let formHasErrorEditContact = false;
let contactsList = getStoredContacts();

/**
 * Loads contacts content from a JSON file, updates the contactsData array,
 * and renders the contacts on the page.
 */

function saveContactstoLocalStorage() {
   localStorage.setItem('contacts', JSON.stringify(contactsData));
   getStoredContacts();
}

function getStoredContacts() {
   let storedContacts = localStorage.getItem('contacts');
   if (storedContacts) {
      return JSON.parse(storedContacts);
   }
   return [];
}

async function loadContactsContent() {
   saveContactstoLocalStorage();
   renderContacts(contactsList);
   removeBackgroundLowerSidebar();
   removeButtonBackground();
   changeContactsButtonBackground();
   removeColorSideBar();
   changeColorSidebarContacts();
}
/**
 * Renders the contacts on the page.
 *
 * @param {Array} contacts - An array of contact objects.
 */
function renderContacts(contacts) {
   const content = document.getElementById('mainContent');
   content.innerHTML = /*html*/ `
    <div class="contacts-container" id="contacts-container">
      <div class="contacts-list">
        <button class="add-contact-btn">Add new contact</button>
      </div>
      <div class="contact-detail"></div>
    </div>
    <div id=edit-popup></div>
  `;

   const contactsList = document.querySelector('.contacts-list');

   // Sort contacts by name
   contacts.sort((a, b) => a.name.localeCompare(b.name));

   let currentLetter = '';

   contacts.forEach((contact) => {
      const firstLetter = contact.name[0].toUpperCase();

      if (firstLetter !== currentLetter) {
         currentLetter = firstLetter;
         const groupTitle = document.createElement('div');
         groupTitle.classList.add('contact-group-title');
         groupTitle.textContent = currentLetter;
         contactsList.appendChild(groupTitle);
      }

      const contactElement = document.createElement('div');
      contactElement.classList.add('contact');
      contactElement.innerHTML = /*html*/ `
      <div class="contact-initials" style="background-color: ${contact.color};">${contact.initials}</div>
      <div class="contact-info">
        <div class="contact-name">${contact.name}</div>
        <div class="contact-email">${contact.email}</div>
      </div>
    `;

      contactElement.addEventListener('click', () => {
         renderContactDetail(contactElement, contact);
         toggleContactView();
      });

      contactsList.appendChild(contactElement);
   });

   const addContactButton = document.querySelector('.add-contact-btn');
   if (addContactButton) {
      addContactButton.addEventListener('click', openContactDialog);
   }
   saveContactstoLocalStorage();
}

/**
 * Gets a contact by its ID.
 *
 * @param {string} id - The ID of the contact.
 * @returns {Object|null} The contact object if found, otherwise null.
 */
function getContact(id) {
   for (let i = 0; i < contactsList.length; i++) {
      if (contactsList[i].id === id.toString()) {
         return contactsList[i];
      }
   }
   return null;
}

/**
 * Renders the edit contact form for a specific contact.
 *
 * @param {string} id - The ID of the contact to edit.
 */
function renderEditContact(id) {
   let contact = getContact(id);
   document.getElementById('edit-popup').style.display = 'unset';
   const content = document.getElementById('edit-popup');
   content.innerHTML = /*html*/ `
    <div class="dialog-edit">
        <div class="popup-header">
            <div class="logo-slogan">
                <img class="logo-white" src="./assets/img/contact/logo-white.svg">
                <h1>Edit contact</h1>
            </div>
            <div class="img-container">
                <img onclick="closeEditContainer()" class="popup-header-img" src="./assets/img/contact/cancel-white.svg">
            </div>
            
        </div>

        <div class="task-edit-description">
            <div class="icon-container">
              <div id="person-icon">${contact.initials}</div>
            </div>
            <form onsubmit="saveContactEdit('${id}')"id="edit-contact" class="contact-description">
                <div class="input-group">
                   <input type="text" id="name-edit-contact" name="name" placeholder="Name">
                   <img src="./assets/img/contact/person.svg" class="input-icon" alt="Person Icon">
                </div>
                <div class="input-group">
                   <input type="email" id="email-edit-contact" name="email" placeholder="Email">
                   <img src="./assets/img/contact/mail.svg" class="input-icon" alt="Mail Icon">
                </div>
                <div class="input-group">
                   <input type="text" id="phone-edit-contact" name="phone" placeholder="Phone">
                   <img src="./assets/img/contact/call.svg" class="input-icon" alt="Call Icon">
                </div>
                <div class="button-group">
                   <button type="button" onclick="closeEditContainer('${id}')" class="white-btn">Delete</button>
                   <button type="submit" class="blue-btn">Save<img src="./assets/img/contact/check-btn.svg" alt=""></button>
                </div>
             </form>
</div>
    </div>
  `;
   getContactToEditForm(contact);
   addTaskValidationEditContact();
}

/**
 * Saves the edited contact information.
 *
 * @param {string} id - The ID of the contact to save.
 */
function saveContactEdit(id) {
   let form = document.getElementById('edit-contact');
   form.querySelectorAll('*').forEach((element) => {
      if (element.classList.contains('error-edit-contact')) {
         formHasErrorEditContact = true;
      }
   });
   if (formHasErrorEditContact) {
      formHasErrorEditContact = false;
      return;
   } else {
      let index = contactsList.findIndex((contact) => contact.id === id.toString());

      if (index !== -1) {
         let newName = document.getElementById('name-edit-contact').value;
         let newMail = document.getElementById('email-edit-contact').value;
         let newPhone = document.getElementById('phone-edit-contact').value;
         contactsList[index].name = newName;
         contactsList[index].email = newMail;
         contactsList[index].phone = newPhone;
         saveContactstoLocalStorage();
         renderContacts(contactsList);
      }
   }
}

/**
 * Populates the edit form with the contact's current information.
 *
 * @param {Object} contact - The contact object to edit.
 */
function getContactToEditForm(contact) {
   let backgroundcolor = contact.color;
   document.getElementById('person-icon').style.backgroundColor = backgroundcolor;
   document.getElementById('name-edit-contact').value = contact.name;
   document.getElementById('email-edit-contact').value = contact.email;
   document.getElementById('phone-edit-contact').value = contact.phone;
}

/**
 * Renders the details of a selected contact.
 *
 * @param {HTMLElement} contactElement - The HTML element of the contact.
 * @param {Object} contact - The contact object.
 */
function renderContactDetail(contactElement, contact) {
   document.querySelectorAll('.contact').forEach((element) => {
      element.classList.remove('selected');
   });

   contactElement.classList.add('selected');

   const contactDetail = document.querySelector('.contact-detail');
   contactDetail.innerHTML = /*html*/ `
    <div class="contact-header">
      <div class="name-initial-container">
        <div class="contact-initials-large" style="background-color: ${contact.color};">${contact.initials}</div>
        <div class="contact-name contact-name-detail">${contact.name}</div>
      </div>
      <div class="contact-actions">
        <div class="contact-actions-btn">
        <button onclick="renderEditContact(${contact.id})" class="edit-btn">
          <img src="./assets/img/contact/edit.svg" alt="Edit" />
          Edit
        </button>
        <button class="delete-btn" onclick="deleteContact('${contact.id}')">
          <img src="./assets/img/contact/delete.svg" alt="Delete" />
          Delete
        </button>
        </div>
        <img class="return-img" onclick="returnToPreviousContent()" src="./assets/img/privacy-legal-help/move-back-arrow.svg" alt="zurück" />
      </div>

    </div>
    <div class="contact-detail-info">
      <h2>Contact Information</h2>
      <p><strong>Email <br></strong> <a href="mailto:${contact.email}">${contact.email}</a></p><br>
      <p><strong>Phone <br></strong> <a href="tel:${contact.phone}">${contact.phone}</a></p>
    </div>
  `;
}

/**
 * Deletes a contact by its ID.
 *
 * @param {string} id - The ID of the contact to delete.
 */
function deleteContact(id) {
   const index = contactsList.findIndex((contact) => contact.id === id);
   if (index !== -1) {
      contactsList.splice(index, 1);
      renderContacts(contactsList);
      document.querySelector('.contact-detail').innerHTML = '';
   }
}

/**
 * Opens the contact dialog to add a new contact.
 */
function openContactDialog() {
   const contactPopup = document.getElementById('contact-dialog-container');
   const contactDialog = document.querySelector('#contact-dialog-container .task-dialog');

   contactPopup.style.display = 'flex';
   setTimeout(() => {
      contactDialog.style.right = '0';
   }, 50);
}

/**
 * Closes the contact dialog.
 */
function closeContactDialog() {
   const contactDialog = document.querySelector('#contact-dialog-container .task-dialog');

   contactDialog.style.right = '-600px';
   setTimeout(() => {
      document.getElementById('contact-dialog-container').style.display = 'none';
   }, 300);
}

/**
 * Closes the edit contact popup and deletes the contact.
 *
 * @param {string} id - The ID of the contact to delete.
 */
function closeEditContainer(id) {
   document.getElementById('edit-popup').style.display = 'none';
   deleteContact(id);
}

/**
 * Toggles the visibility of the contact list and contact details on smaller screens.
 */
function toggleContactView() {
   const contactsList = document.querySelector('.contacts-list');
   const contactDetail = document.querySelector('.contact-detail');

   if (window.innerWidth <= 800) {
      contactsList.classList.toggle('hidden');
      contactDetail.classList.toggle('visible');
   }
}

document.addEventListener('DOMContentLoaded', () => {
   document.getElementById('contact-dialog-container').addEventListener('click', (event) => {
      const contactDialog = document.querySelector('#contact-dialog-container .task-dialog');

      if (!contactDialog.contains(event.target)) {
         closeContactDialog();
      }
   });
});

/**
 * Changes the color of the sidebar for the contacts section.
 */
function changeColorSidebarContacts() {
   document.getElementById('sidebarImgContact').classList.add('color-img-sidebar');
   document.getElementById('fontContactsSidebar').classList.add('menu-row-font');
}

/**
 * Changes the background color of the contacts button.
 */
function changeContactsButtonBackground(params) {
   let contactButton = document.getElementById('contactButton');
   contactButton.classList.add('menu-background');
}

/**
 * Saves a new contact from the contact form.
 *
 * @param {Event} event - The form submission event.
 */
function saveContact(event) {
   event.preventDefault();
   const name = document.getElementById('name').value;
   const email = document.getElementById('email').value;
   const phone = document.getElementById('phone').value;
   const initials = name
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .join('');
   const color = '#' + Math.floor(Math.random() * 16777215).toString(16); // Random color

   const newContact = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      initials,
      color,
   };

   contactsList.push(newContact);
   renderContacts(contactsList);
   localStorage.setItem('contacts', JSON.stringify(contactsList)); // Save updated contactsData to local storage
   //  renderContacts(contactsData);
   closeContactDialog();
   document.getElementById('addContact').reset(); // Reset form
}

/**
 * Adds validation listeners to the edit contact form.
 */
function addTaskValidationEditContact() {
   const addTaskFormEditContact = document.getElementById('edit-contact');
   const nameEditContact = document.getElementById('name-edit-contact');
   const emailEditContact = document.getElementById('email-edit-contact');
   const phoneEditContact = document.getElementById('phone-edit-contact');

   addValidationListenersEditContact(nameEditContact, 'name');
   addValidationListenersEditContact(emailEditContact, 'email');
   addValidationListenersEditContact(phoneEditContact, 'phone');

   addTaskFormEditContact.addEventListener('submit', function (event) {
      event.preventDefault();
      validateInputEditContact(nameEditContact, 'name');
      validateInputEditContact(emailEditContact, 'email');
      validateInputEditContact(phoneEditContact, 'phone');

      // If no validation errors, submit the form (optional)
      if (!document.querySelector('.error-edit-contact')) {
         addTaskFormEditContact.submit();
      }
   });
}

/**
 * Adds validation listeners to input fields.
 *
 * @param {HTMLElement} inputField - The input field element.
 * @param {string} type - The type of the input field.
 */
function addValidationListenersEditContact(inputField, type) {
   inputField.addEventListener('blur', () => validateInputEditContact(inputField, type));
   inputField.addEventListener('input', () => clearErrorEditContact(inputField));
}

/**
 * Validates the input fields in the form.
 *
 * @param {HTMLElement} inputField - The input field element.
 * @param {string} type - The type of the input field.
 */
function validateInputEditContact(inputField, type) {
   const value = inputField.value.trim();
   const parentNode = inputField.parentNode;
   const errorClass = 'error-edit-contact';
   let errorMessage = '';

   if (type === 'name') {
      if (value === '') {
         errorMessage = 'This field is required';
      } else if (!value.includes(' ')) {
         errorMessage = 'Please enter both first name and last name';
      }
   } else if (type === 'email' && !isValidEmailEditContact(value)) {
      errorMessage = 'Please enter a valid email address';
   } else if (type === 'phone' && !isValidPhoneEditContact(value)) {
      errorMessage = 'Please enter a valid phone number';
   }

   if (errorMessage) {
      inputField.classList.add(errorClass);
      showErrorMessageEditContact(parentNode, errorMessage);
   } else {
      inputField.classList.remove(errorClass);
      hideErrorMessageEditContact(parentNode);
   }
}

/**
 * Shows an error message for an input field.
 *
 * @param {HTMLElement} parentNode - The parent node of the input field.
 * @param {string} message - The error message to show.
 */
function showErrorMessageEditContact(parentNode, message) {
   let errorMessage = parentNode.querySelector('.error-message');
   if (!errorMessage) {
      errorMessage = document.createElement('div');
      errorMessage.classList.add('error-message');
      parentNode.appendChild(errorMessage);
   }
   errorMessage.textContent = message;
}

/**
 * Hides the error message for an input field.
 *
 * @param {HTMLElement} parentNode - The parent node of the input field.
 */
function hideErrorMessageEditContact(parentNode) {
   const errorMessage = parentNode.querySelector('.error-message');
   if (errorMessage) {
      errorMessage.remove();
   }
}

/**
 * Clears the error message for an input field.
 *
 * @param {HTMLElement} inputField - The input field element.
 */
function clearErrorEditContact(inputField) {
   inputField.classList.remove('error-edit-contact');
   hideErrorMessageEditContact(inputField.parentNode);
}

/**
 * Validates an email address.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, otherwise false.
 */
function isValidEmailEditContact(email) {
   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates a phone number.
 *
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} True if the phone number is valid, otherwise false.
 */
function isValidPhoneEditContact(phone) {
   return /^\+?[0-9]{5,15}$/.test(phone);
}
