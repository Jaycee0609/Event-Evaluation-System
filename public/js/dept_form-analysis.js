import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
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

async function getFormDataAndAnswers(formId) {
    const formRef = doc(db, 'forms', formId);
    try {
        const formSnap = await getDoc(formRef);
        if (formSnap.exists()) {
            const formData = formSnap.data();

            document.getElementById('form-title').textContent = formData.title;
            document.getElementById('form-count').textContent = `Responses: ${formData.count || 0}`;
            document.getElementById('form-pos').textContent = `Positive: ${formData.positive}`;
            document.getElementById('form-neg').textContent = `Negative: ${formData.negative}`;
            displayResponseCounts(formData.responseCounts, formData.count);

            const expectedCount = await calculateExpectedCount(formData);
            document.getElementById('expected-count').textContent = `Expected Attendance: ${expectedCount}`;

            await displayAnswers(formId, formData.count, formData.responseCounts);
        } else {
            console.error("No such document!");
        }
    } catch (error) {
        console.error("Error getting form data:", error);
    }
}

async function calculateExpectedCount(formData) {
    try {
        const usersRef = collection(db, 'users');
        const usersSnap = await getDocs(usersRef);
        let count = 0;

        if (formData.dept) {
            const dept = formData.dept;
            usersSnap.forEach(doc => {
                if (doc.data().dept === dept) count++;
            });
        } else if (Array.isArray(formData.departments)) {
            const departments = formData.departments;
            usersSnap.forEach(doc => {
                if (departments.includes(doc.data().dept)) count++;
            });
        }

        return count;
    } catch (error) {
        console.error("Error calculating expected count:", error);
        return 0;
    }
}

function displayResponseCounts(responseCounts, totalResponses) {
    const answersContainer = document.getElementById('answers-container');
    if (!answersContainer) {
        console.error('No element found with ID "answers-container".');
        return;
    }

    if (typeof responseCounts !== 'object' || responseCounts === null) {
        console.error('responseCounts is not a valid object:', responseCounts);
        return;
    }

    answersContainer.innerHTML = '';

    const responseCountsTitle = document.createElement('p');
    responseCountsTitle.classList.add("response-counts-title");
    responseCountsTitle.textContent = "Sections";
    answersContainer.appendChild(responseCountsTitle);

    Object.entries(responseCounts).forEach(([section, count]) => {
        const percentage = totalResponses > 0 ? (count / totalResponses * 100).toFixed(2) : 0;
        const sectionElement = document.createElement('p');
        sectionElement.classList.add("response-counts-section");
        sectionElement.textContent = `${section} - ${count} (${percentage}%)`;
        answersContainer.appendChild(sectionElement);
    });

    answersContainer.appendChild(document.createElement('br'));
}

