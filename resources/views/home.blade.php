<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NU Event Evaluation</title>
    <link rel="stylesheet" href="../css/home.css">
    <link rel="icon" href="../imgs/logo.png">
    <script type="module" src="../js/login.js" defer></script>
</head>
<body>
    <nav id="nav-bar">
        <img src="../imgs/logo.png" alt="" id="nav-logo">
        <p id="page-title">Event Experience Evaluation</p>
        <a href="/register" class="nav-text">Register</a>
        <a href="/" class="nav-text">Login</a>
    </nav>

    <main>
        <form id="content">
            <h1>Login</h1>
            <div id="form-box">
                <div>
                    <label for="identifier">Student ID</label>
                    <input name="identifier" id="identifier" required>
                </div>
                <div>
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" required><br>
                    <i id="pswd-info">* password is case sensitive</i>
                </div>
                <button id="sign-in-btn" type="submit">Sign In</button>
                <p id="error-message"></p>
            </div>
        </form>
    </main>
</body>
</html>