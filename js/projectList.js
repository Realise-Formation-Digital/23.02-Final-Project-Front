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


  let projectListEl = document.getElementById("projectList");
//boucle pour créer la liste des projets 
  for (let project of projectList) {
    // créations des elements HTML
    const liElement = document.createElement("li");
    const contentBlockElement = document.createElement("div");
    const contentBlockElementCopil = document.createElement("div");
    const contentBlockElementSpan = document.createElement('span')
    const iconElement = document.createElement('i')
    let listCopil = ""

    // personalisation de l'element li
    liElement.setAttribute("id", project.id); // set attribute ID
    liElement.classList.add("list-group-item", "list-group-item-action", "d-flex", "justify-content-between", "align-items-center");
// boucle pour ajouter des virgules à la liste des copiles 
    for (let i = 0; i < project.copil_list.length; i++) {
      // if (i === project.copil_list.length -1 ) {
      //   listCopil = listCopil.concat(project.copil_list[i].first_name + " " + project.copil_list[i].last_name)
      // }
      // else{
      //   listCopil = listCopil.concat(project.copil_list[i].first_name + " " + project.copil_list[i].last_name + ", ")
      // } 

      i === project.copil_list.length - 1 ? listCopil = listCopil.concat(project.copil_list[i].first_name + " " + project.copil_list[i].last_name) : listCopil = listCopil.concat(project.copil_list[i].first_name + " " + project.copil_list[i].last_name + ", ")
    }

    // personalisation du contentBlock
    contentBlockElement.classList.add("ms-2", "me-auto", "align-items-center");
    contentBlockElement.innerHTML = `
      <div class="fw-bold">${project.title}</div>
     `
// injection de la liste des coordonnées des copiles 
    contentBlockElementCopil.innerText = listCopil

    // personalisation de l'element span 
    contentBlockElementSpan.classList.add("badge", "bg-danger", "rounded-pill");

    // personalisation des icon
    iconElement.classList.add("bi", "bi-trash-fill")

    // concaténation Icon -> Span
    contentBlockElementSpan.appendChild(iconElement)

    // concaténation Title --> Content
    contentBlockElement.appendChild(contentBlockElementCopil)

    //ajout de event Listener dans SPAN
    contentBlockElementSpan.addEventListener('click', async function (evt) {
      evt.stopPropagation()
      let responseDelete = null
      let idProjectDelete = evt.target.parentElement.parentElement.getAttribute('id')
    
      if (idProjectDelete === "projectList") idProjectDelete = evt.target.parentElement.getAttribute('id')
  
      try {
        //envoyer la requette au serveur via l'URL et l'id du Kanban
        responseDelete = await axios.delete(API_BASE_URL + "projects/" + idProjectDelete);
      } catch (err) {
        throw err
      }

      if (responseDelete.status === 200) {
       
        alert("Votre projet a été retiré de la liste")
        setTimeout(location.reload(),1000);
 
        
      } else {
          alert("Quelque chose s'est mal passé")
      }

      

    })



    // concaténation des elements 
        liElement.appendChild(contentBlockElement)
    liElement.appendChild(contentBlockElementSpan)

    //ajoutd'un event listener dans LI
    liElement.addEventListener("click", function (evt) {
      let kanban_id = evt.target.parentElement.parentElement.getAttribute('id')
      if (!kanban_id) kanban_id = evt.target.getAttribute('id')

      window.open(
        "http://127.0.0.1:5500/Kanban.html?kanban_id=" +
        kanban_id,
        "_blank"
      );
    });

    // concaténation du li dans ul
    projectListEl.appendChild(liElement);
  }

}

await getProjects();
