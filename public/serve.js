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
            for (let i = 0; i < files.length; i++) {
                if (!files[i].type.match("image")) continue;
                const picReader = new FileReader();
                picReader.addEventListener('load', (e) => {
                    const my_pic_file = e.target;

                    const IMG = new Image();
                    IMG.src = `${my_pic_file.result}`
                    IMG.classList = 'rounded  float-start'
                    IMG.title = `${my_pic_file.name}`
                    IMG.alt = '...'

                    submitButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        imageContainer.appendChild(IMG);
                    })
                })
                picReader.readAsDataURL(files[i]);
            }
        } catch (e) {
            console.log(e.message)
        }
    })
    // send files to server

document.addEventListener('DOMContentLoaded', init, false);

async function init() {
    loader_spin.classList.add('hide_element')
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