import {API_BASE_URL} from "../constants/constants.js";

// datepicker with months instead days
$("#creationDate").datepicker( {
    format: "dd/mm/yyyy",
    viewMode: "months",
    minViewMode: "months"
});

async function sendBeer() {
    try {
        // get values from form
        const form = document.getElementById("sendBeerForm")
        let name = form.elements['name'].value;
        let tagline = form.elements['tagline'].value;
        let firstBrewed = form.elements['creationDate'].value;
        let description = form.elements['description'].value;
        let imageUrl = form.elements['imageUrl'].value;
        let brewersTips = form.elements['brewersTips'].value;
        let contributedBy = form.elements['contributedBy'].value;
        let foodPairing1 = form.elements['foodPairing1'].value;
        let foodPairing2 = form.elements['foodPairing2'].value;
        let foodPairing3 = form.elements['foodPairing3'].value;

        // construct jsonBody
        let jsonBody = {
            "name": name,
            "tagline": tagline,
            "first_brewed": firstBrewed,
            "description": description,
            "image_url": imageUrl,
            "food_pairing":[
                foodPairing1,
                foodPairing2,
                foodPairing3
            ],
            "brewers_tips": brewersTips,
            "contributed_by": contributedBy
        }

        // get id param
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get("id");

        //if id, update beer
        if (id) {
            return await axios.put(
                API_BASE_URL + "beers/" + id,
                jsonBody
            )
        // if no id, add beer
        } else {
            return await axios.post(
                API_BASE_URL + "beers",
                jsonBody
            )
        }

    } catch (e) {
        console.error(e);
        throw e;
    }
}

//when click on submit beer
document.getElementById("submitBeer").addEventListener("click", () => {
    sendBeer().then(beer => {

            //remove error message
            const errorElement = document.getElementById("errorMessage");
            errorElement.innerHTML = '';

            //add success message
            const successMessageEl = document.createElement("div");
            successMessageEl.innerHTML = "La bière a bien été ajoutée.";
            successMessageEl.classList.add("alert");
            successMessageEl.classList.add("alert-success");
            successMessageEl.innerText = `La bière ${beer.data.name} a bien été ajoutée.`;
            const successElement = document.getElementById("successMessage");
            successElement.innerHTML = '';
            successElement.appendChild(successMessageEl);

            //empty inputs when success
            const form = document.getElementById("sendBeerForm");
            Array.from(form.elements).forEach((element) => {
                element.value = "";
            });
        }
    ).catch(e => {
            //remove success message
            const successElement = document.getElementById("successMessage");
            successElement.innerHTML = "";

            //add error message
            const error = document.createElement("div");
            error.classList.add("alert");
            error.classList.add("alert-danger");
            error.innerText = e.response.data.message;
            const errorElement = document.getElementById("errorMessage");
            errorElement.innerHTML = '';
            errorElement.appendChild(error);
        }
    );
});

// when DOM loaded
document.addEventListener("DOMContentLoaded", async function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("id");
    const titleEl = document.getElementById("title");

    // if id, put values from beer in inputs
    if (id) {
        let response = await axios.get(API_BASE_URL + 'beers/' + id);
        let beer = response.data;
        const form = document.getElementById("sendBeerForm")
        form.elements['name'].value = beer.name;
        form.elements['tagline'].value = beer.tagline;
        form.elements['firstBrewed'].value = beer.first_brewed;
        form.elements['description'].value = beer.description;
        form.elements['imageUrl'].value = beer.image_url;
        form.elements['brewersTips'].value = beer.brewers_tips;
        form.elements['contributedBy'].value = beer.contributed_by;
        form.elements['foodPairing1'].value = beer.food_pairing[0];
        form.elements['foodPairing2'].value = beer.food_pairing[1];
        form.elements['foodPairing3'].value = beer.food_pairing[2];

        // add update beer title
        titleEl.innerHTML = `Mettre à jour la bière ${beer.name}`;
    } else {

        // add add beer title
        titleEl.innerHTML = "Ajouter une bière";
    }
});