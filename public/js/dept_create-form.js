import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
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
const auth = getAuth(app);

const today = new Date();
const todayDate = today.toISOString().split("T")[0];
document.getElementById("start-date").setAttribute("min", todayDate);
document.getElementById("end-date").setAttribute("min", todayDate);

const form = document.getElementById('questionnaire-form');
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

document.addEventListener('DOMContentLoaded', () => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      try {
        const adminDocRef = doc(db, 'dept-admins', user.uid);
        const adminDoc = await getDoc(adminDocRef);

        if (!adminDoc.exists()) {
          console.error('Admin document does not exist.');
          return;
        }

        const adminData = adminDoc.data();
        const adminDept = adminData.dept;

        if (!adminDept) {
          console.error('Admin department not found.');
          return;
        }

        console.log('Admin department:', adminDept);

        sectionsContainer.innerHTML = '';

        try {
          const sectionsCollection = collection(db, "sections");
          const sectionsSnapshot = await getDocs(sectionsCollection);
        
          if (sectionsSnapshot.empty) {
            console.log("No sections found in the collection.");
            return;
          }
        
          let sectionFound = false;
        
          if (!document.getElementById("selectAllSections")) {
            const selectAllDiv = document.createElement("div");
            selectAllDiv.innerHTML = `
              <label>
                <input type="checkbox" id="selectAllSections">
                Select all sections
              </label>
            `;
            sectionsContainer.appendChild(selectAllDiv);
        
            const selectAllCheckbox = document.getElementById("selectAllSections");
            selectAllCheckbox.addEventListener("change", (e) => {
              const allSectionCheckboxes = sectionsContainer.querySelectorAll('input[name="section"]');
              allSectionCheckboxes.forEach((checkbox) => {
                checkbox.checked = e.target.checked;
              });
            });
          }
        
          sectionsSnapshot.forEach((doc) => {
            const data = doc.data();
            const sectionArray = data.sections || [];
            const departmentName = doc.id;
        
            if (departmentName === adminDept) {
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
        
          if (!sectionFound) {
            console.log("No matching sections found.");
          }
        } catch (error) {
          console.error("Error fetching sections:", error);
        }        

      } catch (error) {
        console.error('Error retrieving admin data:', error);
      }
    } else {
      console.error('No authenticated user found.');
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const generateQRButton = document.getElementById('generate-qr-btn');
  const qrCodeContainer = document.getElementById('qr-code-container');
  const downloadQRButton = document.getElementById('download-qr-btn');
  const titleInput = document.getElementById('title');
  let qrId = '';
  let formTitle = '';

  if (generateQRButton) {
    generateQRButton.addEventListener('click', () => {
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
    downloadQRButton.addEventListener('click', () => {
      formTitle = titleInput ? titleInput.value : '';
      const qrCodeCanvas = qrCodeContainer.querySelector('canvas');
      const imageURL = "../imgs/logo.png";
  
      if (qrCodeCanvas) {
        const finalCanvas = document.createElement('canvas');
        const context = finalCanvas.getContext('2d');
        
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
          context.textAlign = 'center';
          context.fillStyle = 'white';
          context.fillText(formTitle, qrSize / 2 + logoPadding, logoHeight + logoPadding + qrSize + padding + fontSize / 2);
  
          const link = document.createElement('a');
          link.href = finalCanvas.toDataURL('image/png');
          link.download = 'qr-code.png';
          link.click();
        };
  
        image.onerror = () => {
          console.error('Failed to load the image.');
        };
      }
    });
  }  

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const adminDocRef = doc(db, "dept-admins", user.uid);
        const adminDoc = await getDoc(adminDocRef);
        const adminData = adminDoc.data();
        const adminDept = adminData.dept;
    
        const formData = new FormData(form);
        const formObject = {};
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
    
        const departmentCheckboxes = document.querySelectorAll('input[name="dept"]:checked');
        const departments = Array.from(departmentCheckboxes).map(checkbox => checkbox.value);
    
        const sectionCheckboxes = document.querySelectorAll('input[name="section"]:checked');
        const sections = Array.from(sectionCheckboxes).map(checkbox => checkbox.value);
    
        const startDate = document.getElementById("start-date").value;
        const endDate = document.getElementById("end-date").value;
    
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
    
        try {
            const docRef = await addDoc(collection(db, "forms"), {
                ...formObject,
                title,
                description,
                qrCodeData: qrId,
                startDate,
                endDate,
                createdAt: new Date(),
                questions: [],
                dept: adminDept,
                sections,
                responseCounts: sections.reduce((acc, section) => {
                    acc[section] = 0;
                    return acc;
                }, {}),
                positive: 0,
                negative: 0
            });
    
            console.log("Document written with ID: ", docRef.id);
    
            const successMessage = document.createElement("div");
            successMessage.textContent = "Form created successfully!";
            successMessage.style.color = "green";
            form.appendChild(successMessage);
    
            setTimeout(() => {
                window.location.href = "/dept/dash";
            }, 2000);
    
        } catch (error) {
            console.error("Error adding document: ", error);
    
            const errorMessage = document.createElement("div");
            errorMessage.textContent = "Error creating form. Please try again.";
            errorMessage.style.color = "red";
            form.appendChild(errorMessage);
        }
      });      
    }
  });
});