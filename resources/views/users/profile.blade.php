<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Profile</title>
    <link rel="stylesheet" href="../css/profile.css">
    <link rel="icon" href="../imgs/logo.png">
    <script type="module" src="../js/profile.js" defer></script>
</head>
<body>
    <nav id="nav-bar">
        <img src="../imgs/logo.png" alt="" id="nav-logo">
        <p id="page-title">Event Experience Evaluation</p>
        <a href="/users/profile"><img src="../imgs/acc-icon.png" alt="" id="profile-icon"></a>
    </nav>

    <main>
        <div id="profile-box">
            <div id="profile-img-container">
                <img src="../imgs/acc-icon-black.png" alt="" id="bottom-profile-icon">
            </div>
            <div>
                <p id="full-name"></p>
                <p id="studentid"></p>
                <p id="gender"></p>
                <p id="dept"></p>
            </div>
            <div id="home-btn">
                <img onclick="window.location.href='/users/dash'" src="../imgs/home-black.png" alt="">
                <p>Home</p>
            </div>
            <div id="logout-btn">
                <img src="../imgs/logout-icon.png" alt="">
                <p>Logout</p>
            </div>
        </div>

        <div id="bottom-container">
            <div id="contacts-container">
                <b>Contacts</b>
                <div style="margin: 1rem 0;"></div>
                <p>National University Laguna</p>
                <div style="margin: 1rem 0;"></div>
                <p>(+63) 919-082-1494</p>
                <p>(+63) 977-346-6136</p>
                <p>(049) 572-3356</p>
                <div style="margin: 1rem 0;"></div>
                <p>Admissions</p>
                <div style="margin: 1rem 0;"></div>
                <p>admissions@nu-laguna.edu.ph</p>
                <div style="margin: 1rem 0;"></div>
            </div>
            <div id="announcements-container">
                <b>Announcements</b>
                <div style="margin: 1rem 0;"></div>
                <p>None</p>
            </div>
        </div>
    </main>
</body>
</html>