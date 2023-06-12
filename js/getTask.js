//importation de notre url
import { API_BASE_URL, SECTOR} from "../constants/constants.js";

// appele modal
const myModalAlternative = new bootstrap.Modal('#modalList')

//  variable contenant l'identifiant de l'élément à supprimer
let idTaskDelete

async function createTaskModal(){
  try{
    const titleTask = document.getElementById("task-title")
    const startDateTask = document.getElementById("task-start-date")
    const endDateTask = document.getElementById("task-end-date")
    const descTask = document.getElementById("task-description")
    const pilotTask = document.getElementById("assigned-to")
    const sectTask = document.getElementById("sector")

    titleTask.value = ""

    let date = new Date()
    let mm = date.getMonth() + 1; // getMonth() is zero-based
    let dd = date.getDate();

    if(mm>9){
      mm = mm
    } else{
      mm = "0" + mm
    }

    if(dd>9){
      dd = dd
    } else{
      dd = "0" + dd
    }

    let today = date.getFullYear() + "-" + mm + "-" + dd

    startDateTask.value = today

    endDateTask.value = today

    descTask.value = ""

    //ouvrir le lien dans une nouvelle fenêtre
    const queryString = window.location.search;

    //réccupérer le paramettre de l'URL
    const urlParams = new URLSearchParams(queryString);

    //récupérer l'id du kanban  de l'URL
    const kanban_id = urlParams.get("kanban_id");

    //envoyer la requette au serveur via l'URL et l'id du Kanban
    const project = await axios.get(API_BASE_URL + "projects/" + kanban_id);
    const projectInfo = project.data;

    let userOptions = projectInfo.copil_list

    for(let i = 0; i < userOptions.length; i++) {
      let opt = userOptions[i];
      let el = document.createElement("option");
      el.textContent = opt.last_name + " " + opt.first_name;
      el.value = opt.id;
      pilotTask.appendChild(el);
    }

    let sectorOptions = SECTOR

    for(let i = 0; i < sectorOptions.length; i++) {
      let opt = sectorOptions[i];
      let el = document.createElement("option");
      el.textContent = opt;
      sectTask.appendChild(el);
    }

    //recupération du btn
    const btnValidation = document.getElementById("valid-task");
    btnValidation.addEventListener("click", async()=> await addTask(
      kanban_id, titleTask.value, today, endDateTask.value, descTask.value, pilotTask.value, sectTask.value
    ));


  } catch (e) {
    alert("Erreur de serveur, merci de réessayer plus tard");
  }
}

async function addTask(id, title, startDate, endDate, description, pilot, sector){
  //construct jsonBody
    if(sector === "Selectionnez secteur"){
      sector = null
    }
    if(id && title && description && pilot !== "Selectionnez pilote"){
      let jsonBody = {
        title: title,
        description: description,
        start_date: startDate,
        end_date: endDate,
        pilot: pilot,
        sector: sector,
        project_id: id
      };

      //post project
      const responsePost = await axios.post(API_BASE_URL + "tasks", jsonBody)
      location.reload()
      await getTasks()
    }else {
      alert("veuillez remplir les champs nécessaires")
    }
}

