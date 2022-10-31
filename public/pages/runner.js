const IMG_container = document.getElementById('image_container');
const doc_state_count = document.getElementById('status_');

// avail localy available documents
(async() => {
    let response = await fetch('/get-all/docs');
    let data = await response.json();

    for (let obj of data) {
        if (!obj || obj.filename == undefined) return;
        const { filename } = await obj

        const IMG = new Image();
        IMG.src = `../local_storage/${filename}`
        IMG.classList = 'rounded  float-start'
        IMG.title = `${filename}`
        IMG.alt = '...'

        IMG_container.appendChild(IMG);
        doc_state_count.innerHTML = `Total count: ${data.length}`
    }

})()
// delete documents
document.addEventListener('click', async(event) => {
    try {

        let clicked_element = event.target;
        if (clicked_element.classList.contains('rounded')) {
            let element_title = clicked_element.title

            let response = await fetch('/get-all/docs');
            let data = await response.json();

            doc_state_count.innerHTML = `Total count: ${data.length - 1}`

            for (let obj of data) {
                const { filename } = await obj
                if (element_title === filename) {
                    await fetch(`/delete/${element_title}`, { method: 'DELETE' });

                    // clicked_element.classList.add('smooth_ele');
                    setTimeout(async() => await clicked_element.remove(), 600)
                }
            }
        }
    } catch (e) {
        console.log(e.message)
    }
});