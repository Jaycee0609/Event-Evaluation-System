import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, collection, getDoc, getDocs, doc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
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

async function fetchAndDisplaySpecificFields(user) {
  try {
      const adminDocRef = doc(db, 'dept-admins', user.uid);
      const adminDoc = await getDoc(adminDocRef);

      if (!adminDoc.exists()) {
          console.error("Admin document not found.");
          return;
      }

      const adminDept = adminDoc.data().dept;

      const usersQuery = query(collection(db, "users"), where("dept", "==", adminDept));
      const querySnapshot = await getDocs(usersQuery);

      const dataContainer = document.getElementById("data-container");
      const searchInput = document.getElementById("searchInput");
      const deptFilter = document.getElementById("deptFilter");

      dataContainer.innerHTML = '';

      const rows = [];
      const departments = new Set();

      querySnapshot.forEach(async (docSnapshot) => {
          const data = docSnapshot.data();
          const field1 = data.studentid;
          const field2 = `${data.fname} ${data.lname}`;
          const status = data.status;
          const dept = data.dept;

          departments.add(dept);

          const row = document.createElement("tr");
          row.dataset.studentid = field1.toLowerCase();
          row.dataset.fullName = field2.toLowerCase();
          row.dataset.dept = dept.toLowerCase();

          const field1Cell = document.createElement("td");
          field1Cell.textContent = field1;
          row.appendChild(field1Cell);

          const field2Cell = document.createElement("td");
          field2Cell.textContent = field2;
          field2Cell.style.textAlign = "center";
          row.appendChild(field2Cell);

          const statusCell = document.createElement("td");
          statusCell.textContent = status;
          statusCell.style.fontWeight = "900";
          statusCell.style.textAlign = "center";
          statusCell.style.color = status === "Active" ? "green" : "red";
          row.appendChild(statusCell);

          const field4Cell = document.createElement("td");
          const toggleButton = document.createElement("button");
          toggleButton.classList.add("toggle-button");

          toggleButton.textContent = status === "Active" ? "Deactivate" : "Activate";

          toggleButton.addEventListener("click", async () => {
              try {
                  const docRef = doc(db, "users", docSnapshot.id);
                  const currentDocSnapshot = await getDoc(docRef);
                  const currentStatus = currentDocSnapshot.data().status;

                  const newStatus = currentStatus === "Active" ? "Deactivated" : "Active";
                  await updateDoc(docRef, { status: newStatus });

                  statusCell.textContent = newStatus;
                  statusCell.style.color = newStatus === "Active" ? "green" : "red";
                  toggleButton.textContent = newStatus === "Active" ? "Deactivate" : "Activate";
              } catch (error) {
                  console.error("Error updating document:", error);
              }
          });

          field4Cell.appendChild(toggleButton);
          row.appendChild(field4Cell);

          rows.push(row);
      });

      rows.forEach(row => dataContainer.appendChild(row));

      // deptFilter.innerHTML = '<option value="">All Departments</option>';
      departments.forEach(dept => {
          const option = document.createElement("option");
          option.value = dept.toLowerCase();
          option.textContent = dept;
          deptFilter.appendChild(option);
      });

      searchInput.addEventListener("input", () => {
          const searchTerm = searchInput.value.toLowerCase();
          rows.forEach(row => {
              const studentid = row.dataset.studentid;
              const fullName = row.dataset.fullName;
              const dept = row.dataset.dept;
              const isVisible = (studentid.includes(searchTerm) || fullName.includes(searchTerm)) &&
                                (deptFilter.value === "" || dept === deptFilter.value);

              row.style.display = isVisible ? "" : "none";
          });
      });

      deptFilter.addEventListener("change", () => {
          const selectedDept = deptFilter.value.toLowerCase();
          rows.forEach(row => {
              const dept = row.dataset.dept;
              row.style.display = (dept === selectedDept || selectedDept === "") ? "" : "none";
          });
      });

  } catch (error) {
      console.error("Error fetching documents:", error);
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
      fetchAndDisplaySpecificFields(user);
  } else {
      console.error("No user is logged in.");
  }
});