async function getTasks() {
  try {
    //ouvrir le lien dans une nouvelle fenêtre
    const queryString = window.location.search;

    //réccupérer le paramettre de l'URL
    const urlParams = new URLSearchParams(queryString);

    //récupérer l'id du kanban  de l'URL
    const kanban_id = urlParams.get("kanban_id");

    //envoyer la requette au serveur via l'URL et l'id du Kanban
    const reponse = await axios.get(API_BASE_URL + "projects/" + kanban_id);
    const kanban = reponse.data;

    //début création element titre
    let projectTitleId = document.getElementById("titleprojet");

    // injection title to element
    projectTitleId.innerHTML = `<h1>${kanban.title}</h1>`;

    //attacher un element dans le Kanban.html
    let row = document.querySelector("#row");

    //boucle pour récupérer les informations retournées de chaque colonne
    for (let column of kanban.status_columns) {
      //création d'une div
      let col = document.createElement("div");

      //ajout des classes bootstrap
      col.classList.add(
        "col-3",
        "border",
        "border-dark",
        "h-25",
        "d-inline-block",
        "min-vh-100",
        "px-0"
      );

      // add id to col
      col.setAttribute("id", column.id);

      //définir l'element h4 comme titre de la colonne
      let h4 = document.createElement("h4");
      h4.classList.add("text-center", "border-bottom", "border-dark", "py-2");

      // CHANGEMENT DE LA TRAD DU TITRE DES COLONNES
      switch(column.title){
        case "toDo":
          h4.innerText = "à faire"
        break
        case "inProgress":
          h4.innerText = "en cours"
        break
        case "validated":
          h4.innerText = "à valider"
        break
        case "done":
          h4.innerText = "terminé"
        break
      }

      // append Elements
      col.appendChild(h4);
      row.appendChild(col);

      //utilisation de librairie sortable.js

      Sortable.create(col, {
        group: "test",
        animation: 150,
        draggable: ".card",

        onEnd: function (evt) {
          dragingElementId = evt.item.id;
          targetElementId = evt.to.id;
          patchTask();
        },
      });
      
      let imgElement;
      //boucle pour venir récupérer chaque tâches
      for (let task of column.tasks) {
        // Elements creation
        let cardDiv = document.createElement("div");
        let cardBodyDiv = document.createElement("div");
        let titleCard = document.createElement("h5");
        imgElement = document.createElement("img");

        imgElement.src = "./Photos/red-bin.png";
        imgElement.classList.add(
          "h-50",
          "me-3",
          "position-absolute",
          "top-50",
          "end-0",
          "translate-middle-y"
        );
        // Custom Card
        cardDiv.classList.add("card", "my-3", "mx-3", "shadow-sm");
        cardDiv.setAttribute("id", task.id);

        //  Custom body card
        cardBodyDiv.classList.add("card-body", "position-relative");

        //  Custom title
        titleCard.classList.add = "p-5";

        // text injection
        titleCard.innerText = task.title;

        // append elements
        cardBodyDiv.appendChild(titleCard);
        cardBodyDiv.appendChild(imgElement);
        cardDiv.appendChild(cardBodyDiv);
        col.appendChild(cardDiv);

        // attente d'un clic pour supprimer une tâche
        imgElement.addEventListener('click', (evt) => {
          evt.stopPropagation()
          idTaskDelete = evt.target.parentElement.parentElement.getAttribute('id')

         
          const titleSpanElement = document.querySelector('#titleSpan')
          titleSpanElement.innerText = task.title
          myModalAlternative.show()
        })
        
        const btnConfirm = document.querySelector('#btnConfirm')
        btnConfirm.addEventListener('click', deleteTask)

        // imgElement.addEventListener("click", deleteTask)

      }
    }
  } catch (e) {
    alert("Erreur de serveur, merci de réessayer plus tard");
  }
      
      
}

let dragingElementId = null;
let targetElementId = null;
/**
 * Fonction patch. Envoi d'une raquette à la base de données concernant new_status_column_id
 * 
 */
async function patchTask() {
  try {
    console.log(dragingElementId)
    console.log(targetElementId )
    const reponsePatch = await axios.patch(
      API_BASE_URL + "tasks/" + dragingElementId,
      {
        new_status_column_id: parseInt(targetElementId) 
      }
      );
  } catch (error) {
    console.error(error);
  }
}

 async function deleteTask(evt) {
    evt.stopPropagation();
    let responseDelete = null;
    

    try {
      //envoyer la requette DELETE au serveur via l'URL et l'id du Kanban
      responseDelete = await axios.delete(
        API_BASE_URL + "tasks/" + idTaskDelete
      );
    } catch (err) {
      throw err;
    }


    // message success
    if (responseDelete.status === 200) {
      // alert("Votre tàche" + ` ${idTaskDelete} ` + "a été retiré de la liste");

      const alert = document.getElementById('alert-box')
      const messageDivElement = document.createElement('div')

      if(alert === null){
        messageDivElement.classList.add(
          "alert",
          "alert-success"
        )
        messageDivElement.setAttribute("role", "alert")
        messageDivElement.setAttribute("id", "alert-box")
        messageDivElement.innerText = "Votre tàche" + ` ${idTaskDelete} ` + "a été retiré de la liste"
      }else {
        removeDiv(alert)
        messageDivElement.classList.add(
          "alert",
          "alert-success"
        )
        messageDivElement.setAttribute("role", "alert")
        messageDivElement.setAttribute("id", "alert-box")
        messageDivElement.innerText = "Votre tàche" + ` ${idTaskDelete} ` + "a été retiré de la liste"
      }

        function insertAfter(referenceNode, newNode) {
          referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

        const divTitleKanban = document.getElementById("titleprojet")
        insertAfter(divTitleKanban, messageDivElement);
        myModalAlternative.hide();

        removeChild(row)

        getTasks();
        

     
        
      } else {
        alert("Quelque chose s'est mal passé");
      }
      
    };

    function removeDiv(div){
      div.remove()
    }
    
    function removeChild(div){
      while (div.firstChild) {
        div.removeChild(div.firstChild);
      }
  }


await getTasks();






//Ajouter un listener sur le bouton de l'ajout d'un projet
document.getElementById("add-task-btn").addEventListener("click", (evt) => {
  evt.stopPropagation()
  const myModal = new bootstrap.Modal(
    document.getElementById("new-task-modal"),
    {}
  );
  myModal.show();
  createTaskModal();
  
});
