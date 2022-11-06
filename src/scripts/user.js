import { coWorkers, renderCompany, userInfo } from "./requests.js";
import { getLocalStorage } from "./localStorage.js";
import { verifyUser } from "./requests.js";
import { changeUserInfo } from "./requests.js";

const userName = document.querySelector(".name")
const userMail = document.querySelector(".email")
const userLevel = document.querySelector(".level")
const userStyle = document.querySelector(".style")

const bttEditUser = document.querySelector(".btt-pen")
const modalEditUserInfo = document.querySelector(".modal-wrapper-edit-user")
const bttCloseModalEditUser = document.querySelector(".btt-close-modal-edit-user")

bttEditUser.addEventListener("click", () => {
    modalEditUserInfo.classList.add("show-modal")
})
bttCloseModalEditUser.addEventListener("click", () => {
    modalEditUserInfo.classList.remove("show-modal")
})


function logOut(){
    const bttLogOut = document.querySelector(".btt-logout")
    bttLogOut.addEventListener("click", () => {
        localStorage.removeItem("user")
        window.location.assign("/index.html")

    })
}
logOut()

const verifyPermission = async () => {
    const token = `Bearer ${getLocalStorage().token}`
    const localStor = `${getLocalStorage()}`
    
     if (localStor == "") {
    window.location.assign("/index.html")
    return
}
if (await verifyUser(token) === false) {
    return
}
else {
    window.location.assign("/src/pages/admin/index.html")
    return
}


}
verifyPermission()
const outOfWork = document.querySelector(".not-admit")
const inWork = document.querySelector(".admited")

async function renderUserInfo() {
    const info = await userInfo()
    
    if(info.department_uuid == null){
        outOfWork.style = "display: flex"
        inWork.style = "display: none"
    }else{
        outOfWork.style = "display: none"
        inWork.style = "display: flex"
    }
    
        userName.innerText = info.username
        userMail.innerText = `email: ${info.email}`
        if (info.professional_level == null){
            userLevel.innerText = ""            
        }else{userLevel.innerText = info.professional_level}
        if(info.kind_of_work == null){
            userStyle.innerText = ""
        }else{userStyle.innerText = info.kind_of_work} 

}

await renderUserInfo()

async function changeInfo(){
    const form = document.querySelector(".form-edit-user")
    const elements = [...form.elements]
    
    form.addEventListener("submit", async (event) => {
        event.preventDefault()
        const body = {}
        elements.forEach((elem) => {
            if(elem.tagName == "INPUT" && elem.value != ""){
                body[elem.name] = elem.value
            }
        })
        await changeUserInfo(body)
        setTimeout( async() => {
            modalEditUserInfo.classList.remove("show-modal")
            await renderUserInfo()
        })
    })

}
await changeInfo()

async function listCoWorkers(){
    const listUl = document.querySelector(".list-coo")
    listUl.innerHTML = ""
    const listOfCoWorkers = await coWorkers()
    const companyFind = await renderCompany()
    

    listOfCoWorkers.forEach((elem) => {
        companyFind.filter((el) => {
            if (elem.company_uuid == el.uuid){
                
                const compName = document.querySelector(".comp-name")
                const depName = document.querySelector(".dep-name")
                compName.innerText = `${el.name}`
                depName.innerText = `${el.sectors.description}`
            }
        })


        elem.users.forEach((user) => {
            
            const liList = document.createElement("li")
            liList.classList.add("coo-card")
            const nameOfCo = document.createElement("h3")
            nameOfCo.classList.add("name-coo")
            nameOfCo.innerText = `${user.username}`
            const levelCo = document.createElement("p")
            levelCo.classList.add("level-coo")
            levelCo.innerText = `${user.professional_level}`

            liList.append(nameOfCo, levelCo)
            listUl.append(liList)
        })
    })



}

await listCoWorkers()
