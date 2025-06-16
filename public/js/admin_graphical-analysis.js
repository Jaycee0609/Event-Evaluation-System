import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
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

function getFormIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('formId');
}

async function displayGraphs(formId) {
    const formRef = doc(db, 'forms', formId);
    const formSnap = await getDoc(formRef);

    if (!formSnap.exists()) {
        console.error("No such document!");
        return;
    }

    const formData = formSnap.data();
    const responseCounts = formData.responseCounts || {};

    const answersQuery = query(collection(db, 'answers'), where('formId', '==', formId));
    const querySnapshot = await getDocs(answersQuery);

    const answersData = {};

    querySnapshot.forEach((doc) => {
        const groupedAnswers = doc.data().groupedAnswers;

        Object.entries(groupedAnswers).forEach(([groupTitle, groupObj]) => {
            if (typeof groupObj !== 'object' || typeof groupObj.order !== 'number' || !Array.isArray(groupObj.sections)) {
                console.warn('Invalid groupObj or sections:', groupObj);
                return;
            }

            if (!answersData[groupTitle]) {
                answersData[groupTitle] = {};
            }

            groupObj.sections.forEach((sectionObj) => {
                if (typeof sectionObj !== 'object' || typeof sectionObj.title !== 'string') {
                    console.warn('Invalid sectionObj:', sectionObj);
                    return;
                }

                const sectionTitle = sectionObj.title;
                const answerValue = sectionObj.answer;

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

    console.log('Processed answersData:', answersData);

    const graphsContainer = document.getElementById('graphs-container');
    if (!graphsContainer) {
        console.error('No element found with ID "graphs-container".');
        return;
    }

    const sortedGroups = Object.entries(answersData).filter(([groupTitle]) => groupTitle !== 'Feedback').sort(([a], [b]) => {
        const aOrder = querySnapshot.docs.find(doc => doc.data().groupedAnswers[a])?.data().groupedAnswers[a]?.order || 0;
        const bOrder = querySnapshot.docs.find(doc => doc.data().groupedAnswers[b])?.data().groupedAnswers[b]?.order || 0;
        return aOrder - bOrder;
    });

    let currentPage = 0;
    const itemsPerPage = 2;
    const totalPages = Math.ceil((sortedGroups.length + 1) / itemsPerPage);

    function renderPage(page) {
        if (page < 0 || page >= totalPages) return;

        graphsContainer.innerHTML = '';

        if (page === 0) {
            const pieChartContainer = document.createElement('div');
            pieChartContainer.classList.add('pie-chart-container');
            graphsContainer.appendChild(pieChartContainer);

            const pieCanvas = document.createElement('canvas');
            pieCanvas.id = 'section-response-count-pie-chart';
            pieChartContainer.appendChild(pieCanvas);

            const pieCtx = pieCanvas.getContext('2d');

            new Chart(pieCtx, {
                type: 'pie',
                data: {
                    labels: Object.keys(responseCounts),
                    datasets: [{
                        data: Object.values(responseCounts),
                        backgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                            '#FF5733', '#33FF57', '#5733FF', '#F1C40F', '#E74C3C',
                            '#9B59B6', '#16A085', '#F39C12', '#D35400', '#1ABC9C',
                            '#2ECC71', '#3498DB', '#9B59B6', '#34495E', '#95A5A6'
                          ],
                        borderColor: '#ffffff',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    const label = tooltipItem.label || '';
                                    const value = tooltipItem.raw || 0;
                                    const total = Object.values(responseCounts).reduce((a, b) => a + b, 0);
                                    const percentage = total ? (value / total * 100).toFixed(2) : 0;
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });

            if (sortedGroups.length > 0) {
                const [firstGroupTitle, firstGroupSections] = sortedGroups[0];
                const firstGroupElement = document.createElement('div');
                firstGroupElement.classList.add('group-title');
                
                const firstGroupTitleElement = document.createElement('h2');
                firstGroupTitleElement.textContent = firstGroupTitle;
                firstGroupElement.appendChild(firstGroupTitleElement);
            
                graphsContainer.appendChild(firstGroupElement);
            
                const firstGroupSectionsSorted = Object.entries(firstGroupSections).sort(([a], [b]) => {
                    const groupObj = querySnapshot.docs.find(doc => doc.data().groupedAnswers[firstGroupTitle])?.data().groupedAnswers[firstGroupTitle];
                    const aOrder = groupObj?.sections.find(sec => sec.title === a)?.order || 0;
                    const bOrder = groupObj?.sections.find(sec => sec.title === b)?.order || 0;
                    return aOrder - bOrder;
                });
            
                firstGroupSectionsSorted.forEach(([sectionTitle, options]) => {
                    const sectionContainer = document.createElement('div');
                    sectionContainer.classList.add('section-container');
            
                    const sectionTitleElement = document.createElement('h3');
                    sectionTitleElement.textContent = sectionTitle;
                    sectionContainer.appendChild(sectionTitleElement);
            
                    const canvas = document.createElement('canvas');
                    canvas.id = `chart-${firstGroupTitle.replace(/\s+/g, '-')}-${sectionTitle.replace(/\s+/g, '-')}`;
                    sectionContainer.appendChild(canvas);
            
                    firstGroupElement.appendChild(sectionContainer);
            
                    const totalResponses = Object.values(options).reduce((sum, count) => sum + count, 0);
                    const data = Object.values(options).map(count => totalResponses > 0 ? (count / totalResponses * 100).toFixed(2) : 0);
            
                    const ctx = canvas.getContext('2d');
            
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ['1', '2', '3', '4', '5'],
                            datasets: [{
                                label: sectionTitle,
                                data: data,
                                backgroundColor: 'rgba(175, 29, 30, 1)',
                                borderColor: 'rgba(175, 29, 30, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                datalabels: {
                                    color: 'white',
                                    anchor: 'end',
                                    align: 'start',
                                    formatter: (value, context) => {
                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = total ? ((value / total) * 100).toFixed(2) : 0;
                                        return value > 0 ? `${value}%` : '';
                                    },
                                    font: {
                                        weight: 'bold',
                                        size: 15
                                    }
                                },
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        callback: function(value) {
                                            return value;
                                        }
                                    }
                                },
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: function(value) {
                                            return value;
                                        }
                                    }
                                }
                            }
                        },
                        plugins: [ChartDataLabels]
                    });
                });
            }
        } else {
            const start = (page - 1) * itemsPerPage + 1;
            const end = Math.min(start + itemsPerPage, sortedGroups.length);
            const currentGroups = sortedGroups.slice(start, end);

            currentGroups.forEach(([groupTitle, sections]) => {
                const groupElement = document.createElement('div');
                groupElement.classList.add('group-title');

                const groupTitleElement = document.createElement('h2');
                groupTitleElement.textContent = groupTitle;
                groupElement.appendChild(groupTitleElement);

                graphsContainer.appendChild(groupElement);

                const sortedSections = Object.entries(sections).sort(([a], [b]) => {
                    const groupObj = querySnapshot.docs.find(doc => doc.data().groupedAnswers[groupTitle])?.data().groupedAnswers[groupTitle];
                    const aOrder = groupObj?.sections.find(sec => sec.title === a)?.order || 0;
                    const bOrder = groupObj?.sections.find(sec => sec.title === b)?.order || 0;
                    return aOrder - bOrder;
                });

                sortedSections.forEach(([sectionTitle, options]) => {
                    const sectionContainer = document.createElement('div');
                    sectionContainer.classList.add('section-container');

                    const sectionTitleElement = document.createElement('h3');
                    sectionTitleElement.textContent = sectionTitle;
                    sectionContainer.appendChild(sectionTitleElement);

                    const canvas = document.createElement('canvas');
                    canvas.id = `chart-${groupTitle.replace(/\s+/g, '-')}-${sectionTitle.replace(/\s+/g, '-')}`;
                    sectionContainer.appendChild(canvas);

                    groupElement.appendChild(sectionContainer);

                    const totalResponses = Object.values(options).reduce((sum, count) => sum + count, 0);
                    const data = Object.values(options).map(count => totalResponses > 0 ? (count / totalResponses * 100).toFixed(2) : 0);

                    const ctx = canvas.getContext('2d');

                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ['1', '2', '3', '4', '5'],
                            datasets: [{
                                label: sectionTitle,
                                data: data,
                                backgroundColor: 'rgba(175, 29, 30, 1)',
                                borderColor: 'rgba(175, 29, 30, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                datalabels: {
                                    color: 'white',
                                    anchor: 'end',
                                    align: 'start',
                                    formatter: (value, context) => {
                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = total ? ((value / total) * 100).toFixed(2) : 0;
                                        return value > 0 ? `${value}%` : '';
                                    },
                                    font: {
                                        weight: 'bold',
                                        size: 15
                                    }
                                },
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        callback: function(value) {
                                            return value;
                                        }
                                    }
                                },
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: function(value) {
                                            return value;
                                        }
                                    }
                                }
                            }
                        },
                        plugins: [ChartDataLabels]
                    });
                });
            });
        }
    }

    renderPage(currentPage);

    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            renderPage(currentPage);
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const formId = getFormIdFromUrl();
    if (formId) {
        const backButton = document.getElementById('back-to-analysis');
        if (backButton) {
            backButton.addEventListener('click', () => {
                window.location.href = `/admin/form-analysis?formId=${formId}`;
            });
        }
        displayGraphs(formId);
    } else {
        console.error("No formId found in the URL.");
    }
});