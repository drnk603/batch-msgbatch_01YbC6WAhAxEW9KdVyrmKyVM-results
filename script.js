(function() {
  'use strict';

  if (window.__app && window.__app.initialized) {
    return;
  }

  window.__app = {
    initialized: true
  };

  const escapeHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  const validateEmail = (email) => {
    return /^[^s@]+@[^s@]+\.[^s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[+]?[0-9]{8,15}$/.test(phone);
  };

  const validateName = (name) => {
    return /^[a-zA-ZÀ-ÿs-']{2,50}$/.test(name);
  };

  const validateYear = (year) => {
    const num = parseInt(year, 10);
    return num >= 1990 && num <= 2025;
  };

  const validateMessage = (message) => {
    return message && message.trim().length >= 10;
  };

  const showNotification = (message, type) => {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.position = 'fixed';
      container.style.top = '20px';
      container.style.right = '20px';
      container.style.zIndex = '9999';
      container.style.maxWidth = '350px';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `alert alert-${type || 'info'} alert-dismissible fade show`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `${escapeHTML(message)}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
    
    container.appendChild(toast);

    const closeBtn = toast.querySelector('.btn-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 150);
      });
    }

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 150);
    }, 5000);
  };

  const initBurgerMenu = () => {
    const toggler = document.querySelector('.navbar-toggler');
    const collapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!toggler || !collapse) {
      return;
    }

    const closeMenu = () => {
      collapse.classList.remove('show');
      toggler.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    const openMenu = () => {
      collapse.classList.add('show');
      toggler.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    toggler.addEventListener('click', (e) => {
      e.preventDefault();
      if (collapse.classList.contains('show')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && collapse.classList.contains('show')) {
        closeMenu();
      }
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth >= 768) {
          closeMenu();
        }
      }, 200);
    });
  };

  const initSmoothScroll = () => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#' || href === '#!') {
          return;
        }

        const targetId = href.substring(1);
        const target = document.getElementById(targetId);

        if (target) {
          e.preventDefault();
          const header = document.querySelector('.navbar');
          const headerHeight = header ? header.offsetHeight : 70;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  };

  const initActiveMenu = () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach((link) => {
      link.removeAttribute('aria-current');
      link.classList.remove('active');

      const linkPath = link.getAttribute('href');
      if (!linkPath) return;

      const normalizedLinkPath = linkPath.replace(/\/$/, '');
      const normalizedCurrentPath = currentPath.replace(/\/$/, '');

      if (
        normalizedLinkPath === normalizedCurrentPath ||
        (normalizedCurrentPath === '' && (normalizedLinkPath === '/index.html' || normalizedLinkPath === '/')) ||
        (normalizedLinkPath === '/index.html' && normalizedCurrentPath === '')
      ) {
        link.setAttribute('aria-current', 'page');
        link.classList.add('active');
      }
    });
  };

  const initFormValidation = () => {
    const forms = document.querySelectorAll('.needs-validation');

    forms.forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();

        let isValid = true;
        const errors = [];

        const firstName = form.querySelector('#firstName');
        if (firstName && firstName.hasAttribute('required')) {
          if (!validateName(firstName.value.trim())) {
            isValid = false;
            firstName.classList.add('is-invalid');
            errors.push('Имя должно содержать от 2 до 50 букв');
          } else {
            firstName.classList.remove('is-invalid');
          }
        }

        const lastName = form.querySelector('#lastName');
        if (lastName && lastName.hasAttribute('required')) {
          if (!validateName(lastName.value.trim())) {
            isValid = false;
            lastName.classList.add('is-invalid');
            errors.push('Фамилия должна содержать от 2 до 50 букв');
          } else {
            lastName.classList.remove('is-invalid');
          }
        }

        const email = form.querySelector('#email, #newsletterEmail');
        if (email && email.hasAttribute('required')) {
          if (!validateEmail(email.value.trim())) {
            isValid = false;
            email.classList.add('is-invalid');
            errors.push('Введите корректный email адрес');
          } else {
            email.classList.remove('is-invalid');
          }
        }

        const phone = form.querySelector('#phone');
        if (phone && phone.hasAttribute('required')) {
          if (!validatePhone(phone.value.trim())) {
            isValid = false;
            phone.classList.add('is-invalid');
            errors.push('Телефон должен содержать от 8 до 15 цифр');
          } else {
            phone.classList.remove('is-invalid');
          }
        }

        const carBrand = form.querySelector('#carBrand');
        if (carBrand && carBrand.hasAttribute('required')) {
          if (carBrand.value.trim().length < 2) {
            isValid = false;
            carBrand.classList.add('is-invalid');
            errors.push('Укажите марку автомобиля');
          } else {
            carBrand.classList.remove('is-invalid');
          }
        }

        const carModel = form.querySelector('#carModel');
        if (carModel && carModel.hasAttribute('required')) {
          if (carModel.value.trim().length < 1) {
            isValid = false;
            carModel.classList.add('is-invalid');
            errors.push('Укажите модель автомобиля');
          } else {
            carModel.classList.remove('is-invalid');
          }
        }

        const carYear = form.querySelector('#carYear');
        if (carYear && carYear.hasAttribute('required')) {
          if (!validateYear(carYear.value)) {
            isValid = false;
            carYear.classList.add('is-invalid');
            errors.push('Год выпуска должен быть от 1990 до 2025');
          } else {
            carYear.classList.remove('is-invalid');
          }
        }

        const insuranceType = form.querySelector('#insuranceType');
        if (insuranceType && insuranceType.hasAttribute('required')) {
          if (!insuranceType.value) {
            isValid = false;
            insuranceType.classList.add('is-invalid');
            errors.push('Выберите тип страхования');
          } else {
            insuranceType.classList.remove('is-invalid');
          }
        }

        const serviceType = form.querySelector('#serviceType');
        if (serviceType && serviceType.hasAttribute('required')) {
          if (!serviceType.value) {
            isValid = false;
            serviceType.classList.add('is-invalid');
            errors.push('Выберите тип услуги');
          } else {
            serviceType.classList.remove('is-invalid');
          }
        }

        const message = form.querySelector('#message');
        if (message && message.hasAttribute('required')) {
          if (!validateMessage(message.value)) {
            isValid = false;
            message.classList.add('is-invalid');
            errors.push('Сообщение должно содержать минимум 10 символов');
          } else {
            message.classList.remove('is-invalid');
          }
        }

        const consent = form.querySelector('#consent');
        if (consent && consent.hasAttribute('required')) {
          if (!consent.checked) {
            isValid = false;
            consent.classList.add('is-invalid');
            errors.push('Необходимо согласие на обработку данных');
          } else {
            consent.classList.remove('is-invalid');
          }
        }

        form.classList.add('was-validated');

        if (!isValid) {
          showNotification(errors[0] || 'Пожалуйста, заполните форму корректно', 'danger');
          return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton ? submitButton.innerHTML : '';

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Отправка...';
        }

        setTimeout(() => {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
          }
          showNotification('Ваше сообщение успешно отправлено!', 'success');
          form.reset();
          form.classList.remove('was-validated');
          
          setTimeout(() => {
            window.location.href = 'thank_you.html';
          }, 1000);
        }, 1500);
      });
    });
  };

  const initAccordion = () => {
    const buttons = document.querySelectorAll('.accordion-button');

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-bs-target');
        if (!targetId) return;

        const target = document.querySelector(targetId);
        if (!target) return;

        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
          button.classList.add('collapsed');
          button.setAttribute('aria-expanded', 'false');
          target.classList.remove('show');
        } else {
          button.classList.remove('collapsed');
          button.setAttribute('aria-expanded', 'true');
          target.classList.add('show');
        }
      });
    });
  };

  const initLazyImages = () => {
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach((img) => {
      if (!img.classList.contains('c-logo__img') && !img.hasAttribute('data-critical')) {
        img.setAttribute('loading', 'lazy');
      }
    });

    const videos = document.querySelectorAll('video:not([loading])');
    videos.forEach((video) => {
      video.setAttribute('loading', 'lazy');
    });
  };

  const initImageFallback = () => {
    const images = document.querySelectorAll('img');
    const placeholderSVG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23e9ecef"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23adb5bd" font-family="sans-serif" font-size="18"%3EИзображение недоступно%3C/text%3E%3C/svg%3E';

    images.forEach((img) => {
      img.addEventListener('error', function() {
        if (!this.hasAttribute('data-fallback-applied')) {
          this.setAttribute('data-fallback-applied', 'true');
          this.src = placeholderSVG;
        }
      });
    });
  };

  const init = () => {
    initBurgerMenu();
    initSmoothScroll();
    initActiveMenu();
    initFormValidation();
    initAccordion();
    initLazyImages();
    initImageFallback();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();