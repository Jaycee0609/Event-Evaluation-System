import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, getDoc, addDoc, collection, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
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

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const formId = urlParams.get('formId');

  if (formId) {
    try {
      const formDoc = await getDoc(doc(db, 'forms', formId));
      if (formDoc.exists()) {
        const formData = formDoc.data();
        document.getElementById("title").textContent = formData.title;
        document.getElementById("desc").textContent = formData.description;

        const formContainer = document.getElementById('form-container');
        let currentGroup = '';
        let order = 1;

        formData.questions.forEach((question, index) => {
          if (question.group) {
            const h2 = document.createElement('h2');
            h2.textContent = question.group;
            formContainer.appendChild(h2);
            currentGroup = question.group;
            order = 1;
          }

          const sectionTitle = document.createElement('p');
          sectionTitle.textContent = question.text;
          sectionTitle.classList.add('section-title');
          formContainer.appendChild(sectionTitle);

          question.choices.forEach(choice => {
            const radioButton = document.createElement('input');
            radioButton.type = 'radio';
            radioButton.name = `question${index}`;
            radioButton.value = choice;

            const label = document.createElement('label');
            label.textContent = choice;

            formContainer.appendChild(radioButton);
            formContainer.appendChild(label);
            formContainer.appendChild(document.createElement('br'));
          });

          formContainer.appendChild(document.createElement('div')).style.margin = '1.5rem 0';
        });

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Submit';
        submitButton.classList.add('submit-btn');
        formContainer.appendChild(submitButton);

      } else {
        document.body.innerHTML = '<p>Form not found.</p>';
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      document.body.innerHTML = error;
    }
  } else {
    document.body.innerHTML = '<p>No form ID provided.</p>';
  }
});

const feedbackTextarea = document.getElementById('feedback');

function adjustTextareaHeight(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
}

adjustTextareaHeight(feedbackTextarea);

feedbackTextarea.addEventListener('input', function() {
  adjustTextareaHeight(this);
});

emailjs.init("U0z2EKZx9cUmVo5Tt");

document.getElementById("form-container").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formId = new URLSearchParams(window.location.search).get("formId");
  const formData = new FormData(e.target);

  const groupedAnswers = {};
  let isValid = true;

  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  const errorElement = document.querySelector(".error-message");
  if (errorElement) errorElement.remove();

  document.querySelectorAll(".section-title").forEach((section) => {
    section.style.color = "";
  });

  const feedback = formData.get("feedback");
  if (feedback) {
    groupedAnswers["Feedback"] = {
      order: 1,
      sections: [{ title: "Feedback", answer: feedback, order: 1 }],
    };
  } else {
    document.querySelector('label[for="feedback"]').style.color = "red";
    isValid = false;
  }

  const eventRate = formData.get("event-rate");
  let positiveIncrement = 0;
  let negativeIncrement = 0;

  if (eventRate === "Positive") {
    positiveIncrement = 1;
  } else if (eventRate === "Negative") {
    negativeIncrement = 1;
  } else {
    document.getElementById("event-rate-label").style.color = "red";
    isValid = false;
  }

  document.querySelectorAll(".section-title").forEach((sectionTitle) => {
    const nextElement = sectionTitle.nextElementSibling;
    
    if (nextElement) {
      if (nextElement.tagName === "TEXTAREA") {
        if (!nextElement.value.trim()) {
          sectionTitle.style.color = "red";
          isValid = false;
        }
      } else if (nextElement.tagName === "DIV") {
        const radioInputs = nextElement.querySelectorAll('input[type="radio"]');
        const isAnyRadioChecked = Array.from(radioInputs).some((radio) => radio.checked);

        if (radioInputs.length && !isAnyRadioChecked) {
          sectionTitle.style.color = "red";
          isValid = false;
        }
      } else {
        const inputName = nextElement.name;
        if (inputName && !formData.has(inputName)) {
          sectionTitle.style.color = "red";
          isValid = false;
        }
      }
    }
  });

  if (!isValid) {
    const submitButton = document.querySelector(".submit-btn");

    const errorMessage = document.createElement("p");
    errorMessage.classList.add("error-message");
    errorMessage.textContent = "Please answer all sections before submitting.";
    submitButton.insertAdjacentElement("afterend", errorMessage);
    return;
  }

  try {
    const formDocRef = doc(db, "forms", formId);
    const formDocSnapshot = await getDoc(formDocRef);

    if (formDocSnapshot.exists()) {
      const formData = formDocSnapshot.data();

      await updateDoc(formDocRef, {
        positive: formData.positive + positiveIncrement,
        negative: formData.negative + negativeIncrement,
      });

      console.log("Updated positive and negative fields.");
    }

    console.log("Final Grouped Answers:", groupedAnswers);

    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      const userSection = userDoc.exists() ? userDoc.data().section : null;

      console.log("User Section:", userSection);

      if (!userSection) {
        console.warn("User section not found.");
        return;
      }

      await incrementFormCount(formId, userSection);

      await addDoc(collection(db, "answers"), {
        formId,
        userId,
        groupedAnswers,
        submittedAt: new Date(),
      });

      const existingMessage = document.querySelector("#form-container .success-message");
      if (existingMessage) {
        existingMessage.remove();
      }

      const successMessage = document.createElement("p");
      successMessage.classList.add("success-message");
      successMessage.textContent = "Form submitted successfully! Redirecting...";
      document.getElementById("form-container").appendChild(successMessage);

      if (userId) {
        const userDocRef = doc(db, "users", userId);
        
        try {
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const fullName = `${userData.fname} ${userData.lname}`;

            let messageContent = "";
            if (eventRate === "Positive") {
              messageContent = `Hello ${fullName},\n\nThank you for participating in the event and for your positive feedback!\n\nBest regards.`;
            } else if (eventRate === "Negative") {
              messageContent = `Hello ${fullName},\n\nThank you for participating in the event. We're sorry to hear that your experience wasn't satisfactory.\n\nWe appreciate your input and will work on improving.\n\nBest regards.`;
            }
            
            const emailParams = {
              to_name: fullName,
              to_email: userData.email,
              message: messageContent,
            };

            emailjs.send("service_49xln9p", "template_5bjjfe4", emailParams)
              .then((response) => {
                console.log("Email sent successfully", response);
              })
              .catch((error) => {
                console.error("Failed to send email", error);
              });
          } else {
            console.error("User data not found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
        }
      }

      setTimeout(() => {
        window.location.href = "/users/dash";
      }, 2000);
    } catch (error) {
      console.error("Error submitting responses:", error);

      const errorMessage = document.createElement("p");
      errorMessage.classList.add("error-message");
      errorMessage.textContent = "Failed to submit your responses.";
      document.getElementById("form-container").appendChild(errorMessage);
    }
  } catch (error) {
    console.error("Error updating positive/negative values:", error);
  }
});

async function incrementFormCount(formId, userSection) {
  const formRef = doc(db, 'forms', formId);

  try {
    await updateDoc(formRef, {
      count: increment(1),
      [`responseCounts.${userSection}`]: increment(1)
    });
  } catch (error) {
    console.error('Error updating form count:', error);
  }
}