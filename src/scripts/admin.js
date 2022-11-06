import { getLocalStorage } from "./localStorage.js"
import { deleteDepartment, dismissUser, editDepartment, verifyUser } from "./requests.js"
import { renderDepartments } from "./requests.js"
import { renderCompany } from "./requests.js"
import { createDepartment } from "./requests.js"
import { toast } from "./toast.js"
import { usersOutOfWork } from "./requests.js"
import { admitEmployee } from "./requests.js"
import { renderUsers } from "./requests.js"
import { deleteUser } from "./requests.js"
import { editUser } from "./requests.js"

const bttCreateDep = document.querySelector(".create-dep")
const bttCloseModalCreateDep = document.querySelector(".btt-close-modal-create-dep")
const modalCreateDep = document.querySelector(".modal-wrapper-create-dep")

const modalEdit = document.querySelector(".modal-wrapper-edit-dep")
const bttCloseModalEditDep = document.querySelector(".btt-close-modal-edit-dep")

const modalDelete = document.querySelector(".modal-wrapper-delete-dep")
const bttCloseModalDeleteDep = document.querySelector(".btt-close-modal-delete-dep")
const bttModalDelete = document.querySelector(".btt-delete-dep")

const modalOpenDep = document.querySelector(".modal-wrapper-open-dep")
const bttCloseModalOpenDep = document.querySelector(".btt-close-modal-open-dep")

const modalDeleteUser = document.querySelector(".modal-wrapper-delete-user")
const bttCloseModalDeleteUser = document.querySelector(".btt-close-modal-delete-user")
const bttDeleteUserModal = document.querySelector(".btt-delete-user")

const modalEditUser = document.querySelector(".modal-wrapper-edit-user")
const bttCloseModalEditUser = document.querySelector(".btt-close-modal-edit-user")
const bttEditUserModal = document.querySelector(".btt-edit-user")

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
bttCloseModalOpenDep.addEventListener("click", () => {
    modalOpenDep.classList.remove("show-modal-open-dep")
})
bttCloseModalDeleteUser.addEventListener("click", () => {
    modalDeleteUser.classList.remove("show-modal-delete-user")
})
bttCloseModalEditUser.addEventListener("click", () => {
    modalEditUser.classList.remove("show-modal-edit-user")
})