async function displayAnswers(formId, totalResponses, responseCounts) {
    const answersContainer = document.getElementById('answers-container');
    if (!answersContainer) {
        console.error('No element found with ID "answers-container".');
        return;
    }

    const answersQuery = query(collection(db, 'answers'), where('formId', '==', formId));
    const querySnapshot = await getDocs(answersQuery);

    const answersData = {};
    let feedbackResponses = [];

    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        console.log('Document data:', docData);

        const groupedAnswers = docData.groupedAnswers;
        if (typeof groupedAnswers !== 'object' || groupedAnswers === null) {
            console.error('groupedAnswers is not a valid object:', groupedAnswers);
            return;
        }

        Object.entries(groupedAnswers).forEach(([groupTitle, groupObj]) => {
            if (typeof groupObj !== 'object' || typeof groupObj.order !== 'number' || !Array.isArray(groupObj.sections)) {
                console.warn('Invalid groupObj or sections:', groupObj);
                return;
            }

            if (!answersData[groupTitle]) {
                answersData[groupTitle] = {};
            }

            groupObj.sections.forEach((sectionObj) => {
                if (typeof sectionObj !== 'object') {
                    console.warn('Invalid sectionObj type:', sectionObj);
                    return;
                }

                if (typeof sectionObj.title !== 'string') {
                    console.warn('Invalid sectionObj title:', sectionObj.title);
                    return;
                }

                const sectionTitle = sectionObj.title;
                const answerValue = sectionObj.answer;

                if (sectionTitle.toLowerCase() === 'feedback') {
                    console.log('Feedback found:', answerValue);
                    feedbackResponses.push(answerValue);
                    return;
                }

                if (typeof answerValue !== 'number') {
                    console.warn('Invalid answerValue for section:', sectionObj);
                    return;
                }

                if (!answersData[groupTitle][sectionTitle]) {
                    answersData[groupTitle][sectionTitle] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                }

                answersData[groupTitle][sectionTitle][answerValue] = (answersData[groupTitle][sectionTitle][answerValue] || 0) + 1;
            });
        });
    });

    console.log('Processed answersData:', JSON.stringify(answersData, null, 2));
    console.log('Feedback responses:', feedbackResponses);

    const sortedGroups = Object.entries(answersData)
        .sort(([a], [b]) => {
            const aOrder = querySnapshot.docs.find(doc => doc.data().groupedAnswers[a])?.data().groupedAnswers[a]?.order || 0;
            const bOrder = querySnapshot.docs.find(doc => doc.data().groupedAnswers[b])?.data().groupedAnswers[b]?.order || 0;
            return aOrder - bOrder;
        });

    for (const [groupTitle, sections] of sortedGroups) {
        const groupElement = document.createElement('p');
        groupElement.classList.add("group-title");
        groupElement.textContent = groupTitle;
        answersContainer.appendChild(groupElement);

        answersContainer.appendChild(document.createElement('br'));

        const sortedSections = Object.entries(sections).sort(([a], [b]) => {
            const groupObj = querySnapshot.docs.find(doc => doc.data().groupedAnswers[groupTitle])?.data().groupedAnswers[groupTitle];
            const aOrder = groupObj?.sections.find(sec => sec.title === a)?.order || 0;
            const bOrder = groupObj?.sections.find(sec => sec.title === b)?.order || 0;
            return aOrder - bOrder;
        });

        for (const [sectionTitle, options] of sortedSections) {
            const sectionElement = document.createElement('p');
            sectionElement.classList.add("section-title");
            sectionElement.textContent = sectionTitle;
            answersContainer.appendChild(sectionElement);

            for (let option = 1; option <= 5; option++) {
                const count = options[option] || 0;
                const percentage = totalResponses > 0 ? (count / totalResponses * 100).toFixed(2) : 0;

                const optionElement = document.createElement('p');
                optionElement.textContent = `${option} - ${count} (${percentage}%)`;
                answersContainer.appendChild(optionElement);
            }

            answersContainer.appendChild(document.createElement('br'));

            if (responseCounts && responseCounts[sectionTitle]) {
                const sectionResponseCount = responseCounts[sectionTitle];
                const responsePercentage = totalResponses > 0 ? (sectionResponseCount / totalResponses * 100).toFixed(2) : 0;
                const responseCountElement = document.createElement('p');
                responseCountElement.classList.add("section-response-count");
                responseCountElement.textContent = `${sectionTitle} - ${sectionResponseCount} (${responsePercentage}%)`;
                answersContainer.appendChild(responseCountElement);
            }

        }
    }

    if (feedbackResponses.length > 0) {
        feedbackResponses.forEach((feedback, index) => {
            console.log('Displaying feedback entry:', feedback);
            const feedbackElement = document.createElement('p');
            feedbackElement.classList.add("feedback-text");
            feedbackElement.textContent = `${feedback}`;
            answersContainer.appendChild(feedbackElement);
        });

    }
}

