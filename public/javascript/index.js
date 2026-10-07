/* eslint-disable @typescript-eslint/no-unused-vars */

function toggleMenu() {
  document.querySelector('.navbar').classList.toggle('navbar--toggled');
}

function setPictureSizes(image, sizes) {
  image.sizes = sizes;
  const source = image.closest('picture').querySelector('source');
  if (source) source.sizes = sizes;
}

function showArtwork(target, selected, enlarged = false) {
  const picture = target.closest('picture');
  Object.assign(target.dataset, selected.dataset);
  target.alt = selected.alt;
  target.width = Number(selected.dataset.imageWidth);
  target.height = Number(selected.dataset.imageHeight);
  picture.style.setProperty('--image-ratio', selected.dataset.imageRatio);
  setPictureSizes(
    target,
    enlarged ? target.dataset.overlaySizes : target.dataset.displaySizes,
  );
  const source = picture.querySelector('source');
  if (source) source.srcset = target.dataset.displayWebpSrcset;
  target.srcset = target.dataset.displayJpegSrcset;
  target.src = target.dataset.displaySrc;
}

function selectCarouselImage(imageTag) {
  const mainImage = document.querySelector('#index-carousel > picture > img');
  showArtwork(mainImage, imageTag);
}

function maximizeImage(imageTag) {
  const container = document.querySelector('.maximized-image-container');
  const image = container.querySelector('img');
  // Reset before replacing sources so reopening cannot request the previous
  // artwork at a different resolution.
  image.style.cssText = '';
  image.closest('picture').style.width = '';
  showArtwork(image, imageTag, true);
  container.style.display = 'flex';
}

function closeMaximizedImage() {
  const container = document.querySelector('.maximized-image-container');
  container.style.display = 'none';
}

function resetZoom(image) {
  image.style.cssText = '';
  image.closest('picture').style.width = '';
  setPictureSizes(image, image.dataset.overlaySizes);
}

function toggleZoom(image) {
  if (image.style.width) {
    resetZoom(image);
    return;
  }
  const width = `${image.dataset.imageWidth}px`;
  image.closest('picture').style.width = width;
  image.style.maxWidth = 'none';
  image.style.maxHeight = 'none';
  image.style.width = width;
  image.style.height = `${image.dataset.imageHeight}px`;
  setPictureSizes(image, width);
}

// Price copy can make commission cards taller than their CSS minimum. Match
// the source resolution to the real crop, including after font/viewport changes.
if (typeof ResizeObserver !== 'undefined') {
  const observer = new ResizeObserver((entries) => {
    for (const { target, contentRect } of entries) {
      const image = target.querySelector('img');
      const ratio =
        Number(image.getAttribute('width')) /
        Number(image.getAttribute('height'));
      const width = Math.max(contentRect.width, contentRect.height * ratio);
      setPictureSizes(image, `${Math.ceil(width)}px`);
    }
  });
  document.querySelectorAll('.commission-section__left').forEach((picture) => {
    observer.observe(picture);
  });
}
