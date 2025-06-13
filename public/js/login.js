import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, getDoc, query, collection, where, getDocs, collectionGroup } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
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

async function loginUser(identifier, password) {
  try {
    let email;

    if (identifier.includes('@')) {
      email = identifier;

      const collections = ['nu-admin', 'nu-organizer', 'dept-admins'];
      let adminFound = false;

      for (const collectionName of collections) {
        const adminQuery = query(collection(db, collectionName), where('email', '==', email));
        const adminSnapshot = await getDocs(adminQuery);

        if (!adminSnapshot.empty) {
          adminFound = true;
          break;
        }
      }

      if (!adminFound) {
        const errorMsg = document.getElementById("error-message");
        errorMsg.textContent = "Admin email not found.";
        return;
      }

    } else {
      const userQuery = query(collection(db, "users"), where("studentid", "==", identifier.trim()));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        const errorMsg = document.getElementById("error-message");
        errorMsg.textContent = "Student ID not found.";
        return;
      }

      const userData = querySnapshot.docs[0].data();
      email = userData.email;
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const adminDocRef = doc(db, "nu-admin", user.uid);
    const adminDoc = await getDoc(adminDocRef);
    
    if (adminDoc.exists()) {
      window.location.href = "/admin/dash";
      return;
    }

    const deptAdminDocRef = doc(db, "dept-admins", user.uid);
    const deptAdminDoc = await getDoc(deptAdminDocRef);

    if (deptAdminDoc.exists()) {
      window.location.href = "/dept/dash";
      return;
    }

    const saoAdminDocRef = doc(db, "nu-organizer", user.uid);
    const saoAdminDoc = await getDoc(saoAdminDocRef);

    if (saoAdminDoc.exists()) {
      window.location.href = "/organizer/dash";
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();

      if (userData.status === "Deactivated") {
        const errorMsg = document.getElementById("error-message");
        errorMsg.textContent = "Your account is deactivated.";
        return;
      }

      window.location.href = "/users/dash";
      return;
    }

    const errorMsg = document.getElementById("error-message");
    errorMsg.textContent = "You do not have access to this system.";
    await signOut(auth);

  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const errorMsg = document.getElementById("error-message");

    if (errorCode === "auth/invalid-credential") {
      errorMsg.textContent = "Incorrect Password or Email/Student ID";
    } else {
      errorMsg.textContent = errorMessage;
    }
  }
}

const submit = document.getElementById("sign-in-btn");
submit.addEventListener("click", function(event) {
  event.preventDefault();
  const identifier = document.getElementById("identifier").value;
  const password = document.getElementById("password").value;
  loginUser(identifier, password);
});