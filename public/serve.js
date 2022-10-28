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
        myLable.style.cssText = 'color: #66FF00;'


        for (let i = 0; i < files.length; i++) {
            const { type, name } = files[i];

            const keys = Object.keys(localStorage)
            for (let key of keys) {
                if (key === name) {
                    myLable.innerHTML = 'One or more duplicate files detected!'
                    myLable.style.cssText = 'color: red;'
                    event.stopPropagation
                    event.target.value = '';
                    setTimeout(() => {
                        myLable.style.cssText = 'color: inherit;'
                        myLable.innerHTML = 'Please try again'
                    }, 2000)
                    return;
                }
            }

            if (!type.match("image")) continue;

            const picReader = new FileReader();
            picReader.addEventListener('load', (e) => {
                const { result } = e.target;

                (result && name != undefined) && localStorage.setItem(`${name}`, `${result}`);

                const IMG = new Image();
                IMG.src = `${result}`
                IMG.classList = 'rounded  float-start'
                IMG.title = `${name}`
                IMG.alt = '...'
                IMG.width = 200
                IMG.height = 200

                submitButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(IMG)
                    imageContainer.appendChild(IMG);
                })
            })
            picReader.readAsDataURL(files[i]);
        }
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
    submitButton.addEventListener('click', doUpload, false);
}

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
}

async function uploadFile(f) {
    console.log(`Starting with ${f.name}`);
    let form = new FormData();

    form.append('images', f);
    let resp = await fetch('/multiple/files', { method: 'POST', body: form });
    let data = await resp.json();
    console.log(`Done with ${f.name}`);
    return data;
}

imageInput.addEventListener('focus', (e) => {
        if (e.type == 'focus') return submitButton.removeAttribute('disabled');
    })
    // document.addEventListener('DOMContentLoaded', load_available_docs)
window.addEventListener('load', load_available_docs, false);
async function load_available_docs() {
    try {
        const keys = Object.keys(localStorage)
        for (let key of keys) {
            let doc_value = localStorage.getItem(key);

            const IMG = new Image();
            IMG.src = `${doc_value}`
            IMG.classList = 'rounded  float-start'
            IMG.title = `${key}`
            IMG.alt = '...'

            imageContainer.appendChild(IMG);
        }

    } catch (e) {
        console.log(e.message)
    }
}

function initUpdator() {
    try {
        let total_doc_count = localStorage.length;
        myLable.innerHTML = `Total document count: [ ${total_doc_count} ]`

    } catch (e) {
        console.log(e.message)
        myLable.innerHTML = `Error: ${e.message}`
    }
}
initUpdator()