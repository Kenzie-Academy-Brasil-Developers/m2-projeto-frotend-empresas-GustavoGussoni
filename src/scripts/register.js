import { register } from "./requests.js"


const bttDropDown = document.querySelector(".btt-dropdown")
const bttRemoveDrop = document.querySelector(".btt-close-dropdown")
const divDropDown = document.querySelector(".head-btt-down")
const bttLogin = document.querySelectorAll("[data-login]")
const bttHome = document.querySelectorAll("[data-home]")
const bttReturn = document.querySelector(".btt-return")

bttDropDown.addEventListener("click", () => {
    divDropDown.classList.add("show-drop")
    bttDropDown.classList.add("remove-btt")
    bttRemoveDrop.classList.add("show-drop")
})

bttRemoveDrop.addEventListener("click", () => {
    divDropDown.classList.remove("show-drop")
    bttDropDown.classList.remove("remove-btt")
    bttRemoveDrop.classList.remove("show-drop")
})

bttReturn.addEventListener("click", () => {
    window.location.assign("/index.html")
})

function goToLogin() {
    bttLogin.forEach((elem) => {
        elem.addEventListener("click", () => {
            window.location.assign("/src/pages/login/index.html")
        })

    })

}
goToLogin()

function goToHome() {
    bttHome.forEach((elem) => {
        elem.addEventListener("click", () => {
            window.location.assign("/index.html")
        })

    })
}
goToHome()

const eventRegister = () => {
    const form = document.querySelector(".form-register")

    const elements = [...form.elements]

    form.addEventListener("submit", async (event) => {
        event.preventDefault()
        const body = {}

        elements.forEach((elem) => {
            if (elem.tagName == "INPUT" && elem.value !== "" || elem.tagName == "SELECT") {
                body[elem.name] = elem.value
            }
        })
        await register(body)
    })
}
eventRegister()

