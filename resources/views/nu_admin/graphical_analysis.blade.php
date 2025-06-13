<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Graphical Analysis</title>
    <link rel="stylesheet" href="../css/admin_graphical-analysis.css">
    <link rel="icon" href="../imgs/logo.png">
    <script type="module" src="../js/admin_graphical-analysis.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@1.0.0/dist/chartjs-plugin-datalabels.min.js"></script>
</head>
<body>
    <nav id="nav-bar">
        <img src="../imgs/logo.png" alt="" id="nav-logo">
        <p id="page-title">Event Experience Evaluation</p>
        <a href="/admin/manage-acc" class="nav-text">Manage Accounts</a>
        <a href="/admin/profile"><img src="../imgs/acc-icon.png" alt="" id="profile-icon"></a>
    </nav>

    <main>
        <img src="../imgs/back.png" alt="" id="back-to-analysis">
        <h1>Graphical Analysis</h1>
        <div style="margin: 1rem 0;"></div>
        <button id="prev-btn">Prev</button>
        <button id="next-btn">Next</button>
        <div style="margin: 3rem 0;"></div>
        <div id="graphs-container"></div>
    </main>
</body>
</html>