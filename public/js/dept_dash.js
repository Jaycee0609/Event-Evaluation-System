import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, collection, getDocs, getDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
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
const auth = getAuth(app);
const db = getFirestore(app);

function displayFormsForAdmin(user) {
    const formsContainer = document.getElementById('events-box');
    
    const existingFormItems = formsContainer.querySelectorAll('.form-item');
    existingFormItems.forEach(item => item.remove());

    const adminDocRef = doc(db, 'dept-admins', user.uid);

    getDoc(adminDocRef).then(adminDoc => {
        if (!adminDoc.exists()) {
            console.error("Admin document not found.");
            return;
        }

        const adminData = adminDoc.data();
        const adminDept = adminData.dept;
        const formsQueryArray = query(collection(db, 'forms'), where('departments', 'array-contains', adminDept));
        const formsQuerySingle = query(collection(db, 'forms'), where('dept', '==', adminDept));

        Promise.all([getDocs(formsQueryArray), getDocs(formsQuerySingle)]).then(([arraySnapshot, singleSnapshot]) => {
            
            arraySnapshot.forEach(doc => {
                displayForm(doc, adminDept);
            });

            singleSnapshot.forEach(doc => {
                displayForm(doc, adminDept);
            });

        }).catch(error => {
            console.error("Error fetching forms:", error);
        });
    }).catch(error => {
        console.error("Error fetching admin document:", error);
    });
}

function displayForm(doc, adminDept) {
    const formsContainer = document.getElementById('events-box');
    const formData = doc.data();

    const deptText = document.getElementById("dept");
    deptText.textContent = "Department: " + adminDept;

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
        window.location.href = `/dept/form-analysis?formId=${doc.id}`;
    });

    const editButton = document.createElement('button');
    editButton.classList.add('view-btn');
    editButton.textContent = "Edit Details";
    editButton.addEventListener('click', () => {
        localStorage.setItem('formTitle', formData.title);
        localStorage.setItem('formCount', formData.count);
        window.location.href = `/dept/edit-event?formId=${doc.id}`;
    });

    formDiv.appendChild(viewButton);
    formDiv.appendChild(editButton);
    formsContainer.appendChild(formDiv);
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        displayFormsForAdmin(user);
    } else {
        console.error("No user is logged in.");
    }
});