//importation de notre url
import { API_BASE_URL } from "../constants/constants.js";

async function getTasks() {
  try {
    //début création element titre
    let projectTitle = document.getElementById('titleprojet')
    projectTitle.innerHTML = ``


    // <div class="col-mb-8 text-center">
    //       <h1>lala</h1>
    //     </div>

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
    let projectTitleId = document.getElementById('titleprojet')
    projectTitleId.innerHTML = `<h1>${kanban.title}</h1>`
    //attacher un element dans le Kanban.html
    let row = document.querySelector("#row");
    // table de ID
    let tableId = []
    let columnId = []
    //boucle pour récupérer les informations retournées de chaque colonne
    for (let column of kanban.status_columns) {
      columnId.push(column.id)
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
      let h4 = document.createElement("h4");
      //définir l'element h4 comme titre de la colonne
      h4.innerText = column.title;
      col.appendChild(h4);
      row.appendChild(col);
      //utilisation de librairie sortable.js
      Sortable.create(col, {
        group: "test",
        animation: 150,
        draggable: ".card",

        onUpdate: function (evt) {

          var order = sortable.toArray()
          var itemEl = evt.item; // dragged HTMLElement
          evt.to; // target list
          evt.from; // previous list
          evt.oldIndex; // element's old index within old parent
          evt.newIndex; // element's new index within new parent
          evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
          evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
          evt.clone; // the clone element
          evt.pullMode; // when item is in another sortable: `"clone"` if cloning, `true` if moving
          console.log( sortable.toArray())
        },

        // Element dragging ended
        onEnd: function (/**Event*/ evt) {

          var itemEl = evt.item; // dragged HTMLElement
          evt.to; // target list
          evt.from; // previous list
          evt.oldIndex; // element's old index within old parent
          evt.newIndex; // element's new index within new parent
          evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
          evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
          evt.clone; // the clone element
          evt.pullMode; // when item is in another sortable: `"clone"` if cloning, `true` if moving
        },
      });
      
      // console.log(columnId)
      //boucle pour venir récupérer chaque tâches
      for (let task of column.tasks) {
        //creation de la carte
        let cardDiv = document.createElement("div");
        //assignation de la classe
        cardDiv.classList.add("card");
        cardDiv.setAttribute("id","card23")
        let cardBodyDiv = document.createElement("div");
        cardBodyDiv.classList.add("card-body");
        let titleCard = document.createElement("h5");
        titleCard.classList.add = "p-5";
        titleCard.innerText = task.title;
        cardBodyDiv.appendChild(titleCard);
        cardDiv.appendChild(cardBodyDiv);
        col.appendChild(cardDiv);
      }
      tableId.push(column.tasks)
    }
    console.log(tableId)

  } catch (e) {
    alert("Erreur de serveur, merci de réessayer plus tard");
  }
}

await getTasks();
