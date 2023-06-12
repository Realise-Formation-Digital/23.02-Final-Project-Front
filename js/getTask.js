//importation de notre url
import { API_BASE_URL } from "../constants/constants.js";

// appele modal
const myModalAlternative = new bootstrap.Modal('#modalList')

//  variable contenant l'identifiant de l'élément à supprimer
let idTaskDelete
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
          console.log(idTaskDelete);

         
          const titleSpanElement = document.querySelector('#titleSpan')
          titleSpanElement.innerText = task.title
          myModalAlternative.show()
          // const foundCharacter = task.find((ch) => ch.id === parseInt(evt.target.id))
          // // console.log(evt.target.id)
          // const name = document.getElementById('nameCh')
          // const title = document.getElementById('titleCh')
          // name.innerText = foundCharacter.fullName
          // title.innerText = foundCharacter.title
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
    const reponsePatch = await axios.patch(
      API_BASE_URL + "tasks/" + dragingElementId,
      {
        new_status_column_id: targetElementId,
      }
    );

    console.log(reponsePatch);
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
        API_BASE_URL + "projects/" + idTaskDelete
      );
    } catch (err) {
      throw err;
    }
    console.log(responseDelete);


    // message success
    if (responseDelete.status === 200) {
      // alert("Votre tàche" + ` ${idTaskDelete} ` + "a été retiré de la liste");

      const alert = document.getElementById('alert-box')
      const messageDivElement = document.createElement('div')
      console.log(alert)

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
