(function(){

const imageElement = document.getElementById('image');
const imageErrorElement = document.getElementById('imageError');
const loadingElement = document.getElementById('loading');
const scriptElement = document.getElementById('script');

const indexLabel = document.getElementById('indexLabel');

const runButton = document.getElementById('runButton');
const previousButton = document.getElementById('previousButton');
const nextButton = document.getElementById('nextButton');
const saveButton = document.getElementById('saveButton');
const clearButton = document.getElementById('clearButton');

const DEFAULT_CODE = '(index) => {\n\treturn \'https://mini-google-cs.herokuapp.com/sites/scriptable-gallery/example/image\'+index+\'.png\';\n}';

let index = 0;
let call = null;
scriptElement.value = DEFAULT_CODE;

loadData();

buildScript();

function updateImage() {
    const url = call(index);
    imageElement.src = url;
    indexLabel.textContent = index;
    showLoading();
}

function loadData() {

    const sTemp = localStorage['ScriptableGallery_script'];
    const iTemp = localStorage['ScriptableGallery_index'];

    if (sTemp && iTemp) {
        index = new Number(iTemp);
        scriptElement.value = sTemp;
    }
}

function buildScript(){
    try {
        const font = scriptElement.value;

        call = eval(font);

        if (typeof (call) != 'function') {
            alert('Você deve implementar uma função!');
        }

        updateImage();
    }
    catch (e) {
        alert('Erro de sintaxe!');
    }
}

function clearData(){
    delete localStorage['ScriptableGallery_script'];
    delete localStorage['ScriptableGallery_index'];
}

function saveData() {
    localStorage['ScriptableGallery_script'] = scriptElement.value;
    localStorage['ScriptableGallery_index'] = index;
}

function showImageError(){
    imageElement.style.display = 'none';
    imageErrorElement.style.display = 'block';
}

function clearImageError(){
    imageElement.style.display = '';
    imageErrorElement.style.display = 'none';
}

function showLoading(){
    imageElement.style.display = 'none';
    imageErrorElement.style.display = 'none';
    loadingElement.style.display = 'block';
}

function clearLoading(){
    loadingElement.style.display = 'none';
}

function nextImage(){
    index++;
    updateImage();
}

function previousImage(){
    index--;

    if(index < 0)
        index = 0;

    updateImage();
}

scriptElement.onkeydown = (e) => {
    if(e.key == 'Tab'){
        e.preventDefault();
        const start = scriptElement.selectionStart;
        const end = scriptElement.selectionEnd;
        const value = scriptElement.value;
        scriptElement.value = value.substr(0, start) + '\t' + value.substr(end);
        scriptElement.selectionStart = scriptElement.selectionEnd = end + 1;
    }
}

saveButton.onclick = () => {
    saveData();
}

clearButton.onclick = () => {
    clearData();
}

runButton.onclick = async () => {
    buildScript();
}

nextButton.onclick = () => {
    nextImage();
}

previousButton.onclick = () => {
    previousImage();
}

nextButton.onkeydown = previousButton.onkeydown = (e) => {
    switch(e.key){
        case 'ArrowRight':
            nextImage();
            e.preventDefault();
            break;

        case 'ArrowLeft':
            previousImage();
            e.preventDefault();
            break;
    }
}

imageElement.onerror = (err) => {
    showImageError();
    clearLoading();
}

imageElement.onload = () => {
    clearImageError();
    clearLoading();
}

}());