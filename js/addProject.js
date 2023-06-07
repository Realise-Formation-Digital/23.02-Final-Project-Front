import { API_BASE_URL } from "../constants/constants.js";

let usersGlobalList = null
// datepicker with months instead days
// $("#creationDate").datepicker( {
//     format: "dd/mm/yyyy",
//     viewMode: "months",
//     minViewMode: "months"
// });

async function getUsers() {
  try {
    const response = await axios.get(API_BASE_URL + "users");
    const usersList = response.data;
    //console.log(users)
    //return users
    //const usersHTML = users.map((user) => `<li>${user}</li>`).join("");

    //const dropdownMenu = document.querySelector(".dropdown-menu");
    //dropdownMenu.innerHTML = usersHTML;

    const selectElement = document.getElementById('select-users')
    for(let user of usersList){
        const optionEl = document.createElement('option')
        optionEl.setAttribute('value', user.id)
        optionEl.innerText = user.first_name + " " + user.last_name
        selectElement.appendChild(optionEl)
    }




  } catch (e) {
    console.error(e);
    throw e;
  }
}

await getUsers()

async function createProject() {
  try {
    // get values from form
    const form = document.getElementById("newProject");
    let title = form.elements["title"].value;
    let pilot = form.elements["pilot"].value;

    // construct jsonBody
    let jsonBody = {
      title: title,
      copil: [copil1],
    };

    // get id param
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("id");

    //post project
    return await axios.post(API_BASE_URL + "projects", jsonBody);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

//
document.getElementById("newProject").addEventListener("click", () => {
  const myModal = new bootstrap.Modal(
    document.getElementById("new-project-modal"),
    {}
  );
  myModal.show();

  // createProject().then(project => {

  //         //remove error message
  //         const errorElement = document.getElementById("errorMessage");
  //         errorElement.innerHTML = '';

  //         //add success message
  //         const successMessageEl = document.createElement("div");
  //         successMessageEl.innerHTML = "Le projet a bien été ajouté.";
  //         successMessageEl.classList.add("alert");
  //         successMessageEl.classList.add("alert-success");
  //         successMessageEl.innerText = `Le projet ${project.title} a bien été ajoutée.`;
  //         const successElement = document.getElementById("successMessage");
  //         successElement.innerHTML = '';
  //         successElement.appendChild(successMessageEl);

  //         //empty inputs when success
  //         const form = document.getElementById("newProject");
  //         Array.from(form.elements).forEach((element) => {
  //             element.value = "";
  //         });
  //     }
  // ).catch(e => {
  //         //remove success message
  //         const successElement = document.getElementById("successMessage");
  //         successElement.innerHTML = "";

  //         //add error message
  //         const error = document.createElement("div");
  //         error.classList.add("alert");
  //         error.classList.add("alert-danger");
  //         error.innerText = e.response.data.message;
  //         const errorElement = document.getElementById("errorMessage");
  //         errorElement.innerHTML = '';
  //         errorElement.appendChild(error);
  //     }
  // );
});
