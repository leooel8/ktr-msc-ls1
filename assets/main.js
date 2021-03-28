const input_name = document.querySelector("#name_input")
const input_company_name = document.querySelector("#company_name_input")
const input_email = document.querySelector("#email_input")
const input_phone = document.querySelector("#phone_input")
const input_submit = document.querySelector("#submit_input")
const auth_input_name = document.querySelector("#name_authentication_input")
const auth_input_password = document.querySelector("#password_authentication_input")
const auth_input_submit = document.querySelector("#submit_authentication_input")
const input_add_button = document.querySelector("#add_button")
const add_profil_input_submit = document.querySelector("#submit_add_profil_input")
const input_add_name = document.querySelector("#name_add_input")
const input_add_company_name = document.querySelector("#company_name_add_input")
const input_add_email = document.querySelector("#email_add_input")
const input_add_phone = document.querySelector("#phone_add_input")
const input_contacts_table = document.querySelector("#contacts_table_input")
const input_div_authentication = document.querySelector(".authentication_div")
const input_div_profil = document.querySelector(".profil_div")
const input_div_new_contact = document.querySelector(".new_contact_div")
const input_div_library = document.querySelector(".library_div")
const input_div_button = document.querySelector(".button_div")

let last_name
let contacts_list //last mail used, before an eventual change of the email

auth_input_submit.addEventListener("submit", (event) => {
    event.preventDefault()
    const auth_data = {
        name: auth_input_name.value,
        password: auth_input_password.value
    }

    fetch('api/index.php', {
        method: 'POST',
        body: JSON.stringify(auth_data)
    })
        .then((result) => {
            return result.json()
        })
        .then((res) => {
            if (res.error) {
                alert(res.error)
            } else {
                input_div_authentication.classList.add('hide')
                input_div_profil.classList.remove('hide')
                input_div_library.classList.remove('hide')
                input_contacts_table.classList.remove('hide')
                input_div_button.classList.remove('hide')
                input_name.value = res.name
                input_company_name.value = res.company_name
                input_email.value = res.email
                input_phone.value = res.phone
                last_name = res.name
                fetch('api/get_contacts.php',{
                    method: 'POST'
                })
                    .then((result) => {
                        return result.json()
                    }) 
                    .then((res) => {
                        contacts_list = res.contacts_list
                        draw_contacts()
                    })
                    .catch((err) => {
                        alert(err)
                    })
            }
        })
        .catch((err) => {
            alert(err)
        })
})

input_submit.addEventListener("submit", (event) => {

    event.preventDefault()
    const form_data = {
        name: input_name.value,
        company_name: input_company_name.value,
        email: input_email.value,
        phone: input_phone.value,
        last_name
    }

    fetch('api/update_user.php', {
        method: 'POST',
        body: JSON.stringify(form_data)
    })
        .then((result) => {
            return result.json()
        })
        .then((res) => {
            if(res.error) {
                alert(res.error)
                return
            }
            if (res > 1) {
                alert('There has been an error modifying your profile informations!')
            }
            else if (res == 1) {
                alert('Your profil has been modified successfully')
                last_name = form_data.name
            }
        })
        .catch((err) => {
            alert(err)
        })
})

input_add_button.addEventListener("click", (event) => {
    event.preventDefault()
    input_div_new_contact.classList.remove('hide')
})

add_profil_input_submit.addEventListener("submit", (event) => {
    event.preventDefault()
    const form_add_data = {
        name: input_add_name.value,
        company_name: input_add_company_name.value,
        email: input_add_email.value,
        phone: input_add_phone.value,
        last_name
    }
    input_div_new_contact.classList.add('hide')

    fetch('api/add_business_card.php', {
        method: 'POST',
        body: JSON.stringify(form_add_data)
    })
        .then((result) => {
            return result.json()
        })
        .then((res) => {
            fetch('api/get_contacts.php',{
                method: 'POST'
            })
                .then((result) => {
                    return result.json()
                }) 
                .then((res) => {
                    contacts_list = res.contacts_list
                    draw_contacts()
                })
                .catch((err) => {
                    alert(err)
                })
        })
        .catch((err) => {
            alert(err)
        })
})

function draw_contacts() {
    let input_use = document.querySelector(".contacts_tbody_input")
    if (input_use != null) {
        input_use.parentNode.removeChild(input_use)
    }
    
    var table_body = document.createElement('tbody')
    table_body.classList.add('contacts_tbody_input')
  
    contacts_list.forEach(function(row_data) {
        var row = document.createElement('tr')

        var name_cell = document.createElement('td')
        var company_name_cell = document.createElement('td')
        var email_cell = document.createElement('td')
        var phone_cell = document.createElement('td')

        name_cell.appendChild(document.createTextNode(row_data.contact_name))
        company_name_cell.appendChild(document.createTextNode(row_data.contact_company_name))
        email_cell.appendChild(document.createTextNode(row_data.contact_email))
        phone_cell.appendChild(document.createTextNode(row_data.contact_phone))

        row.appendChild(name_cell)
        row.appendChild(company_name_cell)
        row.appendChild(email_cell)
        row.appendChild(phone_cell)

        table_body.appendChild(row)
    })
    input_contacts_table.appendChild(table_body)
}

