<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SSC Admin</title>
    <link rel="stylesheet" href="../css/organizer_dash.css">
    <link rel="icon" href="../imgs/logo.png">
    <script type="module" src="../js/organizer_dash.js" defer></script>
</head>
<body>
    <nav id="nav-bar">
        <img src="../imgs/logo.png" alt="" id="nav-logo">
        <p id="page-title">Event Experience Evaluation</p>
    </nav>
    <div id="dashboard">
        <select name="dept" id="department-filter">
            <option value="">All Departments</option>
            <option value="SCS">SCS</option>
            <option value="SEA">SEA</option>
            <option value="SABM">SABM</option>
            <option value="SAS">SAS</option>
        </select>
        <a href="/organizer/manage-acc" class="nav-text">Manage Accounts</a>
        <a href="/organizer/profile"><img src="../imgs/acc-icon.png" alt="" id="profile-icon"></a>
    </div>
    <main>
        <div id="events-box">
            <b id="events-title">Events</b>
            <div style="margin: 1rem 0;"></div>
            <div id="form-items-container"></div>
        </div>
    </main>
</body>
</html>