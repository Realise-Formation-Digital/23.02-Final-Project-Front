let el = document.getElementById('items');

let sortable = Sortable.create(el);



new Sortable(example2Left, {
    group: 'shared', // set both lists to same group
    animation: 150
});

new Sortable(example2Right, {
    group: 'shared',
    animation: 150
});

