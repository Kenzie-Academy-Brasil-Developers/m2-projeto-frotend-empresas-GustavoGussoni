import { getLocalStorage } from "./localStorage.js"
import { verifyUser } from "./requests.js"
import { renderDepartments } from "./requests.js"
import { renderCompany } from "./requests.js"

const verifyPermission = () => {
    const token = `Bearer ${getLocalStorage().token}`
    if (verifyUser(token)) {
        return
    } if (getLocalStorage() == "") {
        window.location.assign("/index.html")
        return
    }
    else {
        window.location.assign("/src/pages/user/index.html")
        return
    }

}
verifyPermission()


// renderDepartments()

const listDep = document.querySelector(".depart-list")

async function renderDepartmentsAtWindown(listToRender) {

    const departments = await listToRender

    listDep.innerHTML = ""

    const createCards = departments.forEach((elem) => {
        const cardLi = document.createElement("li")
        cardLi.classList.add("depart-cards")
        cardLi.id = elem.uuid

        const divHead = document.createElement("di")
        divHead.classList.add("card-head")

        const titleCard = document.createElement("h3")
        titleCard.innerText = `${elem.name}`
        const descripCard = document.createElement("p")
        descripCard.innerText = `${elem.description}`
        const nameCard = document.createElement("p")
        nameCard.innerText = `${elem.companies.name}`

        divHead.append(titleCard, descripCard, nameCard)

        const divBtts = document.createElement("div")
        divBtts.classList.add("card-btns")

        const bttLook = document.createElement("button")
        bttLook.classList.add("btt-look-card")
        bttLook.id = `${elem.uuid}`
        const bttEdit = document.createElement("button")
        bttEdit.classList.add("btt-edit-card")
        bttEdit.id = `${elem.uuid}`
        const bttDelete = document.createElement("button")
        bttDelete.classList.add("btt-delete-card")
        bttDelete.id = `${elem.uuid}`

        divBtts.append(bttLook, bttEdit, bttDelete)

        cardLi.append(divHead, divBtts)

        listDep.append(cardLi)
    })
    return createCards
}

await renderDepartmentsAtWindown(renderDepartments())


async function renderCompanySelect() {
    const selectButton = document.getElementById("select-company")
    const companyFound = await renderCompany()
    companyFound.forEach((elem) => {
        const option = document.createElement("option")
        option.innerText = `${elem.name}`
        option.value = `${elem.name}`
        selectButton.appendChild(option)
    })

}
renderCompanySelect()

async function renderDepartsByClick() {
    const selectButton = document.getElementById("select-company")
    selectButton.addEventListener("change", async (event) => {
        const value = `${event.target.value}`
        const filterDep = await renderDepartments()
        const selectDeps = filterDep.filter((elem) => {
            if (value !== "") {
                return elem.companies.name == value
            }else {
                renderDepartmentsAtWindown(renderDepartments())
            }
        })
        renderDepartmentsAtWindown(selectDeps)
    })
}
renderDepartsByClick()

