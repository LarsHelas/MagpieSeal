    const usernameInp = document.getElementById("username");
    const passwordInp = document.getElementById("password");
    const respTxt = document.getElementById("respTxt");

    document.getElementById("createUser").onclick = async function(evt) {

        if(usernameInp.value.length < 3 || passwordInp.value.length < 6){
            alert("Username must be at least 3 characters long and password at least 6.");
            return;
        }

        let body = {
            username: usernameInp.value,
            password: passwordInp.value
        }
        let config = {
            method: "POST",
            headers:{
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        }
        
        try {
            let response = await fetch("/user", config);
            let data = await response.json();
            if(response.status === 200){
                location.href = "./userLogin.html";
            }else if(response.status === 400){
                respTxt.innerHTML = "Username already exists";
            }
            console.log(response.status);   
            }
        catch(err) {
            respTxt.innerHTML = "Something went wrong. Please try again."
        }
    }

