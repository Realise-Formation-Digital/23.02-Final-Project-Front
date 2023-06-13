//importation de notre url
import { API_BASE_URL, SECTOR } from "../constants/constants.js";

// appeler modal
const myModalAlternative = new bootstrap.Modal("#modalList");

//  variable contenant l'identifiant de l'élément à supprimer
let idTaskDelete;

// liste de toutes les tâches du kanban
let taskList = [];

//création de la modal pour afficher les infos d'une tâche
async function viewTaskModal(id, modal) {
  try {
    const title = document.getElementById("task-title-modal");
    const stDate = document.getElementById("task-start-date-modal");
    const ndDate = document.getElementById("task-end-date-modal");
    const desc = document.getElementById("task-description-modal");
    const pilot = document.getElementById("assigned-to-modal");
    const sect = document.getElementById("sector-modal");

    const task = taskList.find((taskList) => taskList.id === parseInt(id));
    //affichage des valeurs de la modal
    title.value = "";
    title.innerText = task.title;

    stDate.value = "";
    stDate.innerText = task.start_date;

    ndDate.value = "";
    ndDate.innerText = task.end_date;

    desc.value = "";
    desc.innerText = task.description;

    pilot.value = "";
    pilot.innerText = task.pilot.last_name + " " + task.pilot.first_name;

    sect.value = "";
    sect.innerText = task.sector;

    //recupération du bouton de modification des tâches (EventListener)
    const btnValidation = document.getElementById("edit-task");
    btnValidation.addEventListener("click", (evt) => {
      evt.stopPropagation();
      modal.hide();

      const editModal = new bootstrap.Modal(
        document.getElementById("new-task-modal"),
        {}
      );

      // ouvrir une modal
      editModal.show();
      editTaskModal(task);
    });
  } catch (e) {
    alert("Erreur de serveur, merci de réessayer plus tard");
  }
}
// fonction pour modifier une tâche
async function editTaskModal(task) {
  try {
    const titleTask = document.getElementById("task-title");
    const startDateTask = document.getElementById("task-start-date");
    const endDateTask = document.getElementById("task-end-date");
    const descTask = document.getElementById("task-description");
    const pilotTask = document.getElementById("assigned-to");
    const sectTask = document.getElementById("sector");

    titleTask.value = task.title;

    startDateTask.value = task.start_date;

    endDateTask.value = task.end_date;

    descTask.value = task.description;

    //ouvrir le lien dans une nouvelle fenêtre
    const queryString = window.location.search;

    //réccupérer le paramettre de l'URL
    const urlParams = new URLSearchParams(queryString);

    //récupérer l'id du kanban  de l'URL
    const kanban_id = urlParams.get("kanban_id");

    //envoyer la requette au serveur via l'URL et l'id du Kanban
    const project = await axios.get(API_BASE_URL + "projects/" + kanban_id);
    const projectInfo = project.data;

    let userOptions = projectInfo.copil_list;
    //boucle pour créer la liste des utilisateurs
    for (let i = 0; i < userOptions.length; i++) {
      let opt = userOptions[i];
      let el = document.createElement("option");
      el.textContent = opt.last_name + " " + opt.first_name;
      el.value = opt.id;
      pilotTask.appendChild(el);
    }

    let sectorOptions = SECTOR;
    //boucle pour créer la liste des secteurs de Réalise
    for (let i = 0; i < sectorOptions.length; i++) {
      let opt = sectorOptions[i];
      let el = document.createElement("option");
      el.textContent = opt;
      sectTask.appendChild(el);
    }

    //recupération du bouton valider une tâche
    const btnValidation = document.getElementById("valid-task");
    btnValidation.addEventListener(
      "click",
      async () =>
        await updateTask(
          task.id,
          kanban_id,
          titleTask.value,
          startDateTask.value,
          endDateTask.value,
          descTask.value,
          pilotTask.value,
          sectTask.value
        )
    );
  } catch (e) {
    alert("Erreur de serveur, merci de réessayer plus tard");
  }
}
//fonction pour créer une modal permet de créer une nouvelle tâche
async function createTaskModal() {
  try {
    const titleTask = document.getElementById("task-title");
    const startDateTask = document.getElementById("task-start-date");
    const endDateTask = document.getElementById("task-end-date");
    const descTask = document.getElementById("task-description");
    const pilotTask = document.getElementById("assigned-to");
    const sectTask = document.getElementById("sector");

    titleTask.value = "";

    let date = new Date();
    let mm = date.getMonth() + 1; // getMonth() is zero-based
    let dd = date.getDate();

    if (mm > 9) {
      mm = mm;
    } else {
      mm = "0" + mm;
    }

    if (dd > 9) {
      dd = dd;
    } else {
      dd = "0" + dd;
    }

    let today = date.getFullYear() + "-" + mm + "-" + dd;

    startDateTask.value = today;

    endDateTask.value = today;

    descTask.value = "";

    //ouvrir le lien dans une nouvelle fenêtre
    const queryString = window.location.search;

    //réccupérer le paramettre de l'URL
    const urlParams = new URLSearchParams(queryString);

    //récupérer l'id du kanban  de l'URL
    const kanban_id = urlParams.get("kanban_id");

    //envoyer la requette au serveur via l'URL et l'id du Kanban
    const project = await axios.get(API_BASE_URL + "projects/" + kanban_id);
    const projectInfo = project.data;

    let userOptions = projectInfo.copil_list;
    //boucle pour créer la liste des pilotes
    for (let i = 0; i < userOptions.length; i++) {
      let opt = userOptions[i];
      let el = document.createElement("option");
      el.textContent = opt.last_name + " " + opt.first_name;
      el.value = opt.id;
      pilotTask.appendChild(el);
    }

    let sectorOptions = SECTOR;
    //boucle pour créer la liste des secteurs de Réalise
    for (let i = 0; i < sectorOptions.length; i++) {
      let opt = sectorOptions[i];
      let el = document.createElement("option");
      el.textContent = opt;
      sectTask.appendChild(el);
    }

    //recupération du bouton valider tâche(eventlistener)
    const btnValidation = document.getElementById("valid-task");
    btnValidation.addEventListener(
      "click",
      async () =>
        await addTask(
          kanban_id,
          titleTask.value,
          today,
          endDateTask.value,
          descTask.value,
          pilotTask.value,
          sectTask.value
        )
    );
  } catch (e) {
    alert("Erreur de serveur, merci de réessayer plus tard");
  }
}
// fonction pour modifier une tâche existante
async function updateTask(
  taskId,
  projectId,
  title,
  startDate,
  endDate,
  description,
  pilot,
  sector
) {
  if (sector === "Selectionnez secteur") {
    sector = null;
  }
  //construction du jsonBody
  if (projectId && title && description && pilot !== "Selectionnez pilote") {
    let jsonBody = {
      title: title,
      description: description,
      start_date: startDate,
      end_date: endDate,
      pilot: pilot,
      sector: sector,
      project_id: projectId,
    };

    //méthode put project
    const responsePost = await axios.put(
      API_BASE_URL + "tasks/" + taskId,
      jsonBody
    );
    location.reload();
    await getTasks();
  } else {
    alert("veuillez remplir les champs nécessaires");
  }
}
// fonction pour ajouter une tâche
async function addTask(
  id,
  title,
  startDate,
  endDate,
  description,
  pilot,
  sector
) {
  let dateDebut = document.getElementById("task-start-date").value;
  let dateFin = document.getElementById("task-end-date").value;
  if(dateFin< dateDebut){
    alert("La date de fin ne peux pas être antérieure à la date du début!!");
  }
  if (sector === "Selectionnez secteur") {
    sector = null;
  }
  //construction du jsonBody
  if (id && title && description && pilot !== "Selectionnez pilote") {
    let jsonBody = {
      title: title,
      description: description,
      start_date: startDate,
      end_date: endDate,
      pilot: pilot,
      sector: sector,
      project_id: id,
    };

    //méthode post project
    const responsePost = await axios.post(API_BASE_URL + "tasks", jsonBody);
    location.reload();
    await getTasks();
  } else {
    alert("veuillez remplir les champs nécessaires");
  }
}
//fonction pour créer le kanban avec toutes les informations (tâches et nom du kanban)
async function getTasks() {
  try {
    //ouvrir le lien dans une nouvelle fenêtre
    const queryString = window.location.search;

    //réccupérer le paramettre de l'URL
    const urlParams = new URLSearchParams(queryString);

    //récupérer l'id du kanban  de l'URL
    const kanban_id = urlParams.get("kanban_id");

    //envoyer la requette au serveur via l'URL et l'id du Kanban
    const project = await axios.get(API_BASE_URL + "projects/" + kanban_id);
    const kanban = project.data;

    //début création element titre
    let projectTitleId = document.getElementById("titleprojet");

    // injection du titre du kanban
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
        "rounded-3", // ???
        "px-0"
      );

      // ajouter les id aux colonnes
      col.setAttribute("id", column.id);

      //définir l'element h4 comme titre de la colonne
      let h4 = document.createElement("h4");
      h4.classList.add("text-center", "border-bottom", "border-dark", "py-2");

      // CHANGEMENT DE LA TRADUCTION DU TITRE DES COLONNES
      switch (column.title) {
        case "toDo":
          h4.innerText = "à faire";
          break;
        case "inProgress":
          h4.innerText = "en cours";
          break;
        case "validated":
          h4.innerText = "à valider";
          break;
        case "done":
          h4.innerText = "terminé";
          break;
      }

      // assembler des Elements
      col.appendChild(h4);
      row.appendChild(col);

      //utilisation de librairie sortable.js (drag and drop)

      Sortable.create(col, {
        group: "test",
        animation: 150,
        draggable: ".card",
        //gestion de la nouvelle colonne (statut d'une tâche)
        onEnd: function (evt) {
          dragingElementId = evt.item.id;
          targetElementId = evt.to.id;
          patchTask();
        },
      });

      let imgElement;
      //boucle pour venir récupérer chaque tâches
      for (let task of column.tasks) {
        //ajouter chaque tâche dans le tableau
        taskList.push(task);
        // Elements création
        let cardDiv = document.createElement("div");
        let cardBodyDiv = document.createElement("div");
        let titleCard = document.createElement("h5");
        let buttonViewTaskElement = document.createElement("button");
        imgElement = document.createElement("img");
        //ajouter des src image
        imgElement.src = "./Photos/red-bin.png";
        // personalisation image
        imgElement.classList.add(
          "me-3",
          "position-absolute",
          "top-50",
          "end-0",
          "translate-middle-y",
          "delete-size"
        );
        // personalisation de la carte
        cardDiv.classList.add("card", "my-3", "mx-3", "shadow-sm");
        cardDiv.setAttribute("id", task.id);

        //  personalisation du contenu de la carte
        cardBodyDiv.classList.add("card-body", "position-relative");

        //  personalisation du titre
        titleCard.classList.add = "p-5";

        // injécter dans la carte les informations sur la tâche
        titleCard.innerHTML = `
          <img class="avatar-size m-1" src="${task.pilot.image}" alt="avatar">
          <h4 class="m-1">${task.title}</h4>
          <p>${task.pilot.last_name} ${task.pilot.first_name}</p>
          <p>${task.description}</p>
          <p>${task.start_date}</p>
        `;

        // personalisation bouton voir tâche
        buttonViewTaskElement.classList.add("btn", "btn-success");
        buttonViewTaskElement.innerText = "Voir tâche";

        // la concaténation des elements
        cardBodyDiv.appendChild(titleCard);
        cardBodyDiv.appendChild(buttonViewTaskElement);
        cardBodyDiv.appendChild(imgElement);
        cardDiv.appendChild(cardBodyDiv);
        col.appendChild(cardDiv);

        // Bouton VOIR TACHE qui ouvre la modal avec les infos de la tâche (eventlistener)
        buttonViewTaskElement.addEventListener("click", (evt) => {
          evt.stopPropagation();
          let taskId =
            evt.target.parentElement.parentElement.getAttribute("id");
          const viewModal = new bootstrap.Modal(
            document.getElementById("view-task-modal"),
            {}
          );
          viewModal.show();
          viewTaskModal(taskId, viewModal);
        });

        // attente d'un clic pour supprimer une tâche(eventlistener)

        imgElement.addEventListener("click", (evt) => {
          evt.stopPropagation();
          idTaskDelete =
            evt.target.parentElement.parentElement.getAttribute("id");

          const titleSpanElement = document.querySelector("#titleSpan");
          titleSpanElement.innerText = task.title;
          myModalAlternative.show();
        });

        const btnConfirm = document.querySelector("#btnConfirm");
        btnConfirm.addEventListener("click", deleteTask);
      }
    }
  } catch (e) {
    alert("Erreur de serveur, merci de réessayer plus tard");
  }
}
//variables globales qui contiennent l'id de la tâche et son nouveau statut
let dragingElementId = null;
let targetElementId = null;
/**
 * Fonction(méthode) patch. Envoi d'une requette à la base de données concernant (new_status_column_id)
 *
 */
