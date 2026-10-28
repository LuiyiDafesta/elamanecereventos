/**
 * El Amanecer Eventos - Main JavaScript
 * Handles navigation, mobile drawer, modal, and contact form
 */

document.addEventListener('DOMContentLoaded', () => {
  // Configuration: Easy to change WhatsApp number and details
  const CONFIG = {
    whatsappNumber: '5491171003333',
    whatsappDefaultMessage: '¡Hola! Me gustaría coordinar una visita para conocer la Quinta El Amanecer.',
  };

  /* ---------------- 1. STICKY / SCROLLED HEADER ---------------- */
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ---------------- 2. MOBILE MENU DRAWER ---------------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    mobileToggle.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    mobileToggle.setAttribute('aria-expanded', 'false');
  };

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  /* ---------------- 3. MODAL POPUP: COORDINAR VISITA ---------------- */
  const contactModal = document.getElementById('contactModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');

  const openModal = (e) => {
    if (e) e.preventDefault();
    closeDrawer();
    contactModal.classList.add('active');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    contactModal.classList.remove('active');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  // Close modal when clicking outside dialog
  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
      closeModal();
    }
  });

  // ESC key closes modal & drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeDrawer();
    }
  });

  /* ---------------- 4. CONTACT FORM SUBMISSION ---------------- */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const submitOriginalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>ENVIANDO...</span>';
      formFeedback.style.display = 'none';
      formFeedback.className = 'form-feedback';

      try {
        const response = await fetch('contacto.php', {
          method: 'POST',
          body: formData
        });

        const result = await response.json().catch(() => null);

        if (response.ok && result && result.status === 'success') {
          formFeedback.textContent = result.message || '¡Gracias! Nos pondremos en contacto a la brevedad para coordinar la visita.';
          formFeedback.classList.add('success');
          formFeedback.style.display = 'block';
          contactForm.reset();

          // After 3 seconds, offer direct whatsapp redirection
          setTimeout(() => {
            closeModal();
          }, 3500);
        } else {
          // If server fails or PHP is not configured yet on localhost, fallback friendly
          const nombre = formData.get('nombre') || '';
          const tipo = formData.get('tipo_evento') || 'Evento';
          const fecha = formData.get('fecha') || '';
          const msg = encodeURIComponent(`¡Hola! Mi nombre es ${nombre}. Quisiera consultar disponibilidad y coordinar una visita para ${tipo} (fecha aprox: ${fecha}).`);

          formFeedback.innerHTML = `Mensaje preparado. <a href="https://wa.me/${CONFIG.whatsappNumber}?text=${msg}" target="_blank" style="text-decoration: underline; font-weight: bold; color: inherit;">Hacé clic acá para enviar tu consulta por WhatsApp</a>`;
          formFeedback.classList.add('success');
          formFeedback.style.display = 'block';
        }
      } catch (err) {
        // Fallback for static hosting without PHP
        const nombre = formData.get('nombre') || '';
        const tipo = formData.get('tipo_evento') || 'Evento';
        const fecha = formData.get('fecha') || '';
        const msg = encodeURIComponent(`¡Hola! Mi nombre es ${nombre}. Quisiera consultar disponibilidad y coordinar una visita para ${tipo} (fecha aprox: ${fecha}).`);

        formFeedback.innerHTML = `¡Solicitud lista! <a href="https://wa.me/${CONFIG.whatsappNumber}?text=${msg}" target="_blank" style="text-decoration: underline; font-weight: bold; color: inherit;">Hacé clic acá para enviarla directo a nuestro WhatsApp</a>`;
        formFeedback.classList.add('success');
        formFeedback.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitOriginalText;
      }
    });
  }

  /* ---------------- 5. SCROLL SPY ACTIVE NAV LINK ---------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
});
