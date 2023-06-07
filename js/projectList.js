import { API_BASE_URL } from "../constants/constants.js";
import { projectListener } from "./projects.js";

let totalBeers = 25;
let page = 1;
let perPage = 12;
let beerFilter = "";

/**
 * Get beers
 *
 * @returns {Promise<void>}
 */
async function getBeers() {
    try {
        const response = await axios.get(API_BASE_URL + `beers?page=${page}&per_page=${perPage}&beer_filter=${beerFilter}`);
        const beerList = response.data.data;
        totalBeers = response.data.metadata.total;
        let beerListEl = document.getElementById("beerList");
        beerListEl.innerHTML = "";

        // add pagination elements
        paginationEl();
        paginationBeersListener();

        for (let beer of beerList) {

            //create update button
            const buttonUpdate = document.createElement("button");
            buttonUpdate.classList.add("btn");
            buttonUpdate.classList.add("btn-warning");
            buttonUpdate.classList.add("float-end");
            buttonUpdate.classList.add("me-1");
            buttonUpdate.classList.add("update-button");
            buttonUpdate.innerText = "Modifier";

            //create input hidden for update button
            const inputUpdate = document.createElement("input");
            inputUpdate.type = "hidden";
            inputUpdate.name = "id";
            inputUpdate.value = beer.id

            //create form update button
            const buttonUpdateForm = document.createElement("form");
            buttonUpdateForm.action = `./addProject.html?id=${project.id}`;
            buttonUpdateForm.appendChild(inputUpdate);
            buttonUpdateForm.appendChild(buttonUpdate);

            //create delete button
            const buttonDelete = document.createElement("button");
            buttonDelete.classList.add("btn");
            buttonDelete.classList.add("btn-danger");
            buttonDelete.classList.add("float-end");
            buttonDelete.classList.add("delete-button");
            buttonDelete.addEventListener('click', async function(){
                const url = API_BASE_URL + 'beers?id=' + beer.id
               console.log(url)
               await axios({
                method: 'delete',
                url: url})
                getBeers();
            })
            buttonDelete.innerText = "Supprimer";

            //create detail button
            const buttonDetail = document.createElement("button");
            buttonDetail.classList.add("btn");
            buttonDetail.classList.add("btn-primary");
            buttonDetail.classList.add("float-start");
            buttonDetail.classList.add("detail-button");
            buttonDetail.innerText = "Détail";

            //create card-footer
            const cardFooter = document.createElement("div");
            cardFooter.classList.add("card-footer");
            cardFooter.appendChild(buttonDetail);
            cardFooter.appendChild(buttonDelete);
            cardFooter.appendChild(buttonUpdateForm);

            // create brewers-tips
            const brewersTips = document.createElement("li");
            brewersTips.classList.add("list-group-item");
            brewersTips.innerText = beer.brewers_tips;

            // create description
            const description = document.createElement("li");
            description.classList.add("list-group-item");
            description.innerText = beer.description;

            // create tagline
            const tagline = document.createElement("li");
            tagline.classList.add("list-group-item");
            tagline.classList.add("fw-bold");
            tagline.innerText = beer.tagline;

            //create ul
            const ul = document.createElement("ul");
            ul.classList.add("list-group");
            ul.classList.add("list-group-flush")
            ul.appendChild(tagline);
            ul.appendChild(brewersTips);
            ul.appendChild(description);

            // create title
            const title = document.createElement("h5");
            title.classList.add("card-title");
            title.innerText = beer.name;

            //create image
            const image = document.createElement("img");
            image.src = beer.image_url;
            image.classList.add("mx-auto");
            image.classList.add("mt-3");

            //create card-body
            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");
            cardBody.appendChild(title);
            cardBody.appendChild(ul);

            //create card
            const card = document.createElement("div");
            card.classList.add("card")
            card.classList.add("h-100");
            card.appendChild(image);
            card.appendChild(cardBody);
            card.appendChild(cardFooter);

            //create element
            const element = document.createElement("div");
            element.classList.add("col");
            element.classList.add("mb-3");
            element.id = beer.id;
            element.appendChild(card);

            beerListEl.appendChild(element);
        }

        beersListener();
        
    } catch (e) {
        throw e;
    }
}

/**
 * Pagination create elements
 */
function paginationEl() {
    let nbPage;
    if (totalBeers % perPage === 0) {
        nbPage = totalBeers / perPage;
    } else {
        nbPage = Math.floor(totalBeers / perPage) + 1;
    }

    let ulPagination = document.getElementById("pagination");
    ulPagination.innerHTML = "";
    //create buttons pages
    for (let pageNumber = 1; pageNumber <= nbPage; pageNumber++) {
        const aPageEl = document.createElement("a");
        aPageEl.href = "#";
        aPageEl.classList.add("page-link");
        aPageEl.value = pageNumber;
        aPageEl.innerHTML = pageNumber.toString();

        const liPage = document.createElement("li");
        liPage.classList.add("page-item");
        if (pageNumber === page) {
            liPage.classList.add("active");
        }
        liPage.appendChild(aPageEl);

        ulPagination.appendChild(liPage);
    }
}

/**
 * Search beers listener
 */
let searchBeers = document.getElementById("searchBeers");
searchBeers.addEventListener("keyup", async (e)  => {
    try {
        beerFilter = e.target.value;
        await getBeers();
    } catch(e) {
        throw e;
    }
})

/**
 * Pagination beers listener
 */
const paginationBeersListener = function() {
    document.querySelectorAll('li.page-item').forEach(beerPageLi => {
        beerPageLi.addEventListener('click', async (e) => {
            try {
                page = e.target.value;
                await getBeers();
            } catch(e) {
                throw e;
            }
        });
    });
}

await getBeers();