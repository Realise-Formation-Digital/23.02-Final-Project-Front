//importation de notre url
import { API_BASE_URL } from "../constants/constants.js";

// let totalTask = "";
// let allTitle = "";
// let projectId = "";

async function getTasks() {
    try {

        const reponse = await axios.get(API_BASE_URL + 'projects/3')

        console.log(reponse)
        const kanban = reponse.data

        let row = document.querySelector('#row')


        for (let column of kanban.status_columns) {

            let col = document.createElement('div')
            col.classList.add('col-3', 'border', 'border-dark', 'h-25', 'd-inline-block', 'min-vh-100')
            let h4 = document.createElement('h4')
            // h4.classList.add('p-5')
            h4.innerText = column.title
            col.appendChild(h4)
            row.appendChild(col)
            console.log(column.tasks)
            Sortable.create(col, {
                group: "test",
                animation: 150,
                draggable: '.card',
                // ghostClass: "col-3", 
                // Element dragging ended
                onEnd: function (/**Event*/evt) {
                    console.log(evt)
                    var itemEl = evt.item;  // dragged HTMLElement
                    evt.to;    // target list
                    evt.from;  // previous list
                    evt.oldIndex;  // element's old index within old parent
                    evt.newIndex;  // element's new index within new parent
                    evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
                    evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
                    evt.clone // the clone element
                    evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving
                },

            });

            for (let tasks of column.tasks) {
                console.log('caio')
                console.log(tasks.title)
                // < div class="card" >
                //     <div class="card-body">
                //         This is some text within a card body.
                //     </div>
                //     </div >
                //creation de la carte
                let cardDiv = document.createElement('div')
                //assignation de la classe
                cardDiv.classList.add('card')
                let cardBodyDiv = document.createElement('div')
                cardBodyDiv.classList.add('card-body')
                let titleCard = document.createElement('h5')
                titleCard.classList.add = ('p-5')
                titleCard.innerText = tasks.title
                cardBodyDiv.appendChild(titleCard)
                cardDiv.appendChild(cardBodyDiv)
                col.appendChild(cardDiv)



            }
        }
    } catch (e) {

    }
}


await getTasks();