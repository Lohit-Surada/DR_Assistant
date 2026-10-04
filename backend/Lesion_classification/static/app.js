const input = document.querySelector('#image-input');
const dropzone = document.querySelector('#dropzone');
const fileLabel = document.querySelector('#file-label');
const fileHint = document.querySelector('#file-hint');
const previewWrap = document.querySelector('#preview-wrap');
const preview = document.querySelector('#preview');
const form = document.querySelector('#detect-form');
const submitButton = document.querySelector('#submit-button');

function showFile(file) {
  if (!file) return;
  fileLabel.textContent = file.name;
  fileHint.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB selected`;
  dropzone.classList.add('has-file');
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    preview.src = reader.result;
    previewWrap.hidden = false;
  });
  reader.readAsDataURL(file);
}

input.addEventListener('change', () => showFile(input.files[0]));
['dragenter', 'dragover'].forEach((eventName) => dropzone.addEventListener(eventName, (event) => {
  event.preventDefault();
  dropzone.classList.add('dragging');
}));
['dragleave', 'drop'].forEach((eventName) => dropzone.addEventListener(eventName, (event) => {
  event.preventDefault();
  dropzone.classList.remove('dragging');
}));
dropzone.addEventListener('drop', (event) => {
  const [file] = event.dataTransfer.files;
  if (file) {
    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
    showFile(file);
  }
});
form.addEventListener('submit', () => {
  submitButton.disabled = true;
  submitButton.querySelector('span:first-child').textContent = 'Analyzing image...';
});