async function patchTask() {
  try {
    const reponsePatch = await axios.patch(
      API_BASE_URL + "tasks/" + dragingElementId,
      {
        new_status_column_id: parseInt(targetElementId),
      }
    );
  } catch (error) {
    console.error(error);
  }
}
//fonction (méthode) supprimer une tâche
async function deleteTask(evt) {
  evt.stopPropagation();
  let responseDelete = null;

  try {
    //envoyer la requête DELETE au serveur via l'URL et l'id du Kanban
    responseDelete = await axios.delete(API_BASE_URL + "tasks/" + idTaskDelete);
  } catch (err) {
    throw err;
  }

  // gestion des statuts des requêtes
  if (responseDelete.status === 200) {
    const alert = document.getElementById("alert-box");
    const messageDivElement = document.createElement("div");

    if (alert === null) {
      messageDivElement.classList.add("alert", "alert-success");
      messageDivElement.setAttribute("role", "alert");
      messageDivElement.setAttribute("id", "alert-box");
      messageDivElement.innerText =
        "Votre tàche" + ` ${idTaskDelete} ` + "a été retiré de la liste";
    } else {
      removeDiv(alert);
      messageDivElement.classList.add("alert", "alert-success");
      //confirmation de la suppression d'une tâche
      messageDivElement.setAttribute("role", "alert");
      messageDivElement.setAttribute("id", "alert-box");
      messageDivElement.innerText =
        "Votre tàche" + ` ${idTaskDelete} ` + "a été retiré de la liste";
    }
    //fonction pour l'injection du code HTML du message de confirmation de la suppression
    function insertAfter(referenceNode, newNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    const divTitleKanban = document.getElementById("titleprojet");
    insertAfter(divTitleKanban, messageDivElement);
    myModalAlternative.hide();

    removeChild(row);

    getTasks();
  } else {
    alert("Quelque chose s'est mal passé");
  }
}
// fonction pour n'afficher que la confirmation de la dernière suppression de tâche
function removeDiv(div) {
  div.remove();
}

function removeChild(div) {
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}

await getTasks();

//Ajouter un listener sur le bouton de l'ajout d'une tâche
document.getElementById("add-task-btn").addEventListener("click", (evt) => {
  evt.stopPropagation();
  const myModal = new bootstrap.Modal(
    document.getElementById("new-task-modal"),
    {}
  );
  myModal.show();
  createTaskModal();
});
