    const usernameInp = document.getElementById("username");
    const passwordInp = document.getElementById("password");
    const respTxt = document.getElementById("respTxt");


    document.getElementById("loginUser").onclick = async function (evt) {
        
       let body = {
            username: usernameInp.value,
            password: passwordInp.value
        }
        
        let config = {
            method: "POST",
            headers:{
                "content-type": "application/json",
            },
            
            body: JSON.stringify(body)
        }
        
        try {
            let response = await fetch("/user/login", config);
            let data = await response.json();
            if(response.status === 200){
                localStorage.setItem("logindata", JSON.stringify(data));
                location.href = "./tasks.html";
                } else if (response.status === 401){
                respTxt.innerHTML = "Wrong username and password."
                }
            }
        catch(err) {
            respTxt.innerHTML = "Something went wrong. Please try again."
        }

}
