const popup = document.getElementById('popup');
const pinName = document.getElementById('pinName');
const pinImage = document.getElementById('pinImage');

let images = [];
let currentIndex = 0;

function attachPopupEvents(pin) {
  pin.addEventListener('click', (event) => {
    event.stopPropagation();
    const pinRect = pin.getBoundingClientRect();
    popup.style.left = pinRect.left + 'px';
    popup.style.top = pinRect.top + 'px';
    popup.style.display = 'flex';

    pinName.textContent = pin.dataset.name;
    images = pin.dataset.images.split(',');
    currentIndex = 0;
    pinImage.src = images[currentIndex];
  });
}

function nextImage() {
  if (images.length > 0) {
    currentIndex = (currentIndex + 1) % images.length;
    pinImage.src = images[currentIndex];
  }
}

function prevImage() {
  if (images.length > 0) {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    pinImage.src = images[currentIndex];
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.map-pin').forEach(pin => {
    attachPopupEvents(pin);
  });
});

document.addEventListener('click', () => {
  popup.style.display = 'none';
});

popup.addEventListener('click', (e) => {
  e.stopPropagation();
});

function highlightPin(type) {
  document.querySelectorAll('.map-pin').forEach(pin => {
    pin.classList.remove('highlighted');
  });
  const pin = Array.from(document.querySelectorAll('.map-pin'))
    .find(p => p.dataset.name?.toLowerCase().includes(type.toLowerCase()));
  if (pin) {
    pin.classList.add('highlighted');
    setTimeout(() => pin.classList.remove('highlighted'), 2000);
  } else {
    alert(type + ' is not placed on the map.');
  }
}

const mapInner = document.getElementById('mapInner');
let scale = 0.5;
let pos = { x: 0, y: 0 };
let isDragging = false;
let dragStart = { x: 0, y: 0 };

function updateTransform() {
  mapInner.style.transform = `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) scale(${scale})`;
}

document.querySelector('.map-viewport').addEventListener('wheel', (e) => {
  e.preventDefault();
  const zoomAmount = 0.1;
  const direction = e.deltaY > 0 ? -1 : 1;
  scale = Math.min(Math.max(scale + direction * zoomAmount, 0.5), 3);
  updateTransform();
});

mapInner.addEventListener('mousedown', (e) => {
  isDragging = true;
  dragStart.x = e.clientX - pos.x;
  dragStart.y = e.clientY - pos.y;
  mapInner.classList.add('grabbing');
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  mapInner.classList.remove('grabbing');
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    pos.x = e.clientX - dragStart.x;
    pos.y = e.clientY - dragStart.y;
    updateTransform();
  }
});
