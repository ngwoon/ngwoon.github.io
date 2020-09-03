const greeting = document.querySelector('.js-name');
const USER_LS = "currentUser";

function saveName(text) {
    localStorage.setItem(USER_LS, text);
}

function handleSubmit(event) {
    event.preventDefault();
    const input = document.querySelector("input");
    const currentValue = input.value;
    if(currentValue === "")
        return;
    
    saveName(currentValue);
    paintGreeting(currentValue);
}

function askForName() {
    const input = document.createElement("input");
    input.placeholder = "Type your name here";
    input.type = "text";
    input.className = "name_input";
    
    const form = document.createElement("form");
    form.addEventListener("submit", handleSubmit);
    form.appendChild(input);

    greeting.appendChild(form);
}

function paintGreeting(text) {
    greeting.innerHTML = "";

    const title = document.createElement("span");
    title.className = "name_text";
    title.innerHTML = `Hello ${text}`;
    greeting.appendChild(title);
}

function loadName() {
    const currentUser = localStorage.getItem(USER_LS);
    if(currentUser === null) {
        askForName();
    } else {
        paintGreeting(currentUser);
    }
}

function init() {
    loadName();
}

init();