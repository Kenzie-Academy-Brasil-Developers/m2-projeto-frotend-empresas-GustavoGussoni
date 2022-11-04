import { getLocalStorage } from "./localStorage.js"
import { deleteDepartment, editDepartment, verifyUser } from "./requests.js"
import { renderDepartments } from "./requests.js"
import { renderCompany } from "./requests.js"
import { createDepartment } from "./requests.js"
import { toast } from "./toast.js"


const bttCreateDep = document.querySelector(".create-dep")
const bttCloseModalCreateDep = document.querySelector(".btt-close-modal-create-dep")
const modalCreateDep = document.querySelector(".modal-wrapper-create-dep")
const modalEdit = document.querySelector(".modal-wrapper-edit-dep")
const bttCloseModalEditDep = document.querySelector(".btt-close-modal-edit-dep")
const modalDelete = document.querySelector(".modal-wrapper-delete-dep")
const bttCloseModalDeleteDep = document.querySelector(".btt-close-modal-delete-dep")
const bttModalDelete = document.querySelector(".btt-delete-dep")

bttCreateDep.addEventListener("click", () => {
    modalCreateDep.classList.add("show-modal")
})
bttCloseModalCreateDep.addEventListener("click", () => {
    modalCreateDep.classList.remove("show-modal")
})
bttCloseModalEditDep.addEventListener("click", () => {
    modalEdit.classList.remove("show-modal-edit")
})
bttCloseModalDeleteDep.addEventListener("click", () => {
    modalDelete.classList.remove("show-modal-delete")
})


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
        bttEdit.addEventListener("click", () => {            
            const id = bttEdit.id       
            const form = document.querySelector(".form-edit-dep")
            form.elements[0].value = `${elem.description}`
            form.id = id
            modalEdit.classList.add("show-modal-edit")  
            eventEditDep()          
        })
        const bttDelete = document.createElement("button")
        bttDelete.classList.add("btt-delete-card")
        bttDelete.id = `${elem.uuid}`
        bttDelete.addEventListener("click", () => {
            const id = bttDelete.id
            modalDelete.classList.add("show-modal-delete")            
            bttModalDelete.id = id
            
        })

        divBtts.append(bttLook, bttEdit, bttDelete)

        cardLi.append(divHead, divBtts)

        listDep.insertAdjacentElement("afterbegin", cardLi)
    })
    return createCards
}

await renderDepartmentsAtWindown(renderDepartments())

async function renderCompanySelect() {
    const selectButton = document.getElementById("select-company")
    const selectBttCreateDep = document.getElementById("select-create-dep")
    const companyFound = await renderCompany()
    companyFound.forEach((elem) => {
        const option = document.createElement("option")
        option.innerText = `${elem.name}`
        option.value = `${elem.name}`
        selectButton.appendChild(option)
        const optionCreate = document.createElement("option")
        optionCreate.innerText = `${elem.name}`
        const uiddId = elem.uuid.toString()
        optionCreate.value = `${uiddId}`        
        selectBttCreateDep.appendChild(optionCreate)
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

const eventCreateDep = () => {
    const form = document.querySelector(".form-create-dep")
    const elements = [...form.elements]
    const token = `Bearer ${getLocalStorage().token}`

    form.addEventListener("submit", async (event) => {
        event.preventDefault()
        const body = {}
        elements.forEach((elem) => {
        if (elem.tagName == "INPUT" && elem.value != "" || elem.tagName == "SELECT") {
            body[elem.name] = elem.value
        }
    })
    await createDepartment(body, token)
    setTimeout(() => {
        modalCreateDep.classList.remove("show-modal")
        renderDepartmentsAtWindown(renderDepartments())
    }, 4000)

    })
}
eventCreateDep()

const eventEditDep = () => {
    const form = document.querySelector(".form-edit-dep")
    const elements = [...form.elements]      

    const token = `Bearer ${getLocalStorage().token}`
       
    form.addEventListener("submit", async (event) => {
        event.preventDefault()
        const body = {}
        elements.forEach((elem) => {
            if (elem.tagName == "INPUT" && elem.value != ""){
                body[elem.name] = elem.value
            }
        })
        await editDepartment(body, token, form.id)
        toast("Departamento editado com sucesso!", "")
        setTimeout(() => {
            modalEdit.classList.remove("show-modal-edit")
            renderDepartmentsAtWindown(renderDepartments())
        }, 4000)
    })
}
eventEditDep()

const eventDeleteDep = () => {    
    const token = `Bearer ${getLocalStorage().token}`
    bttModalDelete.addEventListener("click", async () => {
        await deleteDepartment(token, bttModalDelete.id)
        toast("Departamento deletado com sucesso!", "")
        setTimeout(() => {
            modalDelete.classList.remove("show-modal-delete")
            renderDepartmentsAtWindown(renderDepartments())
        }, 4000)
    })
}
eventDeleteDep()


