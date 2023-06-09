//importation de notre url
import { API_BASE_URL } from "../constants/constants.js";

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
        "min-vh-100"
      );

      // add id to col
      col.setAttribute("id", column.id);

      //définir l'element h4 comme titre de la colonne
      let h4 = document.createElement("h4");
      h4.innerText = column.title;

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
          // console.log("ID card element: ", dragingElementId);
          targetElementId = evt.to.id;
          // console.log("ID target element: ", targetElementId);
          patchTask()
        },

      });

      //boucle pour venir récupérer chaque tâches
      for (let task of column.tasks) {
      
        // Elements creation
        let cardDiv = document.createElement("div");
        let cardBodyDiv = document.createElement("div");
        let titleCard = document.createElement("h5");

        // Custom Card 
        cardDiv.classList.add("card");
        cardDiv.setAttribute("id", task.id);

        //  Custom body card
        cardBodyDiv.classList.add("card-body");

        //  Custom title
        titleCard.classList.add = "p-5";

        // text injection
        titleCard.innerText = task.title;

        // append elements
        cardBodyDiv.appendChild(titleCard);
        cardDiv.appendChild(cardBodyDiv);
        col.appendChild(cardDiv);
      }
    }
  } catch (e) {
    alert("Erreur de serveur, merci de réessayer plus tard");
  }
}



let dragingElementId = null;
let targetElementId = null;


async function patchTask() {
  try {

   
    const reponsePatch = await axios.patch(API_BASE_URL + "tasks/" + dragingElementId, {
      'new_status_column_id' : targetElementId,
  
      
    })
    
    console.log(reponsePatch);
  }catch(error) {
    console.error(error);
  };
  
  
}

await getTasks();
