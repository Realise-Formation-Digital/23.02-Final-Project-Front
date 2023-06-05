import { API_BASE_URL } from "../constants/constants.js";


const projectListener = async function() {
  document.querySelectorAll('button.detail-button').forEach(detailButton => {
    detailButton.addEventListener('click', async (e) => {

      try {
            
            let beerId = e.target.parentNode.parentNode.parentNode.id;
            let response = await axios.get(API_BASE_URL + "beers/" + beerId);
            let beer = response.data;
            
            
            await createBeerElement(beer);

            const beerModal = new bootstrap.Modal('#beerModal')
            beerModal.show();
           

            //récupère tous les éléments HTML qui ont la classe CSS "deleteIngredient". 
            //Ces éléments sont stockés dans la variable htmlElList.
            const htmlElList = document.getElementsByClassName('deleteIngredient')

           //Boucle utilisée pour itérer sur chaque élément de htmlElList. 
           //La variable htmlEl représente chaque élément à chaque itération de la boucle. 
            
            for (let htmlEl of htmlElList) {
              //  À l'intérieur de la boucle, une variable ingId est déclarée et initialisée avec une chaîne vide. 
              // Cela servira à stocker l'identifiant de l'ingrédient à supprimer.
              let ingId = "";
              

              //écouteur d'événements est ajouté à chaque élément HTML via htmlEl.addEventListener('click', function(evt) {...}). 
              //Cela signifie que lorsque l'utilisateur clique sur cet élément, la fonction anonyme passée en argument sera exécutée.
              htmlEl.addEventListener('click', function(evt){

                //evt.stopPropagation() est appelé pour arrêter la propagation de l'événement de clic. 
                //Cela empêche l'événement de se propager aux éléments parents.
                evt.stopPropagation()

                //Les lignes suivantes extraient les valeurs des attributs HTML malt-id et hop-id à partir de l'élément sur lequel l'utilisateur a cliqué, 
                //respectivement maltId et hopId. 
                 const maltId = evt.target.getAttribute('malt-id')
                 const hopId = evt.target.getAttribute('hop-id')
                 //Si maltId est défini (non nul et non vide), cela signifie que l'élément cliqué est associé à un ingrédient de malt. 
                 //Dans ce cas, ingId est mis à jour avec maltId
                 if (!!maltId) {
                  ingId = maltId
                  
                  //requête de suppression HTTP est envoyée à une URL spécifique à l'aide de la bibliothèque Axios.
                  axios.delete(API_BASE_URL + "beers/" + beerId + "/ingredients/" + ingId);
                  const ingredientElToRemove = document.querySelector('[malt-id="' + ingId + '"]');
                  ingredientElToRemove.parentElement.remove();

                 }else{
                  ingId = hopId
                  //requête de suppression HTTP est envoyée à une URL spécifique à l'aide de la bibliothèque Axios.
                  axios.delete(API_BASE_URL + "beers/" + beerId + "/ingredients/" + ingId);
                  const ingredientElToRemove = document.querySelector('[hop-id="' + ingId + '"]');
                  ingredientElToRemove.parentElement.remove();                  
                 }
              })
            }

          } catch(e) {
            throw e;
          }
        });
      });
    }


async function createBeerElement(beer) {
  const divEl = document.createElement("div");
  const modalTitleEl = document.getElementById("modalLabel");
  modalTitleEl.textContent = beer.name + " (Since : " + beer.first_brewed + ")";

  divEl.innerHTML = `
      <div class="card" style="width:100%;">
        <div class="card-body">
        <h5 class="card-text text-center mb-4">${beer.tagline}</h5>
          <div class="row">
            <div class="col text-center">
            <img src=${beer.image_url} alt="Beer Picture" style="width:100px;height:auto;" class="center mt-2">
          </div>
          <div class="col">
          <h6 class="card-title">${beer.description}</h6>
        </div>
        <p class="card-text mt-3">${beer.brewers_tips}</p>
        <p class="card-text mb-2"><i>Contributed by :   ${beer.contributed_by}</i></p>
      </div>
    
 
    `;
  const ingredientsDiv = createBeerIngredients(beer);
  divEl.appendChild(ingredientsDiv);
  divEl.classList.add("col");
  const beerDetailsEl = document.getElementById("beerDetails");
  beerDetailsEl.innerHTML = "";
  beerDetailsEl.appendChild(divEl);

  const addIngredientTitle = document.createElement("h6");
  addIngredientTitle.classList.add("mt-5");
  addIngredientTitle.classList.add("mb-2");
  addIngredientTitle.innerHTML = "Ajouter un ingrédient à la bière (non fonctionnel)";
  beerDetailsEl.appendChild(addIngredientTitle);

  const addIngredientEl = await addIngredient(beer);
  beerDetailsEl.appendChild(addIngredientEl);
}

