
    const filters = document.querySelectorAll('.filter');
    const works = document.querySelectorAll('.work');
    filters.forEach(button => button.addEventListener('click', () => {
      filters.forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      const category = button.dataset.filter;
      works.forEach(work => {
        work.hidden = category !== 'all' && work.dataset.category !== category;
      });
    }));
    const menuButton = document.getElementById('menuButton');
    const navLinks = document.getElementById('navLinks');
    menuButton.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));

const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const submitButton = contactForm.querySelector('.submit-button');

// Przy każdym wejściu lub przywróceniu strony
// wyczyść poprzedni komunikat.
function resetFormStatus() {
  formMessage.textContent = '';
  formMessage.style.color = '';
  submitButton.disabled = false;
  submitButton.innerHTML = 'WYŚLIJ WIADOMOŚĆ <span>↗</span>';
}

window.addEventListener('pageshow', resetFormStatus);
resetFormStatus();

contactForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  if (!contactForm.reportValidity()) return;

  submitButton.disabled = true;
  submitButton.textContent = 'WYSYŁANIE...';

  formMessage.textContent = 'Wysyłanie wiadomości...';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(
        Object.fromEntries(new FormData(contactForm).entries())
      )
    });

    const result = await response.json();

    if (
      response.ok &&
      (result.success === true || result.success === 'true')
    ) {
      formMessage.textContent =
        '✓ Dziękujemy! Wiadomość została wysłana.';

      formMessage.style.color = '#276b38';

      contactForm.reset();

    } else {
      formMessage.textContent =
        'Nie udało się wysłać: ' +
        (result.message || 'Sprawdź konfigurację formularza.');

      formMessage.style.color = '#a32626';
    }

  } catch (error) {
    formMessage.textContent =
      'Błąd połączenia. Sprawdź internet i spróbuj ponownie.';

    formMessage.style.color = '#a32626';

    console.error('FormSubmit error:', error);

  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'WYŚLIJ WIADOMOŚĆ <span>↗</span>';
  }
});
