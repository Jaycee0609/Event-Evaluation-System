import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import {apiKey} from "/config.js";

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: "bsueventeval.firebaseapp.com",
    projectId: "bsueventeval",
    storageBucket: "bsueventeval.appspot.com",
    messagingSenderId: "196382590759",
    appId: "1:196382590759:web:797b79644ead0ebd500b02",
    measurementId: "G-87RMT03SNK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function displayFormsForAdmin() {
    const formsContainer = document.getElementById('form-items-container');
    const departmentFilter = document.getElementById('department-filter');
    const selectedDepartment = departmentFilter.value;

    try {
        formsContainer.innerHTML = '';

        const querySnapshot = await getDocs(collection(db, 'forms'));

        querySnapshot.forEach((doc) => {
            const formData = doc.data();

            if (selectedDepartment === '' || (formData.departments && formData.departments.includes(selectedDepartment))) {
                const formDiv = document.createElement('div');
                formDiv.classList.add('form-item');

                const title = document.createElement('p');
                title.classList.add('title');
                title.textContent = formData.title;
                formDiv.appendChild(title);

                const viewButton = document.createElement('button');
                viewButton.classList.add('view-btn');
                viewButton.textContent = "View Analysis";
                viewButton.addEventListener('click', () => {
                    localStorage.setItem('formTitle', formData.title);
                    localStorage.setItem('formCount', formData.count);
                    window.location.href = `/admin/form-analysis?formId=${doc.id}`;
                });

                const editButton = document.createElement('button');
                editButton.classList.add('view-btn');
                editButton.textContent = "Edit Details";
                editButton.addEventListener('click', () => {
                    localStorage.setItem('formTitle', formData.title);
                    localStorage.setItem('formCount', formData.count);
                    window.location.href = `/admin/edit-event?formId=${doc.id}`;
                });

                formDiv.appendChild(viewButton);
                formDiv.appendChild(editButton);
                formsContainer.appendChild(formDiv);
            }
        });
    } catch (error) {
        console.error("Error fetching forms:", error);
    }
}

window.addEventListener('DOMContentLoaded', displayFormsForAdmin);

document.getElementById('department-filter').addEventListener('change', displayFormsForAdmin);