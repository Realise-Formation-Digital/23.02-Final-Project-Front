let eltodo = document.getElementById('todo');

let sortabletodo = Sortable.create(eltodo, {group: "test",
animation: 150,
    // Element dragging ended
	onEnd: function (/**Event*/evt) {console.log(evt)
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
let elencours = document.getElementById('encours');

let sortableencours = Sortable.create(elencours, {
    animation: 150,
    group: "test",
    ghostClass: "sortable-ghost",  // Class name for the drop placeholder
    // Element dragging ended
	onEnd: function (/**Event*/evt) {console.log(evt)
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



