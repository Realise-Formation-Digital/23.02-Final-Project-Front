import { API_BASE_URL } from "../constants/constants.js";

/**
 * Get Projects
 *
 * @returns {Promise<void>}
 */
async function getProjects() {
  let response = null

  try {
    response = await axios.get(API_BASE_URL + "projects");
  } catch (err) {
    console.log(err)
    throw err
  }
  const projectList = response.data;
  const projectListText = response.data.toString("utf-8"); // Conversion en texte avec encodage UTF-8
  // Utilisez projectListText pour travailler avec les données texte si nécessaire

  // let totalProjects = response.data.length;
  let projectListEl = document.getElementById("projectList");

  for (let project of projectList) {
    // Elements creation
    const liElement = document.createElement("li");
    const contentBlockElement = document.createElement("div");
    const contentBlockElementTitle = document.createElement("div");
    const contentBlockElementSpan = document.createElement('span')
    const iconElement = document.createElement('i')
    let listCopil = ""

    // Custom LI Element
    liElement.setAttribute("id", project.id); // set attribute ID
    liElement.classList.add("list-group-item", "list-group-item-action", "d-flex", "justify-content-between", "align-items-start");

    for (let i = 0; i < project.copil_list.length; i++) {
      // if (i === project.copil_list.length -1 ) {
      //   listCopil = listCopil.concat(project.copil_list[i].first_name + " " + project.copil_list[i].last_name)
      // }
      // else{
      //   listCopil = listCopil.concat(project.copil_list[i].first_name + " " + project.copil_list[i].last_name + ", ")
      // } 

      i === project.copil_list.length - 1 ? listCopil = listCopil.concat(project.copil_list[i].first_name + " " + project.copil_list[i].last_name) : listCopil = listCopil.concat(project.copil_list[i].first_name + " " + project.copil_list[i].last_name + ", ")
    }

    // Custom Content Block
    contentBlockElement.classList.add("ms-2", "me-auto");
    contentBlockElement.innerHTML = `
      <div class="fw-bold">${project.title}</div>
      ${listCopil}`

    // Custom span element
    contentBlockElementSpan.classList.add("badge", "bg-danger", "rounded-pill");

    // Custom icon element
    iconElement.classList.add("bi", "bi-trash-fill")

    // Attach Icon -> Span
    contentBlockElementSpan.appendChild(iconElement)

    // Attach Title --> Content
    contentBlockElement.appendChild(contentBlockElementTitle)

    // Add event Listener to SPAN
    contentBlockElementSpan.addEventListener('click', async function (evt) {
      evt.stopPropagation()
      let responseDelete = null
      let idProjectDelete = evt.target.parentElement.parentElement.getAttribute('id')
      try {
        //envoyer la requette au serveur via l'URL et l'id du Kanban
        responseDelete = await axios.delete(API_BASE_URL + "projects/" + idProjectDelete);
      } catch (err) {
        throw err
      }

      if (responseDelete.status === 200) {
        console.log(responseDelete.status)
        alert("Votre projet a été retiré de la liste")
        setTimeout(location.reload(),1000);
 
        
      } else {
          alert("Quelque chose s'est mal passé")
      }

      

    })



    // Final Step --> Attach Block and span to li element
    liElement.appendChild(contentBlockElement)
    liElement.appendChild(contentBlockElementSpan)

    //Add event listener to LI
    liElement.addEventListener("click", function (evt) {
      let kanban_id = evt.target.parentElement.parentElement.getAttribute('id')
      if (!kanban_id) kanban_id = evt.target.getAttribute('id')

      window.open(
        "http://127.0.0.1:5500/Kanban.html?kanban_id=" +
        kanban_id,
        "_blank"
      );
    });

    // Final FINAL Step --> Attach li to ul
    projectListEl.appendChild(liElement);
  }

}

await getProjects();
