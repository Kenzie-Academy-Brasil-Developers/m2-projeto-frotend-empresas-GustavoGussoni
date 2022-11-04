export const toast = (title, message) => {
    const body = document.querySelector("body")

    const containerToast = document.createElement("div")
    containerToast.classList.add("div-toast")
    containerToast.style = "background: rgba(255, 255, 255, 0.75);"

    const toastHead = document.createElement("div")
    toastHead.classList.add("div-toast-head")

    const imgToast = document.createElement("img")
    imgToast.src = "/src/img/Group 17.png"
        
    const toastTitle = document.createElement("h2")
    toastTitle.classList.add("toast-title")
    toastTitle.innerText = title

    const toastText = document.createElement("p")
    toastText.classList.add("toast-text")
    toastText.innerHTML = message    

    if(title == "Sua conta não foi criada!" || title == "Email incorreto!" || title == "Senha incorreta!" || title == "Departamento não foi criado!"){
        imgToast.src = "/src/img/Vector (1).png"
        toastTitle.style = "color: red"      
        toastText.style = "color: red"  
    }

    toastHead.append(imgToast, toastTitle)
   
    containerToast.append(toastHead, toastText)

    body.appendChild(containerToast)

}    