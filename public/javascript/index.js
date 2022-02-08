/* eslint-disable @typescript-eslint/no-unused-vars */

function toggleMenu() {
  document.querySelector('.navbar').classList.toggle('navbar--toggled');
}

function selectCorouselImage(imageTag, imageIndex, containerID) {
  const mainImage = document.querySelector(`#${containerID} > img`);
  mainImage.srcset = imageTag.srcset;
  mainImage.img = imageTag.img;
  mainImage.alt = imageTag.alt;
}

function maximizeImage(imageTag) {
  const maximizedImageContainer = document.querySelector(
    '.maximized-image-container',
  );
  const image = maximizedImageContainer.querySelector('img');
  image.srcset = imageTag.srcset;
  image.img = imageTag.img;
  image.alt = imageTag.alt;
  maximizedImageContainer.style.display = 'block';
}

function closeMaximizedImage() {
  const maximizedImageContainer = document.querySelector(
    '.maximized-image-container',
  );
  maximizedImageContainer.style.display = 'none';
}
