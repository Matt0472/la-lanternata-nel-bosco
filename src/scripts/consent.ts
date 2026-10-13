// Cookie consent (vanilla-cookieconsent, self-hosted: no external call). Two
// categories: "necessary" (always on: only the cookie that remembers this
// choice) and "tickets" (the TicketingHub widget, which loads Google
// Analytics, Google Fonts, IP geolocation and Bugsnag).
//
// The prior blocking lives in Tickets.astro: the TicketingHub script does not
// start on load but only once this category is accepted. The handover uses the
// window.__ticketsConsent flag (for whoever comes later) and the
// "tickets-consent" event (for whoever is already listening). The banner texts
// are interface microcopy tied to this logic (CMS-02).
import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';

const notifyTickets = () => {
  if (!CookieConsent.acceptedCategory('tickets')) return;
  window.__ticketsConsent = true;
  window.dispatchEvent(new CustomEvent('tickets-consent'));
};

// Used by the page buttons (footer, cookie policy, ticket box)
window.showCookiePreferences = () => CookieConsent.showPreferences();
window.enableTickets = () => {
  CookieConsent.acceptCategory(['necessary', 'tickets']);
  CookieConsent.hide(); // consent from the contextual box closes the banner too
};

CookieConsent.run({
  categories: {
    necessary: { enabled: true, readOnly: true },
    tickets: {
      // On withdrawal: remove the cookies GA set on our domain and reload — a
      // script already run cannot be "unloaded", only a clean load restores the
      // prior blocking (and the contextual box).
      autoClear: {
        cookies: [{ name: /^(_ga|_gid|_gat|th_)/ }],
        reloadPage: true,
      },
    },
  },

  guiOptions: {
    consentModal: { layout: 'box', position: 'bottom left', equalWeightButtons: true },
    preferencesModal: { layout: 'box', equalWeightButtons: true },
  },

  onConsent: notifyTickets,
  onChange: ({ changedCategories }) => {
    // Belt and braces beyond autoClear: if the tickets category was just
    // withdrawn, clean up and reload even when there was no cookie to delete
    // (e.g. GA blocked by an ad blocker).
    if (changedCategories.includes('tickets') && !CookieConsent.acceptedCategory('tickets')) {
      try {
        localStorage.removeItem('bugsnag-anonymous-id');
      } catch {
        /* storage not accessible: nothing to clean */
      }
      window.location.reload();
      return;
    }
    notifyTickets();
  },

  language: {
    default: 'it',
    translations: {
      it: {
        consentModal: {
          title: 'Cookie alla Lanternata',
          description:
            'Questo sito usa solo cookie tecnici. La biglietteria online, fornita da TicketingHub, usa invece cookie di terze parti (statistiche Google): si attiva solo se accetti.',
          acceptAllBtn: 'Accetta tutti',
          acceptNecessaryBtn: 'Solo necessari',
          showPreferencesBtn: 'Preferenze',
          footer: '<a href="/privacy/">Privacy policy</a> <a href="/cookie/">Cookie policy</a>',
        },
        preferencesModal: {
          title: 'Preferenze cookie',
          acceptAllBtn: 'Accetta tutti',
          acceptNecessaryBtn: 'Solo necessari',
          savePreferencesBtn: 'Salva le preferenze',
          closeIconLabel: 'Chiudi',
          sections: [
            {
              description:
                'Qui puoi decidere quali cookie accettare. Puoi cambiare idea in qualsiasi momento da "Preferenze cookie" in fondo alla pagina. Per i dettagli: <a href="/cookie/">cookie policy</a>.',
            },
            {
              title: 'Necessari',
              description: 'Servono solo a ricordare questa tua scelta. Non tracciano nulla e non escono dal tuo browser.',
              linkedCategory: 'necessary',
            },
            {
              title: 'Biglietteria e statistiche (terze parti)',
              description:
                'Attivano il widget di prenotazione di TicketingHub, che carica servizi di terze parti: Google Analytics (statistiche), Google Fonts, geolocalizzazione IP e Bugsnag (monitoraggio errori). Senza questo consenso la biglietteria online resta spenta: puoi attivarla anche solo quando decidi di prenotare.',
              linkedCategory: 'tickets',
            },
          ],
        },
      },
    },
  },
});
