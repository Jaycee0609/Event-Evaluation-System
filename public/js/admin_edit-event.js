import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, doc, getDocs, getDoc, Timestamp, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
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

const renderedSections = new Set();

departmentsContainer.addEventListener('change', async () => {
    await updateSections();
});

async function updateSections() {
    const sectionsContainer = document.getElementById("sections-container");
    const departmentCheckboxes = document.querySelectorAll('input[name="dept"]:checked');
    const departments = Array.from(departmentCheckboxes).map((checkbox) => checkbox.value);

    if (departments.length === 0) {
        sectionsContainer.innerHTML = "";
        renderedSections.clear();
        return;
    }

    const previouslyCheckedSections = new Set();
    const existingCheckedCheckboxes = document.querySelectorAll('input[name="section"]:checked');
    existingCheckedCheckboxes.forEach((checkbox) => {
        if (checkbox.dataset && checkbox.value) {
            previouslyCheckedSections.add(checkbox.value);
        }
    });

    let sectionFound = false;

    try {
        const sectionsCollection = collection(db, "sections");
        const sectionsSnapshot = await getDocs(sectionsCollection);

        sectionsContainer.querySelectorAll("div").forEach((sectionDiv) => {
            const sectionInput = sectionDiv.querySelector('input[name="section"]');
            if (sectionInput) {
                const sectionName = sectionInput.value;
                const departmentName = sectionInput.dataset.department;

                if (!departments.includes(departmentName) && renderedSections.has(sectionName)) {
                    sectionsContainer.removeChild(sectionDiv);
                    renderedSections.delete(sectionName);
                }
            }
        });

        if (!document.getElementById("selectAllSections")) {
            const selectAllDiv = document.createElement("div");
            selectAllDiv.innerHTML = `
                <label>
                    <input type="checkbox" id="selectAllSections">
                    Select all sections
                </label>
            `;
            sectionsContainer.insertBefore(selectAllDiv, sectionsContainer.firstChild);

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

            if (departments.includes(departmentName)) {
                sectionFound = true;
                sectionArray.forEach((section) => {
                    if (!renderedSections.has(section)) {
                        const sectionDiv = document.createElement("div");
                        const isChecked = previouslyCheckedSections.has(section) ? "checked" : "";
                        sectionDiv.innerHTML = `
                            <label>
                                <input type="checkbox" name="section" value="${section}" ${isChecked} data-department="${departmentName}">
                                ${section}
                            </label>
                        `;
                        sectionsContainer.appendChild(sectionDiv);
                        renderedSections.add(section);
                    }
                });
            }
        });

        if (!sectionFound) {
            console.log("No matching sections found.");
        }
    } catch (error) {
        console.error("Error fetching sections:", error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const formId = new URLSearchParams(window.location.search).get('formId');
    if (formId) {
        try {
            const formDocRef = doc(db, 'forms', formId);
            const formSnapshot = await getDoc(formDocRef);
            const formData = formSnapshot.data();

            if (formSnapshot.exists()) {
                const startDate = formData.startDate || '';
                const endDate = formData.endDate || '';

                document.getElementById('title').value = formData.title;
                document.getElementById('description').value = formData.description;
                document.getElementById('start-date').value = startDate;
                document.getElementById('end-date').value = endDate;

                if (Array.isArray(formData.departments)) {
                    formData.departments.forEach(department => {
                        const departmentCheckbox = document.querySelector(`input[name="dept"][value="${department}"]`);
                        if (departmentCheckbox) {
                            departmentCheckbox.checked = true;
                        }
                    });
                } else if (formData.dept) {
                    const departmentCheckbox = document.querySelector(`input[name="dept"][value="${formData.dept}"]`);
                    if (departmentCheckbox) {
                        departmentCheckbox.checked = true;
                        departmentCheckbox.disabled = true;
                    }

                    document.querySelectorAll('input[name="dept"]').forEach(checkbox => {
                        if (checkbox.value !== formData.dept) {
                            checkbox.disabled = true;
                        }
                    });
                }

                await updateSections();

                formData.sections.forEach(section => {
                    const sectionCheckbox = document.querySelector(`input[name="section"][value="${section}"]`);
                    if (sectionCheckbox) {
                        sectionCheckbox.checked = true;
                    }
                });

                formData.questions.forEach((question, index) => {
                    const questionDiv = document.createElement('div');
                    questionDiv.id = `question-div-${index}`;
                    questionDiv.innerHTML = ` 
                        <label for="question-${index}">Question:</label>
                        <input type="text" id="question-${index}" value="${question.text}">
                        <label for="type-${index}">Type:</label>
                        <select id="type-${index}">
                            <option value="multiple-choice" ${question.type === 'multiple-choice' ? 'selected' : ''}>Multiple Choice</option>
                            <option value="short-answer" ${question.type === 'short-answer' ? 'selected' : ''}>Short Answer</option>
                        </select>
                        ${question.type === 'multiple-choice' ? ` 
                            <div>
                                <label for="choice-${index}-1">Choice 1:</label>
                                <input type="text" id="choice-${index}-1" value="${question.choices[0] || ''}">
                            </div>
                            <div>
                                <label for="choice-${index}-2">Choice 2:</label>
                                <input type="text" id="choice-${index}-2" value="${question.choices[1] || ''}">
                            </div>
                        ` : ''}
                    `;
                    questionsContainer.appendChild(questionDiv);
                });
            } else {
                console.log('Form not found.');
            }
        } catch (error) {
            console.error('Error loading form data:', error);
        }
    } else {
        console.log('No form ID provided.');
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
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");
            const hour = String(now.getHours()).padStart(2, "0");
            const minute = String(now.getMinutes()).padStart(2, "0");
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
              context.fillText(
                formTitle,
                qrSize / 2 + logoPadding,
                logoHeight + logoPadding + qrSize + padding + fontSize / 2
              );
      
              const link = document.createElement('a');
              link.href = finalCanvas.toDataURL('image/png');
              link.download = 'qr-code.png';
              link.click();
            };
      
            image.onerror = () => {
              console.error('Failed to load the image.');
            };
          } else {
            console.error('QR Code not found.');
          }
        });
      }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const formId = new URLSearchParams(window.location.search).get('formId');
        if (!formId) {
            console.error('No form ID found.');
            return;
        }
    
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const departmentCheckboxes = document.querySelectorAll('input[name="dept"]:checked');
        let departments;
        let dept;
    
        if (departmentCheckboxes.length === 1) {
            dept = departmentCheckboxes[0].value;
        } else {
            departments = Array.from(departmentCheckboxes).map(checkbox => checkbox.value);
        }
        const sectionCheckboxes = document.querySelectorAll('input[name="section"]:checked');
        const sections = Array.from(sectionCheckboxes).map(checkbox => checkbox.value);
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const questions = [];
        const questionDivs = questionsContainer.querySelectorAll('div[id^="question-div"]');
        
        questionDivs.forEach((div, index) => {
            const questionInput = div.querySelector(`#question-${index}`);
            const questionTypeSelect = div.querySelector(`#type-${index}`);
            const question = {
                text: questionInput.value,
                type: questionTypeSelect.value,
            };
    
            if (question.type === 'multiple-choice') {
                const choices = [];
                const choiceInputs = div.querySelectorAll(`input[id^="choice-${index}"]`);
                choiceInputs.forEach((choiceInput) => {
                    choices.push(choiceInput.value);
                });
                question.choices = choices;
            }
    
            questions.push(question);
        });
    
        try {
            const formDocRef = doc(db, 'forms', formId);
            const formSnapshot = await getDoc(formDocRef);
            const formData = formSnapshot.data();
            const existingQRCodeData = formData ? formData.qrCodeData : '';
            const updateData = {
                title,
                description,
                startDate,
                endDate,
                sections,
                questions,
                responseCounts: (() => {
                    const existingCounts = (formData && formData.responseCounts) || {};
                    const updatedCounts = {};

                    sections.forEach((section) => {
                        updatedCounts[section] = existingCounts[section] ?? 0;
                    });

                    return updatedCounts;
                })(),
                qrCodeData: qrId || existingQRCodeData,
            };
    
            if (departments) {
                updateData.departments = departments;
            } else if (dept) {
                updateData.dept = dept;
            }
    
            await updateDoc(formDocRef, updateData);
    
            const successMessage = document.createElement('p');
            successMessage.textContent = 'Form updated successfully!';
            successMessage.style.color = 'green';
            form.appendChild(successMessage);
    
            setTimeout(() => {
                window.location.href = '/admin/dash';
            }, 2000);
    
        } catch (error) {
            console.error('Error updating form:', error);
    
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Error updating form. Please try again.';
            errorMessage.style.color = 'red';
            form.appendChild(errorMessage);
        }
    });    
});