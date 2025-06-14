<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit Details</title>
  <link rel="stylesheet" href="../css/dept_edit-event.css">
  <link rel="icon" href="../imgs/logo.png">
  <script type="module" src="../js/dept_edit-event.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js"></script>
</head>
<body>
    <nav id="nav-bar">
        <img src="../imgs/logo.png" alt="" id="nav-logo">
        <p id="page-title">Event Experience Evaluation</p>
        <a href="/dept/manage-acc" class="nav-text">Manage Accounts</a>
        <a href="/dept/profile"><img src="../imgs/acc-icon.png" alt="" id="profile-icon"></a>
    </nav>

    <main>
        <div id="new-form-box">
            <a href="/dept/dash"><img src="../imgs/back.png" alt="" id="back-btn"></a>
            <h1>Edit Event</h1>
            <form id="questionnaire-form">
                <label for="title">New Title:</label>
                <div style="margin: 0.1rem 0;"></div>
                <input type="text" id="title" required>
                <div style="margin: 1rem 0;"></div>
                <label for="description">New Description:</label>
                <div style="margin: 0.1rem 0;"></div>
                <textarea id="description" required></textarea>
                <div style="margin: 1rem 0;"></div>
                <div id="departments-container">
                    <label for="dept">Update Departments:</label>
                    <div style="margin: 0.1rem 0;"></div>
                    <input type="checkbox" id="sas" name="dept" value="SAS">
                    <label for="sas">SAS</label><br>
                    <input type="checkbox" id="scs" name="dept" value="SCS">
                    <label for="scs">SCS</label><br>
                    <input type="checkbox" id="sea" name="dept" value="SEA">
                    <label for="sea">SEA</label><br>
                    <input type="checkbox" id="sabm" name="dept" value="SABM">
                    <label for="sabm">SABM</label><br>
                </div>
                <div style="margin: 1rem 0;"></div>
                <p>Update Sections:</p>
                <div id="sections-container"></div>
                <div style="margin: 1rem 0;"></div>
                <label for="expiration">Start Date:</label>
                <div style="margin: 0.1rem 0;"></div>
                <input type="date" id="start-date" required>
                <div style="margin: 0.5rem 0;"></div>
                <label for="expiration">End Date:</label>
                <div style="margin: 0.1rem 0;"></div>
                <input type="date" id="end-date" required>
                <div style="margin: 1rem 0;"></div>
                <div id="questions-container"></div>
                <button id="generate-qr-btn" type="button">Generate New QR Code</button>
                <div id="qr-code-container"><canvas></canvas></div>
                <button id="download-qr-btn" style="display:none;" type="button">Download New QR Code</button>
                <div style="margin: 1rem 0;"></div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    </main>
</body>
</html>