const verifyPermission = async () => {
    const token = `Bearer ${getLocalStorage().token}`
    const localStor = `${getLocalStorage()}`
    
     if (localStor == "") {
    window.location.assign("/index.html")
    return
}
if (await verifyUser(token)) {
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
        bttLook.addEventListener("click", async () => {
            const id = bttEdit.id
            modalOpenDep.classList.add("show-modal-open-dep")
            const name = document.querySelector(".name-open-dep")
            name.innerText = `${elem.name}`
            const descrip = document.querySelector(".descrip-open-dep")
            descrip.innerText = `${elem.description}`
            const companyCard = document.querySelector(".company-open-dep")
            companyCard.innerText = `${elem.companies.name}`
            
            const bttAdmitEmp = document.querySelector(".btt-admit")
            bttAdmitEmp.id = id        
            const listUsers = await renderUsers()
            console.log(listUsers)
          const usersList = () => listUsers.filter((elem) => {
                if(elem.department_uuid === bttLook.id){                    
                    return elem                            
            }
        })
        
           await renderUserCards(usersList())
           

       await renderUserOutOf()
        
            // renderModalOpenDep(id)
        })


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

async function renderUsersAtWindown(listToRenderUser, listToRenderDepart){
    const users = await listToRenderUser
    const dep = await listToRenderDepart
    const listUser = document.querySelector(".users-list")
    listUser.innerHTML = ""
    
    users.forEach((elem) => {
        if (elem.is_admin != true){
            const userCard = document.createElement("li")
            userCard.classList.add("depart-cards")

            const divCardHead = document.createElement("div")
            divCardHead.classList.add("card-head")

            const userName = document.createElement("h3")
            userName.classList.add("card-user-name")
            userName.innerText = `${elem.username}`
            const userDescription = document.createElement("p")
            userDescription.classList.add("card-user-desc")
            userDescription.innerText = `${elem.professional_level}`
            if(elem.professional_level == ""){
                userDescription.innerText = "Nível profissional não informado"
            }
            
            const userCompany = document.createElement("p")
            userCompany.classList.add("card-user-comp")
            dep.forEach((el) => {
                if(el.uuid == elem.department_uuid){
                    userCompany.innerText = `${el.companies.name}`
                }if (elem.department_uuid == null){
                    userCompany.innerText = "Usuário não contratado"
                }
            })

            const divCardUserbtt = document.createElement("div")
            divCardUserbtt.classList.add("card-btns")

            const bttCardUserEdit = document.createElement("button")
            bttCardUserEdit.classList.add("btt-edit-card-user")
            bttCardUserEdit.id = elem.uuid
            bttCardUserEdit.addEventListener("click", () => {
                modalEditUser.classList.add("show-modal-edit-user")
                bttEditUserModal.id = elem.uuid

            })

            const bttCardUserDelete = document.createElement("button")
            bttCardUserDelete.classList.add("btt-delete-card-user")
            bttCardUserDelete.id = elem.uuid
            bttCardUserDelete.addEventListener("click", () => {
                modalDeleteUser.classList.add("show-modal-delete-user")
               
                bttDeleteUserModal.id = elem.uuid

            })

            divCardHead.append(userName, userDescription, userCompany)

            divCardUserbtt.append(bttCardUserEdit, bttCardUserDelete)

            userCard.append(divCardHead, divCardUserbtt)

            listUser.insertAdjacentElement("afterbegin", userCard)





        }
        
    })
}
await renderUsersAtWindown(renderUsers(), renderDepartments())


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

const eventAdmitEmployee = async () => {
    const token = `Bearer ${getLocalStorage().token}`
    const bttAdmit = document.querySelector(".form-admit")    
    const options = bttAdmit.elements    
   
    bttAdmit.addEventListener("submit", async (event) => {
        event.preventDefault()
        const idUser = options[0].value
        const sectorId = options[1].id        
        admitEmployee(token, idUser, sectorId)   
        setTimeout(() => {
            modalOpenDep.classList.remove("show-modal-open-dep")            
        }, 4000);
        
        renderUserOutOf()
        
   
    })

     
}
eventAdmitEmployee()


 async function renderUserOutOf(){
            const token = `Bearer ${getLocalStorage().token}`
            const userList = await usersOutOfWork(token)
            const usersOutOfW = document.querySelector(".users-out-of-work")
            usersOutOfW.innerHTML = `<option value="">Selecionar usuário</option>`
            userList.forEach((elem) => {                
                
                const optionUser = document.createElement("option")
                optionUser.id = `${elem.id}`
                optionUser.innerText = `${elem.username}`
                optionUser.value = elem.uuid
                usersOutOfW.append(optionUser)
            })
        }


async function deleteUserFromList() {
    bttDeleteUserModal.addEventListener("click", async (event) => {
        deleteUser(bttDeleteUserModal.id)
        toast("Sucesso!", "Usuário deletado")
        setTimeout(() => {
            modalDeleteUser.classList.remove("show-modal-delete-user")
            renderUsersAtWindown(renderUsers(), renderDepartments())
        }, 4000)

    })
}        
deleteUserFromList()

async function editUserInfo(){
    const formEdit = document.querySelector(".form-edit-user")
    const elements = [...formEdit.elements] 
    
    formEdit.addEventListener("submit", async (event) => {
        event.preventDefault()
        const body = {}
        elements.forEach((elem) => {
            if(elem.tagName == "SELECT" && elem.value != ""){
                body[elem.name] = elem.value                
                setTimeout(() => {
                    modalEditUser.classList.remove("show-modal-edit-user")
                    renderUsersAtWindown(renderUsers(), renderDepartments())
                },4000)
            }            
        })
        await editUser(body, bttEditUserModal.id)   
             
    })
}
editUserInfo()

async function renderUserCards(user){
    const listUser = document.querySelector(".users-modal-list")
    listUser.innerHTML = ""
    const listCompany = await renderDepartments()       

   const createCard = user.forEach((elem) => {   
        const listCard = document.createElement("li")
        listCard.classList.add("card-modal-users")

        const divCard = document.createElement("div")
        divCard.classList.add("div-card-info")

        const listUserName = document.createElement("h3")
        const listUserInfo = document.createElement("p")
        const listUserCompany = document.createElement("p")
        const bttRemoveUser = document.createElement("button")
        bttRemoveUser.classList.add("btt-dismiss")
        bttRemoveUser.id = `${elem.uuid}`
        bttRemoveUser.innerText = "Desligar"
        bttRemoveUser.addEventListener("click", () => {
            dismissUser(bttRemoveUser.id)
            setTimeout(() => {
                modalOpenDep.classList.remove("show-modal-open-dep")    
            },4000);
        })

        listUserName.innerText = `${elem.username}`
        listUserInfo.innerText = `${elem.professional_level}`
        if(elem.professional_level == ""){
            listUserInfo.innerText = `Nível profissional não informado`
        }
        listCompany.forEach((el) => {
           if (el.uuid == elem.department_uuid) {
            listUserCompany.innerText = `${el.companies.name}`
           }
        })
        divCard.append(listUserName, listUserInfo, listUserCompany)
        listCard.append(divCard, bttRemoveUser)
        listUser.append(listCard)     
})
return createCard
}

function logOut(){
    const bttLogOut = document.querySelector(".btt-logout")
    bttLogOut.addEventListener("click", () => {
        localStorage.removeItem("user")
        window.location.assign("/index.html")

    })
}
logOut()