function createBeerIngredients(beer) {
  const divEl = document.createElement("div");
  
  divEl.innerHTML = `
  <div class="accordion" id="ingredientsAccordion">
  <div class="accordion-item">
    <h2 class="accordion-header" id="foodPairing">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#foodPairingCollapse" aria-expanded="false" aria-controls="foodPairingCollapse">
        Food Pairing
      </button>
    </h2>
    <div id="foodPairingCollapse" class="accordion-collapse collapse" aria-labelledby="foodPairingHeading" data-bs-parent="#ingredientsAccordion">
      <div class="accordion-body bg-success">
        <ul>
        ${beer.food_pairing
          .map(
            (food_pairing) =>
            `<li>${food_pairing}</li>`
            )
            .join("")}
        </ul>
      </div>
    </div>
  </div>
  <div class="accordion" id="ingredientsAccordion">
  <div class="accordion-item">
    <h2 class="accordion-header" id="maltHeading">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#maltCollapse" aria-expanded="false" aria-controls="maltCollapse">
        Malt
      </button>
    </h2>
    <div id="maltCollapse" class="accordion-collapse collapse" aria-labelledby="maltHeading" data-bs-parent="#ingredientsAccordion">
      <div class="accordion-body bg-success">
        <ul>
          ${beer.ingredients.malt
            .map(
              (malt) =>
                `<li><button class="me-2 deleteIngredient btn btn-outline-warning btn-sm" type ="button" malt-id="${malt.id}" id="ingredients.malt">delete</button>${malt.name}: ${malt.amount.value} ${malt.amount.unit}</li>`
            )
            .join("")}
             
        </ul>
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="hopsHeading">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#hopsCollapse" aria-expanded="false" aria-controls="hopsCollapse">
        Hops
      </button>
    </h2>
    <div id="hopsCollapse" class="accordion-collapse collapse" aria-labelledby="hopsHeading" data-bs-parent="#ingredientsAccordion">
      <div class="accordion-body bg-success">
        <ul>
          ${beer.ingredients.hops
            .map(
              (hop) =>
                `<li><button class="me-2 deleteIngredient btn btn-outline-warning btn-sm" type="button" hop-id="${hop.id}" id=beer_ingredient.ingredient_id>delete</button>${hop.name}: ${hop.amount.value} ${hop.amount.unit} ${hop.id}</li>`
            )
            .join("")}
            
        </ul>
      </div>
    </div>
  </div>
</div>
    `

   
  return divEl;
}





function removeIngredients (){
  for (let ingredients of beer_ingredient) {

    //create delete button
    const buttonDelete = document.createElement("button");
    buttonDelete.classList.add("btn");
    buttonDelete.classList.add("btn-danger");
    buttonDelete.classList.add("float-end");
    buttonDelete.classList.add("delete-button");
    buttonDelete.disabled = false;
    buttonDelete.innerText = "Supprimer";

    //create card-body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
  }
}

async function addIngredient(beer) {
    try {
        let response = await axios.get(API_BASE_URL + "ingredients?per_page=1000");
        let ingredients = response.data;

        const addIngredientEl = document.createElement("select");
        addIngredientEl.classList.add("form-select");

        const beersIngredients = beer.ingredients.malt.concat(beer.ingredients.hops);
        console.log(beersIngredients);

        for(const ingredient of ingredients) {
            // put ingredient in select if not in beers ingredients
            if (!beersIngredients.find(ingredientEl => ingredientEl.id === ingredient.id)) {
                const ingredientEl = document.createElement("option");
                ingredientEl.innerHTML = ingredient.name;
                ingredientEl.value = ingredient.id;
                addIngredientEl.appendChild(ingredientEl);
            }
        }
        return addIngredientEl;
    } catch(e) {
        throw e;
    }


}

export { beersListener }