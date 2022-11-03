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

export {
    renderCompany,
    findCompaniesBySector,
    register,
    login,
    findSectors
}