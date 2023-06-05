import { API_BASE_URL } from "../constants/constants.js";
// import { projectListener } from "./projects.js";

// let totalProjects = 25;
// let page = 1;
// let perPage = 12;
// let ProjectFilter = "";

/**
 * Get Projects
 *
 * @returns {Promise<void>}
 */
async function getProjects() {
    try {
        const response = await axios.get(API_BASE_URL + 'projects')
        const projectList = response.data;
        console.log("sdfgerhe");
        console.log(response);
        let totalProjects = response.data.length;
        let projectListEl = document.getElementById("projectList");
        projectListEl.innerHTML = "";

        // add pagination elements
        //paginationEl();
        //paginationProjectsListener();

        for (let project of projectList) {
            const block = document.createElement("li");
            block.setAttribute('id', project.id)
            block.classList.add("list-group-item");
            block.classList.add('list-group-item-action')
            projectListEl.appendChild(block);

            const h3 = document.createElement("h3");
            h3.innerText = project.title;

            // const img = document.createElement("img");
            // img.src = project.image_url;

            // const a = document.createElement("a"); // créer la balise <a>
            // a.href = project.url; // définir l'URL externe que vous voulez lier
            // a.target = "_blank"; // configurer le lien pour s'ouvrir dans un nouvel onglet

            // a.appendChild(img);
            // block.appendChild(a);
            block.appendChild(h3);
        }
    } catch (e) {
        throw e;
    }
}


await getProjects();