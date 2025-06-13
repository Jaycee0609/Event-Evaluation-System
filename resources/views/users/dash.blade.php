<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="../css/dash.css">
    <link rel="icon" href="../imgs/logo.png">
    <script type="text/javascript" src="https://unpkg.com/html5-qrcode" defer></script>
    <script type="module" src="../js/dash.js" defer></script>
</head>
<body>
    <nav id="nav-bar">
        <img src="../imgs/logo.png" alt="" id="nav-logo">
        <p id="page-title">Event Experience Evaluation</p>
        <a href="/users/profile"><img src="../imgs/acc-icon.png" alt="" id="profile-icon"></a>
    </nav>

    <main>
        <!-- <div id="dept-container">
            <h2>Departments</h2>
            <select name="dept" id="dept">
                <option value="all">All Departments</option>
                <option value="CICS">CICS</option>
                <option value="CIT">CIT</option>
                <option value="CAS">CAS</option>
                <option value="CABEIHM">CABEIHM</option>
                <option value="CTE">CTE</option>
            </select>
        </div> -->

        <div id="events-container">
            <h2>Events</h2>
            <p id="subtitle">Availability Time</p>
            <div id="qr-video" style="width: 100%;"></div>
        </div>
    </main>
</body>
</html>