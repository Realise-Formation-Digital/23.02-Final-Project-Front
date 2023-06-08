import { API_BASE_URL } from "../constants/constants.js";
//Création de la liste des utilisateurs et initialisation vide 
let usersGlobalList = null;
/**
 * Création de la function vérifier pour venir recup le statut de nos check box
 * 
 */
function verfierUser() {
  let checkedUser = [];
  const checked = document.querySelectorAll(".daniel");
  for (let i of checked) {
    if (i.checked === true) {
      checkedUser.push(i.id);
    }
  }
}
//création de la function 
async function getUsers() {
  try {
    const response = await axios.get(API_BASE_URL + "users");
    const usersList = response.data;
    const ulElement = document.getElementById("lista");
    let idTabUser = [];
    console.log(idTabUser);

    for (let user of usersList) {
      const liCheck = document.createElement("li");
      const optionEl = document.createElement("label");
      const checkBox = document.createElement("input");

      //perso li
      liCheck.classList.add("list-group-item");

      //perso input
      checkBox.classList.add("form-check-input", "me-1", "mx-3");
      checkBox.classList.add("daniel");
      checkBox.setAttribute("type", "checkbox");
      checkBox.setAttribute("id", user.id);

      //perso label
      optionEl.classList.add("form-check-label", "stretched-link");
      optionEl.setAttribute("for", user.id);
      optionEl.innerText = user.first_name + " " + user.last_name;
      idTabUser.push(user.id);
      liCheck.appendChild(checkBox);
      liCheck.appendChild(optionEl);
      ulElement.appendChild(liCheck);
    }
    //recupération du btn
    const btnValidation = document.getElementById("valid");
    btnValidation.addEventListener("click", verfierUser);
    console.log(btnValidation);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

await getUsers();

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


//Ajouter un listener sur le bouton de l'ajout d'un projet
document.getElementById("newProject").addEventListener("click", () => {
  const myModal = new bootstrap.Modal(
    document.getElementById("new-project-modal"),
    {}
  );
  myModal.show();
});
