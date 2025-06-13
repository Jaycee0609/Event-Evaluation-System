<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Analysis</title>
    <link rel="stylesheet" href="../css/admin_form-analysis.css">
    <link rel="icon" href="../imgs/logo.png">
    <script type="module" src="../js/admin_form-analysis.js"></script>
</head>
<body>
    <nav id="nav-bar">
        <img src="../imgs/logo.png" alt="" id="nav-logo">
        <p id="page-title">Event Experience Evaluation</p>
        <a href="/admin/manage-acc" class="nav-text">Manage Accounts</a>
        <a href="/admin/profile"><img src="../imgs/acc-icon.png" alt="" id="profile-icon"></a>
    </nav>
    
    <main>
        <div id="data-container">
            <a href="/admin/dash"><img src="../imgs/back.png" alt="" id="back-btn"></a>
            <p id="form-title"></p>
            <p id="form-count"></p>
            <p id="form-pos"></p>
            <p id="form-neg"></p>
            <p id="expected-count"></p><br>
            <button id="graph-btn">View Graphical Analysis</button>
            <select id="map-filter" class="map-filter-dropdown">
                <option value="All Maps">All Analysis</option>
                <option value="Service">Service</option>
                <option value="Activity Design">Activity Design</option>
                <option value="Participation">Participation</option>
                <option value="Facilitator">Facilitator</option>
                <option value="Emcee">Emcee</option>
            </select>
            <div id="answers-container"></div>
        </div>
    </main>
</body>
</html>