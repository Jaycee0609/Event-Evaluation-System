import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
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

const today = new Date();
const todayDate = today.toISOString().split("T")[0];
document.getElementById("start-date").setAttribute("min", todayDate);
document.getElementById("end-date").setAttribute("min", todayDate);

const form = document.getElementById('questionnaire-form');
const questionsContainer = document.getElementById('questions-container');
const departmentsContainer = document.getElementById('departments-container');
const sectionsContainer = document.getElementById('sections-container');
const descriptionTextarea = document.getElementById('description');

function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
}

adjustTextareaHeight(descriptionTextarea);

descriptionTextarea.addEventListener('input', function() {
    adjustTextareaHeight(this);
});

departmentsContainer.addEventListener('change', async () => {
  sectionsContainer.innerHTML = '';

  const departmentCheckboxes = document.querySelectorAll('input[name="dept"]:checked');
  const departments = Array.from(departmentCheckboxes).map(checkbox => checkbox.value);

  console.log('Selected departments:', departments);

  if (departments.length === 0) {
    return;
  }

  try {
    const sectionsCollection = collection(db, "sections");
    const sectionsSnapshot = await getDocs(sectionsCollection);
  
    if (sectionsSnapshot.empty) {
      console.log("No sections found in the collection.");
    }
  
    let sectionFound = false;
  
    const selectAllDiv = document.createElement("div");
    selectAllDiv.innerHTML = `
      <label>
        <input type="checkbox" id="selectAllSections">
        Select all sections
      </label>
    `;
    sectionsContainer.appendChild(selectAllDiv);
  
    sectionsSnapshot.forEach((doc) => {
      const data = doc.data();
      const sectionArray = data.sections || [];
      const departmentName = doc.id;
  
      if (departments.includes(departmentName)) {
        sectionFound = true;
        sectionArray.forEach((section) => {
          const sectionDiv = document.createElement("div");
          sectionDiv.innerHTML = `
            <label>
              <input type="checkbox" name="section" value="${section}">
              ${section}
            </label>
          `;
          sectionsContainer.appendChild(sectionDiv);
        });
      }
    });
  
    const selectAllCheckbox = document.getElementById("selectAllSections");
    selectAllCheckbox.addEventListener("change", (e) => {
      const allSectionCheckboxes = sectionsContainer.querySelectorAll(
        'input[name="section"]'
      );
      allSectionCheckboxes.forEach((checkbox) => {
        checkbox.checked = e.target.checked;
      });
    });
  
    if (!sectionFound) {
      console.log("No matching sections found.");
    }
  } catch (error) {
    console.error("Error fetching sections:", error);
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const generateQRButton = document.getElementById('generate-qr-btn');
  const qrCodeContainer = document.getElementById('qr-code-container');
  const downloadQRButton = document.getElementById('download-qr-btn');
  const titleInput = document.getElementById('title');
  let qrId = '';
  let formTitle = '';

  if (generateQRButton) {
    generateQRButton.addEventListener('click', async () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hour = String(now.getHours()).padStart(2, '0');
      const minute = String(now.getMinutes()).padStart(2, '0');
      const concatenatedDate = `${year}${month}${day}${hour}${minute}`;

      qrId = concatenatedDate;
      formTitle = titleInput ? titleInput.value : '';

      qrCodeContainer.innerHTML = '';

      const qr = new QRious({
        element: document.createElement('canvas'),
        size: 600,
        value: qrId,
      });

      qrCodeContainer.appendChild(qr.element);
      qrCodeContainer.style.display = 'block';
      generateQRButton.style.display = 'none';
      downloadQRButton.style.display = 'block';
    });
  }

  if (downloadQRButton) {
    downloadQRButton.addEventListener("click", () => {
      formTitle = titleInput ? titleInput.value : '';
      const qrCodeCanvas = qrCodeContainer.querySelector("canvas");
      const imageURL = "../imgs/logo.png";

      if (qrCodeCanvas) {
        const finalCanvas = document.createElement("canvas");
        const context = finalCanvas.getContext("2d");
        const qrSize = 600;
        const padding = 40;
        const fontSize = 50;
        const logoWidth = 120;
        const logoHeight = 120;
        const logoPadding = 20;

        const finalCanvasWidth = qrSize + logoPadding + logoWidth;
        const finalCanvasHeight = qrSize + logoPadding + logoHeight + padding + fontSize;

        finalCanvas.width = finalCanvasWidth;
        finalCanvas.height = finalCanvasHeight;

        const image = new Image();
        image.src = imageURL;

        image.onload = () => {
          context.drawImage(image, logoPadding, 0, logoWidth, logoHeight);
          context.drawImage(qrCodeCanvas, logoPadding, logoHeight + logoPadding, qrSize, qrSize);

          context.font = `${fontSize}px Arial`;
          context.textAlign = "center";
          context.fillStyle = "white";
          context.fillText(
            formTitle,
            qrSize / 2 + logoPadding,
            logoHeight + logoPadding + qrSize + padding + fontSize / 2
          );

          const link = document.createElement("a");
          link.href = finalCanvas.toDataURL("image/png");
          link.download = "qr-code.png";
          link.click();
        };

        image.onerror = () => {
          console.error("Failed to load the image.");
        };
      } else {
        console.error("QR Code not found.");
      }
    });
  }  
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const departmentCheckboxes = document.querySelectorAll('input[name="dept"]:checked');
  const departments = Array.from(departmentCheckboxes).map((checkbox) => checkbox.value);
  const sectionCheckboxes = document.querySelectorAll('input[name="section"]:checked');
  const sections = Array.from(sectionCheckboxes).map((checkbox) => checkbox.value);
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;
  const formattedStartDate = new Date(startDate).toISOString().split("T")[0];
  const formattedEndDate = new Date(endDate).toISOString().split("T")[0];

  const questions = [];
  const questionDivs = questionsContainer.querySelectorAll('div[id^="question-div"]');
  questionDivs.forEach((div) => {
    const questionInput = div.querySelector('input[id^="question"]');
    const questionTypeSelect = div.querySelector('select[id^="type"]');
    const question = {
      text: questionInput.value,
      type: questionTypeSelect.value,
    };

    if (question.type === "multiple-choice") {
      const choices = [];
      const choiceInputs = div.querySelectorAll('input[id^="choice"]');
      choiceInputs.forEach((choiceInput) => {
        choices.push(choiceInput.value);
      });
      question.choices = choices;
    }

    questions.push(question);
  });

  try {
    const formsCollection = collection(db, "forms");
    const now = new Date();
    let qrId = "";
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const concatenatedDate = `${year}${month}${day}${hour}${minute}`;
    qrId = concatenatedDate;

    const docRef = await addDoc(formsCollection, {
      title,
      description,
      departments,
      sections,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      createdAt: new Date(),
      questions,
      responseCounts: sections.reduce((acc, section) => {
        acc[section] = 0;
        return acc;
      }, {}),
      qrCodeData: qrId,
      positive: 0,
      negative: 0,
    });

    const successMessage = document.createElement("p");
    successMessage.textContent = "Form created successfully! Redirecting...";
    successMessage.style.color = "green";
    form.appendChild(successMessage);

    setTimeout(() => {
      window.location.href = "/ssc/dash";
    }, 2000);
  } catch (error) {
    console.error("Error submitting form:", error);

    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Error creating form. Please try again.";
    errorMessage.style.color = "red";
    form.appendChild(errorMessage);
  }
});