async function displayFilteredAnswers(formId, mapName) {
    const answersContainer = document.getElementById('answers-container');
    if (!answersContainer) {
        console.error('No element found with ID "answers-container".');
        return;
    }

    answersContainer.innerHTML = '';

    try {
        const answersQuery = query(
            collection(db, 'answers'),
            where('formId', '==', formId)
        );

        const querySnapshot = await getDocs(answersQuery);

        const answersData = {};
        let feedbackResponses = [];
        let totalResponses = 0;
        let responseCounts = {};

        querySnapshot.forEach((doc) => {
            const docData = doc.data();
            const groupedAnswers = docData.groupedAnswers;

            if (typeof groupedAnswers !== 'object' || groupedAnswers === null) {
                console.error('groupedAnswers is not a valid object:', groupedAnswers);
                return;
            }

            if (mapName && !groupedAnswers.hasOwnProperty(mapName)) {
                return;
            }

            totalResponses++;

            const targetMaps = mapName ? { [mapName]: groupedAnswers[mapName] } : groupedAnswers;

            Object.entries(targetMaps).forEach(([groupTitle, groupObj]) => {
                if (typeof groupObj !== 'object' || typeof groupObj.order !== 'number' || !Array.isArray(groupObj.sections)) {
                    console.warn('Invalid groupObj or sections:', groupObj);
                    return;
                }

                if (!answersData[groupTitle]) {
                    answersData[groupTitle] = {};
                }

                groupObj.sections.forEach((sectionObj) => {
                    if (typeof sectionObj !== 'object') {
                        console.warn('Invalid sectionObj type:', sectionObj);
                        return;
                    }

                    if (typeof sectionObj.title !== 'string') {
                        console.warn('Invalid sectionObj title:', sectionObj.title);
                        return;
                    }

                    const sectionTitle = sectionObj.title;
                    const answerValue = sectionObj.answer;

                    if (!answersData[groupTitle][sectionTitle]) {
                        answersData[groupTitle][sectionTitle] = {
                            title: sectionTitle,
                            counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                        };
                    }

                    if (sectionTitle in responseCounts) {
                        responseCounts[sectionTitle]++;
                    } else {
                        responseCounts[sectionTitle] = 1;
                    }

                    if (sectionTitle.toLowerCase() === 'feedback') {
                        console.log('Feedback found:', answerValue);
                        feedbackResponses.push(answerValue);
                        return;
                    }

                    if (typeof answerValue !== 'number') {
                        console.warn('Invalid answerValue for section:', sectionObj);
                        return;
                    }

                    answersData[groupTitle][sectionTitle].counts[answerValue] =
                        (answersData[groupTitle][sectionTitle].counts[answerValue] || 0) + 1;
                });
            });
        });

        console.log('Processed filtered answersData:', JSON.stringify(answersData, null, 2));
        console.log('Filtered feedback responses:', feedbackResponses);

        const sortedGroups = Object.entries(answersData)
            .sort(([a], [b]) => {
                const aOrder = querySnapshot.docs.find(doc => doc.data().groupedAnswers[a])?.data().groupedAnswers[a]?.order || 0;
                const bOrder = querySnapshot.docs.find(doc => doc.data().groupedAnswers[b])?.data().groupedAnswers[b]?.order || 0;
                return aOrder - bOrder;
            });

        for (const [groupTitle, sections] of sortedGroups) {
            const groupElement = document.createElement('p');
            groupElement.classList.add("group-title");
            groupElement.textContent = groupTitle;
            answersContainer.appendChild(groupElement);
            answersContainer.appendChild(document.createElement('br'));

            const sortedSections = Object.values(sections).sort((a, b) => a.title.localeCompare(b.title));

            for (const section of sortedSections) {
                const sectionElement = document.createElement('p');
                sectionElement.classList.add("section-title");
                sectionElement.textContent = section.title;
                answersContainer.appendChild(sectionElement);

                for (let option = 1; option <= 5; option++) {
                    const count = section.counts[option] || 0;
                    const percentage = totalResponses > 0 ? (count / totalResponses * 100).toFixed(2) : 0;

                    const optionElement = document.createElement('p');
                    optionElement.textContent = `${option} - ${count} (${percentage}%)`;
                    answersContainer.appendChild(optionElement);
                }

                answersContainer.appendChild(document.createElement('br'));
            }
        }

        if (feedbackResponses.length > 0) {
            feedbackResponses.forEach((feedback) => {
                console.log('Displaying feedback entry:', feedback);
                const feedbackElement = document.createElement('p');
                feedbackElement.classList.add("feedback-text");
                feedbackElement.textContent = `${feedback}`;
                answersContainer.appendChild(feedbackElement);
            });
        }

    } catch (error) {
        console.error("Error fetching filtered answers:", error);
    }
}

document.getElementById('map-filter').addEventListener('change', async (event) => {
    const selectedMap = event.target.value;
    const formId = new URLSearchParams(window.location.search).get('formId');
    
    if (formId) {
        if (selectedMap === "All Maps") {
            await getFormDataAndAnswers(formId);
        } else {
            await displayFilteredAnswers(formId, selectedMap);
        }
    }
});

document.getElementById('graph-btn').addEventListener('click', () => {
    const formId = new URLSearchParams(window.location.search).get('formId');
    if (formId) {
        window.location.href = `/dept/graphical-analysis?formId=${formId}`;
    }
});

window.addEventListener('DOMContentLoaded', async () => {
    const formId = new URLSearchParams(window.location.search).get('formId');
    if (formId) {
        await getFormDataAndAnswers(formId);
    }
});