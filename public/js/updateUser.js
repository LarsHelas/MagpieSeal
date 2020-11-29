    const newUsername = document.getElementById("newUsername");
    const newPassword = document.getElementById("newPassword");
    const respTxt = document.getElementById("respTxt");
    const user = document.getElementById("user");

    let logindataJson = localStorage.getItem("logindata");
    if (logindataJson === null) {
        logindataJson = '{"token":"null"}';
    }
    let logindata = JSON.parse(logindataJson);
    let logindataString = JSON.stringify(logindata.token);

    //Viser hvem som er logget inn
    let greetings = ["Hello ", "Howdy ", "Hey ", "Greetings ", "Welcome ", "Hiya ", "Ahoy ", "Bonjour ", "Hola ", "Aloha ", "Hai ", "Hei ", "Sup ", "How you doing ", "Ay yo ", "Wassap ", "I see you ", "I'm watching you "];
    let randomGreet = Math.floor(Math.random() * greetings.length);
    user.innerHTML = greetings[randomGreet] + logindata.username;

    function logout() {
        localStorage.clear();
        window.location.reload();
    }

    function privateList() {
        location.href = "./tasks.html";
    }

    function publicList() {
        location.href = "./public.html";
    }

    function updateUser() {
        location.href = "./updateUser.html";
    } 

    loadData();
    async function loadData() {

        let config = {
            method: "GET",
            headers: {
                "authorization": logindataString
            }
        }
        try {
            let response = await fetch("/tasks", config);
            let data = await response.json();
            if (response.status === 403) {
                location.href = "./userLogin.html";
            }
        }
        catch (err) {
            console.log("Something went wrong.");
        }
    }

    document.getElementById("username").onclick = async function (evt) {

        if (newUsername.value.length < 3) {
            alert("Username must be at least 3 digits long");
            return;
        }
        let body = {
            username: newUsername.value
        }
        let config = {
            method: "PUT",
            headers: {
                "content-type": "application/json",
                "authorization": logindataString
            },
            body: JSON.stringify(body)
        }

        try {
            let response = await fetch("/user/updateUsername", config);
            let data = await response.json();
            if (response.status === 200) {
                respTxt.innerText = data.msg; 
                logindata['username'] = newUsername.value;
                localStorage.setItem('logindata', JSON.stringify(logindata));
                user.innerText = newUsername.value; 
            } else if (response.status === 400) {
                respTxt.innerText = data.msg; 
            }
        }
        catch (err) {
            console.log("Something went wrong.")
        }
    }

    document.getElementById("password").onclick = async function (evt) {

        if (newPassword.value.length < 6) {
            alert("Password must be at least 6 digits long");
            return;
        }
        let body = {
            password: newPassword.value
        }
        let config = {
            method: "PUT",
            headers: {
                "content-type": "application/json",
                "authorization": logindataString
            },
            body: JSON.stringify(body)
        }

        try {
            let response = await fetch("/user/updatePassword", config);
            let data = await response.json();
            if (response.status === 200) {
                respTxt.innerText = "Password updated"
            }
        }
        catch (err) {
            console.log("Something went wrong.")
        }
    }

    document.getElementById("delete").onclick = async function (evt) {

        let config = {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "authorization": logindataString
            }
        }

        try {
            let response = await fetch("/user/deleteUser", config);
            let data = await response.json();
            if (response.status === 200) {
                location.href = "./index.html";
            }
        }
        catch (err) {
            console.log("Something went wrong.")
        }
    }
