<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BSU Event Evaluation</title>
    <link rel="stylesheet" href="../css/register.css">
    <link rel="icon" href="../imgs/logo.png">
    <script type="module" src="../js/register.js" defer></script>
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
            @csrf
            <h1>Register</h1>
            <div id="form-box">
                <div>
                    <label for="lname">Last Name</label><span class="req-sym">*</span>
                    <input name="lname" id="lname" required>
                </div>
                <div>
                    <label for="fname">First Name</label><span class="req-sym">*</span>
                    <input name="fname" id="fname" required><br>
                </div>
                <div>
                    <label for="mname">Middle Name</label>
                    <input name="mname" id="mname"><br>
                </div>
                <div>
                    <label for="studentid">Student ID</label><span class="req-sym">*</span>
                    <input type="text" name="studentid" id="studentid" required><br>
                </div>
                <div>
                    <label for="email">Email</label><span class="req-sym">*</span>
                    <input name="email" id="email" required><br>
                    <p id="email-error"></p>
                </div>
                <div>
                    <label for="dept">Department</label><span class="req-sym">*</span>
                    <select name="dept" id="dept" required>
                        <option value="SCS">SCS</option>
                        <option value="SEA">SEA</option>
                        <option value="SABM">SABM</option>
                        <option value="SAS">SAS</option>
                    </select>
                </div>
                <div>
                    <label for="sect">Section</label><span class="req-sym">*</span>
                    <select name="sect" id="sect" required></select>
                </div>
                <div>
                    <label for="gender">Gender</label><span class="req-sym">*</span>
                    <select name="gender" id="gender" required>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div>
                    <label for="password">Password</label><span class="req-sym">*</span>
                    <input type="password" name="password" id="password" required><br>
                </div>
                <div>
                    <label for="cpassword">Confirm Password</label><span class="req-sym">*</span>
                    <input type="password" name="cpassword" id="cpassword" required><br>
                    <p id="error-message"></p>
                </div>
                <button id="sign-up-btn" type="submit">Sign Up</button>
            </div>
        </form>
    </main>
</body>
</html>