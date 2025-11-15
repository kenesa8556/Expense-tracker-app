const refli1 = document.querySelector(".container #form form p .lo");
const refli2 = document.querySelector(".container #form form p .re");
const loginpage = document.querySelector(".container .loginform")
const registerpage = document.querySelector(".container .registeration")


refli1.addEventListener('click',() => {
loginpage.classList.add("active");
registerpage.classList.remove("active")

})

refli2.addEventListener('click',() => {
registerpage.classList.add("active");
loginpage.classList.remove("active")

})

document.getElementById("register").addEventListener('submit',(e) =>{
    e.preventDefault()

    const form = e.target;
    const username = form.user.value.trim();
    const password = form.password.value;
    const budget = parseFloat(form.budget.value);

    let users =  JSON.parse(localStorage.getItem('users')) || [];

    if( users.some(u => u.username === username)){
        alert("username is already exists.")
        return;
    }
    users.push({username,password,budget});

    localStorage.setItem("users",JSON.stringify(users));
    alert("u are succesfully registered");
    form.reset()
    loginpage.classList.add("active");
registerpage.classList.remove("active");

});


document.getElementById("login").addEventListener('submit',(e) =>{
    e.preventDefault()

    const form = e.target;
    const username = form.user.value.trim();
    const password = form.password.value;


    let users =  JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.username === username && u.password === password);
    
    if(!user){
        alert("invalid user");
        form.reset();

        return;
    }
    localStorage.setItem("loggedinuser", username);
    alert("login successful!");

    window.location.href = "dashboard.html";

});