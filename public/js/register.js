import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
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

const submit = document.getElementById("sign-up-btn");
const departmentDropdown = document.getElementById("dept");
const sectionDropdown = document.getElementById("sect");
const errorMsg = document.getElementById("error-message");
const emailError = document.getElementById("email-error");
const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

const populateSections = async () => {
    const selectedDepartment = departmentDropdown.value;

    sectionDropdown.innerHTML = '';

    try {
        const docRef = doc(db, 'sections', selectedDepartment);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            const sectionsArray = docSnapshot.data().sections;

            sectionsArray.forEach(section => {
                const option = document.createElement('option');
                option.value = section;
                option.textContent = section;
                sectionDropdown.appendChild(option);
            });
        } else {
            console.log("No such department found!");
        }
    } catch (error) {
        console.error("Error fetching sections:", error);
    }
};

departmentDropdown.addEventListener('change', populateSections);

window.addEventListener('load', () => {
    populateSections();
});

const studentidInput = document.getElementById("studentid");

studentidInput.addEventListener("input", function(event) {
    let input = studentidInput.value;
    
    input = input.replace(/[^0-9-]/g, '');

    const dashCount = (input.match(/-/g) || []).length;
    if (dashCount > 3) {
        input = input.slice(0, input.lastIndexOf('-') + 1);
    }

    if (input.length > 10) {
        input = input.slice(0, 11);
    }

    studentidInput.value = input;
});

submit.addEventListener("click", function(event) {
    event.preventDefault();
    const lname = document.getElementById("lname").value;
    const fname = document.getElementById("fname").value;
    const mname = document.getElementById("mname").value;
    let studentid = document.getElementById("studentid").value;
    const email = document.getElementById("email").value;
    const dept = departmentDropdown.value;
    const section = sectionDropdown.value;
    const gender = document.getElementById("gender").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("cpassword").value;

    if (!passwordPattern.test(password)) {
        errorMsg.textContent = "Password must be at least 8 characters long, contain at least one number, and one uppercase letter.";
        return;
    }

    if (password !== confirmPassword) {
        errorMsg.textContent = "Passwords do not match";
        return;
    }

    const studentidPattern = /^\d{4}-\d{6}$/;
    if (!studentidPattern.test(studentid)) {
        errorMsg.textContent = "Please enter a valid Student ID.";
        return;
    } else {
        errorMsg.textContent = "";
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        const userId = user.uid;
        const userDocRef = doc(db, "users", userId);

        setDoc(userDocRef, {
            lname: lname,
            fname: fname,
            mname: mname,
            studentid: studentid,
            email: email,
            dept: dept,
            section: section,
            gender: gender,
            status: "Active"
        })
        .then(() => {
            console.log("User data stored");
            errorMsg.textContent = "";
            emailError.textContent = "";
            window.location.href = "/users/dash";
        })
        .catch((error) => {
            console.error("Error during registration:", error);
            console.log("Error Code:", error.code);
            console.log("Error Message:", error.message);
        });
    })
    .catch((error) => {
        const errorCode = error.code;

        if (errorCode === "auth/invalid-email") {
            emailError.textContent = "Invalid Email";
        } else if (errorCode === "auth/email-already-in-use") {
            emailError.textContent = "Email already exists";
        } else {
            emailError.textContent = error.message;
        }
    });
});