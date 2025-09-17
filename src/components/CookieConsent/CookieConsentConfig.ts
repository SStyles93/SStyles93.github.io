import type { CookieConsentConfig } from 'vanilla-cookieconsent';

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    gtag: (...args: any[]) => void;
  }
}

export const config: CookieConsentConfig = {
    root: "#cc-container",
  guiOptions: {
    consentModal: {
      layout: 'box inline',
      position: 'bottom left',
    },
    preferencesModal: {
      layout: 'box',
      position: 'right',
      equalWeightButtons: true,
      flipButtons: false,
    },
  },
  categories: {
    necessary: {
      readOnly: true,
      enabled: true,
    },
    functionality: {
        enabled: true,
    },
    analytics: {
         enabled: true,
      services: {
        ga4: {
          label: "Google Analytics (GA4)",
          onAccept: () => {
            // Grant consent to the Google Analytics service
            console.log("ga4 granted");

            window.gtag('consent', 'update', {
              ad_storage: 'granted',
              ad_user_data: 'granted',
              ad_personalization: 'granted',
              analytics_storage: 'granted',
            });
          },
          onReject: () => {
            // Google Analytics rejected
            console.log("Google Analytics consent denied.");
          },
          cookies: [
            {
              name: /^_ga/,
            },
            {
              name: /^_gid/,
            },
            {
              name: /^_gat/,
            }
          ],
        },
      },
    },
  },
  language: {
    default: 'en',
    autoDetect: 'browser',
    translations: {
      en: {
        consentModal: {
          title: "This website uses cookies",
          description:
            'We use cookies to enhance your browsing experience and analyze site traffic. By clicking "Accept all", you consent to our use of cookies as described in our policy.',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          showPreferencesBtn: 'Manage preferences',
          // Using direct links to Google's policies
          footer: 
          '<a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacy Policy</a>\n<a href="https://policies.google.com/terms" target="_blank" rel="noopener">Terms of Service</a>',
        },
        preferencesModal: {
          title: 'Consent Preferences Center',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          savePreferencesBtn: 'Save preferences',
          closeIconLabel: 'Close modal',
          serviceCounterLabel: 'Service|Services',
          sections: [
            {
              title: 'Cookie Usage',
              description:
                'We use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details, please read the full <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">privacy policy</a>.',
            },
            {
              title: 'Strictly Necessary Cookies <span class="pm__badge">Always Enabled</span>',
              description:
                'These cookies are essential for the proper functioning of our website. Without these cookies, the website would not work properly. They are used to perform basic functions like page navigation and access to secure areas of the website.',
              linkedCategory: 'necessary',
            },
            {
              title: 'Functionality Cookies',
              description:
                'These cookies allow the website to remember choices you have made in the past, like what language you prefer or what your user name and password are so you can automatically log in.',
              linkedCategory: 'functionality',
            },
            {
              title: 'Analytics Cookies',
              description:
                'These cookies collect information about how you use our website, such as which pages you visited and which links you clicked on. This data is aggregated and anonymized. Their sole purpose is to improve website functions by analyzing site traffic via Google Analytics.',
              linkedCategory: 'analytics',
            },
            {
              title: 'More information',
              description:
                'For any questions in relation to our policy on cookies and your choices, please <a href="mailto:samuel.styles93@gmail.com">contact us</a>.',
            },
          ],
        },
      },
    },
  },
};
