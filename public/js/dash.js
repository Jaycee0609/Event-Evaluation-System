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
const auth = getAuth();
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  let qrScanner;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userId = user.uid;
      console.log('User ID:', userId);

      const userDoc = await getDoc(doc(db, 'users', userId));
      const userDept = userDoc.exists() ? userDoc.data().dept : null;
      const userSection = userDoc.exists() ? userDoc.data().section : null;

      if (!userDept || !userSection) {
        console.warn('User department or section not found.');
        return;
      }

      console.log('User Department:', userDept);
      console.log('User Section:', userSection);

      loadForms(userDept, userSection, userId);
    } else {
      console.warn('User not authenticated.');
    }
  });

  async function loadForms(userDept, userSection, userId, department = "all", section = "all") {
    const formsContainer = document.getElementById("events-container");

    const formItems = formsContainer.querySelectorAll(".form-item");
    formItems.forEach(item => item.remove());

    const querySnapshot = await getDocs(collection(db, "forms"));
    const sortedForms = querySnapshot.docs.sort((a, b) => {
        const aData = a.data();
        const bData = b.data();
        return new Date(aData.createdAt.toDate()) - new Date(bData.createdAt.toDate());
    });

    sortedForms.forEach(async (doc) => {
        const formData = doc.data();

        if (department !== "all" && formData.department !== department) {
            return;
        }

        const deptMatch = formData.departments ? formData.departments.includes(userDept) : formData.dept === userDept;
        const sectionMatch = formData.sections ? formData.sections.includes(userSection) : true;

        if (!deptMatch || !sectionMatch) {
            return;
        }

        const formDiv = document.createElement("div");
        formDiv.classList.add("form-item");

        const title = document.createElement("p");
        title.classList.add("title");
        title.textContent = formData.title;

        const availability = document.createElement("p");
        availability.classList.add("availability");

        const evaluateButton = document.createElement("button");
        evaluateButton.classList.add("evaluate-button");
        evaluateButton.textContent = "Evaluate";

        evaluateButton.addEventListener("click", () => {
            startQRScanning(doc.id, formData.qrCodeData);
        });

        formDiv.appendChild(title);
        formDiv.appendChild(availability);
        formDiv.appendChild(evaluateButton);
        formsContainer.appendChild(formDiv);

        const startDate = formData.startDate ? new Date(formData.startDate) : null;
        const endDate = formData.endDate ? new Date(formData.endDate) : null;

        updateRemainingTime(availability, startDate, endDate, evaluateButton);
        setInterval(() => {
            updateRemainingTime(availability, startDate, endDate, evaluateButton);
        }, 60 * 1000);

        const answersQuery = query(
            collection(db, "answers"),
            where("formId", "==", doc.id),
            where("userId", "==", userId)
        );

        const answersSnapshot = await getDocs(answersQuery);

        if (!answersSnapshot.empty) {
            evaluateButton.textContent = "Answered";
            availability.textContent = "Answered Form";
            evaluateButton.classList.add("answered-button");
            evaluateButton.disabled = true;
        }
    });
  }

  function updateRemainingTime(element, startDate, endDate, button) {
    const now = new Date();

    if (startDate && endDate) {
        const startDay = new Date(startDate);
        const endDay = new Date(endDate);
        endDay.setHours(23, 59, 59, 999);

        if (now > endDay) {
            element.textContent = "Expired form";
            element.classList.add("expired");
            button.textContent = "Expired";
            button.classList.add("expired-button");
            button.disabled = true;
        } else if (now < startDay) {
            const daysLeft = Math.ceil((startDay - now) / (1000 * 60 * 60 * 24));
            element.textContent = `${daysLeft} days until available`;
            element.classList.add("locked");
            button.textContent = "Locked";
            button.classList.add("locked-button");
            button.disabled = true;
        } else {
          const timeLeft = endDay - now;

          if (timeLeft > 24 * 60 * 60 * 1000) {
              const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
              element.textContent = `${daysLeft} days left`;
          } else if (timeLeft > 0) {
              const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
              const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
              element.textContent = hoursLeft > 0 
                  ? `${hoursLeft} hours left` 
                  : `${minutesLeft} minutes left`;
          } else {
              element.textContent = "Expired form";
              element.classList.add("expired");
              button.textContent = "Expired";
              button.classList.add("expired-button");
              button.disabled = true;
          }
          
          button.textContent = "Evaluate";
          button.classList.remove("expired-button", "locked-button");
          button.disabled = false;          
        }
    } else {
        element.textContent = "Invalid availability dates";
        element.classList.add("error");
        button.textContent = "Unavailable";
        button.classList.add("error-button");
        button.disabled = true;
    }
  }

  async function startQRScanning(formId, expectedQRCode) {
    if (!qrScanner) {
        console.log('Initializing Html5-Qrcode scanner...');
        console.log(expectedQRCode)

        qrScanner = new Html5Qrcode("qr-video");

        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        try {
            await qrScanner.start(
                { facingMode: "environment" },
                config,
                (decodedText) => {
                    console.log('Scanned content:', decodedText);
                    if (decodedText === expectedQRCode) {
                        console.log('QR code matches. Redirecting to form...');
                        window.location.href = `/users/form?formId=${formId}`;
                    } else {
                        console.log('QR code does not match. Returning to dashboard.');
                        alert('Invalid QR code. Returning to dashboard.');
                        window.location.href = '/users/dash';
                    }
                },
                (errorMessage) => {
                    console.warn('QR scan error:', errorMessage);
                }
            );

            console.log('QR scanner started.');

        } catch (startError) {
            console.error('Error starting Html5-Qrcode scanner:', startError);
            alert('Failed to initialize the QR scanner. Please check camera permissions and try again.');
        }
    } else {
        console.log('QR scanner already initialized.');
    }
}
});