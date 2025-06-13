<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Accounts</title>
    <link rel="stylesheet" href="../css/sao_manage-acc.css">
    <link rel="icon" href="../imgs/logo.png">
    <script type="module" src="../js/sao_manage-acc.js" defer></script>
</head>
<body>
    <nav id="nav-bar">
        <img src="../imgs/logo.png" alt="" id="nav-logo">
        <p id="page-title">Event Experience Evaluation</p>
        <a href="/sao/manage-acc" class="nav-text">Manage Accounts</a>
        <a href="/sao/profile"><img src="../imgs/acc-icon.png" alt="" id="profile-icon"></a>
    </nav>

    <main>
        <div id="acc-box">
            <div id="filter-container">
                <a href="/sao/dash"><img src="../imgs/home.png" alt="" id="home-btn"></a>
                <select name="deptFilter" id="deptFilter"></select>
                <div id="search-container">
                    <input type="text" name="searchInput" id="searchInput" placeholder="Search by SR Code or Name">
                </div>
            </div>
            <table id="data-table">
                <thead>
                    <tr>
                        <th>SR-Code</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Toggle</th>
                    </tr>
                </thead>
                <tbody id="data-container"></tbody>
            </table>
        </div>
    </main>
</body>
</html>