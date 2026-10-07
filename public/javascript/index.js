(() => {
  'use strict';
  document.documentElement.classList.add('js');

  const navigation = document.querySelector('.navbar');
  const menuButton = document.querySelector('.navbar__toggle');
  const setMenu = (open) => {
    navigation.classList.toggle('navbar--open', open);
    menuButton.setAttribute('aria-expanded', String(open));
  };
  menuButton?.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      menuButton?.getAttribute('aria-expanded') === 'true'
    ) {
      setMenu(false);
      menuButton.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (navigation && !navigation.contains(event.target)) setMenu(false);
  });
  navigation?.querySelectorAll('.navbar__links a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });
  window
    .matchMedia('(min-width: 960px)')
    .addEventListener('change', () => setMenu(false));

  const dialog = document.querySelector('.artwork-dialog');
  let artworkTrigger;
  if (dialog && typeof dialog.showModal === 'function') {
    document.querySelectorAll('[data-artwork]').forEach((link) => {
      link.addEventListener('click', (event) => {
        // Retain ordinary image links for new-tab and modified clicks.
        if (
          event.button !== 0 ||
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        const selected = link.querySelector('img');
        const image = dialog.querySelector('img');
        const source = dialog.querySelector('source');
        image.alt = selected.alt;
        image.width = Number(selected.dataset.imageWidth);
        image.height = Number(selected.dataset.imageHeight);
        image.sizes = selected.dataset.overlaySizes;
        source.sizes = image.sizes;
        source.srcset = selected.dataset.displayWebpSrcset;
        image.srcset = selected.dataset.displayJpegSrcset;
        image.src = selected.dataset.displaySrc;
        dialog.querySelector('.artwork-dialog__caption').textContent =
          selected.alt;
        artworkTrigger = link;
        dialog.showModal();
        document.documentElement.classList.add('artwork-open');
      });
    });
    dialog
      .querySelector('.artwork-dialog__close')
      .addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      )
        dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.documentElement.classList.remove('artwork-open');
      artworkTrigger?.focus({ preventScroll: true });
    });
  }

  const form = document.querySelector('.contact-form');
  if (!form) return;
  const sitekey = form.dataset.sitekey;
  const submitButton = form.querySelector('[type="submit"]');
  const initialLabel = submitButton.textContent;
  const errorMessage = form.querySelector('[data-form-error]');
  let captchaPromise;
  let submitting = false;

  const withTimeout = (promise, duration) =>
    new Promise((resolve, reject) => {
      const timer = window.setTimeout(
        () => reject(new Error('Verification timed out')),
        duration,
      );
      promise.then(
        (result) => {
          clearTimeout(timer);
          resolve(result);
        },
        (error) => {
          clearTimeout(timer);
          reject(error);
        },
      );
    });

  const loadCaptcha = () => {
    if (!sitekey) return Promise.reject(new Error('Verification unavailable'));
    if (window.grecaptcha?.execute) return Promise.resolve(window.grecaptcha);
    if (captchaPromise) return captchaPromise;
    captchaPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const fail = () => {
        clearTimeout(timer);
        script.remove();
        reject(new Error('Verification unavailable'));
      };
      const timer = window.setTimeout(fail, 12000);
      script.src =
        'https://www.google.com/recaptcha/api.js?render=' +
        encodeURIComponent(sitekey);
      script.async = true;
      script.onerror = fail;
      script.onload = () => {
        if (!window.grecaptcha?.ready) {
          fail();
          return;
        }
        window.grecaptcha.ready(() => {
          clearTimeout(timer);
          resolve(window.grecaptcha);
        });
      };
      document.head.appendChild(script);
    }).catch((error) => {
      captchaPromise = undefined;
      throw error;
    });
    return captchaPromise;
  };

  form.addEventListener(
    'focusin',
    () => {
      loadCaptcha().catch(() => {});
    },
    { once: true },
  );

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting || !form.reportValidity()) return;
    submitting = true;
    submitButton.disabled = true;
    submitButton.textContent = form.dataset.submitting;
    form.setAttribute('aria-busy', 'true');
    errorMessage.hidden = true;
    try {
      const captcha = await loadCaptcha();
      await withTimeout(
        new Promise((resolve) => captcha.ready(resolve)),
        12000,
      );
      const token = await withTimeout(
        captcha.execute(sitekey, { action: 'contact' }),
        12000,
      );
      if (typeof token !== 'string' || !token)
        throw new Error('Verification unavailable');
      form.querySelector('[name="token"]').value = token;
      HTMLFormElement.prototype.submit.call(form);
    } catch {
      submitting = false;
      submitButton.disabled = false;
      submitButton.textContent = initialLabel;
      form.removeAttribute('aria-busy');
      errorMessage.textContent = form.dataset.verificationError;
      errorMessage.hidden = false;
    }
  });
})();
