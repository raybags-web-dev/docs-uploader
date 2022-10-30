'use strict'

const submitButton = document.getElementById('submit_button')
const imageContainer = document.getElementById('image_container');
const imageInput = document.getElementById('file_inputt');
const myLable = document.getElementById('myLable')
const loader_spin = document.querySelector('.loader')

imageInput.addEventListener('change', async(event) => {
    try {
        event.preventDefault();
        if (!window.File && !window.FileReader && !window.FileList && !window.Blob) return alert('Sorry - Browser does not support File API');

        const files = await event.target.files;
        myLable.innerHTML = `${files.length} : selected`
        myLable.style.cssText = 'color: #66FF00 !important;'

        for (let i = 0; i < files.length; i++) {
            const { type, name } = files[i];
            if (!type.match("image")) continue;
        }
        submitButton.addEventListener('click', (e) => e.preventDefault())
    } catch (e) {
        console.warn(e.message)
        myLable.innerHTML = `Error: ${e.message}`
    }
})


// send files to server
document.addEventListener('DOMContentLoaded', init, false);

async function init() {
    loader_spin.classList.add('hide_element');
    submitButton.setAttribute('disabled', 'true');
};

submitButton.addEventListener('click', doUpload, false);

async function doUpload(e) {
    e.preventDefault();
    myLable.innerHTML = '';

    let totalFilesToUpload = imageInput.files.length;

    //nothing was selected 
    if (totalFilesToUpload === 0) {
        myLable.innerHTML = 'Please select one or more files.';
        myLable.style.cssText = 'color: red'
        setTimeout(() => myLable.style.cssText = 'color: inherit', 2000)
        return;
    }

    myLable.innerHTML = `Uploading ${totalFilesToUpload} files.`;

    let uploads = [];
    for (let i = 0; i < totalFilesToUpload; i++) {
        uploads.push(uploadFile(imageInput.files[i]));
    }


    await Promise.all(uploads);

    myLable.innerHTML = 'All complete.';
    imageInput.value = '';

    setTimeout(() => myLable.style.cssText = 'color: inherit', 2000)

    submitButton.childNodes[2].nodeValue = '';
    loader_spin.classList.remove('hide_element');

    setTimeout(() => {
            submitButton.childNodes[2].nodeValue = 'Upload';
            loader_spin.classList.add('hide_element')
        }, 2000)
        // fetch all docs in database
    await load_available_docs();
}

async function uploadFile(f) {
    console.log(`Saving: ${f.name}`);
    let form = new FormData();

    form.append('images', f);
    let resp = await fetch('/multiple/files', { method: 'POST', body: form });
    let data = await resp.json();
    console.log(`Done: ${f.name}`);
    return data;
}



window.addEventListener('load', load_available_docs, false);
async function load_available_docs() {
    try {
        // empty container
        imageContainer.innerHTML = "";

        let response = await fetch('/get-all/docs');
        let data = await response.json();

        let { length } = await data;
        if (length == 0) return;


        for (let obj of data) {
            if (!obj || obj.filename == undefined) return;
            const { filename } = await obj

            const IMG = new Image();
            IMG.src = `./local_storage/${filename}`
            IMG.classList = 'rounded  float-start'
            IMG.title = `${filename}`
            IMG.alt = '...'

            imageContainer.appendChild(IMG);
        }
        myLable.innerHTML = `Total document count: [ ${length} ]`

    } catch (e) {
        console.log(e.message)
        myLable.innerHTML = `Error: ${e.message}`
    }
}

// activate submit button
imageInput.addEventListener('focus', (e) => {
    if (e.type == 'focus') return submitButton.removeAttribute('disabled');
});