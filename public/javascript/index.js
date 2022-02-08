/* eslint-disable @typescript-eslint/no-unused-vars */

function toggleMenu() {
  document.querySelector('.navbar').classList.toggle('navbar--toggled');
}

function selectCorouselImage(imageTag, imageIndex, containerID, width, height) {
  const mainImage = document.querySelector(`#${containerID} > img`);
  mainImage.srcset = imageTag.srcset;
  mainImage.img = imageTag.img;
  mainImage.alt = imageTag.alt;
  mainImage.setAttribute('data-image-width', Number.parseInt(width, 10) * 4);
  mainImage.setAttribute('data-image-height', Number.parseInt(height, 10) * 4);
}

function maximizeImage(imageTag) {
  const maximizedImageContainer = document.querySelector(
    '.maximized-image-container',
  );
  const image = maximizedImageContainer.querySelector('img');
  image.srcset = imageTag.srcset;
  image.img = imageTag.img;
  image.alt = imageTag.alt;
  image.setAttribute(
    'data-image-width',
    imageTag.getAttribute('data-image-width'),
  );
  image.setAttribute(
    'data-image-height',
    imageTag.getAttribute('data-image-height'),
  );
  maximizedImageContainer.style.display = 'flex';
}

function closeMaximizedImage() {
  const maximizedImageContainer = document.querySelector(
    '.maximized-image-container',
  );
  maximizedImageContainer.style.display = 'none';
  resetZoom(maximizedImageContainer.querySelector('img'));
}

function resetZoom(maximizedImageTag) {
  maximizedImageTag.style.maxWidth = '100%';
  maximizedImageTag.style.maxHeight = '100%';
  maximizedImageTag.style.width = null;
  maximizedImageTag.style.height = null;
}

function toggleZoom(maximizedImageTag) {
  if (
    maximizedImageTag.style.maxWidth === '100%' ||
    !maximizedImageTag.style.maxWidth
  ) {
    maximizedImageTag.style.maxWidth = 'none';
    maximizedImageTag.style.maxHeight = 'none';
    maximizedImageTag.style.width = `${maximizedImageTag.getAttribute(
      'data-image-width',
    )}px`;
    maximizedImageTag.style.height = `${maximizedImageTag.getAttribute(
      'data-image-height',
    )}px`;
  } else {
    resetZoom(maximizedImageTag);
  }
}
