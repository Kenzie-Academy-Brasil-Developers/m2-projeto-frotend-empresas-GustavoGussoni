import { renderCompany } from "./requests.js"
import { findCompaniesBySector } from "./requests.js"
import { findSectors } from "./requests.js"


const bttDropDown = document.querySelector(".btt-dropdown")
const bttRemoveDrop = document.querySelector(".btt-close-dropdown")
const divDropDown = document.querySelector(".head-btt-down")
const bttLogin = document.querySelectorAll("[data-login]")
const bttCad = document.querySelectorAll("[data-cad]")

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

function goToLogin() {
    bttLogin.forEach((elem) => {
        elem.addEventListener("click", () => {
            window.location.assign("/src/pages/login/index.html")
        })

    })
    
}
goToLogin()

function goToRegister() {
    bttCad.forEach((elem) => {
        elem.addEventListener("click", () => {
            window.location.assign("/src/pages/register/index.html")
        })

    })    
}
goToRegister()


const listComp = document.querySelector(".list-company")

async function renderCompaniesAtWindown(listToRender) {

    const companies = await listToRender
    listComp.innerHTML = ""
    
    const createCards = companies.forEach((elem) => {

        const cardLi = document.createElement("li")
        cardLi.classList.add("card-company")

        const titleComp = document.createElement("h2")
        const hours = document.createElement("p")
        const sector = document.createElement("span")

        titleComp.innerText = `${elem.name}`
        hours.innerText = `${elem.opening_hours} horas`
        sector.innerText = `${elem.sectors.description}`

        cardLi.append(titleComp, hours, sector)

        listComp.append(cardLi)
    })
    return createCards
}
await renderCompaniesAtWindown(renderCompany())

// findSectors()
async function renderSectors() {
    const selectButton = document.getElementById("select-home")
    const sectorsFound = await findSectors()
    console.log(sectorsFound)
    sectorsFound.forEach((elem) => {
        const options = document.createElement("option")
        options.innerText = `${elem.description}`
        options.value = `${elem.description}`
        selectButton.appendChild(options)
    })  
}
renderSectors()


async function renderByClick() {
    const selectSector = document.getElementById("select-home")

    selectSector.addEventListener("change", (event) => {
       const value = `${event.target.value}`
       renderCompaniesAtWindown(findCompaniesBySector(value))
    })    
    }  

renderByClick()