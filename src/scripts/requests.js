import { getLocalStorage } from "./localStorage.js"
import { toast } from "./toast.js"

const baseURL = "http://localhost:6278"

async function renderCompany() {
    try {
        const request = await fetch(`${baseURL}/companies`, {
            method: "GET"
        })
        const response = await request.json()
        return response
    } catch (err) {
        return (err)
    }
}

async function findSectors() {
    try {
        const request = await fetch(`${baseURL}/sectors`, {
            method: "GET"
        })
        const response = await request.json()
        return response
    }catch(err) {
        console.log(err)
    }
}

async function findCompaniesBySector(sector) {
    try {
        const request = await fetch(`${baseURL}/companies/${sector}`, {
            method: "GET"
        })
        const response = await request.json()
        return response
    } catch (err) {
        return (err)
    }

}

async function register(body) {
    try {
        const request = await fetch(`${baseURL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        if (request.ok) {
            toast("Sua conta foi criada com sucesso!", "Agora você pode acessar os conteudos utilizando seu usuário e senha na página de login")
            setTimeout(() => {
                window.location.assign("/src/pages/login/index.html")
            }, 4000)
        }
        const response = await request.json()

        if (response.error) {
            console.log("erro")
            toast("Sua conta não foi criada!", "Insira outro email")
        }

    } catch (err) {
        console.log(err)
    }
}

async function verifyUser(token){
    try {
        const request = await fetch(`${baseURL}/auth/validate_user`, {
            method: "GET",
            headers: {
                "Authorization": token
            }
        })
        const response = await request.json()
        return response.is_admin
    }catch(err) {
        return err
    }
}

async function login(body) {
    try {
        const request = await fetch(`${baseURL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        const response = await request.json()
        if (request.ok) {
            localStorage.setItem("user", JSON.stringify(response))
            toast("Deu certo!", "Redirecionando")
            const token = `Bearer ${response.token}`
                        
            if (await verifyUser(token)) {
                setTimeout(() => {                    
                    window.location.assign("/src/pages/admin/index.html")
                }, 4000)
            } else {
                setTimeout(() => {
                    window.location.assign("/src/pages/user/index.html")
                }, 4000)
            }
        }
        
        if(response.error == "email invalid!") {
            toast("Email incorreto!", "Favor inserir novamente.")
            return
        }
        if(response.error == "password invalid!") {
            toast("Senha incorreta!", "Favor inserir novamente.")
            return
        }
        
        
    } catch (err) {
        console.log(err)
    }
}

async function renderDepartments() {
    const token = `Bearer ${getLocalStorage().token}`
    try {
        const request = await fetch(`${baseURL}/departments`, {
            method: "GET",
            headers: {
                "Authorization": token
            }
        })
        const response = await request.json()
        return response
    }catch(err){
        return err
    }
}

async function renderUsers(){
    const token = `Bearer ${getLocalStorage().token}`
    try{
        const request = await fetch (`${baseURL}/users`, {
            method: "GET",
            headers: {
                "Authorization": token
            }
        })
        const response = await request.json()        
        return response
    }catch(err){
        return err
    }
}

async function createDepartment(body, token){
    try {
        const request = await fetch(`${baseURL}/departments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(body)
        })
        if(request.ok) {
            toast("Departamento criado com sucesso!", "")
        }
        else {
            toast("Departamento não foi criado!", "Selecione uma empresa")
            return
        }
        const response = await request.json()
        return response
    }catch(err) {
        return err
    }
}

async function editDepartment(body, token, id){
    try {
        const request = await fetch(`${baseURL}/departments/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(body)
        })
        const response = await request.json()
        return response
    }catch (err) {
        return err
    }
}

async function deleteDepartment(token, id){
    try {
        const request = await fetch(`${baseURL}/departments/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": token
            }
        })
        
    }catch(err){
        return err
    }
}

async function usersOutOfWork(token){
    try {
        const request = await fetch(`${baseURL}/admin/out_of_work`, {
            method: "GET",
            headers: {
                "Authorization": token
            }
        })
        const response = await request.json()
        return response
    }catch(err){
        return err
    }

}

async function admitEmployee(token, user, dep){
    try {
        const request = await fetch(`${baseURL}/departments/hire/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                "user_uuid": `${user}`,
                "department_uuid": `${dep}`
            })
        })
        if(request.ok) {
            toast("Sucesso!", "Você acabou de contratar mais um dev")
        }
        const response = await request.json()        
        if(response.error){
            toast("Erro!", "Favor selecionar um dev")            
        }
        return response
    }catch(err){
        return err
    }
}

async function deleteUser(id){
    const token = `Bearer ${getLocalStorage().token}`
    try {
        const request = await fetch (`${baseURL}/admin/delete_user/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": token
            }
        })
    }catch(err){
        return err
    }
}

async function editUser(body, id){
    const token = `Bearer ${getLocalStorage().token}`
    try {
        const request = await fetch (`${baseURL}/admin/update_user/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(body)
        })
        if(request.ok) {
            toast("Sucesso!", "Você editou as informações do usuário")
        }
        const response = await request.json()        
        if(response.error){
            toast("Erro!", "Favor selecionar pelo menos uma opção")    
            return        
        }
    }catch(err){
        return err
    }

}

export {
    renderCompany,
    findCompaniesBySector,
    register,
    login,
    findSectors,
    verifyUser,
    renderDepartments,
    renderUsers,
    createDepartment,
    editDepartment,
    deleteDepartment,
    usersOutOfWork,
    admitEmployee,
    deleteUser,
    editUser    
}