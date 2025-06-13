import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
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

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
      getUserData(uid);
    } else {
        window.location.href = '/users/profile';
    }
});

async function getUserData(uid) {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
  
    if (userDoc.exists()) {
      const userData = userDoc.data();
      displayUserData(userData);
    } else {
      console.log("No such document!");
    }
}
  
function displayUserData(userData) {
    const name = document.getElementById("full-name");
    const studentid = document.getElementById("studentid");
    const gender = document.getElementById("gender");
    const dept = document.getElementById("dept");

    name.textContent = `${userData.fname} ${userData.lname}`
    studentid.textContent = `${userData.studentid}`
    gender.textContent = `${userData.gender}`
    dept.textContent = `${userData.dept}`
}

const logoutButton = document.getElementById("logout-btn");

logoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
      window.location.href = '/';
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
});