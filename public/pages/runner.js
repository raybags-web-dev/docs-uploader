const IMG_container = document.getElementById('image_container');
const doc_state_count = document.getElementById('status_');

// avail localy available documents
window.addEventListener('load', load_available_docs, false);
async function load_available_docs() {
    try {
        let items_array = [];
        const keys = Object.keys(localStorage)
        for (let key of keys) {
            items_array.push(key)
            let doc_value = localStorage.getItem(key);
            // create image elemnet 
            const IMG = new Image();
            IMG.src = `${doc_value}`
            IMG.classList = 'rounded  float-start doc'
            IMG.title = `${key}`
            IMG.alt = '...'

            // append image element to container
            IMG_container.appendChild(IMG);
        }
        // update document count
        ((items_array.length) == 0) ? doc_state_count.textContent = `Nothing to show: [ 0 ]`: doc_state_count.textContent = `Document count: [ ${items_array.length } ]`;

    } catch (e) {
        console.log(e.message);
    }
}
// delete documents
(async function() {
    document.addEventListener('click', (event) => {
        try {
            let clicked_element = event.target,
                keys = Object.keys(localStorage);

            for (let key of keys) {
                if (key == clicked_element.title) {
                    // update image elemnet 
                    ((localStorage.length - 1) == 0) ? doc_state_count.textContent = `Nothing to show: [ 0 ]`: doc_state_count.textContent = `Document count: [ ${localStorage.length - 1} ]`

                    localStorage.removeItem(key)
                    clicked_element.remove()
                }
            }
        } catch (e) {
            console.log(e.message)
        }
    });
})();