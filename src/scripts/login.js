import { login } from "./requests.js"


const bttDropDown = document.querySelector(".btt-dropdown")
const bttRemoveDrop = document.querySelector(".btt-close-dropdown")
const divDropDown = document.querySelector(".head-btt-down")
const bttCad = document.querySelectorAll("[data-cad]")
const bttHome = document.querySelectorAll("[data-home]")


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

function goToCad() {
    bttCad.forEach((elem) => {
        elem.addEventListener("click", () => {
            window.location.assign("/src/pages/register/index.html")
        })

    })
    
}
goToCad()

function goToHome() {
    bttHome.forEach((elem) => {
        elem.addEventListener("click", () => {
            window.location.assign("/index.html")
        })

    })    
}
goToHome()

const eventLogin = () => {
    const form = document.querySelector(".form-login")

    const elements = [...form.elements]

    form.addEventListener("submit", async (event) => {
        event.preventDefault()
        const body = {}

        elements.forEach((elem) => {
            if(elem.tagName == "INPUT" && elem.value !== ""){
                body[elem.name] = elem.value
            }
        })
        await login(body)
    })
}
eventLogin()




