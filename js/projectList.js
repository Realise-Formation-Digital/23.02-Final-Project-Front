import { API_BASE_URL } from "../constants/constants.js";

/**
 * Get Projects
 *
 * @returns {Promise<void>}
 */
async function getProjects() {
  try {
    const response = await axios.get(API_BASE_URL + "projects");
    const projectList = response.data;
    const projectListText = response.data.toString("utf-8"); // Conversion en texte avec encodage UTF-8
    // Utilisez projectListText pour travailler avec les données texte si nécessaire
    

    // let totalProjects = response.data.length;
    let projectListEl = document.getElementById("projectList");
    projectListEl.innerHTML = "";

    for (let project of projectList) {
      const block = document.createElement("li");
      block.setAttribute("id", project.id);
      //étendre la zone de li tout le bloc 
      block.classList.add("stretched-link")
      block.classList.add("list-group-item");
      block.classList.add("list-group-item-action");

      projectListEl.appendChild(block);

      block.addEventListener("click", function (evt) {
        console.log(evt.target.getAttribute("id"));
        window.open(
            "http://127.0.0.1:5500/Kanban.html?kanban_id=" +
            evt.target.getAttribute("id"),
            "_blank"
            );
        });
        
        const h3 = document.createElement("h3");
        h3.innerText = project.title;
        block.appendChild(h3);
     

      for (let copil of project.copil_list) {
        const copilBlock = document.createElement("div");
        const copilH5 = document.createElement("h5");
        copilH5.innerText = copil.first_name + " " + copil.last_name;
        copilBlock.appendChild(copilH5);
        block.appendChild(copilBlock);
      }
    }
  } catch (e) {
    throw e;
  }
}

await getProjects();
