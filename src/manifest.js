var config = require('./common/config');

module.exports = (browser, version) => {
  const CHROME = browser === 'chrome';
  const MANIFESTV3 = CHROME;
  const HOST_PERMISSIONS = [
    "https://github.com/*",
    "https://gist.github.com/*",
  ];
  return {
    "key": CHROME
      ? "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhUUr0Z4y8DxD5WIezuYeGW3zDZkvGXST+uviv4jtXwkNVZI5XTUrs/pfYoYsOKdnrxkE47/mI+TiumUj7buB1pC+qeWYjVEshDD5Wum6J44RhXmAo7eb1e3u+IG0BmFvQOO+ENtRxIacZ/M8gexGRIlVWJKuRtcLREc7EkwxtWN58fPrWcYsuXfO3NDEkvrSz7hCCNgeVf/y0MKIz7ZRje8Afb1cRa2PtVAFJ2KUFikzghNFyAY8DVmXXZzrvUDbkeKxA/ja2+5TePhVhKBE+DpFGNUBhb1bEi+pl7ysssxFxjdwiW5/9q58JJeh1Mcu1lnoGIVQTspcd5fbioMNNQIDAQAB"
      : undefined,
    "manifest_version": MANIFESTV3 ? 3 : 2,
    minimum_chrome_version: CHROME ? (
      MANIFESTV3 ? "102" : "34"
    ) : undefined,
    applications: (browser === 'firefox') ? {
      "gecko": {
        "id": config.app.ids.firefox,
        "strict_min_version": "50.0"
      }
    } : undefined,
    "name": "Code Medium",
    version,
    "description": "Extends the Medium writer interface to quickly create and edit Github Gists, without having to leave the editor.",
    "icons": {
      "48": "assets/icon.png",
      "128": "assets/icon.png"
    },
    "author": "Manuel Dell'Elce",
    "short_name": "code-medium",
    "background": {
      ...(MANIFESTV3 ? {
        "service_worker": "background/background.js"
      } : {
        "page": "background/background.html",
        "persistent": (browser === 'firefox')
          ? undefined // firefox only supports persistent and complains when it's set explicitly
          : true,
      }),
    },
    [MANIFESTV3 ? "action" : "browser_action"]: {
      "default_icon": {
        "19": "assets/icon.png",
        "38": "assets/icon.png"
      }
    },
    "content_scripts": [
      {
        "matches": [
          "https://medium.com/**"
        ],
        "js": [
          "content/content.js"
        ],
        "css": [
          "content/content.css"
        ],
        "run_at": "document_idle"
      },
      {
        "matches": [
          "https://medium.com/media/*"
        ],
        "js": [
          "content/content_iframe.js"
        ],
        "all_frames": true,
        "run_at": "document_idle"
      }
    ],
    "web_accessible_resources": [
      ...(MANIFESTV3 ? [
        {
          "resources": ["app/*.*"],
          "matches": ["https://medium.com/*"],
        }
      ] : [
        "app/*.*"
      ])
    ],
    "commands": {
      'medium-create-gist': {
        "suggested_key": {
          "default": "Alt+Shift+0",
        },
        "description": 'Create a Gist in the Medium Editor',
      },
    },

    "permissions": [
      "identity",
      "storage",
      ...(!MANIFESTV3 ? HOST_PERMISSIONS : []),
    ],
    ...(MANIFESTV3 ? {
      "host_permissions": HOST_PERMISSIONS,
    } : {}),
  };
};
