"use strict";

/* ===============================================
   TOP - QAS


   TABLE OF CONTENTS:
   1. URL & Environment Configuration
   2. Authentication & Token Management  
   3. AJAX & API Communication
   4. User Management
   5. UI Components & Dialogs
   6. Kendo UI Helpers
   7. Validation System
   8. Logging & Analytics
   9. Menu System
   10. Utility Functions
   11. Event Handlers & Initialization
   =============================================== */

/* ===============================================
   1. URL & ENVIRONMENT CONFIGURATION
   =============================================== */

// URL Case Correction
// URL Case Correction
(function () {
  const url = window.location.href;
  const fixed = url.replace(/\/sites\/[^\/\?#]+/i, (match) => {
    const lowerMatch = match.toLowerCase();
    if (lowerMatch.includes('topcool')) {
      return '/sites/TOPCool';
    } else if (lowerMatch.includes('cool-qas')) {
      return '/sites/COOL-qas';  // แก้ให้เป็นรูปแบบที่ถูกต้อง
    }
    return match;
  });
  if (url !== fixed) window.location.replace(fixed);
})();

window.KendoLicenseManager = {
  _debounceTimeout: null,
  _licenseApplied: false,
  _retryCount: 0,
  _maxRetries: 5,
  _observers: [],

  setKendoLicenseDebounced: function () {
    if (this._debounceTimeout) {
      clearTimeout(this._debounceTimeout);
    }

    this._debounceTimeout = setTimeout(() => {
      this.setKendoLicenseWithRetry();
    }, 300);
  },

  setKendoLicenseWithRetry: function () {
    const attempt = () => {
      if (this.setKendoLicense()) {
        this._retryCount = 0;
        return true;
      } else if (this._retryCount < this._maxRetries) {
        this._retryCount++;
        console.log(`[KendoLicenseManager] Retry attempt ${this._retryCount}/${this._maxRetries}`);
        setTimeout(() => attempt(), 1000 * this._retryCount);
      }
      return false;
    };

    return attempt();
  },

  setKendoLicense: function () {
    try {
      // ตรวจสอบว่า KendoLicensing พร้อมใช้งาน
      if (typeof KendoLicensing === "undefined") {
        console.warn("[KendoLicenseManager] KendoLicensing not ready, will retry...");
        return false;
      }

      // Set license
      console.log("[KendoLicenseManager] Setting Kendo UI license key...");
      KendoLicensing.setScriptKey(
        "141j044b041h541j4i1d542e58285k264c22502j5f465d38573657385d3558395j3h2c432h39235723011e0h1c345d121e321f0927032c051j175k1420074h414j3j613a213b24195k171f335b0h1e01230f2h5709394f401f5a27035h2131084i4027054c1g4g494k2i0b4k1a4i0c35520f541b44024f1d0d2j0f2d60344d3e112a3i1j4e0a4k253d1g51033a153g2b5j3e03511e3h145e1g0g5a265g3g06512e402c581i4a304k165j1j560350294g3i21581d4c1h3325341j591g0g5h1b5a2f00243c285f0i57330g5j2b4b26450a2g531e582a0d4708490j341232033f173b134a1260094c043d1b430d4a121c4k06351j3c1g4j0b561i58145i2e58023c1h57351i4c0c5c225b1h422a0628470k602h08370i385b2f541f10460e4b224h0b491i5k1g561g612i5c340a4c1k4a07542h3k18460g5j264g035h2a4c2345123h115k263a5f0h48133i4c225f1d3c0i360k4f2g083e5g1e3a0j6128470i4d1j362j3e0k1h57054i4002390i3i13244j0d472d5h0053003f2a5k04391a461d5f2i58053c0f3a1g521j14582i4k1g12470f4926611j5449043h2d3e0241165a2i612b0c1d5b2749023c2843055j0f4c105e055932255f2b0d3j1b4k1c3i4i4027401f53103h00280b510c304k1b5f2139073i1939243g1147205h0d3f003j1g312a372k55074f2937524b0f310h3400360k380h391k19460833264j0a3g1h0j511h4j2d015403551d0k1f4j4b191k3g0d5148143e0c481a3g12562j044h0k5e4625602j534915224k01310i612b3h2i4506414i1a4k0d5h3a1h360j4c1g3j0h1b3d0j5j054828414c2b4f003c5i425i10362i3b14550f3f0k5e462a4e1c592c40541650043121331b3k013c2g311d39304j02520h4e3h2a4216390d2a4d412537022g45163c18521a234a28511i521j59331h581e4116591c115k053424165k1g531c0h612h5f0k43173f13225f164e41542g5j114e1e4h0342125a2h0955074d40064b0j1c13551h410i5a0i1g401c3k4e1h5c01364k0b31013813235e0i32115e0d4h1k5a06451825510g4h265i0i1f3e5k3d0d5b1i602759051i5h1i"
      );

      // ลบ notification ถ้ามี
      this.removeAllLicenseNotifications();

      // ตั้งค่า data-interception สำหรับ links
      setTimeout(() => {
        $("a").each(function () {
          $(this).attr("data-interception", "off");
        });
      }, 500);

      this._licenseApplied = true;
      console.log("[KendoLicenseManager] License applied successfully");
      return true;

    } catch (error) {
      console.error("[KendoLicenseManager] Error setting license:", error);
      return false;
    }
  },

  removeAllLicenseNotifications: function () {
    // ลบทุก license notification ที่อาจปรากฏ
    const selectors = [
      '.k-notification:contains("No license found")',
      '.k-notification:contains("license")',
      '.k-notification.k-license-warning',
      '[class*="license-notification"]'
    ];

    selectors.forEach(selector => {
      $(selector).remove();
    });
  },

  startAggressiveMonitoring: function () {
    // Monitor สำหรับ SharePoint page state changes
    this.observeSharePointChanges();

    // Monitor สำหรับ DOM mutations
    this.observeDOMMutations();

    // Monitor สำหรับ browser navigation
    this.observeNavigation();

    // Periodic check
    this.startPeriodicCheck();
  },

  observeSharePointChanges: function () {
    // SharePoint specific events
    const spEvents = [
      'spfxloaded',
      'sppagecontextchanged',
      'spfxnavigated',
      'sharePointReady'
    ];

    spEvents.forEach(eventName => {
      window.addEventListener(eventName, () => {
        console.log(`[KendoLicenseManager] SharePoint event: ${eventName}`);
        this.setKendoLicenseDebounced();
      });
    });

    // Monitor SharePoint edit mode changes
    if (window._spPageContextInfo) {
      let lastFormDigest = window._spPageContextInfo.formDigestValue;
      setInterval(() => {
        if (window._spPageContextInfo?.formDigestValue !== lastFormDigest) {
          lastFormDigest = window._spPageContextInfo.formDigestValue;
          console.log('[KendoLicenseManager] SharePoint context changed');
          this.setKendoLicenseDebounced();
        }
      }, 2000);
    }
  },

  observeDOMMutations: function () {
    // Enhanced MutationObserver
    const observer = new MutationObserver((mutations) => {
      let needsLicense = false;

      mutations.forEach(mutation => {
        // ตรวจสอบ Kendo components ใหม่
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
              const hasKendo = node.matches?.('[data-role*="kendo"], .k-widget, .k-notification') ||
                node.querySelector?.('[data-role*="kendo"], .k-widget, .k-notification');

              if (hasKendo) {
                needsLicense = true;
              }

              // ตรวจสอบ license notification โดยเฉพาะ
              if (node.textContent?.includes('No license found') ||
                node.classList?.contains('k-notification')) {
                this.removeAllLicenseNotifications();
                needsLicense = true;
              }
            }
          });
        }

        // ตรวจสอบ attribute changes
        if (mutation.type === 'attributes' &&
          mutation.target.classList?.contains('k-widget')) {
          needsLicense = true;
        }
      });

      if (needsLicense) {
        this.setKendoLicenseDebounced();
      }
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-role']
    });

    this._observers.push(observer);
  },

  observeNavigation: function () {
    // Browser back/forward
    window.addEventListener('popstate', () => {
      console.log('[KendoLicenseManager] Navigation: popstate');
      this.setKendoLicenseDebounced();
    });

    // Hash changes
    window.addEventListener('hashchange', () => {
      console.log('[KendoLicenseManager] Navigation: hashchange');
      this.setKendoLicenseDebounced();
    });

    // Override pushState & replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function () {
      originalPushState.apply(history, arguments);
      KendoLicenseManager.setKendoLicenseDebounced();
    };

    history.replaceState = function () {
      originalReplaceState.apply(history, arguments);
      KendoLicenseManager.setKendoLicenseDebounced();
    };

    // Page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('[KendoLicenseManager] Page became visible');
        this.setKendoLicenseDebounced();
      }
    });

    // Focus events
    window.addEventListener('focus', () => {
      this.setKendoLicenseDebounced();
    });
  },

  startPeriodicCheck: function () {
    // ตรวจสอบทุก 5 วินาที
    setInterval(() => {
      // ตรวจสอบว่ามี license notification หรือไม่
      if ($('.k-notification:contains("No license found")').length > 0 ||
        $('.k-notification:contains("license")').length > 0) {
        console.log('[KendoLicenseManager] License notification detected in periodic check');
        this.setKendoLicenseWithRetry();
      }

      // ตรวจสอบว่ามี Kendo widgets ใหม่หรือไม่
      if ($('.k-widget').length > 0 && !this._licenseApplied) {
        this.setKendoLicenseWithRetry();
      }
    }, 5000);
  },

  cleanup: function () {
    // Cleanup observers
    this._observers.forEach(observer => observer.disconnect());
    this._observers = [];

    if (this._debounceTimeout) {
      clearTimeout(this._debounceTimeout);
    }
  }
};

// Legacy function for backward compatibility
function setKendoLicense() {
  KendoLicenseManager.setKendoLicense();
}

// Enhanced TLM Global Object with Modern MSAL Patterns
(function (window) {
  if (window.tlm === undefined) {
    window.tlm = {};
  }

  let tlm = window.tlm;

  // SPFx Environment Detection
  const isSpfxEnvironment = () => {
    return typeof window.spfxContext !== 'undefined' ||
      typeof window._spPageContextInfo !== 'undefined' ||
      document.querySelector('[data-spfx-root]') !== null;
  };

  // Enhanced Environment Configuration with Dynamic Detection
  const getEnvironmentConfig = () => {
    const currentUrl = window.location.href;
    const baseUrl = window.location.origin;

    let dynamicRedirectUri = baseUrl;

    if (window._spPageContextInfo?.webAbsoluteUrl) {
      dynamicRedirectUri = window._spPageContextInfo.webAbsoluteUrl;
    } else if (currentUrl.includes('/sites/')) {
      const siteMatch = currentUrl.match(/(https?:\/\/[^\/]+\/sites\/[^\/\?#]+)/);
      if (siteMatch) {
        dynamicRedirectUri = siteMatch[1];
      }
    }

    // CRITICAL FIX: Normalize case to match Azure AD registration
    dynamicRedirectUri = dynamicRedirectUri.replace(/\/sites\/[^\/\?#]+/i, (match) => {
      const lowerMatch = match.toLowerCase();
      if (lowerMatch.includes('topcool')) {
        return '/sites/TOPCool';
      } else if (lowerMatch.includes('cool-qas')) {
        return '/sites/COOL-qas';
      }
      return match;
    });

    // CRITICAL FIX: Remove trailing slash for consistency
    dynamicRedirectUri = dynamicRedirectUri.replace(/\/$/, '');

    // Store redirect URI in localStorage for cross-tab usage
    localStorage.setItem('tlm_redirect_uri', dynamicRedirectUri);

    console.log('[TLM] Final Redirect URI:', dynamicRedirectUri);

    return {
      siteName: "COOL-qas",
      webBaseUrl: window._spPageContextInfo?.webAbsoluteUrl || "https://thaioilgroup0.sharepoint.com/sites/COOL-qas",
      currentPageUrl: currentUrl,
      dynamicRedirectUri: dynamicRedirectUri,
      isSpfx: isSpfxEnvironment(),
      tenantID: "894f6e4e-e59c-47ff-be1e-b63a852cfb53",
      clientID: "79f6f4f1-491b-480c-bc7e-57239452b97c",
    };
  };

  tlm.global = null;
  tlm.global = {
    ...getEnvironmentConfig(),
    serviceUrl: "https://qas-spoapi.thaioilgroup.com/Thalamo.TOP.COOL.Service",
    attachmentDownloadPath: "/api/Attachment/Download/{attachmentGUID}/{fileName}",
    timeoutInterval: 100,
    emptyGuid: "00000000-0000-0000-0000-000000000000",
    msalInstance: null,
    scope: ".default",
    _scopes: ["api://79f6f4f1-491b-480c-bc7e-57239452b97c/User_read_access"],
    azureToken: null,
    decodeEncodedString: function (input) {
      return input.replace(/\x00/g, '');
    },
    roles: {
      digitalSupport: "Digital Support"
    },

    // Enhanced State Management
    _tokenPromise: null,
    _pendingRequests: [],
    _initializationPromise: null,
    _msalReady: false,
    _dependenciesLoaded: false,
    _disposed: false,
    _eventListeners: new Map(),

    // SPFx Lifecycle
    _spfxContext: null,

    // Enhanced Token Configuration
    TOKEN_DURATION_MINUTES: 60,
    TOKEN_REFRESH_THRESHOLD_MINUTES: 10,

    // Authentication State Management
    _handling401Error: false,
    _tokenRefreshInProgress: false,
    _tokenRefreshPromise: null,
    _lastUserActivity: Date.now(),
    _activityListeners: [],
    _isInitializing: false,
    _redirectInProgress: false,
    _authenticationInProgress: false,
    _tokenReady: false,
    _waitingForToken: false,
    _showingPopupGuidance: false,

    // Enhanced SSO Silent Management
    _acquireTokenSilentInProgress: false,
    _acquireTokenSilentPromise: null,
    _ssoSilentInProgress: false,
    _ssoSilentPromise: null,
    _lastTokenAttempt: 0,
    _tokenAttemptCooldown: 2000, // CRITICAL FIX #5: Reduced from 5000ms to prevent blocking post-redirect token acquisition
    _tokenAttemptFailureCount: 0,
    MAX_TOKEN_ATTEMPT_FAILURES: 3,
    _lastErrorCode: null,

    _showFullLoadingCount: 0,
    _authenticationInProgress: false,

    // iOS WebKit popup attempts tracking
    // Increased from 1 to 3 to allow multiple tries before showing permanent notification
    // This is more forgiving for cases where popup blocker might need multiple attempts
    _safariPopupAttempts: 0,
    MAX_SAFARI_POPUP_ATTEMPTS: 3,

    /* ===============================================
       1.1. ENHANCED AUTHENTICATION & TOKEN MANAGEMENT
    =============================================== */
    /**
     * CRITICAL FIX #1: Unified iOS WebKit Detection
     * All browsers on iOS (Safari, Chrome, Edge) use the SAME WebKit engine
     * They MUST be treated identically for authentication to prevent inconsistent behavior
     * 
     * Detection strategy:
     * 1. Detect iOS device (iPhone, iPad, iPod, iPad emulating Mac)
     * 2. Exclude in-app browsers (Facebook, Instagram, etc.) - they have severe restrictions
     * 3. Include ALL standard browsers (Safari, Chrome, Edge) - they all use WebKit on iOS
     * 
     * @returns {boolean} true if iOS WebKit browser, false otherwise
     */
    _isIOSWebKit: function () {
      const ua = navigator.userAgent;

      // Detect iOS device (including iPad pro masquerading as Mac)
      const isIOS = /iPad|iPhone|iPod/.test(ua) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      // Exclude in-app browsers - they have additional restrictions beyond standard WebKit
      const isInAppBrowser = /(FBAN|FBAV|Instagram|WhatsApp|Line|Twitter|FB_IAB|FBIOS)/i.test(ua);

      // Exclude standalone PWA - different authentication context
      const isStandalonePWA = window.navigator.standalone === true;

      // Log detection results for debugging
      console.log('[TLM] iOS WebKit Detection:', {
        isIOS: isIOS,
        isInApp: isInAppBrowser,
        isPWA: isStandalonePWA,
        browser: this._getIOSBrowserName(ua),
        userAgent: ua
      });

      // Any iOS device browser EXCEPT in-app browsers and PWAs
      return isIOS && !isInAppBrowser && !isStandalonePWA;
    },

    /**
     * Helper function to identify specific iOS browser for logging/debugging
     * All iOS browsers use WebKit, but this helps with user-facing messages
     */
    _getIOSBrowserName: function (ua) {
      if (/CriOS/i.test(ua)) return 'Chrome';
      if (/EdgiOS/i.test(ua)) return 'Edge';
      if (/FxiOS/i.test(ua)) return 'Firefox';
      if (/Safari/i.test(ua) && !/Chrome|CriOS|EdgiOS|FxiOS/i.test(ua)) return 'Safari';
      return 'Unknown iOS Browser';
    },

    /**
     * DEPRECATED: Legacy function kept for backward compatibility
     * Use _isIOSWebKit() instead for all iOS browser detection
     * @deprecated Use _isIOSWebKit() instead
     */
    _isIOSSafari: function () {
      console.warn('[TLM] _isIOSSafari() is deprecated - use _isIOSWebKit() instead');
      return this._isIOSWebKit();
    },

    /**
     * CRITICAL: Detect Safari browser ONLY on iOS (not Chrome/Edge/Firefox iOS)
     * Purpose: Safari iOS has unique in-place redirect behavior that causes race condition
     * Chrome iOS does full-page redirect (like Desktop) - no race condition
     * @returns {boolean} true if Safari on iOS (iPhone/iPad), false otherwise
     */
    _isSafariIOS: function () {
      const ua = navigator.userAgent;

      // Check if iOS device
      const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;

      // Check if Safari browser (NOT Chrome/Edge/Firefox on iOS)
      // Safari has "Safari" in UA, others have CriOS/EdgiOS/FxiOS
      const isSafari = /Safari/i.test(ua) && !/CriOS|EdgiOS|FxiOS/i.test(ua);

      const result = isIOS && isSafari;

      if (result) {
        console.log('[TLM][Safari iOS] Detected Safari browser on iOS - will use race condition protection');
      }

      return result;
    },

    //  function สำหรับตรวจสอบ mobile ทั่วไป
    _isMobileDevice: function () {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth <= 768;
    },


    // Enhanced Loop Detection
    isLoopDetected: function () {
      const loopDetected = localStorage.getItem("tlm_aad_loop_detected") === "true";
      const redirectAttempts = parseInt(localStorage.getItem('tlm_redirect_attempts') || '0');
      const lastRedirectTime = parseInt(localStorage.getItem('tlm_last_redirect_time') || '0');
      const now = Date.now();

      // CRITICAL FIX #3: Auto-reset counter if >2 hours passed (session gap scenario)
      // This prevents false loop detection when user returns after extended inactivity
      if (redirectAttempts > 0 && (now - lastRedirectTime) > 7200000) { // 2 hours = 7200000ms
        console.log('[TLM] Redirect attempts counter expired (>2 hours since last attempt) - auto-resetting');
        console.log(`[TLM] Last redirect: ${new Date(lastRedirectTime).toISOString()}, Age: ${Math.floor((now - lastRedirectTime) / 60000)} minutes`);
        localStorage.removeItem('tlm_redirect_attempts');
        localStorage.removeItem('tlm_last_redirect_time');
        return false; // Not a loop - just stale counter from previous session
      }

      // Consider it a loop if:
      // 1. Previously detected AAD loop
      // 2. Too many redirect attempts in short time (3 attempts within 5 minutes)
      if (loopDetected) return true;
      if (redirectAttempts >= 3 && (now - lastRedirectTime) < 300000) return true; // 5 minutes

      return false;
    },
    _handleInteractionRequired: async function (error) {
      console.warn('[TLM] Interaction required due to session conflict or expiry. Initiating a clean login flow.', error);

      // ตรวจสอบว่าเป็น mobile device และ iOS WebKit หรือไม่
      const isMobile = this._isMobileDevice();
      const isIOSWebKit = this._isIOSWebKit();

      // ===================================================
      // iOS WebKit (Safari, Chrome, Edge): ใช้ POPUP เท่านั้น (ไม่มี redirect)
      // ===================================================
      if (isIOSWebKit) {
        console.log('[TLM][iOS WebKit] Detected - using POPUP authentication (NO RELOAD)');

        // 🚫 Check if already showing popup guidance - prevent duplicate attempts
        if (this._showingPopupGuidance) {
          console.log('[TLM][iOS WebKit] ⏸️ Popup guidance is showing - skipping duplicate authentication attempt');
          return null;
        }

        // 🚫 Check if already authenticating - prevent duplicate attempts
        if (this._authenticationInProgress) {
          console.log('[TLM][iOS WebKit] ⏸️ Authentication already in progress - skipping duplicate attempt');
          return null;
        }

        // 🚫 Check max popup attempts - prevent infinite loop
        // 🔥 CRITICAL FIX: Use sessionStorage instead of localStorage for attempt counter
        // This ensures counter resets on browser close/new session instead of persisting forever
        const storedAttempts = parseInt(sessionStorage.getItem('tlm_safari_popup_attempts') || '0');
        this._safariPopupAttempts = storedAttempts;

        // 🔥 CRITICAL FIX: Add time-based reset for attempt counter (24 hour timeout)
        // This prevents permanent blocking if user returns after long gap
        const lastAttemptTime = parseInt(localStorage.getItem('tlm_safari_last_attempt_time') || '0');
        const now = Date.now();
        const ATTEMPT_RESET_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

        if (now - lastAttemptTime > ATTEMPT_RESET_TIMEOUT) {
          console.log('[TLM][iOS WebKit] ♻️ Attempt counter timeout exceeded (24h) - resetting');
          this._safariPopupAttempts = 0;
          sessionStorage.removeItem('tlm_safari_popup_attempts');
          localStorage.removeItem('tlm_safari_last_attempt_time');
        }

        if (this._safariPopupAttempts >= this.MAX_SAFARI_POPUP_ATTEMPTS) {
          console.log('[TLM][iOS WebKit] ⚠️ Max popup attempts reached (' + this._safariPopupAttempts + '/' + this.MAX_SAFARI_POPUP_ATTEMPTS + ') - showing notification');
          this._showSafariMobileSetupNotification();
          return null;
        }

        // Increment attempt counter and save to sessionStorage (not localStorage)
        this._safariPopupAttempts++;
        sessionStorage.setItem('tlm_safari_popup_attempts', this._safariPopupAttempts.toString());
        localStorage.setItem('tlm_safari_last_attempt_time', now.toString());
        console.log('[TLM][iOS WebKit] 🔄 Popup attempt #' + this._safariPopupAttempts + '/' + this.MAX_SAFARI_POPUP_ATTEMPTS);

        this._authenticationInProgress = true;

        try {
          const success = await this._safariMobilePopupAuth();

          if (success) {
            console.log('[TLM][iOS WebKit] ✅ Popup authentication completed - token ready');
            // Reset counter on success (both memory and sessionStorage)
            this._safariPopupAttempts = 0;
            sessionStorage.removeItem('tlm_safari_popup_attempts');
            console.log('[TLM][iOS WebKit] ♻️ Reset popup attempt counter');
            this._authenticationInProgress = false;
            // ✅ NO RELOAD - token is ready immediately, page can continue
            return null;
          } else {
            console.error('[TLM][iOS WebKit] ❌ Popup authentication failed (attempt ' + this._safariPopupAttempts + '/' + this.MAX_SAFARI_POPUP_ATTEMPTS + ')');
            this._authenticationInProgress = false;

            // Show notification if max attempts reached
            if (this._safariPopupAttempts >= this.MAX_SAFARI_POPUP_ATTEMPTS) {
              console.log('[TLM][iOS WebKit] ⚠️ Max attempts reached - showing setup notification');
              this._showSafariMobileSetupNotification();
            }

            return null;
          }
        } catch (error) {
          console.error('[TLM][iOS WebKit] ❌ Authentication error (attempt ' + this._safariPopupAttempts + '/' + this.MAX_SAFARI_POPUP_ATTEMPTS + '):', error);
          this._authenticationInProgress = false;

          // Show notification if max attempts reached
          if (this._safariPopupAttempts >= this.MAX_SAFARI_POPUP_ATTEMPTS) {
            console.log('[TLM][iOS WebKit] ⚠️ Max attempts reached - showing setup notification');
            this._showSafariMobileSetupNotification();
          }

          return null;
        }
      }

      // ===================================================
      // Desktop & Non-iOS Mobile: ใช้ REDIRECT
      // ===================================================

      // ป้องกันการเรียกซ้ำซ้อนหากกำลังอยู่ในกระบวนการ redirect
      if (this._redirectInProgress) {
        console.log('[TLM] Redirect is already in progress. Aborting.');
        return;
      }
      this._redirectInProgress = true;

      // CRITICAL FIX #5 & #6: Reset cooldown and add safety timeout for redirect flag
      this._lastTokenAttempt = 0; // Reset cooldown so post-redirect token acquisition isn't blocked
      console.log('[TLM] Reset token attempt cooldown before redirect');

      // CRITICAL FIX #6: Auto-clear redirect flag after 10 seconds (safety timeout)
      // SECURITY FIX: Reduced from 30s to 10s to handle browser back button edge case
      // Prevents flag from being stuck if redirect fails or user cancels
      setTimeout(() => {
        if (this._redirectInProgress) {
          console.warn('[TLM] Redirect flag still set after 10 seconds - auto-clearing (likely redirect failed)');
          this._redirectInProgress = false;
        }
      }, 10000); // Reduced from 30000ms to 10000ms

      // Track redirect attempts สำหรับ loop detection (สำหรับ redirect เท่านั้น)
      const redirectAttempts = parseInt(localStorage.getItem('tlm_redirect_attempts') || '0');
      const now = Date.now();
      localStorage.setItem('tlm_redirect_attempts', (redirectAttempts + 1).toString());
      localStorage.setItem('tlm_last_redirect_time', now.toString());
      localStorage.setItem('tlm_intended_url', window.location.href);

      // CRITICAL FIX #1: Store timestamp instead of boolean for just_authenticated flag
      // This allows auto-expiry and prevents race conditions
      localStorage.setItem('tlm_just_authenticated', now.toString());

      // === Desktop & Non-iOS Mobile: logout → login chain ===
      // CRITICAL FIX #6: Wrap in try-finally to ensure redirect flag is cleared
      try {
        try {
          // ทำการ logout เพื่อล้าง session เก่าที่อาจจะขัดแย้งอยู่
          // แล้ว redirect กลับมาเพื่อ login ใหม่ทันทีในกระบวนการเดียว
          await this.msalInstance.logoutRedirect({
            onRedirectNavigate: (url) => {
              // เราไม่ต้องการ redirect ไปยังหน้า post-logout ของ Azure AD
              // แต่จะให้เริ่มกระบวนการ login ใหม่ทันที
              const loginRequest = {
                scopes: this._scopes,
                redirectUri: this.dynamicRedirectUri,
                authority: `https://login.microsoftonline.com/${this.tenantID}`,
                prompt: "select_account", // บังคับให้ผู้ใช้เลือกบัญชีเพื่อแก้ปัญหา session conflict
                // เพิ่มพารามิเตอร์สำหรับ mobile device (non-iOS)
                ...(isMobile && {
                  responseMode: 'fragment',
                  state: kendo.guid()
                })
              };
              this.msalInstance.loginRedirect(loginRequest);
              return false; // บอก MSAL ว่าเราจัดการ redirect เอง ไม่ต้องไปต่อ
            }
          });
        } catch (logoutError) {
          console.error('[TLM] The controlled logout-redirect flow failed. Falling back to a standard login redirect.', logoutError);
          // หากกระบวนการ logout-redirect ด้านบนมีปัญหา ให้กลับไปใช้วิธี loginRedirect แบบมาตรฐาน
          const loginRequest = {
            scopes: this._scopes,
            redirectUri: this.dynamicRedirectUri,
            authority: `https://login.microsoftonline.com/${this.tenantID}`,
            prompt: "select_account",
            // เพิ่มพารามิเตอร์สำหรับ mobile device (non-iOS)
            ...(isMobile && {
              responseMode: 'fragment',
              state: kendo.guid()
            })
          };
          this.msalInstance.loginRedirect(loginRequest);
        }
      } finally {
        // CRITICAL FIX #6: Clear redirect flag in finally (runs even if redirect succeeds)
        // NOTE: This will execute, but redirect navigation will interrupt it
        // That's OK - the flag will be cleared in handleRedirectPromise on return
        setTimeout(() => {
          this._redirectInProgress = false;
          console.log('[TLM] Redirect flag cleared in finally block');
        }, 1000); // Small delay to allow redirect to start
      }
    },

    acquireTokenWithFallback: async function (options = {}) {
      const now = Date.now();

      if (this.isLoopDetected()) {
        console.log('[TLM] Token acquisition blocked due to loop detection');
        return null;
      }

      if (this._tokenAttemptFailureCount >= this.MAX_TOKEN_ATTEMPT_FAILURES) {
        console.log('[TLM] Token acquisition blocked - max failures reached');
        return null;
      }

      // CRITICAL FIX #5: Add exception for post-authentication scenario
      // Check if we're within 60 seconds of authentication (based on timestamp)
      const justAuthTimestamp = localStorage.getItem('tlm_just_authenticated');
      const isPostAuth = justAuthTimestamp && (now - parseInt(justAuthTimestamp)) < 60000; // Within 1 min of auth

      if (!isPostAuth && now - this._lastTokenAttempt < this._tokenAttemptCooldown) {
        console.log('[TLM] Token acquisition on cooldown, skipping...');
        return null;
      }

      this._lastTokenAttempt = now;

      try {
        if (!this.msalInstance) {
          console.log('[TLM] MSAL not initialized for token acquisition');
          return null;
        }

        const isIOSWebKit = this._isIOSWebKit();
        const deviceType = this._isMobileDevice() ? 'Mobile' : 'Desktop';

        // 🔥 OPTIMIZED: iOS WebKit ข้าม silent methods ไปทำ popup เลย
        // เพราะ iframe/cors restrictions ทำให้ acquireTokenSilent & ssoSilent ใช้ไม่ได้
        if (isIOSWebKit) {
          console.log('[TLM][iOS WebKit] 🚀 Skipping silent methods - going straight to popup');
          console.log('[TLM][iOS WebKit] Reason: iframe/3rd-party cookies blocked on iOS Safari');

          // ข้ามไป TIER 3 เลย (popup)
          await this._handleInteractionRequired({
            errorCode: 'ios_webkit_skip_silent_methods'
          });
          return null;
        }

        // === Desktop & Non-iOS Mobile: Unified 3-Tier Fallback Strategy ===
        console.log(`[TLM] ${deviceType} - using unified 3-tier fallback strategy`);

        // 🔵 TIER 1: acquireTokenSilent (cache) - Desktop & Non-iOS Mobile
        console.log(`[TLM] ${deviceType}: Trying TIER 1 - acquireTokenSilent (cache)`);
        const silentResult = await this.performAcquireTokenSilent(options);
        if (silentResult && silentResult.accessToken) {
          console.log(`[TLM] ${deviceType}: ✅ TIER 1 successful (cache)`);
          this._tokenAttemptFailureCount = 0;

          // CRITICAL FIX #3: Reset redirect attempts counter on successful token acquisition
          localStorage.removeItem('tlm_redirect_attempts');
          localStorage.removeItem('tlm_last_redirect_time');

          // Update token for all devices
          this.azureToken = "Bearer " + silentResult.accessToken;
          localStorage.setItem('tlm_azure_token', this.azureToken);
          const expiryTime = Date.now() + (this.TOKEN_DURATION_MINUTES * 60 * 1000);
          localStorage.setItem('tlm_token_expiry', expiryTime.toString());

          // CRITICAL FIX #1: Clear just_authenticated flag now that token is successfully acquired
          this._clearAuthenticationFlags('token_acquired');

          return silentResult;
        }

        // 🔵 TIER 2: ssoSilent (M365 session) - Desktop & Non-iOS Mobile
        console.log(`[TLM] ${deviceType}: TIER 1 failed, trying TIER 2 - ssoSilent (M365 session)`);

        try {
          const ssoResult = await this.performSsoSilent(options);
          if (ssoResult && ssoResult.accessToken) {
            console.log(`[TLM] ${deviceType}: ✅ TIER 2 successful (SSO)`);
            this._tokenAttemptFailureCount = 0;

            // CRITICAL FIX #3: Reset redirect attempts counter on successful token acquisition
            localStorage.removeItem('tlm_redirect_attempts');
            localStorage.removeItem('tlm_last_redirect_time');

            // Update token for all devices
            this.azureToken = "Bearer " + ssoResult.accessToken;
            localStorage.setItem('tlm_azure_token', this.azureToken);
            const expiryTime = Date.now() + (this.TOKEN_DURATION_MINUTES * 60 * 1000);
            localStorage.setItem('tlm_token_expiry', expiryTime.toString());

            // CRITICAL FIX #1: Clear just_authenticated flag now that token is successfully acquired
            this._clearAuthenticationFlags('token_acquired');

            return ssoResult;
          }
        } catch (ssoError) {
          // Expected errors - iframe restrictions, X-Frame-Options
          console.log(`[TLM] ${deviceType}: TIER 2 (ssoSilent) failed:`, ssoError.message || ssoError.errorCode);
        }

        // 🔵 TIER 3: Interactive (redirect/popup) - Desktop & Non-iOS Mobile
        console.log(`[TLM] ${deviceType}: TIER 1 & 2 failed, using TIER 3 - Interactive auth`);

        // CRITICAL FIX #1: Check just_authenticated timestamp instead of boolean
        // ป้องกันการ redirect ซ้ำถ้าเพิ่งทำ authentication มาแล้ว
        const justAuthTimestamp = localStorage.getItem('tlm_just_authenticated');
        if (justAuthTimestamp) {
          const authTime = parseInt(justAuthTimestamp);
          const timeSinceAuth = now - authTime;

          // Flag valid for 30 seconds only - protects against immediate re-auth loop
          if (timeSinceAuth < 30000) {
            console.error('[TLM] Just authenticated but still no token - possible authentication issue');
            console.error(`[TLM] Time since authentication: ${Math.floor(timeSinceAuth / 1000)} seconds`);
            // Clear all authentication flags เพื่อไม่ให้ติด loop detection
            this._clearAuthenticationFlags('loop_clear');
            this._tokenAttemptFailureCount++;
            console.log('[TLM] Cleared authentication flags to allow retry');
            return null;
          } else {
            // Flag expired - clear it and continue
            console.log('[TLM] just_authenticated flag expired - clearing');
            localStorage.removeItem('tlm_just_authenticated');
          }
        }

        // ใช้ _handleInteractionRequired สำหรับทุก device
        await this._handleInteractionRequired({
          errorCode: `${deviceType.toLowerCase()}_all_silent_methods_failed`
        });

        return null;

      } catch (error) {
        console.error('[TLM] Exception during token acquisition:', error.errorCode || error);
        this._tokenAttemptFailureCount++;

        if (error.errorCode === 'interaction_required' ||
          error.errorCode === 'consent_required' ||
          error.errorCode === 'login_required') {

          // CRITICAL FIX #1: Check just_authenticated timestamp instead of boolean
          // ป้องกันการ redirect ซ้ำถ้าเพิ่งทำ authentication มาแล้ว
          const justAuthTimestamp = localStorage.getItem('tlm_just_authenticated');
          if (justAuthTimestamp) {
            const authTime = parseInt(justAuthTimestamp);
            const timeSinceAuth = Date.now() - authTime;

            // Flag valid for 30 seconds only
            if (timeSinceAuth < 30000) {
              console.error('[TLM] Just authenticated but still no token - possible authentication issue');
              console.error(`[TLM] Time since authentication: ${Math.floor(timeSinceAuth / 1000)} seconds`);
              // Clear all authentication flags เพื่อไม่ให้ติด loop detection
              this._clearAuthenticationFlags('loop_clear');
              console.log('[TLM] Cleared authentication flags to allow retry');
              return null;
            } else {
              // Flag expired - clear it
              localStorage.removeItem('tlm_just_authenticated');
            }
          }

          await this._handleInteractionRequired(error);
          return null;
        }

        return null;
      }
    },

    //  function สำหรับจัดการ mobile login
    _handleMobileLogin: async function () {
      console.log('[TLM] Handling mobile-specific login');

      try {
        const isIOSWebKit = this._isIOSWebKit();
        const isAndroid = /Android/i.test(navigator.userAgent);

        // 🚫 iOS WebKit: ไม่ทำ redirect - ใช้ popup เท่านั้น
        if (isIOSWebKit) {
          console.log('[TLM][iOS WebKit] ⚠️ _handleMobileLogin blocked - iOS WebKit uses POPUP only, no redirect');
          this._showSafariMobileSetupNotification();
          return;
        }

        // CRITICAL FIX #6: Android redirect optimization with attempt tracking
        if (isAndroid) {
          console.log('[TLM][Android] 📱 Detected Android - using redirect flow');

          // Check redirect attempt counter to prevent infinite loops
          const androidAttempts = parseInt(localStorage.getItem('tlm_android_redirect_attempts') || '0');
          const lastAttemptTime = parseInt(localStorage.getItem('tlm_android_last_attempt_time') || '0');
          const now = Date.now();

          // Reset counter if last attempt was more than 5 minutes ago
          if (now - lastAttemptTime > 300000) {
            localStorage.setItem('tlm_android_redirect_attempts', '0');
            console.log('[TLM][Android] Reset attempt counter (timeout)');
          }

          // Block if too many attempts (more than 3 in 5 minutes)
          if (androidAttempts >= 3) {
            console.error('[TLM][Android] Too many redirect attempts - possible loop detected');
            console.error('[TLM][Android] Please clear browser data and try again');
            return;
          }

          // Increment counter
          localStorage.setItem('tlm_android_redirect_attempts', (androidAttempts + 1).toString());
          localStorage.setItem('tlm_android_last_attempt_time', now.toString());
          console.log(`[TLM][Android] Redirect attempt ${androidAttempts + 1}/3`);
        }

        // Non-iOS Mobile (Android, etc.): ทำ redirect ได้
        const loginRequest = {
          scopes: this._scopes,
          redirectUri: this.dynamicRedirectUri,
          authority: `https://login.microsoftonline.com/${this.tenantID}`,
          prompt: "select_account",
          responseMode: 'fragment',
          state: kendo.guid()
        };

        localStorage.setItem('tlm_intended_url', window.location.href);
        localStorage.setItem('tlm_just_authenticated', Date.now().toString());

        // CRITICAL FIX #6: Android safety timeout
        if (isAndroid) {
          setTimeout(() => {
            if (!localStorage.getItem('tlm_azure_token')) {
              console.warn('[TLM][Android] Redirect timeout - no token received');
            }
          }, 15000); // 15 second safety check
        }

        console.log('[TLM] Initiating mobile redirect...');
        await this.msalInstance.loginRedirect(loginRequest);
      } catch (error) {
        console.error('[TLM] Mobile login failed:', error);

        // Fallback สำหรับ mobile
        setTimeout(() => {
          window.location.href = this.webBaseUrl;
        }, 1000);
      }
    },
    // acquireTokenWithFallback: async function (options = {}) {
    // Enhanced acquireTokenSilent with Account Management
    performAcquireTokenSilent: async function (options = {}) {
      if (this._acquireTokenSilentInProgress && this._acquireTokenSilentPromise) {
        console.log('[TLM] acquireTokenSilent already in progress, waiting...');
        return this._acquireTokenSilentPromise;
      }

      this._acquireTokenSilentInProgress = true;

      this._acquireTokenSilentPromise = new Promise(async (resolve) => {
        try {
          const accounts = this.msalInstance.getAllAccounts();

          if (accounts.length === 0) {
            console.log('[TLM] No accounts available for acquireTokenSilent');
            resolve(null);
            return;
          }

          // Use active account or first available account
          const account = this.msalInstance.getActiveAccount() || accounts[0];

          const silentRequest = {
            account: account,
            scopes: this._scopes,
            authority: `https://login.microsoftonline.com/${this.tenantID}`,
            forceRefresh: false,
            ...options
          };

          console.log('[TLM] Attempting acquireTokenSilent for account:', account.username);

          const response = await this.msalInstance.acquireTokenSilent(silentRequest);

          if (response && response.accessToken) {
            console.log('[TLM] acquireTokenSilent successful');

            // Update active account
            if (response.account) {
              this.msalInstance.setActiveAccount(response.account);
            }

            // Update token
            this.azureToken = "Bearer " + response.accessToken;
            localStorage.setItem('tlm_azure_token', this.azureToken);
            const expiryTime = Date.now() + (this.TOKEN_DURATION_MINUTES * 60 * 1000);
            localStorage.setItem('tlm_token_expiry', expiryTime.toString());

            // Store successful login hint
            if (response.account?.username) {
              localStorage.setItem('tlm_last_login_hint', response.account.username);
            }

            resolve(response);
          } else {
            console.log('[TLM] acquireTokenSilent returned no token');
            resolve(null);
          }

        } catch (error) {
          console.log('[TLM] acquireTokenSilent failed:', error.errorCode || error.message);

          // Some errors are expected and not actual failures
          if (error.errorCode === 'interaction_required' ||
            error.errorCode === 'consent_required' ||
            error.errorCode === 'login_required') {
            console.log('[TLM] acquireTokenSilent requires interaction - this is expected');
          }

          resolve(null);

        } finally {
          this._acquireTokenSilentInProgress = false;
          this._acquireTokenSilentPromise = null;
        }
      });

      return this._acquireTokenSilentPromise;
    },

    // Enhanced SSO Silent function (now as fallback)
    performSsoSilent: async function (options = {}) {
      if (this._ssoSilentInProgress && this._ssoSilentPromise) {
        console.log('[TLM] SSO Silent already in progress, waiting...');
        return this._ssoSilentPromise;
      }

      this._ssoSilentInProgress = true;

      this._ssoSilentPromise = new Promise(async (resolve) => {
        try {
          if (!this.msalInstance) {
            console.log('[TLM] MSAL not initialized for SSO Silent');
            resolve(null);
            return;
          }

          // Build SSO Silent request with safe parameters
          const ssoRequest = {
            scopes: this._scopes,
            authority: `https://login.microsoftonline.com/${this.tenantID}`,
            ...options
          };

          // Try to get loginHint from multiple sources
          if (!ssoRequest.loginHint) {
            ssoRequest.loginHint = localStorage.getItem('tlm_last_login_hint') ||
              window._spPageContextInfo?.userLoginName ||
              window._spPageContextInfo?.userEmail;
          }

          console.log('[TLM] Attempting SSO Silent with loginHint:', ssoRequest.loginHint || 'none');

          const response = await this.msalInstance.ssoSilent(ssoRequest);

          if (response && response.accessToken) {
            console.log('[TLM] SSO Silent successful');

            // Store successful loginHint for future use
            if (response.account?.username) {
              localStorage.setItem('tlm_last_login_hint', response.account.username);
            }

            // Set active account
            if (response.account) {
              this.msalInstance.setActiveAccount(response.account);
            }

            // Update token
            this.azureToken = "Bearer " + response.accessToken;
            localStorage.setItem('tlm_azure_token', this.azureToken);
            const expiryTime = Date.now() + (this.TOKEN_DURATION_MINUTES * 60 * 1000);
            localStorage.setItem('tlm_token_expiry', expiryTime.toString());

            resolve(response);
          } else {
            console.log('[TLM] SSO Silent returned no token');
            resolve(null);
          }

        } catch (error) {
          console.log('[TLM] SSO Silent failed:', error.errorCode || error.message);

          // Check for AADSTS50196 loop error
          if (error.errorCode === 'AADSTS50196' ||
            (error.message && error.message.includes('AADSTS50196'))) {
            localStorage.setItem('tlm_aad_loop_detected', 'true');
            this._lastErrorCode = 'AADSTS50196';
            console.error('[TLM] AAD loop detected in SSO Silent');
            this.showLoopDetectedDialog();
          }

          resolve(null);

        } finally {
          this._ssoSilentInProgress = false;
          this._ssoSilentPromise = null;
        }
      });

      return this._ssoSilentPromise;
    },

    // Enhanced Loop Detection Dialog
    showLoopDetectedDialog: function () {
      setTimeout(() => {
        this.showAlertDialog({
          title: "Authentication Issue Detected",
          content: "Microsoft Azure has detected an authentication loop. Please:<br><br>" +
            "1. Close this browser window<br>" +
            "2. Clear your browser cache (Ctrl+Shift+Delete)<br>" +
            "3. Open a new browser window<br>" +
            "4. Try again<br><br>" +
            "If the problem persists, contact IT support.",
          isError: true,
          width: "500px",
          onOk: function () {
            localStorage.clear();
            sessionStorage.clear();
            window.close();
          }
        });
      }, 1000);
    },

    // SECURITY FIX: Safe localStorage operations with quota/error handling
    /**
     * Safely set item in localStorage with error handling
     * @param {string} key - localStorage key
     * @param {string} value - value to store
     * @returns {boolean} - true if successful, false if failed
     */
    _safeLocalStorageSet: function (key, value) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (error) {
        // Handle quota exceeded, privacy mode, or other errors
        if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
          console.error(`[TLM] localStorage quota exceeded while setting ${key}`);
          console.warn('[TLM] Attempting to clear old authentication data...');

          // Try to free up space by clearing old auth data
          try {
            const keysToTry = ['tlm_aad_loop_detected', 'tlm_redirect_attempts', 'tlm_last_redirect_time'];
            keysToTry.forEach(k => {
              if (k !== key) localStorage.removeItem(k);
            });

            // Retry storage
            localStorage.setItem(key, value);
            console.log(`[TLM] Successfully stored ${key} after cleanup`);
            return true;
          } catch (retryError) {
            console.error(`[TLM] Failed to store ${key} even after cleanup:`, retryError);
            return false;
          }
        } else {
          console.error(`[TLM] localStorage error for ${key}:`, error);
          return false;
        }
      }
    },

    /**
     * Safely get item from localStorage with error handling
     * @param {string} key - localStorage key
     * @returns {string|null} - value or null if not found/error
     */
    _safeLocalStorageGet: function (key) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error(`[TLM] localStorage read error for ${key}:`, error);
        return null;
      }
    },

    // CRITICAL FIX #7: Centralized authentication flags clearing
    // Single source of truth for clearing flags - prevents inconsistent clearing across codebase
    /**
     * Centralized authentication flags clearing
     * @param {string} level - 'redirect_success', 'token_acquired', 'loop_clear', 'full_reset'
     */
    _clearAuthenticationFlags: function (level = 'redirect_success') {
      console.log(`[TLM] Clearing authentication flags - level: ${level}`);

      switch (level) {
        case 'redirect_success':
          // Called from handleRedirectPromise after successful redirect
          // NOTE: Do NOT clear tlm_just_authenticated here - let acquireTokenWithFallback handle it
          // This prevents race condition where flag cleared before it's checked
          localStorage.removeItem('tlm_redirect_attempts');
          localStorage.removeItem('tlm_last_redirect_time');
          localStorage.removeItem('tlm_aad_loop_detected');
          this._tokenAttemptFailureCount = 0;
          this._redirectInProgress = false;
          this._lastTokenAttempt = 0; // Reset cooldown for immediate token acquisition
          break;

        case 'token_acquired':
          // Called from acquireTokenWithFallback after successful token acquisition
          // Safe to clear just_authenticated here since token is now available
          localStorage.removeItem('tlm_just_authenticated');
          localStorage.removeItem('tlm_redirect_attempts');
          localStorage.removeItem('tlm_last_redirect_time');
          this._tokenAttemptFailureCount = 0;
          break;

        case 'loop_clear':
          // Called when user manually clears loop state or auto-clearing stale flags
          localStorage.removeItem('tlm_aad_loop_detected');
          localStorage.removeItem('tlm_redirect_attempts');
          localStorage.removeItem('tlm_last_redirect_time');
          localStorage.removeItem('tlm_just_authenticated');
          localStorage.removeItem('tlm_intended_url');
          this._tokenAttemptFailureCount = 0;
          this._redirectInProgress = false;
          break;

        case 'full_reset':
          // Called on logout or complete reset
          const authKeys = [
            'tlm_aad_loop_detected',
            'tlm_azure_token',
            'tlm_token_expiry',
            'tlm_intended_url',
            'tlm_redirect_attempts',
            'tlm_last_redirect_time',
            'tlm_token_refresh_lock',
            'tlm_last_login_hint',
            'tlm_just_authenticated',
            'tlm_token_ready'
          ];
          authKeys.forEach(key => localStorage.removeItem(key));

          this._tokenRefreshInProgress = false;
          this._redirectInProgress = false;
          this._initializationPromise = null;
          this._tokenAttemptFailureCount = 0;
          this._lastTokenAttempt = 0;
          this.azureToken = null;
          break;

        default:
          // SECURITY FIX: Handle invalid level parameter
          console.warn(`[TLM] _clearAuthenticationFlags called with invalid level: ${level}`);
          console.warn('[TLM] No flags cleared. Valid levels: redirect_success, token_acquired, loop_clear, full_reset');
          break;
      }

      console.log(`[TLM] Flags cleared successfully - level: ${level}`);
    },

    // CRITICAL FIX #8: Detect and clear stale flags from previous session (Desktop specific)
    // Prevents false loop detection when user returns after extended inactivity (>2 hours)
    /**
     * Clear authentication flags if browser was closed/inactive for >2 hours
     * Detects "return after session gap" scenario on desktop browsers
     */
    _checkAndClearStaleFlags: function () {
      const lastActive = localStorage.getItem('tlm_last_active');
      const now = Date.now();

      if (lastActive) {
        const inactiveDuration = now - parseInt(lastActive);

        // SECURITY FIX: Safeguard against system clock changes (negative time differences)
        if (inactiveDuration < 0) {
          console.warn(`[TLM] Negative time difference detected - system clock may have changed`);
          console.warn(`[TLM] Clearing stale flags as safeguard`);
          this._clearAuthenticationFlags('loop_clear');
        }
        // If inactive for >2 hours, clear authentication flags (session gap)
        else if (inactiveDuration > 7200000) { // 2 hours = 7200000ms
          console.log(`[TLM] Detected inactivity of ${Math.floor(inactiveDuration / 60000)} minutes - clearing stale flags`);
          console.log(`[TLM] Last active: ${new Date(parseInt(lastActive)).toISOString()}`);
          this._clearAuthenticationFlags('loop_clear');
        } else {
          console.log(`[TLM] Session continuous - inactive for ${Math.floor(inactiveDuration / 60000)} minutes`);
        }
      } else {
        console.log('[TLM] First time tracking activity - setting baseline');
      }

      // Update last active timestamp
      localStorage.setItem('tlm_last_active', now.toString());
    },

    // Enhanced Authentication State Clearing
    clearAuthenticationLoopState: function () {
      console.log('[TLM] Clearing authentication loop state...');

      // CRITICAL FIX #7: Use centralized flag clearing instead of manual clearing
      this._clearAuthenticationFlags('loop_clear');

      // Clear tokens
      localStorage.removeItem('tlm_azure_token');
      localStorage.removeItem('tlm_token_expiry');
      localStorage.removeItem('tlm_last_login_hint');

      // Clear MSAL cache
      if (this.msalInstance) {
        try {
          const accounts = this.msalInstance.getAllAccounts();
          accounts.forEach(account => {
            this.msalInstance.removeAccount(account);
          });
        } catch (error) {
          console.warn('[TLM] Error clearing MSAL accounts:', error);
        }
      }

      console.log('[TLM] All authentication state cleared');
    },

    // Enhanced Clear All Authentication State
    clearAllAuthState: function () {
      console.log("[TLM] Clearing all authentication state...");

      // CRITICAL FIX #7: Use centralized flag clearing
      this._clearAuthenticationFlags('full_reset');

      // Clear MSAL cache
      if (this.msalInstance) {
        try {
          this.msalInstance.clearCache();
        } catch (e) {
          console.warn("[TLM] MSAL cache clear failed:", e);
        }
      }
    },

    /* ===============================================
       2. ENHANCED AUTHENTICATION & TOKEN MANAGEMENT
    =============================================== */

    // Enhanced Dependency Check with Retry Logic
    checkDependencies: async function () {
      console.log('[TLM] Checking dependencies...');

      const dependencies = [
        {
          name: 'jQuery',
          check: () => typeof window.$ !== 'undefined' && typeof window.jQuery !== 'undefined',
          critical: true
        },
        {
          name: 'MSAL',
          check: () => typeof window.msal !== 'undefined',
          critical: true
        },
        {
          name: 'Kendo',
          check: () => typeof window.kendo !== 'undefined',
          critical: false
        },
        {
          name: 'KendoLicensing',
          check: () => typeof window.KendoLicensing !== 'undefined',
          critical: false
        }
      ];

      const maxWait = 20000; // Increased to 20 seconds
      const checkInterval = 500;
      let waited = 0;

      while (waited < maxWait) {
        const missingDeps = dependencies.filter(dep => !dep.check());
        const criticalMissing = missingDeps.filter(dep => dep.critical);

        if (criticalMissing.length === 0) {
          console.log('[TLM] Critical dependencies loaded successfully');

          const nonCriticalMissing = missingDeps.filter(dep => !dep.critical);
          if (nonCriticalMissing.length > 0) {
            console.warn('[TLM] Non-critical dependencies still loading:', nonCriticalMissing.map(d => d.name));
          }

          this._dependenciesLoaded = true;
          return true;
        }

        console.log('[TLM] Waiting for critical dependencies:', criticalMissing.map(d => d.name));
        await new Promise(resolve => setTimeout(resolve, checkInterval));
        waited += checkInterval;
      }

      const finalMissingDeps = dependencies.filter(dep => !dep.check());
      const finalCriticalMissing = finalMissingDeps.filter(dep => dep.critical);

      if (finalCriticalMissing.length > 0) {
        console.error('[TLM] Critical dependencies failed to load:', finalCriticalMissing.map(d => d.name));
        return false;
      }

      this._dependenciesLoaded = true;
      return true;
    },

    // Enhanced Main Initialization with Better Error Handling
    initialize: async function (spfxContext = null) {
      // Prevent multiple initialization
      if (this._isInitializing || this._initializationPromise) {
        console.log('[TLM] Initialization already in progress, waiting...');
        return this._initializationPromise;
      }

      this._isInitializing = true;
      this._initializationPromise = this._doInitialize(spfxContext);

      try {
        const result = await this._initializationPromise;
        return result;
      } finally {
        this._isInitializing = false;
      }
    },

    _trackUserActivity: function () {
      this._lastUserActivity = Date.now();
    },

    // Enhanced Initialization Process
    _doInitialize: async function (spfxContext) {
      try {
        console.log('[TLM] Starting enhanced initialization...');

        // CRITICAL FIX #8: Check for stale flags from previous session (Desktop specific)
        // This prevents false loop detection when user returns after 2+ hours
        this._checkAndClearStaleFlags();

        // Check for AAD loop error
        if (this.isLoopDetected()) {
          console.error('[TLM] Loop detected, blocking initialization');
          this.showLoopDetectedDialog();
          return false;
        }

        // Standard Setup
        if (spfxContext) {
          this._spfxContext = spfxContext;
        }

        // Check dependencies with retry
        const depsLoaded = await this.checkDependencies();
        if (!depsLoaded) {
          throw new Error('Critical dependencies failed to load after retries');
        }

        // Update configuration
        const config = getEnvironmentConfig();
        Object.assign(this, config);

        // Initialize MSAL with enhanced patterns
        await this._initializeMsalEnhanced();

        // Enhanced token acquisition with fallback strategy
        await this._performInitialTokenAcquisition();

        // Setup event listeners
        this._setupEventListeners();

        console.log('[TLM] Enhanced initialization completed successfully');
        return true;

      } catch (error) {
        console.error('[TLM] CRITICAL Enhanced initialization failed:', error);
        this._initializationPromise = null;
        this._isInitializing = false;

        // Handle specific error types
        if (error.message && error.message.includes('AADSTS50196')) {
          localStorage.setItem('tlm_aad_loop_detected', 'true');
        }

        throw error;
      }
    },

    // Enhanced Initial Token Acquisition Strategy
    _performInitialTokenAcquisition: async function () {
      console.log('[TLM] Starting initial token acquisition...');

      // Check for existing valid token first
      const token = localStorage.getItem('tlm_azure_token');
      const expiry = localStorage.getItem('tlm_token_expiry');
      const now = Date.now();

      if (token && expiry && parseInt(expiry) > now) {
        console.log('[TLM] Valid token found in localStorage');
        this.azureToken = token;

        // ✅ iOS WebKit: ซ่อน notification ถ้ามี token อยู่แล้ว
        this._checkAndHideSafariNotification();

        return true;
      }

      // Attempt token acquisition with enhanced fallback
      const tokenResult = await this.acquireTokenWithFallback();

      if (tokenResult && tokenResult.accessToken) {
        console.log('[TLM] Initial token acquisition successful');

        // ✅ iOS WebKit: ซ่อน notification เมื่อได้ token แล้ว
        this._checkAndHideSafariNotification();

        return true;
      }

      // Handle first-time authentication
      return await this._handleFirstTimeAuthentication();
    },

    // Enhanced First-Time Authentication Handler
    _handleFirstTimeAuthentication: async function () {
      console.log('[TLM] Handling first-time authentication...');

      // 🚫 iOS WebKit: ไม่ควรมาถึงที่นี่ เพราะใช้ popup เท่านั้น
      if (this._isIOSWebKit()) {
        console.log('[TLM][iOS WebKit] ⚠️ Should not reach _handleFirstTimeAuthentication - iOS WebKit uses POPUP only');
        // แสดง notification แทนการทำ redirect
        this._showSafariMobileSetupNotification();
        return false;
      }

      // ป้องกันการเรียก authentication หลายครั้งพร้อมกัน
      if (this._authenticationInProgress) {
        console.log('[TLM] Authentication already in progress, aborting...');
        return false;
      }

      // ตรวจสอบว่าเพิ่งกลับมาจากการ authentication หรือไม่
      const hasJustAuthenticated = localStorage.getItem('tlm_just_authenticated') === 'true';
      if (hasJustAuthenticated) {
        console.log('[TLM] Just authenticated flag detected, clearing and waiting...');
        localStorage.removeItem('tlm_just_authenticated');

        // รอนานขึ้นสำหรับ mobile devices
        const waitTime = this._isMobileDevice() ? 3000 : 1500;
        await new Promise(resolve => setTimeout(resolve, waitTime));

        // พยายาม get token อีกครั้ง
        const tokenResult = await this.acquireTokenWithFallback();
        if (tokenResult && tokenResult.accessToken) {
          console.log('[TLM] Token acquired after authentication redirect');

          // จัดการ intended URL redirect
          const intendedUrl = localStorage.getItem('tlm_intended_url');
          if (intendedUrl && intendedUrl !== window.location.href) {
            localStorage.removeItem('tlm_intended_url');
            await new Promise(resolve => setTimeout(resolve, 500));
            window.location.href = intendedUrl;
            return new Promise(() => { }); // Never resolve, wait for redirect
          }

          return true;
        }
      }

      // ตั้งค่าสถานะว่ากำลัง authenticate
      this._authenticationInProgress = true;

      try {
        // === Mobile Device Handling (iOS และ Android) ===
        if (this._isMobileDevice()) {
          console.log('[TLM] Mobile device - initiating mobile-friendly authentication');

          // 🚫 iOS WebKit: ไม่ทำ redirect - ใช้ popup เท่านั้น
          if (this._isIOSWebKit()) {
            console.log('[TLM][iOS WebKit] ⚠️ Mobile redirect blocked - iOS WebKit uses POPUP only');
            this._showSafariMobileSetupNotification();
            this._authenticationInProgress = false;
            return false;
          }

          // Non-iOS Mobile: ตรวจสอบว่าอยู่ในกระบวนการ redirect อยู่หรือไม่
          const existingIntendedUrl = localStorage.getItem('tlm_intended_url');
          if (existingIntendedUrl && existingIntendedUrl === window.location.href) {
            console.log('[TLM] Already in redirect process, waiting...');
            return false;
          }

          // เก็บ URL ปัจจุบัน และตั้งค่า flag
          localStorage.setItem('tlm_intended_url', window.location.href);
          // CRITICAL FIX #1: Store timestamp instead of boolean
          localStorage.setItem('tlm_just_authenticated', Date.now().toString());

          // Non-iOS Mobile: สำหรับ Android และ mobile อื่นๆ
          const loginRequest = {
            scopes: this._scopes,
            redirectUri: this.dynamicRedirectUri,
            authority: `https://login.microsoftonline.com/${this.tenantID}`,
            prompt: "select_account",
            responseMode: 'fragment',
            state: kendo.guid()
          };

          try {
            console.log('[TLM] Non-iOS Mobile: Starting loginRedirect...');
            await this.msalInstance.loginRedirect(loginRequest);
            return new Promise(() => { }); // Never resolve, wait for redirect
          } catch (redirectError) {
            console.error('[TLM] Mobile redirect failed:', redirectError);

            // ตรวจสอบ error code สำหรับ mobile
            if (redirectError.errorCode === 'AADSTS50196' ||
              (redirectError.message && redirectError.message.includes('AADSTS50196'))) {
              localStorage.setItem('tlm_aad_loop_detected', 'true');
            }

            // Fallback สำหรับ non-iOS mobile
            this._showMobileAuthDialog();
            return false;
          }
        }

        // === Desktop Handling ===
        console.log('[TLM] Desktop device - using standard authentication flow');

        const redirectAttempts = parseInt(localStorage.getItem('tlm_redirect_attempts') || '0');
        const lastRedirectTime = parseInt(localStorage.getItem('tlm_last_redirect_time') || '0');
        const now = Date.now();

        // Reset counter หากเวลาผ่านไปนานพอ
        if (now - lastRedirectTime > 3600000) { // 1 ชั่วโมง
          localStorage.setItem('tlm_redirect_attempts', '0');
          localStorage.removeItem('tlm_last_redirect_time');
        }

        if (redirectAttempts >= 3) {
          console.error('[TLM] Too many redirect attempts, showing manual auth dialog');
          this._showManualAuthDialog();
          return false;
        }

        // อัพเดท counter
        localStorage.setItem('tlm_redirect_attempts', (redirectAttempts + 1).toString());
        localStorage.setItem('tlm_last_redirect_time', now.toString());
        localStorage.setItem('tlm_intended_url', window.location.href);
        // CRITICAL FIX #1: Store timestamp instead of boolean
        localStorage.setItem('tlm_just_authenticated', now.toString());

        console.log('[TLM] Desktop: Initiating redirect authentication...');

        // CRITICAL FIX #6: Wrap in try-finally to ensure auth flag cleared on error
        try {
          await this.msalInstance.loginRedirect({
            scopes: this._scopes,
            prompt: "select_account",
            authority: `https://login.microsoftonline.com/${this.tenantID}`,
            redirectUri: this.dynamicRedirectUri
          });

          return new Promise(() => { }); // Never resolve, wait for redirect

        } catch (redirectError) {
          console.error('[TLM] Desktop redirect authentication failed:', redirectError);

          if (redirectError.message && redirectError.message.includes('AADSTS50196')) {
            localStorage.setItem('tlm_aad_loop_detected', 'true');
          }

          this._showManualAuthDialog();
          return false;
        }

      } finally {
        // เคลียร์สถานะ authentication in progress
        this._authenticationInProgress = false;
      }
    },

    //  function สำหรับแสดง dialog เฉพาะ mobile
    _showMobileAuthDialog: function () {
      this.showAlertDialog({
        title: "การล็อกอินบนอุปกรณ์มือถือ",
        content: "การล็อกอินอัตโนมัติล้มเหลว กรุณาลองทำตามขั้นตอนเหล่านี้:<br><br>" +
          "1. รีเฟรชหน้าเว็บ (ลากลงมาที่หน้าเว็บ)<br>" +
          "2. ล้างข้อมูลเว็บไซต์ใน Safari<br>" +
          "3. ปิดและเปิด Safari ใหม่<br>" +
          "4. หากยังไม่ได้ กรุณาติดต่อ IT Support<br>",
        isError: true,
        width: "90%",
        onOk: function () {
          // ลองรีเฟรชหน้าเว็บ
          window.location.reload();
        }
      });
    },


    // Enhanced Manual Authentication Dialog
    _showManualAuthDialog: function () {
      this.showAlertDialog({
        title: "Manual Authentication Required",
        content: "Automatic authentication failed. Please:<br><br>" +
          "1. Clear your browser cache completely<br>" +
          "2. Close all browser windows<br>" +
          "3. Open a new browser session<br>" +
          "4. Try using private/incognito mode<br><br>" +
          "If the problem persists, contact IT support.",
        isError: true,
        width: "450px",
        onOk: function () {
          localStorage.clear();
          window.location.href = tlm.global.webBaseUrl;
        }
      });
    },

    // ===================================================
    // iOS WebKit Popup Authentication Handler (SIMPLE - NO GUIDANCE)
    // ===================================================
    _safariMobilePopupAuth: async function () {
      console.log('[TLM][iOS WebKit] 🚀 Starting simple popup authentication...');

      // SIMPLE MODE: ถ้า popup block ก็ไม่ทำอะไร ไม่แสดง guidance
      // ให้ notification bar ด้านบนจัดการแทน
      try {
        return await this._performSafariPopupLogin();
      } catch (error) {
        console.log('[TLM][iOS WebKit] Popup authentication failed:', error.errorCode || error.message);
        // ไม่ทำอะไร - ปล่อยให้ระบบแสดง notification เอง
        return false;
      }
    },

    /**
     * Show iOS WebKit Setup Notification (Minimal UI)
     * แสดงเฉพาะเมื่อไม่มี token บน iOS WebKit (Safari/Chrome/Edge)
     */
    _showSafariMobileSetupNotification: function () {
      console.log('[TLM][iOS WebKit] 📢 _showSafariMobileSetupNotification called');

      // ตรวจสอบว่ามี token อยู่แล้วหรือไม่ - ถ้ามีก็ไม่ต้องแสดง notification
      const cachedToken = localStorage.getItem('tlm_azure_token');
      const tokenExpiry = localStorage.getItem('tlm_token_expiry');
      const now = Date.now();

      if (cachedToken && tokenExpiry && parseInt(tokenExpiry) > now) {
        console.log('[TLM][iOS WebKit] Token exists - hiding notification instead of showing');
        this._hideSafariMobileSetupNotification();
        return;
      }

      // ตรวจสอบว่ามี notification อยู่แล้วหรือไม่
      if (document.getElementById('tlm-safari-noti')) {
        console.log('[TLM][iOS WebKit] Notification already exists, skipping');
        return;
      }

      console.log('[TLM][iOS WebKit] Creating notification element...');

      // CRITICAL FIX #5: Detect specific iOS browser name
      const ua = navigator.userAgent;
      const browserName = this._getIOSBrowserName(ua);
      console.log('[TLM][iOS WebKit] Detected browser:', browserName);

      // CRITICAL FIX #5: Browser-specific instructions
      let browserInstructions = '';
      if (browserName === 'Safari') {
        browserInstructions = `
          <div style="font-size: 14px; color: #323130; line-height: 1.5;">
            เลื่อนลงมาและเลือก <strong>Safari</strong>
          </div>`;
      } else if (browserName === 'Chrome') {
        browserInstructions = `
          <div style="font-size: 14px; color: #323130; line-height: 1.5;">
            เลื่อนลงมาและเลือก <strong>Chrome</strong><br>
            <span style="font-size: 12px; color: #605e5c;">(ไอคอนวงกลม สีแดง เหลือง เขียว น้ำเงิน)</span>
          </div>`;
      } else if (browserName === 'Edge') {
        browserInstructions = `
          <div style="font-size: 14px; color: #323130; line-height: 1.5;">
            เลื่อนลงมาและเลือก <strong>Edge</strong><br>
            <span style="font-size: 12px; color: #605e5c;">(ไอคอนรูปคลื่น สีน้ำเงิน)</span>
          </div>`;
      } else {
        browserInstructions = `
          <div style="font-size: 14px; color: #323130; line-height: 1.5;">
            เลื่อนลงมาและเลือก <strong>${browserName}</strong><br>
            <span style="font-size: 12px; color: #605e5c;">(เบราว์เซอร์ที่คุณกำลังใช้งาน)</span>
          </div>`;
      }

      const noti = document.createElement('div');
      noti.id = 'tlm-safari-noti';
      noti.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border: none;
        border-radius: 16px;
        padding: 0;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
        z-index: 999999;
        width: 90%;
        max-width: 400px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        overflow: hidden;
      `;

      noti.innerHTML = `
        <style>
          @keyframes slideIn {
            from { 
              transform: translate(-50%, -50%) scale(0.9);
              opacity: 0;
            }
            to { 
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
          }
          @keyframes slideOut {
            from { 
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            to { 
              transform: translate(-50%, -50%) scale(0.9);
              opacity: 0;
            }
          }
          #tlm-safari-refresh-btn:active {
            transform: scale(0.96);
          }
        </style>
        
        <!-- Header Bar -->
        <div style="
          background: linear-gradient(135deg, #0078d4 0%, #106ebe 100%);
          padding: 20px;
          text-align: center;
        ">
          <div style="
            font-size: 32px;
            margin-bottom: 8px;
          ">🔐</div>
          <div style="
            font-size: 18px;
            font-weight: 600;
            color: #ffffff;
            letter-spacing: -0.3px;
          ">ต้องการความช่วยเหลือ (${browserName})</div>
        </div>

        <!-- Content -->
        <div style="padding: 24px 20px;">
          <!-- Primary CTA Section -->
          <div style="
            font-size: 16px;
            color: #323130;
            font-weight: 600;
            line-height: 1.6;
            margin-bottom: 20px;
            text-align: center;
          ">
            URL หลัง redirect กลับมาเป็นยังไง (มี #code= ไหม)URL หลัง redirect กลับมาเป็นยังไง (มี #code= ไหม)
          </div>

          <!-- Safari iOS Explanation -->
          <div style="
            background: #e7f3ff;
            border-left: 4px solid #0078d4;
            border-radius: 4px;
            padding: 14px;
            margin-bottom: 20px;
            font-size: 13px;
            color: #323130;
            line-height: 1.6;
          ">
            <div style="margin-bottom: 8px;">
              <strong>📱 สำหรับ Safari บน iPhone/iPad:</strong>
            </div>
            <div>
              Safari มีระบบรักษาความปลอดภัยพิเศษ 
              ทำให้ต้องใช้วิธีการเข้าสู่ระบบที่แตกต่างจากเบราว์เซอร์อื่น
            </div>
          </div>

          <!-- Action Button - Primary -->
          <button id="tlm-safari-refresh-btn" style="
            width: 100%;
            background: linear-gradient(135deg, #0078d4 0%, #106ebe 100%);
            color: white;
            border: none;
            padding: 16px 24px;
            border-radius: 10px;
            font-size: 17px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(0, 120, 212, 0.3);
            letter-spacing: -0.2px;
            margin-bottom: 20px;
          ">
            เข้าสู่ระบบ
          </button>

          <!-- Optional Settings Section (Collapsible) -->
          <details style="margin-bottom: 16px;">
            <summary style="
              font-size: 14px;
              color: #0078d4;
              cursor: pointer;
              padding: 8px 0;
              list-style: none;
              display: flex;
              align-items: center;
              gap: 6px;
            ">
              <span>⚙️</span>
              <span style="text-decoration: underline;">ต้องการเข้าสู่ระบบเร็วขึ้น? (ไม่บังคับ)</span>
            </summary>
            
            <div style="
              background: #f3f2f1;
              border-radius: 8px;
              padding: 14px;
              margin-top: 10px;
              font-size: 13px;
              line-height: 1.6;
            ">
              <div style="margin-bottom: 12px; color: #605e5c;">
                หากต้องการให้ป๊อปอัพเข้าสู่ระบบแสดงโดยอัตโนมัติ สามารถตั้งค่าได้ดังนี้:
              </div>

              <div style="margin-bottom: 8px;">
                <strong>1.</strong> เปิดแอป <strong>การตั้งค่า (Settings)</strong>
              </div>

              <div style="margin-bottom: 8px;">
                <strong>2.</strong> ${browserInstructions.replace('<div style="font-size: 14px; color: #323130; line-height: 1.5;">', '').replace('</div>', '')}
              </div>

              <div style="margin-bottom: 8px;">
                <strong>3.</strong> ค้นหาและ <strong>ปิด</strong> "ปิดกั้นป๊อปอัพ" (Block Pop-ups)
              </div>

              <div>
                <strong>4.</strong> กลับมากดปุ่ม "เข้าสู่ระบบ" ด้านบน
              </div>
            </div>
          </details>

          <!-- Info Note -->
          <div style="
            font-size: 12px;
            color: #8a8886;
            line-height: 1.5;
            text-align: center;
          ">
            💡 <strong>วิธีง่ายที่สุด:</strong> กดปุ่ม "เข้าสู่ระบบ" ด้านบน<br>
            ระบบจะจัดการทุกอย่างให้คุณโดยอัตโนมัติ
          </div>

          <!-- Removed Steps Section - now in collapsible details -->

          <!-- Footer Note -->
          <div style="
            margin-top: 16px;
            text-align: center;
            font-size: 12px;
            color: #8a8886;
            line-height: 1.4;
          ">
            ใช้ได้กับ Safari และ Chrome บน iOS<br>
            หากพบปัญหา กรุณาติดต่อ IT Support
          </div>
        </div>
      `;

      document.body.appendChild(noti);
      console.log('[TLM][iOS WebKit] ✅ Notification element appended to body');

      // 🔥 CRITICAL FIX: Login button handler - Trigger authentication DIRECTLY (no reload)
      // This fixes the infinite loop issue where button reload → no token → shows notification again
      document.getElementById('tlm-safari-refresh-btn').addEventListener('click', async () => {
        console.log('[TLM][iOS WebKit] 🔐 Login button clicked');

        // Visual feedback
        const btn = document.getElementById('tlm-safari-refresh-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span style="opacity: 0.7;">⏳ กำลังเข้าสู่ระบบ...</span>';
        btn.disabled = true;
        btn.style.opacity = '0.7';
        btn.style.cursor = 'not-allowed';

        try {
          // CRITICAL: Reset attempt counter BEFORE calling auth (allows retry)
          console.log('[TLM][iOS WebKit] Resetting popup attempt counter');
          tlm.global._safariPopupAttempts = 0;
          sessionStorage.removeItem('tlm_safari_popup_attempts'); // Changed from localStorage
          localStorage.removeItem('tlm_safari_last_attempt_time');

          // CRITICAL: Set flag to prevent duplicate notification
          tlm.global._showingPopupGuidance = false;

          // CRITICAL FIX: Call authentication DIRECTLY instead of location.reload()
          // This allows immediate authentication without page reload
          console.log('[TLM][iOS WebKit] Calling _performSafariPopupLogin() directly...');
          const success = await tlm.global._performSafariPopupLogin();

          if (success) {
            console.log('[TLM][iOS WebKit] ✅ Authentication successful via button');
            // Notification hides automatically in _performSafariPopupLogin
            // No reload needed - token is ready immediately for AJAX calls
          } else {
            // Authentication failed (user cancelled or popup blocked)
            console.log('[TLM][iOS WebKit] ⚠️ Authentication failed or cancelled');

            // Restore button state
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';

            // Check if max attempts reached after this failure
            if (tlm.global._safariPopupAttempts >= tlm.global.MAX_SAFARI_POPUP_ATTEMPTS) {
              btn.innerHTML = '❌ ไม่สามารถเข้าสู่ระบบได้';
              btn.style.background = '#d13438';

              // Show error in notification
              const noti = document.getElementById('tlm-safari-noti');
              if (noti) {
                const contentDiv = noti.querySelector('[style*="padding: 24px 20px"]');
                if (contentDiv) {
                  const errorDiv = document.createElement('div');
                  errorDiv.style.cssText = `
                    background: #fde7e9;
                    border-left: 4px solid #d13438;
                    border-radius: 4px;
                    padding: 12px 16px;
                    margin-top: 16px;
                    font-size: 13px;
                    color: #323130;
                  `;
                  errorDiv.innerHTML = `
                    <strong>ไม่สามารถเข้าสู่ระบบได้</strong><br>
                    กรุณาลองรีเฟรชหน้าเว็บ หรือติดต่อ IT Support
                  `;
                  contentDiv.appendChild(errorDiv);
                }
              }
            }
          }
        } catch (error) {
          console.error('[TLM][iOS WebKit] ❌ Button handler error:', error);

          // Restore button state on error
          btn.innerHTML = originalText;
          btn.disabled = false;
          btn.style.opacity = '1';
          btn.style.cursor = 'pointer';

          // Show error message
          tlm.global.showAlertDialog({
            title: "เกิดข้อผิดพลาด",
            content: "ไม่สามารถเริ่มกระบวนการล็อกอินได้<br>กรุณาลองใหม่อีกครั้งหรือรีเฟรชหน้าเว็บ",
            isError: true
          });
        }
      });

      console.log('[TLM][iOS WebKit] 📢 iOS WebKit setup notification displayed successfully');
    },

    /**
     * Hide iOS WebKit Setup Notification
     * ซ่อนเมื่อได้ token แล้ว
     */
    _hideSafariMobileSetupNotification: function () {
      console.log('[TLM][iOS WebKit] 🔇 _hideSafariMobileSetupNotification called');
      const noti = document.getElementById('tlm-safari-noti');
      if (noti) {
        console.log('[TLM][iOS WebKit] Found notification element, removing...');
        noti.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
          noti.remove();
          console.log('[TLM][iOS WebKit] ✅ iOS WebKit setup notification hidden');
        }, 300);
      } else {
        console.log('[TLM][iOS WebKit] No notification element found to hide');
      }
    },

    /**
     * SAFARI iOS ONLY: Show token parsing loader
     * Purpose: Prevent race condition when Safari iOS does in-place redirect
     * Safari iOS behavior: redirect กลับมาแต่ page ยัง same context → Dashboard load ก่อน token parse
     * Chrome iOS/Desktop: full page reload → sequential loading → no race condition
     */
    _showTokenParsingLoader: function () {
      console.log('[TLM][Safari iOS] 🔄 Showing token parsing loader to prevent race condition');

      // Check if loader already exists
      if (document.getElementById('tlm-token-parsing-loader')) {
        console.log('[TLM][Safari iOS] Loader already exists, skipping');
        return;
      }

      const loader = document.createElement('div');
      loader.id = 'tlm-token-parsing-loader';
      loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.95);
        z-index: 9999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      `;

      loader.innerHTML = `
        <div style="text-align: center; padding: 30px;">
          <div style="
            width: 50px;
            height: 50px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #0078d4;
            border-radius: 50%;
            margin: 0 auto 20px;
            animation: spin 1s linear infinite;
          "></div>
          <div style="
            font-size: 18px;
            font-weight: 600;
            color: #323130;
            margin-bottom: 8px;
          ">🔐 กำลังเข้าสู่ระบบ</div>
          <div style="
            font-size: 14px;
            color: #605e5c;
          ">กรุณารอสักครู่...</div>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;

      document.body.appendChild(loader);
      console.log('[TLM][Safari iOS] ✅ Token parsing loader displayed');

      // Note: Loader will stay visible until:
      // 1. Token is ready (normal case) - hidden in _performSafariPopupLogin success path
      // 2. Authentication fails/cancelled - hidden in error path
      // 3. Page visibility change without token - auto-cleanup
      // No fixed timeout - handles slow user input gracefully
    },

    /**
     * SAFARI iOS ONLY: Hide token parsing loader
     * Called when token parsing completes (success or error)
     */
    _hideTokenParsingLoader: function () {
      console.log('[TLM][Safari iOS] 🔄 Hiding token parsing loader');
      
      const loader = document.getElementById('tlm-token-parsing-loader');
      if (loader) {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.3s ease-out';
        setTimeout(() => {
          loader.remove();
          console.log('[TLM][Safari iOS] ✅ Token parsing loader removed');
        }, 300);
      } else {
        console.log('[TLM][Safari iOS] No loader found to hide');
      }
    },    /**
     * Check and hide iOS WebKit notification if token exists
     * เรียกใช้เมื่อ page load หรือเมื่อได้ token
     */
    _checkAndHideSafariNotification: function () {
      if (!this._isIOSWebKit()) {
        return; // ไม่ใช่ iOS WebKit ไม่ต้องทำอะไร
      }

      const cachedToken = localStorage.getItem('tlm_azure_token');
      const tokenExpiry = localStorage.getItem('tlm_token_expiry');
      const now = Date.now();

      // ถ้ามี token ที่ valid ให้ซ่อน notification
      if (cachedToken && tokenExpiry && parseInt(tokenExpiry) > now) {
        console.log('[TLM][iOS WebKit] Valid token found - hiding notification');
        this._hideSafariMobileSetupNotification();

        // CRITICAL FIX #4: Reset ALL popup attempts counters and flags
        sessionStorage.removeItem('tlm_safari_popup_attempts');
        localStorage.removeItem('tlm_safari_last_attempt_time');
        this._safariPopupAttempts = 0; // Reset memory counter
        this._waitingForToken = false; // Clear waiting state
        this._tokenReady = true; // Set token ready flag
        console.log('[TLM][iOS WebKit] All counters and flags reset');

        // CRITICAL FIX #4: Verify MSAL account state
        if (this.msalInstance) {
          const accounts = this.msalInstance.getAllAccounts();
          if (accounts.length > 0) {
            const activeAccount = this.msalInstance.getActiveAccount();
            if (!activeAccount) {
              this.msalInstance.setActiveAccount(accounts[0]);
              console.log('[TLM][iOS WebKit] Set active account:', accounts[0].username);
            }
          }
        }

        // CRITICAL FIX #4: Dispatch dashboard ready event for app to proceed
        window.dispatchEvent(new CustomEvent('tlm_ready_for_dashboard'));
        console.log('[TLM][iOS WebKit] Dashboard ready event dispatched');
      }
    },

    /**
     * Perform popup authentication for iOS WebKit (Safari/Chrome/Edge) - NO RELOAD
     * Returns Promise<boolean> - true if successful, false if failed
     */
    _performSafariPopupLogin: async function () {
      console.log('[TLM][iOS WebKit] 🚀 Performing popup authentication (NO RELOAD)...');

      // 🎯 SAFARI iOS RACE CONDITION FIX: Show loader BEFORE authentication
      // Block Dashboard.js from loading while token is being acquired via popup
      if (this._isSafariIOS()) {
        console.log('[TLM][Safari iOS] 🔐 Showing loader - blocking Dashboard during popup auth...');
        this._showTokenParsingLoader();
      }

      try {
        // 🔥 CRITICAL FIX #2: Clear ALL MSAL interaction locks comprehensively before popup
        console.log('[TLM][iOS WebKit] 🗑️ Clearing all MSAL interaction locks...');

        const allKeys = Object.keys(localStorage);
        const lockKeys = allKeys.filter(k =>
          k.includes('interaction.status') ||
          k.includes('interaction_status') ||
          k.includes('interaction_in_progress') || // ADDED: New pattern for iOS
          k.includes('msal.interaction') ||
          k.includes('.interaction.') ||
          k.includes('.auth.request.') || // ADDED: Auth request pattern for stuck requests
          k.startsWith('msal.') && k.includes('interaction')
        );

        if (lockKeys.length > 0) {
          console.log(`[TLM][iOS WebKit] 🗑️ Found ${lockKeys.length} MSAL lock keys:`, lockKeys);
          lockKeys.forEach(key => {
            localStorage.removeItem(key);
            console.log(`[TLM][iOS WebKit] 🗑️ Removed: ${key}`);
          });
        }

        // Also clear sessionStorage locks with expanded patterns
        const sessionLockKeys = Object.keys(sessionStorage).filter(k =>
          k.includes('interaction.status') ||
          k.includes('interaction_status') ||
          k.includes('interaction_in_progress') || // ADDED: New pattern
          k.includes('msal.interaction') ||
          k.includes('.auth.request.') // ADDED: Auth request pattern
        );

        if (sessionLockKeys.length > 0) {
          console.log(`[TLM][iOS WebKit] 🗑️ Found ${sessionLockKeys.length} sessionStorage lock keys`);
          sessionLockKeys.forEach(key => {
            sessionStorage.removeItem(key);
            console.log(`[TLM][iOS WebKit] 🗑️ Removed from session: ${key}`);
          });
        }

        // CRITICAL FIX #2: Increase delay from 500ms to 800ms for iOS
        // iOS WebKit needs more time to fully process localStorage operations
        console.log('[TLM][iOS WebKit] ⏳ Waiting 800ms for lock clear to settle on iOS...');
        await new Promise(resolve => setTimeout(resolve, 800));

        // CRITICAL FIX #2: Add iOS-specific parameters for better compatibility
        const loginRequest = {
          scopes: this._scopes,
          redirectUri: this.dynamicRedirectUri,
          prompt: 'select_account',
          extraQueryParameters: {
            domain_hint: 'organizations', // Hint for organizational accounts
            login_hint: localStorage.getItem('tlm_last_login_hint') || undefined // Reuse last login if available
          }
        };

        // � FIX: ใช้ loginPopup โดยตรงเพื่อป้องกัน account picker ขึ้น 2 ครั้ง
        // เมื่อผู้ใช้ clear cache, acquireTokenPopup จะ fail และ fallback ไป loginPopup
        // ทำให้เห็น account picker 2 ครั้ง → ใช้ loginPopup เลยจะเห็นครั้งเดียว
        console.log('[TLM][iOS WebKit] 🔓 Calling loginPopup (single account picker)...');
        const popupResult = await this.msalInstance.loginPopup(loginRequest);

        if (popupResult && popupResult.accessToken) {
          // 🔒 SECURITY: Verify popup origin to prevent phishing attacks
          const expectedOrigin = 'https://login.microsoftonline.com';
          if (popupResult.authority && !popupResult.authority.startsWith(expectedOrigin)) {
            console.error('[TLM][iOS WebKit] 🚨 SECURITY WARNING: Unexpected popup origin:', popupResult.authority);
            console.error('[TLM][iOS WebKit] Expected:', expectedOrigin);
            console.error('[TLM][iOS WebKit] Received:', popupResult.authority);
            // Don't use the token - potential phishing attempt
            return false;
          }

          console.log('[TLM][iOS WebKit] ✅ Token acquired successfully from verified origin');

          // Reset popup attempt counter on success (both memory and sessionStorage)
          this._safariPopupAttempts = 0;
          sessionStorage.removeItem('tlm_safari_popup_attempts');
          localStorage.removeItem('tlm_safari_last_attempt_time');
          console.log('[TLM][iOS WebKit] ♻️ Reset popup attempt counter and cleared attempt history');

          // Set active account
          this.msalInstance.setActiveAccount(popupResult.account);

          // Store token immediately (NO RELOAD)
          this.azureToken = `Bearer ${popupResult.accessToken}`;
          this._tokenReady = true;
          this._waitingForToken = false;

          const expiryTime = Date.now() + 3600000;
          localStorage.setItem('tlm_azure_token', `Bearer ${popupResult.accessToken}`);
          localStorage.setItem('tlm_token_expiry', expiryTime.toString());
          localStorage.setItem('tlm_token_ready', 'true');

          if (popupResult.account?.username) {
            localStorage.setItem('tlm_last_login_hint', popupResult.account.username);
          }

          // Dispatch event
          window.dispatchEvent(new CustomEvent('tlm_token_ready'));
          console.log('[TLM][iOS WebKit] 📢 Token ready event dispatched');

          // 🎯 SAFARI iOS RACE CONDITION FIX: Hide loader AFTER token is ready
          if (this._isSafariIOS()) {
            console.log('[TLM][Safari iOS] ✅ Token ready - hiding loader...');
            this._hideTokenParsingLoader();
          }

          // ✅ ซ่อน Safari notification เมื่อได้ token แล้ว
          this._hideSafariMobileSetupNotification();

          // ✅ Double check - ตรวจสอบและซ่อน notification อีกครั้งหลังจาก delay เล็กน้อย
          setTimeout(() => {
            this._checkAndHideSafariNotification();
          }, 1000);

          // Update status
          if (this.checkCurrentTokenStatus) {
            const status = this.checkCurrentTokenStatus();
            console.log('[TLM][iOS WebKit] ✅ Token status:', status);
          }

          console.log('[TLM][iOS WebKit] ✅ Authentication complete - NO RELOAD, ready to use');
          return true;

        } else {
          console.error('[TLM][iOS WebKit] ❌ No access token in result');

          // 🎯 SAFARI iOS: Hide loader on failure
          if (this._isSafariIOS()) {
            this._hideTokenParsingLoader();
          }

          return false;
        }

      } catch (error) {
        console.error('[TLM][iOS WebKit] ❌ Popup authentication error:', error);

        // 🎯 SAFARI iOS: Hide loader on error
        if (this._isSafariIOS()) {
          this._hideTokenParsingLoader();
        }

        // Check error type
        if (error.errorCode === 'user_cancelled') {
          console.log('[TLM][iOS WebKit] User cancelled popup');
          return false;
        }

        if (error.errorCode === 'popup_window_error' ||
          (error.message && error.message.includes('popup'))) {
          console.warn('[TLM][iOS WebKit] Popup blocked error');
          // Will retry from _safariMobilePopupAuth
          return false;
        }

        console.error('[TLM][iOS WebKit] Unexpected error:', error);
        return false;
      }
    },

    // Enhanced Token Validation and Refresh with Modern Patterns
    validateAndRefreshToken: async function () {
      if (this._disposed) return false;

      // iOS WebKit: STOP - no token refresh allowed
      if (this._isIOSWebKit()) {
        console.log('[TLM][iOS WebKit] ⚠️ validateAndRefreshToken blocked - popup authentication only');
        this._showSafariMobileSetupNotification();
        return false;
      }

      // Check for previous AAD loop detection
      if (this.isLoopDetected()) {
        console.warn('[TLM] Token refresh blocked due to loop detection');
        return false;
      }



      // Enhanced refresh lock mechanism
      if (this._tokenRefreshInProgress) {
        console.log("[TLM] Token refresh already in progress, waiting...");

        if (this._tokenRefreshPromise) {
          try {
            return await this._tokenRefreshPromise;
          } catch (e) {
            console.log("[TLM] Waiting for refresh failed:", e);
          }
        }

        // Fallback: wait a bit and check token again
        await new Promise(resolve => setTimeout(resolve, 2000));

        const cachedToken = localStorage.getItem('tlm_azure_token');
        const tokenExpiry = localStorage.getItem('tlm_token_expiry');
        const now = new Date().getTime();

        if (cachedToken && tokenExpiry && parseInt(tokenExpiry) > now) {
          this.azureToken = cachedToken;
          return true;
        }
      }

      // Set refresh lock
      this._tokenRefreshInProgress = true;
      localStorage.setItem('tlm_token_refresh_lock', 'locked');

      // Create enhanced refresh promise
      this._tokenRefreshPromise = this._performEnhancedTokenRefresh();

      try {
        return await this._tokenRefreshPromise;
      } finally {
        // Clear lock
        this._tokenRefreshInProgress = false;
        this._tokenRefreshPromise = null;
        localStorage.removeItem('tlm_token_refresh_lock');
      }
    },

    // Enhanced Token Refresh Process
    _performEnhancedTokenRefresh: async function () {
      // iOS WebKit: STOP - should never reach here
      if (this._isIOSWebKit()) {
        console.log('[TLM][iOS WebKit] ⚠️ _performEnhancedTokenRefresh should not be called');
        this._showSafariMobileSetupNotification();
        return false;
      }

      try {
        // Initialize MSAL if needed
        if (!this._msalReady || !this.msalInstance) {
          await this._initializeMsalEnhanced();
        }

        // Check current token status
        const cachedToken = localStorage.getItem('tlm_azure_token');
        const tokenExpiry = localStorage.getItem('tlm_token_expiry');
        const now = new Date().getTime();

        // Use enhanced token acquisition with fallback
        const tokenResult = await this.acquireTokenWithFallback({ forceRefresh: true });

        if (tokenResult && tokenResult.accessToken) {
          console.log("[TLM] Enhanced token refresh successful");
          return true;
        }

        // If enhanced acquisition fails, check if cached token is still valid
        if (cachedToken && tokenExpiry && parseInt(tokenExpiry) > now) {
          this.azureToken = cachedToken;
          console.log("[TLM] Using cached token despite refresh failure");
          return true;
        }

        console.log("[TLM] Enhanced token refresh failed completely");
        return false;

      } catch (error) {
        console.error("[TLM] Enhanced token refresh error:", error);

        if (error.message && error.message.includes('AADSTS50196')) {
          localStorage.setItem('tlm_aad_loop_detected', 'true');
          console.error('[TLM] AAD loop detected in token refresh');
        }

        // Try to use cached token if available
        const cachedToken = localStorage.getItem('tlm_azure_token');
        const tokenExpiry = localStorage.getItem('tlm_token_expiry');
        if (cachedToken && tokenExpiry && parseInt(tokenExpiry) > new Date().getTime()) {
          this.azureToken = cachedToken;
          return true;
        } else {
          return false;
        }
      }
    },

    // Enhanced Force Login with Better Error Handling
    _forceLogin: async function () {
      console.log("[TLM] Forcing login...");

      // 🚫 iOS WebKit: ไม่ทำ redirect - แสดง notification
      if (this._isIOSWebKit()) {
        console.log('[TLM][iOS WebKit] ⚠️ _forceLogin blocked - iOS WebKit uses POPUP only');
        this._showSafariMobileSetupNotification();
        return false;
      }

      // Check for previous AAD loop detection
      if (this.isLoopDetected()) {
        this.showAlertDialog({
          title: "Login Blocked",
          content: "Login is blocked due to loop detection. Please clear your browser cache and try again in a new session.",
          isError: true,
          onOk: function () {
            localStorage.clear();
            window.location.href = tlm.global.webBaseUrl;
          }
        });
        return false;
      }

      // Enhanced token acquisition attempt before redirect
      if (this.msalInstance) {
        console.log("[TLM] Enhanced token acquisition attempt before redirect...");
        const tokenResult = await this.acquireTokenWithFallback();

        if (tokenResult && tokenResult.accessToken) {
          console.log("[TLM] Enhanced token acquisition successful! No redirect needed");
          return true;
        }
      }

      // Clear tokens and attempt redirect
      this.clearCachedTokens();
      localStorage.setItem('tlm_intended_url', window.location.href);

      const loginRequest = {
        scopes: this._scopes,
        redirectUri: this.dynamicRedirectUri || localStorage.getItem('tlm_redirect_uri'),
        authority: `https://login.microsoftonline.com/${this.tenantID}`,
        prompt: "select_account"
      };

      try {
        await this.msalInstance.loginRedirect(loginRequest);
      } catch (loginError) {
        console.error("[TLM] Login redirect failed:", loginError);

        if (loginError.message && loginError.message.includes('AADSTS50196')) {
          localStorage.setItem('tlm_aad_loop_detected', 'true');
          this.showAlertDialog({
            title: "Authentication Loop Blocked",
            content: "Azure AD has blocked login due to loop detection. Please clear browser cache and try again.",
            isError: true
          });
        } else {
          this.showAlertDialog({
            title: "Login Failed",
            content: "Unable to login. Please try clearing your browser cache or contact IT support.",
            isError: true
          });
        }

        return false;
      }

      return false;
    },

    // Enhanced MSAL Initialization with Modern Configuration
    _initializeMsalEnhanced: async function () {
      if (this._msalReady) {
        return;
      }

      const config = getEnvironmentConfig();
      Object.assign(this, config);

      const storedRedirectUri = localStorage.getItem('tlm_redirect_uri');
      const redirectUri = storedRedirectUri || this.dynamicRedirectUri;
      const cleanRedirectUri = redirectUri.replace(/\/$/, '');

      console.log('[TLM] Using clean redirect URI:', cleanRedirectUri);

      // Enhanced MSAL Configuration with Mobile optimizations
      const msalConfig = {
        auth: {
          clientId: this.clientID,
          authority: "https://login.microsoftonline.com/" + this.tenantID,
          redirectUri: cleanRedirectUri,
          postLogoutRedirectUri: cleanRedirectUri,
          navigateToLoginRequestUrl: false,
          knownAuthorities: ["login.microsoftonline.com"]
        },
        cache: {
          // ปรับ cache strategy ตาม device
          cacheLocation: this._isIOSWebKit() ? "sessionStorage" : "localStorage",
          storeAuthStateInCookie: true,
          secureCookies: window.location.protocol === "https:",
          claimsBasedCachingEnabled: true,
          // ป้องกัน cache migration issues บน mobile
          migrateCacheEntries: false
        },
        system: {
          loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
              // กรองข้อความ error ที่คาดหวังบน mobile
              const expectedMobileErrors = [
                'autologon.microsoftazuread-sso.com',
                'Integrated Windows Authentication failed',
                'user_cancelled',
                'interaction_in_progress',
                'popup_window_error',
                'AADSTS50105', // OAuth2 code redemption failure (common on mobile)
                'network_request_failed'
              ];

              const shouldSuppress = expectedMobileErrors.some(error =>
                message && message.includes(error)
              );

              if (shouldSuppress && (this._isIOSWebKit() || this._isMobileDevice())) {
                // Log เฉพาะเมื่อเป็น debug mode
                if (window.location.search.includes('debug=1')) {
                  console.debug(`[MSAL-Mobile] Suppressed: ${message}`);
                }
                return;
              }

              // ตรวจสอบ loop detection
              if (message && message.includes('AADSTS50196')) {
                console.error('[TLM] Loop detected in MSAL log');
                localStorage.setItem('tlm_aad_loop_detected', 'true');
                this._lastErrorCode = 'AADSTS50196';
              }

              if (level >= msal.LogLevel.Warning && !containsPii) {
                console.log(`[MSAL ${level}] ${message}`);
              }
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Warning
          },
          // ปรับ timeout ตาม device type
          windowHashTimeout: this._isIOSWebKit() ? 180000 : (this._isMobileDevice() ? 120000 : 60000),
          iframeHashTimeout: this._isIOSWebKit() ? 180000 : (this._isMobileDevice() ? 120000 : 60000),
          loadFrameTimeout: this._isIOSWebKit() ? 180000 : (this._isMobileDevice() ? 120000 : 60000),
          allowNativeBroker: false,
          allowRedirectInIframe: !this._isMobileDevice(), // ปิดการใช้ iframe บน mobile
          networkRequestTimeout: this._isIOSWebKit() ? 90000 : (this._isMobileDevice() ? 60000 : 30000),
          telemetry: {
            applicationName: "TOPCool",
            applicationVersion: "2.0.0"
          }
        }
      };

      try {
        if (!window.msal) {
          throw new Error('MSAL library not loaded');
        }

        this.msalInstance = new msal.PublicClientApplication(msalConfig);
        await this.msalInstance.initialize();

        // Enhanced redirect promise handling สำหรับ mobile
        try {
          // CRITICAL FIX #4: Enhanced redirect detection - Log URL to detect redirect fragments
          console.log('[TLM] Current URL after redirect:', window.location.href);
          console.log('[TLM] URL search (query):', window.location.search);
          console.log('[TLM] URL hash (fragment):', window.location.hash);

          // CRITICAL FIX #4: Detect if redirect actually occurred by checking for MSAL fragments
          const hasRedirectFragment = window.location.hash.includes('code=') ||
            window.location.hash.includes('id_token=') ||
            window.location.search.includes('code=');
          console.log('[TLM] Redirect fragment detected:', hasRedirectFragment);

          // 🔥 SAFARI iOS RACE CONDITION FIX:
          // Safari iOS does "in-place redirect" when popup blocked → same page context
          // Dashboard may load before token parsing completes → show loader to prevent race condition
          // Chrome iOS/Desktop do full page reload → sequential loading → no race condition needed
          if (hasRedirectFragment && this._isSafariIOS()) {
            console.log('[TLM][Safari iOS] 🛡️ Race condition protection: Showing loader while parsing token');
            this._showTokenParsingLoader();
          }

          let response;
          try {
            response = await this.msalInstance.handleRedirectPromise();
          } catch (redirectError) {
            // Safari iOS: Hide loader on error
            if (this._isSafariIOS()) {
              console.error('[TLM][Safari iOS] ❌ Token parsing failed:', redirectError);
              this._hideTokenParsingLoader();
            }
            throw redirectError;
          }

          if (response) {
            console.log('[TLM] Redirect handled successfully');
            console.log('[TLM] Response from redirect:', response);

            // CRITICAL FIX #7: Use centralized flag clearing instead of manual clearing
            // CRITICAL FIX #1: Do NOT clear tlm_just_authenticated here - let acquireTokenWithFallback handle it
            this._clearAuthenticationFlags('redirect_success');

            // Auto set active account
            if (response.account) {
              this.msalInstance.setActiveAccount(response.account);
              console.log('[TLM] Auto selected account:', response.account.username);
              localStorage.setItem('tlm_last_login_hint', response.account.username);
            }

            if (response.accessToken) {
              const tokenDurationMs = this.TOKEN_DURATION_MINUTES * 60 * 1000;

              // CRITICAL FIX #2: Add token readiness flags and event
              this.azureToken = "Bearer " + response.accessToken;
              this._tokenReady = true; // Memory flag
              this._waitingForToken = false; // Clear waiting state

              // SECURITY FIX: Use safe localStorage operations with error handling
              const tokenStored = this._safeLocalStorageSet('tlm_azure_token', this.azureToken);
              const expiryTime = new Date().getTime() + tokenDurationMs;
              const expiryStored = this._safeLocalStorageSet('tlm_token_expiry', expiryTime.toString());
              const readyStored = this._safeLocalStorageSet('tlm_token_ready', 'true');

              if (!tokenStored || !expiryStored) {
                console.warn('[TLM] ⚠️ Failed to persist token to localStorage - token available in memory only');
                console.warn('[TLM] Token will be lost on page refresh - user may need to re-authenticate');
              }

              // CRITICAL FIX #2: Dispatch event for app to listen
              window.dispatchEvent(new CustomEvent('tlm_token_ready'));

              console.log('[TLM] Token stored successfully after redirect');

              // สำหรับ iOS WebKit: รอให้ token พร้อมก่อน app เรียก ajax
              if (this._isIOSWebKit()) {
                await new Promise(resolve => setTimeout(resolve, 500));
                console.log('[TLM] iOS WebKit: Token ready for use');

                // ✅ ซ่อน Safari notification เมื่อได้ token แล้ว
                this._checkAndHideSafariNotification();
              }

              // 🔥 SAFARI iOS: Hide loader now that token is ready
              if (this._isSafariIOS()) {
                console.log('[TLM][Safari iOS] ✅ Token parsing complete - hiding loader');
                this._hideTokenParsingLoader();
              }
            }

            // Handle intended URL redirect
            const intendedUrl = localStorage.getItem('tlm_intended_url');
            if (intendedUrl && intendedUrl !== window.location.href) {
              localStorage.removeItem('tlm_intended_url');

              // CRITICAL FIX #3: Increase delay to ensure token fully saved
              // iOS WebKit needs more time: 2000ms vs Desktop: 1000ms
              // รอให้ token save เสร็จก่อน redirect (สำคัญสำหรับ iOS mobile)
              const redirectDelay = this._isIOSWebKit() ? 2000 : (this._isMobileDevice() ? 1500 : 1000);
              console.log(`[TLM] Redirecting to intended URL in ${redirectDelay}ms...`);
              setTimeout(() => {
                window.location.href = intendedUrl;
              }, redirectDelay);
              return; // Stop here to prevent further processing
            }
          } else {
            // CRITICAL FIX #4: Better logging and validation - distinguish between "no redirect" vs "redirect failed"
            if (hasRedirectFragment) {
              console.error('[TLM] ⚠️ REDIRECT FRAGMENTS FOUND but handleRedirectPromise returned null!');
              console.error('[TLM] This indicates MSAL failed to process redirect response.');
              console.error('[TLM] URL:', window.location.href);

              // Safari iOS: Hide loader on failed token parse
              if (this._isSafariIOS()) {
                console.error('[TLM][Safari iOS] ❌ Failed to parse token from redirect - hiding loader');
                this._hideTokenParsingLoader();
              }
              // Don't silently continue - this is an error condition
              // But still try to use cached token as fallback
            } else {
              console.log('[TLM] No response from handleRedirectPromise - no redirect occurred (normal page load)');
            }

            // No redirect response - check for cached token
            const cachedToken = localStorage.getItem('tlm_azure_token');
            const tokenExpiry = localStorage.getItem('tlm_token_expiry');
            const now = Date.now();

            if (cachedToken && tokenExpiry && parseInt(tokenExpiry) > now) {
              console.log('[TLM] Valid cached token found, restoring');
              this.azureToken = cachedToken;

              // Check for accounts and set active if available
              const accounts = this.msalInstance.getAllAccounts();
              if (accounts.length > 0 && !this.msalInstance.getActiveAccount()) {
                this.msalInstance.setActiveAccount(accounts[0]);
                console.log('[TLM] Auto selected first available account:', accounts[0].username);
              }

              // ✅ iOS WebKit: ซ่อน notification ถ้ามี token อยู่แล้ว
              this._checkAndHideSafariNotification();
            }
          }
        } catch (redirectError) {
          console.warn('[TLM] Redirect handling failed:', redirectError);

          // ตรวจสอบว่าเป็น error ที่คาดหวังบน mobile หรือไม่
          const expectedMobileErrors = [
            'AADSTS50105',
            'network_request_failed',
            'popup_window_error'
          ];

          const isMobileExpectedError = expectedMobileErrors.some(error =>
            redirectError.errorCode && redirectError.errorCode.includes(error)
          ) && this._isMobileDevice();

          if (!isMobileExpectedError) {
            if (redirectError.errorCode === 'AADSTS50196' ||
              (redirectError.message && redirectError.message.includes('AADSTS50196'))) {
              localStorage.setItem('tlm_aad_loop_detected', 'true');
              this._lastErrorCode = 'AADSTS50196';
              console.error('[TLM] AAD loop detected in redirect handling');
            }
          } else {
            console.log('[TLM] Mobile expected error during redirect handling, continuing...');
          }
        }

        this._msalReady = true;
        console.log('[TLM] Enhanced MSAL initialization completed for ' +
          (this._isMobileDevice() ? 'mobile' : 'desktop'));

        // ✅ iOS WebKit: ตรวจสอบและซ่อน notification หลัง MSAL initialization
        this._checkAndHideSafariNotification();

      } catch (error) {
        console.error('[TLM] Enhanced MSAL initialization failed:', error);
        throw error;
      }
    },
    /*

    */
    notification: function (message) {
      let id = kendo.guid();
      let div = $(`<div id='#${id}'></div>`);

      let notificationWidget = $(div).kendoNotification({
        autoHideAfter: 0,
        hideOnClick: false,
        position: {
          pinned: true,
          top: 230,
          left: null,
          bottom: null,
          right: 68
        }
      }).data("kendoNotification");

      notificationWidget.showText(message, "warning");
    },
    /* ===============================================
       3. ENHANCED AJAX & API COMMUNICATION
       =============================================== */

    // Enhanced AJAX Call with Modern Token Management
    ajaxCall: async function (options, customCallBack) {
      if (this._disposed) {
        console.warn("[TLM] Ajax call attempted on disposed instance");
        return;
      }

      const _options = options;

      const cachedToken = localStorage.getItem('tlm_azure_token');
      const tokenExpiry = localStorage.getItem('tlm_token_expiry');
      const now = new Date().getTime();

      // If token exists in localStorage but not in memory
      if (cachedToken && tokenExpiry && parseInt(tokenExpiry) > now && !this.azureToken) {
        console.log("[TLM] Restoring token from localStorage");
        this.azureToken = cachedToken;
      }

      // Enhanced token acquisition
      try {
        if (this.msalInstance) {
          const accounts = this.msalInstance.getAllAccounts();

          // iOS WebKit: หลัง redirect localStorage อาจเป็น null แต่ MSAL cache มี account
          // ต้องดึง token จาก MSAL cache
          if (accounts.length > 0 && (!cachedToken || !this.azureToken)) {
            console.log("[TLM] iOS WebKit: Recovering token from MSAL cache after redirect");
            const tokenResult = await this.acquireTokenWithFallback();

            if (tokenResult && tokenResult.accessToken) {
              console.log("[TLM] Token recovered from MSAL cache successfully");
            }
          } else if (accounts.length === 0 && (!cachedToken || parseInt(tokenExpiry) <= now)) {
            console.log("[TLM] No accounts and no valid token, attempting enhanced token acquisition...");

            // 🚫 iOS WebKit: ไม่พยายาม acquire token - แสดง notification แล้วหยุด
            if (this._isIOSWebKit()) {
              console.log('[TLM][iOS WebKit] ⚠️ No token - showing notification and stopping');
              this._showSafariMobileSetupNotification();
              if (_options.error) {
                _options.error({
                  status: 401,
                  responseText: JSON.stringify({ error: "Authentication Required" })
                });
              }
              return;
            }

            const tokenResult = await this.acquireTokenWithFallback();

            if (tokenResult && tokenResult.accessToken) {
              console.log("[TLM] Enhanced token acquisition successful in ajaxCall");
            }
          }
        }
      } catch (e) {
        console.log("[TLM] Account check error:", e.message);
      }

      // Enhanced token validity check
      const currentTokenExpiry = localStorage.getItem('tlm_token_expiry');
      const currentCachedToken = localStorage.getItem('tlm_azure_token') || this.azureToken;

      if (!currentCachedToken || !currentTokenExpiry || parseInt(currentTokenExpiry) <= now) {
        console.log("[TLM] Token expired or missing, validating...");

        // 🚫 iOS WebKit: ไม่พยายาม refresh token - แสดง notification แล้วหยุด
        if (this._isIOSWebKit()) {
          console.log('[TLM][iOS WebKit] ⚠️ Token expired/missing - showing notification and stopping');
          this._showSafariMobileSetupNotification();
          if (_options.error) {
            _options.error({
              status: 401,
              responseText: JSON.stringify({ error: "Authentication Required" })
            });
          }
          return;
        }

        const tokenValid = await this.validateAndRefreshToken();
        if (!tokenValid) {
          console.warn("[TLM] Token validation failed");

          // Enhanced error handling - show authentication required
          if (_options.error) {
            _options.error({
              status: 401,
              statusText: "Authentication Required",
              responseText: "Please login to continue"
            }, "error", "Authentication Required");
          }
          return;
        }
      }
      // Enhanced background refresh for expiring tokens
      else if (parseInt(currentTokenExpiry) - now < (5 * 60 * 1000)) {
        // iOS WebKit: STOP - no background refresh
        if (this._isIOSWebKit()) {
          console.log('[TLM][iOS WebKit] ⚠️ Token expiring - skipping background refresh');
          // Don't show notification yet - token still valid
        } else {
          console.log("[TLM] Token expiring soon, enhanced background refresh...");
          this.validateAndRefreshToken().catch(error => {
            console.warn("[TLM] Enhanced background token refresh failed:", error);
          });
        }
      }

      // Ensure token is available
      if (!this.azureToken && currentCachedToken) {
        this.azureToken = currentCachedToken;
      }

      if (this.azureToken) {
        _options.token = this.azureToken.replace('Bearer ', '');

        if (customCallBack) {
          return customCallBack(_options);
        } else {
          return this.callAPI(_options);
        }
      }

      // Enhanced final attempt if no token
      console.log("[TLM] No token available, attempting enhanced final validation...");

      // iOS WebKit: STOP - no final token acquisition
      if (this._isIOSWebKit()) {
        console.log('[TLM][iOS WebKit] ⚠️ Final token acquisition blocked');
        this._showSafariMobileSetupNotification();
        if (_options.error) {
          _options.error({
            status: 401,
            statusText: "Authentication Required",
            responseText: "Unable to acquire authentication token"
          }, "error", "Authentication Required");
        }
        return;
      }

      try {
        await this.initialize();
        const tokenValid = await this.validateAndRefreshToken();

        if (tokenValid && this.azureToken) {
          _options.token = this.azureToken.replace('Bearer ', '');

          if (customCallBack) {
            return customCallBack(_options);
          } else {
            return this.callAPI(_options);
          }
        }
      } catch (error) {
        console.error("[TLM] Enhanced final token acquisition failed:", error);
      }

      // Final error handling
      if (_options.error) {
        _options.error({
          status: 401,
          statusText: "Authentication Failed",
          responseText: "Unable to acquire authentication token"
        }, "error", "Authentication Failed");
      }
    },

    // Enhanced Auto Token Checker with Intelligent Monitoring
    startAutoTokenChecker: function () {
      if (this._autoTokenChecker) {
        clearInterval(this._autoTokenChecker);
      }

      console.log('[TLM] Starting enhanced token checker...');

      this._autoTokenChecker = setInterval(async () => {
        try {
          if (this._disposed) {
            clearInterval(this._autoTokenChecker);
            return;
          }

          // Enhanced token status check
          const tokenStatus = this.checkCurrentTokenStatus();

          console.log('[TLM][Token Checker] Current status:', {
            isIOSWebKit: this._isIOSWebKit(),
            tokenValid: tokenStatus.valid,
            minutesLeft: tokenStatus.minutesLeft
          });

          // ⚠️ iOS WebKit: แสดง notification ถ้าไม่มี token
          if (this._isIOSWebKit() && !tokenStatus.valid) {
            console.log('[TLM][Token Checker] iOS WebKit detected with invalid token - showing notification');
            this._showSafariMobileSetupNotification();
            // หยุด token checker สำหรับ iOS WebKit ที่ไม่มี token
            console.log('[TLM][iOS WebKit] Stopping token checker - no token');
            clearInterval(this._autoTokenChecker);
            return;
          }
          // ✅ iOS WebKit: ซ่อน notification ถ้ามี token แล้ว
          else if (this._isIOSWebKit() && tokenStatus.valid) {
            console.log('[TLM][Token Checker] iOS WebKit detected with valid token - hiding notification');
            this._hideSafariMobileSetupNotification();
          }

          if (!tokenStatus.valid) {
            console.log('[TLM] Token invalid, stopping auto checker');
            clearInterval(this._autoTokenChecker);
            return;
          }

          // 🚫 iOS WebKit: ไม่ทำ token refresh - ใช้ popup เท่านั้น
          if (this._isIOSWebKit()) {
            console.log('[TLM][iOS WebKit] Skipping auto token refresh - popup authentication only');
            return;
          }

          // Smart refresh logic - only refresh if less than threshold but not expired (Non-iOS Mobile only)
          if (tokenStatus.minutesLeft < this.TOKEN_REFRESH_THRESHOLD_MINUTES &&
            tokenStatus.minutesLeft > 0) {
            if (!this._tokenRefreshInProgress) {
              console.log(`[TLM] Token expires in ${tokenStatus.minutesLeft} minutes, enhanced refreshing...`);
              await this.validateAndRefreshToken();
            }
          }

          // Enhanced account recovery if needed
          if (tokenStatus.valid && !tokenStatus.hasAccounts && this.msalInstance) {
            // iOS WebKit: STOP - no account recovery
            if (this._isIOSWebKit()) {
              console.log('[TLM][iOS WebKit] ⚠️ Account recovery blocked');
            } else {
              console.log('[TLM] Valid token but no accounts, attempting account recovery...');
              try {
                const recoveryResult = await this.acquireTokenWithFallback();
                if (recoveryResult) {
                  console.log('[TLM] Account recovery successful');
                }
              } catch (recoveryError) {
                console.warn('[TLM] Account recovery failed:', recoveryError);
              }
            }
          }

        } catch (error) {
          console.error('[TLM] Enhanced auto token checker error:', error);
        }

      }, 30 * 1000); // Check every 30 seconds
    },

    // Enhanced Token Status Check
    checkCurrentTokenStatus: function () {
      const tokenExpiry = localStorage.getItem('tlm_token_expiry');
      const cachedToken = localStorage.getItem('tlm_azure_token');
      const accounts = this.msalInstance ? this.msalInstance.getAllAccounts() : [];

      if (!tokenExpiry || !cachedToken) {
        return {
          status: 'NO_TOKEN',
          valid: false,
          minutesLeft: 0,
          hasAccounts: accounts.length > 0,
          recommendation: 'Login required',
          lastAttemptFailures: this._tokenAttemptFailureCount,
          loopDetected: this.isLoopDetected()
        };
      }

      const now = new Date().getTime();
      const timeLeft = parseInt(tokenExpiry) - now;
      const minutesLeft = Math.floor(timeLeft / 1000 / 60);

      let status = 'VALID';
      let recommendation = 'Token is healthy';

      if (timeLeft <= 0) {
        status = 'EXPIRED';
        recommendation = 'Login required';
      } else if (minutesLeft < 10) {
        status = 'EXPIRING_SOON';
        recommendation = 'Auto refresh will occur';
      }

      // Enhanced recommendations based on state
      if (this.isLoopDetected()) {
        recommendation = 'Loop detected - run tlmDebug.clearLoop()';
      } else if (this._tokenAttemptFailureCount >= this.MAX_TOKEN_ATTEMPT_FAILURES) {
        recommendation = 'Too many failures - manual intervention needed';
      } else if (accounts.length === 0 && timeLeft > 0) {
        recommendation = 'Token valid but no MSAL accounts (normal in SharePoint)';
      }

      return {
        status: status,
        valid: timeLeft > 0,
        minutesLeft: Math.max(0, minutesLeft),
        timeLeft: timeLeft,
        hasAccounts: accounts.length > 0,
        recommendation: recommendation,
        lastAttemptFailures: this._tokenAttemptFailureCount,
        loopDetected: this.isLoopDetected()
      };
    },

    // Enhanced AJAX Call Result Handler with Better Error Management
    ajaxCallResult: function (options) {

      let _success = options.success;
      let _error = options.error;
      const _options = options;

      options.success = function (data) {
        if (_success !== undefined) {
          if (options.showLoadding === undefined || options.showLoadding == true) {
            if (options.targetElement === undefined) {
              tlm.global._hideFullLoading();
            } else {
              kendo.ui.progress($(options.targetElement), false);
            }
          }

          // Enhanced response handling
          if (data && typeof data === 'object' && 'Status' in data) {
            switch (data.Status) {
              case 1:
                _success(data.Data, data.AdditionalData);
                break;
              case -1:
                if (_error !== undefined) {
                  if (data?.Message?.indexOf("deadlocked on lock resources with another") >= 0) {
                    data.Message = "System is running another process. Please wait a moment and try action again";
                  }
                  _error(data);
                } else {
                  if (data.Message !== "access denied") {
                    tlm.global.showAlertDialog({
                      title: "Error",
                      height: 300,
                      isError: true,
                      isCenter: true,
                      content: data.Message,
                    });
                  }
                }

                if (data.Message === "access denied") {
                  tlm.global.showUnauthorizedAccess("this page", null, '.mainContext');
                  $('.mainContext').fadeIn();
                }

                break;
              default:
                _success(data);
                break;
            }
          } else {
            _success(data);
          }
        }
      };

      // Enhanced Error Handler with Modern Authentication Patterns
      options.error = function (jqXHR, textStatus, errorThrown) {
        if (options.showLoadding === undefined || options.showLoadding == true) {
          if (options.targetElement === undefined) {
            tlm.global._hideFullLoading();
          } else {
            kendo.ui.progress($(options.targetElement), false);
          }
        }

        if (jqXHR.statusText == "abort") return;

        // Enhanced 401 Authentication error handling
        if (jqXHR.status === 401) {
          console.log("[TLM] 401 Unauthorized detected");

          // Check for loop detection
          if (tlm.global.isLoopDetected()) {
            tlm.global.showAlertDialog({
              title: "Authentication Blocked",
              content: "Authentication is blocked due to loop detection. Please clear your browser cache and try again in a new session.",
              width: "400px",
              isError: true,
              isCenter: true,
              onOk: function () {
                localStorage.clear();
                window.location.href = tlm.global.webBaseUrl;
              }
            });
            return;
          }

          // Enhanced 401 handling with modern patterns
          console.log('[TLM] Enhanced 401 handling attempt...');

          // Prevent multiple handling
          if (tlm.global._handling401Error) {
            return;
          }
          tlm.global._handling401Error = true;

          // Enhanced detection for first-time or incognito

          const hasPreviousLogin = !!localStorage.getItem('tlm_last_login_hint');

          if (!hasPreviousLogin) {
            console.log('[TLM] First-time login detected.');

            // 🚫 iOS WebKit: ไม่ทำ redirect - ให้ notification จัดการแทน
            if (tlm.global._isIOSWebKit && tlm.global._isIOSWebKit()) {
              console.log('[TLM][iOS WebKit] ⚠️ Skipping redirect - notification already shown');
              tlm.global._handling401Error = false;
              return;
            }

            localStorage.setItem('tlm_intended_url', window.location.href);

            if (tlm.global.msalInstance) {
              // Enhanced redirect attempt (Desktop & Non-iOS Mobile only)
              tlm.global.msalInstance.loginRedirect({
                scopes: tlm.global._scopes,
                redirectUri: tlm.global.dynamicRedirectUri,
                authority: `https://login.microsoftonline.com/${tlm.global.tenantID}`,
                prompt: "select_account"
              }).catch(err => {
                console.error("[TLM] Enhanced loginRedirect failed:", err);

                // Enhanced error handling
                if (err.message && err.message.includes('AADSTS50196')) {
                  localStorage.setItem('tlm_aad_loop_detected', 'true');
                  tlm.global.showAlertDialog({
                    title: "Authentication Loop Blocked",
                    content: "Azure AD has blocked authentication due to loop detection. Please clear browser cache and try again.",
                    isError: true
                  });
                } else {
                  window.location.href = tlm.global.webBaseUrl;
                }
              });
            } else {
              window.location.reload();
            }
            return;
          }

          // Enhanced recovery attempt
          const attemptEnhancedRecovery = async () => {
            try {
              // iOS WebKit: STOP - no enhanced recovery
              if (tlm.global._isIOSWebKit()) {
                console.log('[TLM][iOS WebKit] ⚠️ Enhanced recovery blocked - showing notification');
                tlm.global._showSafariMobileSetupNotification();
                tlm.global._handling401Error = false;
                return;
              }

              console.log('[TLM] Attempting enhanced token recovery...');

              const recoveryResult = await tlm.global.validateAndRefreshToken();

              if (recoveryResult) {
                console.log('[TLM] Enhanced recovery successful, retrying original request');
                tlm.global._handling401Error = false;
                // The original request will be retried automatically
              } else {
                console.log('[TLM] Enhanced recovery failed, manual login required');

                tlm.global.showAlertDialog({
                  title: "Session Expired",
                  content: "Your session has expired and cannot be automatically renewed. Please refresh the page to login again.",
                  width: "400px",
                  isError: true,
                  onOk: function () {
                    window.location.reload();
                  }
                });
              }

            } catch (recoveryError) {
              console.error('[TLM] Enhanced recovery attempt failed:', recoveryError);

              // Enhanced error classification
              if (recoveryError.message && recoveryError.message.includes('AADSTS50196')) {
                localStorage.setItem('tlm_aad_loop_detected', 'true');
                tlm.global.showAlertDialog({
                  title: "Authentication Loop Blocked",
                  content: "Azure AD has blocked authentication due to loop detection. Please clear browser cache and try again in a new session.",
                  isError: true,
                  onOk: function () {
                    localStorage.clear();
                    window.location.href = tlm.global.webBaseUrl;
                  }
                });
              } else {
                tlm.global.showAlertDialog({
                  title: "Authentication Failed",
                  content: "Unable to restore your session. Please refresh the page.",
                  isError: true,
                  onOk: function () {
                    window.location.reload();
                  }
                });
              }
            } finally {
              tlm.global._handling401Error = false;
            }
          };

          attemptEnhancedRecovery();
          return;
        }

        // Enhanced error handling for other status codes
        if (jqXHR.status === 403 || textStatus === "access denied" || jqXHR.statusText === "access denied" || errorThrown === "access denied") {
          console.log("[TLM] 403 Forbidden");
          tlm.global.showUnauthorizedAccess("this page", null, '#' + $(".sp-page-header").next().find("div").closest('[id]').attr('id'));
        }

        // Enhanced user cancellation handling
        if (jqXHR.status === 0 && (errorThrown.includes('user_cancelled') || textStatus === 'abort')) {
          console.log("[TLM] Request cancelled by user");
          return;
        }

        // Enhanced network error handling
        if (jqXHR.status === 0 && jqXHR.statusText === "error") {
          tlm.global.showAlertDialog({
            title: "Network Error",
            height: 300,
            content: "Unable to connect to the server. Please check your internet connection and try again.",
            isError: true,
            isCenter: true
          });
          return;
        }

        // Enhanced CORS error handling
        if (jqXHR.status === 0 && errorThrown === '') {
          tlm.global.showAlertDialog({
            title: "CORS Error",
            height: 300,
            content: "Cross-origin request blocked. Please contact your administrator.",
            isError: true,
            isCenter: true
          });
          return;
        }

        // Call original error handler if provided
        if (_error) {
          _error(jqXHR, textStatus, errorThrown);
        } else {
          tlm.global.showAlertDialog({
            height: 300,
            content: `${jqXHR.statusText}<br/>${jqXHR.status}<br/>${jqXHR.responseText}`,
            isError: true,
            isCenter: true
          });
        }
      };

      if (options.showLoadding === undefined || options.showLoadding == true) {
        if (options.targetElement === undefined) {
          tlm.global._showFullLoading();
        } else {
          kendo.ui.progress($(options.targetElement), true);
        }
      }

      return this.ajaxCall(options);
    },
    // Enhanced API Call with Headers and Better Security
    callAPI: function (options) {
      if (options.cache === undefined) options.cache = false;
      if (options.async === undefined) options.async = true;
      if (options.type === undefined) options.type = "GET";
      if (options.data === undefined) options.data = null;
      if (options.contentType === undefined)
        options.contentType = "application/json; charset=utf8";
      if (options.dataType === undefined) options.dataType = "json";
      if (options.processData === undefined) options.processData = true;
      if (options.global === undefined) options.global = true;

      // Enhanced headers with security improvements
      if (options.headers === undefined) {
        options.headers = {
          accept: "application/json;odata=verbose",
          "content-type": "application/json;odata=verbose",
          Authorization: "Bearer " + options.token,
          "x-custom-token": "Bearer " + options.token,
          "PageURL": document.location.href,
          "X-Requested-With": "XMLHttpRequest", // Security header
          "Cache-Control": "no-cache" // Prevent caching sensitive data
        };
      }

      return $.ajax({
        async: options.async,
        type: options.type,
        cache: options.cache,
        global: options.global,
        headers: options.headers,
        contentType: options.contentType,
        processData: options.processData,
        url: options.url,
        data: options.data,
        timeout: 0, // 600000 second timeout
        success: function (data) {
          if (options.success) {
            options.success(data);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          if (options.error) {
            options.error(jqXHR, textStatus, errorThrown);
          }
        },
        complete: function (jqXHR, textStatus) {
          if (options.complete) {
            options.complete(jqXHR, textStatus);
          }
        },
      });
    },

    // Enhanced SharePoint AJAX Call with Modern Security Headers
    ajaxCallSP: function (options) {
      if (options.async === undefined) options.async = true;
      if (options.type === undefined) options.type = "GET";
      if (options.data === undefined) options.data = null;
      if (options.contentType === undefined)
        options.contentType = "application/x-www-form-urlencoded; charset=UTF-8";
      if (options.dataType === undefined) options.dataType = "json";
      if (options.processData === undefined) options.processData = true;

      if (options.headers === undefined) {
        options.headers = {
          accept: "application/json;odata=verbose",
          "content-type": "application/json;odata=verbose",
          "X-Requested-With": "XMLHttpRequest"
        };
      }

      return $.ajax({
        async: options.async,
        type: options.type,
        headers: options.headers,
        contentType: options.contentType,
        processData: options.processData,
        url: options.url,
        data: options.data,
        cache: false,
        timeout: 30000, // 30 second timeout for SharePoint calls
        success: function (data) {
          if (options.success) {
            options.success(data);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          if (options.error) {
            options.error(jqXHR, textStatus, errorThrown);
          }
        },
        complete: function (jqXHR, textStatus) {
          if (options.complete) {
            options.complete(jqXHR, textStatus);
          }
        },
      });
    },

    // Enhanced Response WebHook with Better Error Handling
    responseWebHook: function (options) {
      if (options.cache === undefined) options.cache = false;
      if (options.async === undefined) options.async = true;
      if (options.type === undefined) options.type = "GET";
      if (options.data === undefined) options.data = null;
      if (options.contentType === undefined)
        options.contentType = "application/json; charset=utf8";
      if (options.dataType === undefined) options.dataType = "json";
      if (options.processData === undefined) options.processData = true;
      if (options.global === undefined) options.global = true;

      if (options.headers === undefined) {
        options.headers = {
          accept: "application/json;odata=verbose",
          "content-type": "application/json;odata=verbose",
          "x-custom-token": "Bearer " + options.token,
          "X-Requested-With": "XMLHttpRequest"
        };
      }

      return $.ajax({
        async: options.async,
        type: options.type,
        cache: options.cache,
        global: options.global,
        headers: options.headers,
        contentType: options.contentType,
        processData: options.processData,
        url: options.url,
        data: options.data,
        timeout: 45000, // 45 second timeout for webhooks
        success: function (data) {
          if (options.success) {
            options.success(data);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          if (options.error) {
            options.error(jqXHR, textStatus, errorThrown);
          }
        },
        complete: function (jqXHR, textStatus) {
          if (options.complete) {
            options.complete(jqXHR, textStatus);
          }
        },
      });
    },

    // Enhanced Azure Token Acquisition with Modern Patterns
    getAzureToken: async function (options, account, customCallBack) {
      var _options = options;

      // Enhanced token availability check
      if (this.azureToken) {
        const tokenExpiry = localStorage.getItem('tlm_token_expiry');
        const now = new Date().getTime();

        if (tokenExpiry && now < parseInt(tokenExpiry)) {
          _options.token = this.azureToken.replace('Bearer ', '');
          if (customCallBack) {
            return customCallBack(_options);
          } else {
            return this.callAPI(_options);
          }
        }
      }

      // Enhanced token acquisition using modern patterns
      console.log("[TLM] Getting new token with enhanced methods...");

      // iOS WebKit: STOP - no token acquisition
      if (this._isIOSWebKit()) {
        console.log('[TLM][iOS WebKit] ⚠️ getAzureToken blocked - showing notification');
        this._showSafariMobileSetupNotification();
        throw new Error("iOS WebKit: Token acquisition blocked - please configure Safari settings");
      }

      const tokenValid = await this.validateAndRefreshToken();

      if (tokenValid && this.azureToken) {
        _options.token = this.azureToken.replace('Bearer ', '');
        if (customCallBack) {
          customCallBack(_options);
        } else {
          this.callAPI(_options);
        }
      } else {
        console.error("[TLM] Failed to get azure token with enhanced methods");
        throw new Error("Unable to acquire token using enhanced authentication");
      }
    },

    /* ===============================================
        4. USER MANAGEMENT
        =============================================== */

    getCurrentUser: async function () {
      if (tlm.global._disposed) {
        return null;
      }

      // Ensure initialization is complete
      await tlm.global.initialize();

      if (tlm.global._currentUser == null) {
        let url = `${tlm.global.webBaseUrl}/_api/web/currentUser`;

        try {
          const spResponse = await $.ajax({
            url: url,
            async: true,
            type: "GET",
            headers: { Accept: "application/json; odata=verbose" }
          });

          tlm.global._currentUser = spResponse.d;
          let sharePointUserId = tlm.global._currentUser.Id;

          tlm.global._currentUser.LoginName =
            tlm.global._currentUser.LoginName.replace("i:0#.f|membership|", "");

          url = `${tlm.global.serviceUrl}/api/common/GetCurrentUser/${tlm.global._currentUser.LoginName}`;

          const apiResponse = await tlm.global.ajaxCallResult({
            url: url,
            async: true,
            showLoadding: false,
            type: "GET",
            headers: { Accept: "application/json; odata=verbose" }
          });

          tlm.global._currentUser = apiResponse;
          tlm.global._currentUser.SharePointUserId = sharePointUserId;

        } catch (error) {
          // console.error("[TLM] Failed to get current user:", error);
          return null;
        }
      }

      return tlm.global._currentUser;
    },

    getCurrentUserLoginName: function () {
      if (tlm.global._currentUser == null) {
        let url = `${tlm.global.webBaseUrl}/_api/web/currentUser`;
        let loginName = "";

        $.ajax({
          url: url,
          async: false,
          type: "GET",
          headers: { Accept: "application/json; odata=verbose" },
          success: function (data) {
            loginName = data.d.LoginName.replace("i:0#.f|membership|", "");
          },
          error: function (data) {
            // console.error("[TLM] Failed to get login name:", data);
          },
        });

        return loginName;
      }

      return tlm.global._currentUser.LoginName;
    },

    clearCurrentUser: function () {
      tlm.global._currentUser = null;
      tlm.global.clearCachedTokens();
    },

    existsSiteGroup: function (siteGroupID, user) {
      let url = `${tlm.global.webBaseUrl}/_api/web/SiteGroups/GetById(${siteGroupID})/Users?$filter=Id eq ${user.SharePointUserId}`;
      let result = false;

      $.ajax({
        url: url,
        async: false,
        type: "GET",
        headers: { Accept: "application/json; odata=verbose" },
        success: function (data) {
          result = data.d.results.length > 0;
        },
        error: function (data) {
          // console.error("[TLM] Error checking site group:", data);
        },
      });

      return result;
    },

    checkUserPermissionsByRoles: function (data) {
      if (data == null || data == undefined || data.length <= 0) {
        $(".sp-page-header").hide();
        let id = $('.sp-page-header + div[class*="container"]');
        tlm.global.showUnauthorizedAccess("TOP Cool", null, id);
        //$(".custom-sp-nav").remove();
        return;
      }
    },

    checkUserPermissions: async (titlePage, requireRoles, targetDiv) => {
      try {
        await tlm.global.ajaxCall({
          url: `${tlm.global.serviceUrl}/api/common/GetDebugUserInformation`,
          success: function (data) {
            if (data.Data == null || data.Data == undefined) {
              tlm.global.showUnauthorizedAccess(
                titlePage,
                requireRoles,
                targetDiv
              );
              return;
            }

            // Check if user has required roles
            const roleNames = data.Data.ImpersonateUser.Roles;

            const hasRequiredRole = roleNames.some((role) =>
              requireRoles.includes(role.RoleName)
            );

            if (!hasRequiredRole) {
              tlm.global.showUnauthorizedAccess(
                titlePage,
                requireRoles,
                targetDiv
              );
              return;
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            // console.error("Permission check failed:", errorThrown);
            tlm.global.showUnauthorizedAccess(
              titlePage,
              requireRoles,
              targetDiv
            );
          },
        });
      } catch (error) {
        // console.error("Error checking permissions:", error);
        tlm.global.showUnauthorizedAccess(titlePage, requireRoles, targetDiv);
      }
    },

    getCurrentUserWithPermission: async () => {
      try {
        await tlm.global.ajaxCall({
          url: tlm.global.serviceUrl + "/api/common/CurrentUserWithPermission",
          showLoadding: true,
          success: function (data) {
            if (data.Data == null || data.Data == undefined) {
              tlm.global.showUnauthorizedAccess(
                titlePage,
                requireRoles,
                targetDiv
              );
              return;
            }
            tlm.global._currentUserWithPermission = data.Data;
          },
          error: function (jqXHR, textStatus, errorThrown) {
            // console.error("Permission check failed:", errorThrown);
            tlm.global.showUnauthorizedAccess(
              titlePage,
              requireRoles,
              targetDiv
            );
          },
        });
      } catch (error) {
        // console.error("Error checking permissions:", error);
        tlm.global.showUnauthorizedAccess(titlePage, requireRoles, targetDiv);
      }
    },

    checkPermission: function (PermissionCode, Permission) {
      var permissions = $.grep(tlm.global._currentUserWithPermission.Permissions, function (p) { return p.PermissionCode == PermissionCode });
      if (permissions.length == 0) {
        return false;
      }
      else {
        var permission = permissions[0];
        if (permission[Permission] == undefined) {
          return false;
        }
        else {
          return permission[Permission];
        }
      }
    },
    // Add this function inside the tlm.global object (around line 900-950 would be appropriate, after the Token Management section)

    clearCachedTokens: function (clearAll = false) {
      console.log('[TLM] Clearing cached tokens...');

      // Core token keys to clear
      const tokenKeys = [
        'tlm_azure_token',
        'tlm_token_expiry',
        'tlm_token_refresh_lock'
      ];

      // Clear core token keys
      tokenKeys.forEach(key => {
        localStorage.removeItem(key);
      });

      // If clearAll is true, clear additional authentication-related keys
      if (clearAll) {
        const additionalKeys = [
          'tlm_last_login_hint',
          'tlm_intended_url',
          'tlm_redirect_attempts',
          'tlm_last_redirect_time',
          'tlm_aad_loop_detected',
          'tlm_redirect_uri',
          'tlm_session_id',
          'tlm_page_start_time',
          'tlm_click_count',
          'tlm_keystroke_count'
        ];

        additionalKeys.forEach(key => {
          localStorage.removeItem(key);
        });

        // Clear session storage as well
        sessionStorage.clear();

        console.log('[TLM] All authentication data cleared');
      } else {
        console.log('[TLM] Token cache cleared');
      }

      // Clear in-memory token
      this.azureToken = null;
      this._tokenRefreshInProgress = false;
      this._tokenRefreshPromise = null;

      // Clear MSAL cache if available
      if (this.msalInstance) {
        try {
          // Clear MSAL's token cache
          const accounts = this.msalInstance.getAllAccounts();
          accounts.forEach(account => {
            this.msalInstance.removeAccount(account);
          });
          console.log('[TLM] MSAL cache cleared');
        } catch (error) {
          console.warn('[TLM] Error clearing MSAL cache:', error);
        }
      }
    },

    /* ===============================================
        5. UI COMPONENTS & DIALOGS
        =============================================== */

    showYesNoDialog: function (options) {
      let dialog = $("<div></div>");
      dialog
        .kendoDialog({
          width: options.width ? options.width : "450px",
          title: false,//tlm.global.siteName,
          closable: options.closable ? options.closable : false,
          modal: options.modal ? options.modal : true,
          content: options.content ? options.content : "Are you sure?",
          actions: [
            {
              text: "YES",
              action: options.onYes ? options.onYes : function (e) { },
              primary: true
            },
            {
              text: "NO",
              action: options.onNo ? options.onNo : function (e) { },
            },
          ],
          close: function (e) {
            e.sender.destroy();
            if (
              typeof options != "undefined" &&
              typeof options.onClose == "function"
            )
              options.onClose();
          },
        })
        .data("kendoDialog")
        .open();
    },

    showOkCancelDialog3: function (options) {
      let dialog = $("<div></div>");
      dialog
        .kendoDialog({
          width: options.width ? options.width : "450px",
          title: false,
          closable: options.closable ? options.closable : false,
          modal: options.modal ? options.modal : true,
          content: options.content ? options.content : "Are you sure?",
          actions: [
            {
              text: "OK",
              action: options.onOk ? options.onOk : function (e) { },
            },
            {
              text: "CANCEL",
              action: options.onCancel ? options.onCancel : function (e) { },
            },
          ],
          close: function (e) {
            e.sender.destroy();
            if (
              typeof options != "undefined" &&
              typeof options.onClose == "function"
            )
              options.onClose();
          },
        })
        .data("kendoDialog")
        .open();
    },

    showAlertDialog: function (options) {
      let dialog = $("<div></div>");
      dialog
        .kendoDialog({
          width: options.width ? options.width : "450px",
          //title: options.title ? options.title : tlm.global.siteName,
          title: false,
          modal: options.modal ? options.modal : true,
          content: options.content ? options.content : "Alert!!!",
          closable: false,
          actions: [
            {
              text: "OK",
              action: options.onOk ? options.onOk : function (e) { },
            },
          ],
          open: function (e) {

            if (options && options.isError === true) {
              e.sender.wrapper.find(".k-dialog-content").prepend('<div class="unauthorized-icon" style=" display: flex; flex-direction: row;flex-wrap: nowrap; align-content: center;justify-content: center;align-items: center;"><i class="fa-solid fa-circle-exclamation"></i></div>');
              e.sender.wrapper.find(".k-dialog-content").css({
                "color": "#D32F2F",
              });
            }

            if (options && options.isSuccess === true) {
              e.sender.wrapper.find(".k-dialog-content").prepend('<div class="" style=" display: flex; flex-direction: row;flex-wrap: nowrap; align-content: center;justify-content: center;align-items: center;"><i class="fa-solid fa-circle-check" style="font-size: 4rem;color: #28a745;margin-bottom: 1.5rem;"></i></div>');
              e.sender.wrapper.find(".k-dialog-content").css({
                "color": "#28a745",
              });
            }


            if (options && options.isInformation === true) {
              e.sender.wrapper.find(".k-dialog-content").prepend('<div class="" style=" display: flex; flex-direction: row;flex-wrap: nowrap; align-content: center;justify-content: center;align-items: center;"><i class="fa-solid fa-circle-info" style="font-size: 4rem;color: #02aff0;margin-bottom: 1.5rem;"></i></div>');
              e.sender.wrapper.find(".k-dialog-content").css({
                "color": "#02aff0",
              });
            }

            if (options && options.isCenter === true) {
              e.sender.wrapper.find(".k-dialog-content").css({
                "text-align": "center",
              });
            }
          },
          close: function (e) {
            e.sender.destroy();
            if (
              typeof options != "undefined" &&
              typeof options.onClose == "function"
            )
              options.onClose();
          },
        })
        .data("kendoDialog")
        .open();
    },

    showAlertDialog2: function (options) {
      let dialog = $("<div></div>");
      dialog
        .kendoDialog({
          width: options.width ? options.width : "450px",
          title: false,
          closable: options.closable ? options.closable : false,
          modal: options.modal ? options.modal : true,
          content: options.content ? options.content : "Alert!!!",
          actions: [
            {
              text: "Close",
              action: options.onOk ? options.onOk : function (e) { },
            },
          ],
          close: function (e) {
            e.sender.destroy();
            if (
              typeof options != "undefined" &&
              typeof options.onClose == "function"
            )
              options.onClose();
          },
        })
        .data("kendoDialog")
        .open();
    },

    showMessageDialog: function (options) {
      let dialog = $("<div></div>");
      dialog
        .kendoDialog({
          width: options.width ? options.width : "450px",
          title: false,
          closable: false,
          modal: true,
          content: options.content ? options.content : "Alert!!!",
          close: function (e) {
            e.sender.destroy();
            if (
              typeof options != "undefined" &&
              typeof options.onClose == "function"
            )
              options.onClose();
          },
        })
        .data("kendoDialog")
        .open();

      return dialog.data("kendoDialog");
    },

    // Loading Management
    showLoading: function () {
      $(".TLM-k-loading-mask").fadeIn();
    },

    hideLoading: function () {
      setTimeout(function () {
        if (tlm.global._showFullLoadingCount == 0) {
          $(".TLM-k-loading-mask").hide();
        }
      }, 1000);
    },

    showFullLoading: function () {
      this.showLoading();
    },

    showFullLoadingForceAllPage: function () {
      $(".TLM-k-loading-mask").fadeIn();
    },

    hideFullLoading: function () {
      this.hideLoading();
    },

    hideFullLoadingForceAllPage: function () {
      setTimeout(function () {
        $(".TLM-k-loading-mask").hide();
      }, 1000);
    },

    _showFullLoading: function () {
      if (tlm.global._showFullLoadingCount == 0) this.showLoading();
      tlm.global._showFullLoadingCount++;
    },

    _hideFullLoading: function () {
      tlm.global._showFullLoadingCount--;
      if (tlm.global._showFullLoadingCount == 0) this.hideLoading();
    },

    displayLoadingByElement: function (target) {
      var element = $(target);
      kendo.ui.progress(element, true);
    },

    displayLoadingByElementHide: function (target) {
      var element = $(target);
      setTimeout(function () {
        kendo.ui.progress(element, false);
      }, 500);
    },

    showUnauthorizedAccess: function (title, requiredRoles, target) {
      tlm.global.showFullLoading();
      if (target === undefined || target === null || target.length == 0) {
        target = $(".mainContentContainer");
      }
      if (requiredRoles == undefined || requiredRoles == null) {
        requiredRoles = [];
      }
      if (title == undefined || title == null || title == "") {
        title = "this page";
      }
      const rolesText = requiredRoles.join(", ");

      const unauthorizedHtml = `
      <div class="unauthorized-container">
          <div class="unauthorized-content">
              <div class="unauthorized-icon">
                  <i class="fas fa-shield-alt"></i>
              </div>
              <h2>Access Denied</h2>
              <p>You don't have permission to access ${title}</p>
              <button id="btnGoHome" class="k-button k-button-lg k-button-solid k-button-solid-primary k-rounded-md">
                  <i class="fas fa-home"></i> Go to Home Page
              </button>
          </div>
      </div>
  `;

      $(target).html(unauthorizedHtml);



      {
        try {
          let pageName = document.title || "Unknown Page";
          let assayGUID = tlm.global.getUrlParameter("AssayGUID") || "";
          tlm.global.logAction("Access Denined", "", "TOPCool-System", pageName, assayGUID, "Access Denined", "Error");
        } catch (e) {
          console.error("[TLM] Error logging unauthorized access:", e);
        }
      }

      setTimeout(() => {

        if (requiredRoles.length == 0) {
          $(".txt-roles").hide();
        }
        $("#btnGoHome").click(function () {
          window.location.href = tlm.global.webBaseUrl;
        });

      }, 100);
      setTimeout(function () {
        $("#menu-loading-pulse-main").hide();
        tlm.global.hideFullLoading();
      }, 500);
    },

    /* ===============================================
      6. KENDO UI HELPERS
      =============================================== */

    renderKendoGridTextFilter: function (e) {
      let form = e.closest("form");
      form.find(".k-filter-help-text").text("Search Text");
      form.find(".k-filter-help-text").css("margin-bottom", "10px");
      form.find("select").remove();

      e.kendoTextBox();
    },

    fixKendoGridSameHeaderColumnNotActiveWhenFilterBySearchBox(e) {
      /*
        ต้องใส่ไว้ที่ Grid.dataBound และ Grid.filterMenuOpen
      */
      setTimeout(() => {
        if (e.sender.dataSource.filter() === undefined) return;

        let filters = e.sender.dataSource.filter().filters;
        let fileds = [];
        filters.forEach(f => {
          if (f.filters === undefined) {
            fileds.push(f.field);
          } else {
            f.filters.forEach(f2 => {
              fileds.push(f2.field);
            });
          }
        });

        fileds = [...new Set(fileds)];

        fileds.forEach(filed => {
          e.sender.element.find(`th[data-field='${filed}'] a.k-grid-filter-menu.k-grid-header-menu`).addClass(`k-active`);
        });

      }, 20);
    },

    renderKendoGridTextFilter2: function (kendoGridElement, fieldName, element) {
      let context = element.parent();

      // Clear default UI
      context.empty();

      // Create From DatePicker
      const fromPicker = $("<input/>")
        .appendTo(context)
        .kendoTextBox({
        }).data("kendoTextBox");

      $(`<div class="k-actions-stretched k-actions"><button title="Filter" btnFilter="true" class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"><span class="k-icon k-svg-icon k-svg-i-filter k-button-icon"><svg viewBox="0 0 512 512" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="M64 64v32l160 160v224l64-64V256L448 96V64z"></path></svg></span><span class="k-button-text">Filter</span></button><button title="Clear" class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" type="reset"><span class="k-icon k-svg-icon k-svg-i-filter-clear k-button-icon"><svg viewBox="0 0 512 512" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="m143.5 64 168.2 168.2L288 256v160l-64 64V256L64 96V64zm236.1 100.4L448 96V64H279.3l-64-64L192 22l298 298 22-23.3z"></path></svg></span><span class="k-button-text">Clear</span></button></div>`).appendTo(context);

      $(context).find(`button[btnFilter]`).on(`click`, filterGrid);

      function filterGrid() {
        const from = fromPicker.value();

        const filters = [];

        if (from) {
          filters.push({
            field: `${fieldName}`,
            operator: "contains",
            value: from
          });
        }

        const grid = $(`${kendoGridElement}`).data("kendoGrid");
        grid.dataSource.filter({
          logic: "and",
          filters: filters
        });
      }
    },

    renderKendoGridDateBetween: function (kendoGridElement, fieldName, element) {
      let context = element.parent();

      // Clear default UI
      context.empty();

      // Create From DatePicker
      $("<div><label>From:</label><div/>")
        .appendTo(context);
      const fromPicker = $("<input/>")
        .appendTo(context)
        .kendoDatePicker({
          format: "dd-MMM-yyyy"
        }).data("kendoDatePicker");

      $("<div><label>To:</label><div/>")
        .appendTo(context);

      // Create To DatePicker
      const toPicker = $("<input/>")
        .appendTo(context)
        .kendoDatePicker({
          format: "dd-MMM-yyyy"
        }).data("kendoDatePicker");

      $(`<div class="k-actions-stretched k-actions"><button title="Filter" btnFilter="true" class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"><span class="k-icon k-svg-icon k-svg-i-filter k-button-icon"><svg viewBox="0 0 512 512" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="M64 64v32l160 160v224l64-64V256L448 96V64z"></path></svg></span><span class="k-button-text">Filter</span></button><button title="Clear" class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" type="reset"><span class="k-icon k-svg-icon k-svg-i-filter-clear k-button-icon"><svg viewBox="0 0 512 512" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="m143.5 64 168.2 168.2L288 256v160l-64 64V256L64 96V64zm236.1 100.4L448 96V64H279.3l-64-64L192 22l298 298 22-23.3z"></path></svg></span><span class="k-button-text">Clear</span></button></div>`).appendTo(context);

      $(context).find(`button[btnFilter]`).on(`click`, filterGrid);

      function filterGrid() {
        let from = fromPicker.value();
        let to = toPicker.value();
        let filters = [];

        if (from) {
          filters.push({
            field: `${fieldName}`,
            operator: "gte",
            value: from
          });
        }

        if (to) {
          to = new Date(to.setHours(23, 59, 59));
          filters.push({
            field: `${fieldName}`,
            operator: "lte",
            value: to
          });
        }

        const grid = $(`${kendoGridElement}`).data("kendoGrid");
        grid.dataSource.filter({
          logic: "and",
          filters: filters
        });
      }
    },

    renderKendoGridDateTimeBetween: function (kendoGridElement, fieldName, element) {
      let context = element.parent();

      // Clear default UI
      context.empty();

      // Create From DatePicker
      $("<div><label>From:</label><div/>")
        .appendTo(context);
      const fromPicker = $("<input/>")
        .appendTo(context)
        .kendoDateTimePicker({
          format: "dd-MMM-yyyy HH:mm",
          timeFormat: "HH:mm"
        }).data("kendoDateTimePicker");

      // Create To DatePicker
      $("<div><label>To:</label><div/>")
        .appendTo(context);
      const toPicker = $("<input/>")
        .appendTo(context)
        .kendoDateTimePicker({
          format: "dd-MMM-yyyy HH:mm",
          timeFormat: "HH:mm"
        }).data("kendoDateTimePicker");

      let fristSelect = true;
      toPicker.bind("close", function (e) {
        if (e.view === "date" && fristSelect) {
          e.sender.value(new Date(e.sender.value().setHours(23, 59, 59)));
          fristSelect = false;
        }
      });

      $(`<div class="k-actions-stretched k-actions"><button title="Filter" btnFilter="true" class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"><span class="k-icon k-svg-icon k-svg-i-filter k-button-icon"><svg viewBox="0 0 512 512" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="M64 64v32l160 160v224l64-64V256L448 96V64z"></path></svg></span><span class="k-button-text">Filter</span></button><button title="Clear" class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" type="reset"><span class="k-icon k-svg-icon k-svg-i-filter-clear k-button-icon"><svg viewBox="0 0 512 512" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="m143.5 64 168.2 168.2L288 256v160l-64 64V256L64 96V64zm236.1 100.4L448 96V64H279.3l-64-64L192 22l298 298 22-23.3z"></path></svg></span><span class="k-button-text">Clear</span></button></div>`).appendTo(context);

      $(context).find(`button[btnFilter]`).on(`click`, filterGrid);

      function filterGrid() {
        let from = fromPicker.value();
        let to = toPicker.value();
        let filters = [];

        if (from) {
          filters.push({
            field: `${fieldName}`,
            operator: "gte",
            value: from
          });
        }

        if (to) {
          filters.push({
            field: `${fieldName}`,
            operator: "lte",
            value: to
          });
        }

        const grid = $(`${kendoGridElement}`).data("kendoGrid");
        grid.dataSource.filter({
          logic: "and",
          filters: filters
        });
      }
    },

    renderKendoGridNumberBetween: function (kendoGridElement, fieldName, element) {
      let context = element.parent();

      // Clear default UI
      context.empty();

      // Create From DatePicker
      $("<div><label>From:</label><div/>")
        .appendTo(context);
      const fromPicker = $("<input/>")
        .appendTo(context)
        .kendoNumericTextBox({
          decimals: 4,
          format: "n4"
        }).data("kendoNumericTextBox");

      $("<div><label>To:</label><div/>")
        .appendTo(context);

      // Create To DatePicker
      const toPicker = $("<input/>")
        .appendTo(context)
        .kendoNumericTextBox({
          decimals: 4,
          format: "n4"
        }).data("kendoNumericTextBox");

      $(`<div class="k-actions-stretched k-actions"><button title="Filter" btnFilter="true" class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"><span class="k-icon k-svg-icon k-svg-i-filter k-button-icon"><svg viewBox="0 0 512 512" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="M64 64v32l160 160v224l64-64V256L448 96V64z"></path></svg></span><span class="k-button-text">Filter</span></button><button title="Clear" class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" type="reset"><span class="k-icon k-svg-icon k-svg-i-filter-clear k-button-icon"><svg viewBox="0 0 512 512" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="m143.5 64 168.2 168.2L288 256v160l-64 64V256L64 96V64zm236.1 100.4L448 96V64H279.3l-64-64L192 22l298 298 22-23.3z"></path></svg></span><span class="k-button-text">Clear</span></button></div>`).appendTo(context);

      $(context).find(`button[btnFilter]`).on(`click`, filterGrid);

      function filterGrid() {
        const from = fromPicker.value();
        const to = toPicker.value();
        const filters = [];

        if (from) {
          filters.push({
            field: `${fieldName}`,
            operator: "gte",
            value: from
          });
        }

        if (to) {
          filters.push({
            field: `${fieldName}`,
            operator: "lte",
            value: to
          });
        }

        const grid = $(`${kendoGridElement}`).data("kendoGrid");
        grid.dataSource.filter({
          logic: "and",
          filters: filters
        });
      }
    },

    betweenFilter: function (args) {
      let filterCell = args.element.parents(".k-filtercell");

      filterCell.empty();
      filterCell.html(
        '<span style="display:flex; justify-content:center;"><span>From:</span><input  class="start-date"/><span>To:</span><input  class="end-date"/></span>'
      );

      $(".start-date", filterCell).kendoDatePicker({
        change: function (e) {
          let startDate = e.sender.value(),
            endDate = $("input.end-date", filterCell)
              .data("kendoDatePicker")
              .value(),
            dataSource = $("#grid").data("kendoGrid").dataSource;

          if (startDate & endDate) {
            let filter = { logic: "and", filters: [] };
            filter.filters.push({
              field: "BirthDate",
              operator: "gte",
              value: startDate,
            });
            filter.filters.push({
              field: "BirthDate",
              operator: "lte",
              value: endDate,
            });
            dataSource.filter(filter);
          }
        },
      });
      $(".end-date", filterCell).kendoDatePicker({
        change: function (e) {
          let startDate = $("input.start-date", filterCell)
            .data("kendoDatePicker")
            .value(),
            endDate = e.sender.value(),
            dataSource = $("#grid").data("kendoGrid").dataSource;

          if (startDate & endDate) {
            let filter = { logic: "and", filters: [] };
            filter.filters.push({
              field: "BirthDate",
              operator: "gte",
              value: startDate,
            });
            filter.filters.push({
              field: "BirthDate",
              operator: "lte",
              value: endDate,
            });
            dataSource.filter(filter);
          }
        },
      });
    },

    rederGridSortIcon: function (e) {
      var headerCells = e.sender.element.find('th[data-role="columnsorter"]');
      headerCells.each(function (i, e) {
        var headerCell = $(this);
        var link = headerCell.find("span.k-link");
        setTimeout(function () {
          var icon = link.find("span.k-i-arrows-swap");
          var activeElement = $(".k-sorted").children().find(".k-link");
          if (activeElement[0] == link[0]) {
            icon.remove();
          }

          if (!headerCell.hasClass("k-sorted") && !icon.length) {
            link.append(
              '<span class="k-icon k-font-icon k-i-arrows-swap tlm-grid-icon-sort"><i class="fa-light fa-arrow-up-arrow-down"></i></span>'
            );
          }
        });
      });
    },

    getGridHeight(selector) {
      let windowHeight = $(window).height();
      let tableTop = $(selector).offset().top;
      let gridHeight = 500;
      if (windowHeight > tableTop) gridHeight = windowHeight - tableTop - 15;

      return gridHeight;
    },

    resizeKendoGrid(target, gridHeight, gridWidth) {
      const targetElement = $(target);
      const gridScollableTarget = targetElement.find(
        ".k-grid-content.k-auto-scrollable"
      );
      if (gridScollableTarget == null || gridScollableTarget.length == 0)
        return;

      let gridToolbarHeight;
      const gridToolbarTarget = targetElement.find(".k-grid-toolbar");
      if (gridToolbarTarget == null || gridToolbarTarget.length == 0)
        gridToolbarHeight = 0;
      else gridToolbarHeight = gridToolbarTarget.outerHeight(true);

      let gridHeaderHeight;
      const gridHeaderTarget = targetElement.find(".k-grid-header");
      if (gridHeaderTarget == null || gridHeaderTarget.length == 0)
        gridHeaderHeight = 0;
      else gridHeaderHeight = gridHeaderTarget.outerHeight(true);

      let gridPagerHeight;
      const gridPagerTarget = targetElement.find(".k-grid-pager");
      if (gridPagerTarget == null || gridPagerTarget.length == 0)
        gridPagerHeight = 0;
      else gridPagerHeight = gridPagerTarget.outerHeight(true);

      if (typeof gridHeight != "undefined" && gridHeight != null) {
        let newGridScrollableHeight =
          gridHeight - gridToolbarHeight - gridHeaderHeight - gridPagerHeight;
        if (newGridScrollableHeight < 0) newGridScrollableHeight = 0;

        targetElement.height(gridHeight);
        gridScollableTarget.height(newGridScrollableHeight);
      }

      if (typeof gridWidth != "undefined" && gridWidth != null) {
        targetElement.width(gridWidth);
      }
    },

    adjustGridHeight(id, adjustHieght) {
      if (adjustHieght === undefined) {
        adjustHieght = 150;
      }

      function callback() {
        let kendoGridElement = $(id);
        let combar = $(".commandBarWrapper").height();
        let spsite = $("#spSiteHeader").height();
        let marginBottom = parseInt($(".ControlZone").css("margin-bottom"), 10);
        let getH = combar + spsite + marginBottom + adjustHieght;

        kendoGridElement.height(window.innerHeight - getH);

        var kendoGrid = kendoGridElement.data("kendoGrid");
        if (kendoGrid) {
          kendoGrid.resize();
        }
      }

      callback();

      $(window).on("resize", function () {
        callback();
      });
    },

    adjustGridCmd(id) {
      function callback() {
        let kendoGridElement = $(id);
        let kendoGrid = kendoGridElement.data("kendoGrid");

        if (kendoGrid && kendoGridElement.length > 0) {
          // เช็คว่ามี tooltip อยู่แล้วหรือไม่โดยใช้ data attribute
          if (!kendoGridElement.data("tlm-tooltips-bound")) {

            // View button tooltip
            kendoGridElement.kendoTooltip({
              filter: ".btnGridCmdView",
              position: "top",
              content: function (e) {
                return "View";
              }
            });

            // Edit button tooltip  
            kendoGridElement.kendoTooltip({
              filter: ".btnGridCmdEdit",
              position: "top",
              content: function (e) {
                return "Edit";
              }
            });

            // Delete button tooltip
            kendoGridElement.kendoTooltip({
              filter: ".btnGridCmdDelete",
              position: "top",
              content: function (e) {
                return "Delete";
              }
            });

            // ทำเครื่องหมายว่า tooltip ถูก bind แล้ว
            kendoGridElement.data("tlm-tooltips-bound", true);
          }
        }
      }

      callback();

      // Unbind existing resize handler for this grid to prevent duplicates
      $(window).off(`resize.gridCmd${id.replace('#', '')}`);

      // Bind new resize handler with namespaced event
      $(window).on(`resize.gridCmd${id.replace('#', '')}`, function () {
        callback();
      });
    },

    /* ===============================================
       7. VALIDATION SYSTEM
       =============================================== */

    validation: {
      showSummary: function (validationErrors, containerId = 'validationSummaryContainer', isClear = true) {
        if (isClear != false) {
          tlm.global.validation.clear();
        }

        if (!validationErrors || validationErrors.length === 0) {
          return;
        }

        const summaryHtml = tlm.global.validation._createSummaryHtml(validationErrors);

        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = summaryHtml;
        }

        tlm.global.validation._applyValidationStyles(validationErrors);
        tlm.global.validation._setupClickHandlers();

        setTimeout(() => {
          const summaryElement = document.querySelector('.validation-summary-container');
          if (summaryElement) {
            summaryElement.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            });
          }
        }, 100);
      },

      clear: function (containerId = 'validationSummaryContainer') {
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = '';
        }

        // Clear standard HTML controls
        const invalidControls = document.querySelectorAll('.is-invalid');
        invalidControls.forEach(control => {
          control.classList.remove('is-invalid');
        });

        // Clear Kendo UI invalid classes
        $('.k-invalid').removeClass('k-invalid');

        // Clear error spans
        const errorSpans = document.querySelectorAll('.validation-error');
        errorSpans.forEach(span => {
          span.textContent = '';
          span.style.display = 'none';
        });

        // Clear Kendo UI Controls validation
        this._clearKendoUIValidation();
      },

      _clearKendoUIValidation: function () {
        // Clear all k-invalid classes first
        $('.k-invalid').removeClass('k-invalid');

        // Clear TextBox controls
        $('[data-role="textbox"], .k-textbox, input.k-textbox').each(function () {
          const element = $(this);
          element.removeClass('k-invalid is-invalid');
          const kendoTextBox = element.data('kendoTextBox');
          if (kendoTextBox && kendoTextBox.wrapper) {
            kendoTextBox.wrapper.removeClass('k-invalid');
            kendoTextBox.wrapper.css({
              'border-color': '',
              'border-width': '',
              'box-shadow': ''
            });
            // Force remove inline styles
            if (kendoTextBox.wrapper[0]) {
              kendoTextBox.wrapper[0].style.removeProperty('border-color');
              kendoTextBox.wrapper[0].style.removeProperty('border-width');
              kendoTextBox.wrapper[0].style.removeProperty('box-shadow');
            }
          }
          // Also clear the input element itself
          this.style.removeProperty('border-color');
          this.style.removeProperty('border-width');
          this.style.removeProperty('box-shadow');
        });

        // Clear TextArea controls  
        $('[data-role="textarea"], .k-textarea, textarea.k-textarea').each(function () {
          const element = $(this);
          element.removeClass('k-invalid is-invalid');
          const kendoTextArea = element.data('kendoTextArea');
          if (kendoTextArea && kendoTextArea.wrapper) {
            kendoTextArea.wrapper.removeClass('k-invalid');
            kendoTextArea.wrapper.css({
              'border-color': '',
              'border-width': '',
              'box-shadow': ''
            });
            // Force remove inline styles
            if (kendoTextArea.wrapper[0]) {
              kendoTextArea.wrapper[0].style.removeProperty('border-color');
              kendoTextArea.wrapper[0].style.removeProperty('border-width');
              kendoTextArea.wrapper[0].style.removeProperty('box-shadow');
            }
          }
          // Also clear the textarea element itself
          this.style.removeProperty('border-color');
          this.style.removeProperty('border-width');
          this.style.removeProperty('box-shadow');
        });

        // Clear DropDownList controls
        $('[data-role="dropdownlist"], .k-dropdown').each(function () {
          const kendoDropDown = $(this).data('kendoDropDownList');
          if (kendoDropDown && kendoDropDown.wrapper) {
            kendoDropDown.wrapper.removeClass('k-invalid');
            kendoDropDown.wrapper.find('.k-dropdown-wrap').removeClass('k-invalid');
            kendoDropDown.wrapper.css({
              'border-color': '',
              'border-width': '',
              'box-shadow': ''
            });
            // Force remove inline styles
            if (kendoDropDown.wrapper[0]) {
              kendoDropDown.wrapper[0].style.removeProperty('border-color');
              kendoDropDown.wrapper[0].style.removeProperty('border-width');
              kendoDropDown.wrapper[0].style.removeProperty('box-shadow');
            }
          }
          $(this).removeClass('k-invalid is-invalid');
        });

        // Clear DropDownTree controls
        $('[data-role="dropdowntree"], .k-dropdowntree').each(function () {
          const element = $(this);
          element.removeClass('k-invalid is-invalid');
          const kendoDropDownTree = element.data('kendoDropDownTree');
          if (kendoDropDownTree && kendoDropDownTree.wrapper) {
            kendoDropDownTree.wrapper.removeClass('k-invalid');
            kendoDropDownTree.wrapper.css({
              'border-color': '',
              'border-width': '',
              'box-shadow': ''
            });
            // Force remove inline styles
            if (kendoDropDownTree.wrapper[0]) {
              kendoDropDownTree.wrapper[0].style.removeProperty('border-color');
              kendoDropDownTree.wrapper[0].style.removeProperty('border-width');
              kendoDropDownTree.wrapper[0].style.removeProperty('box-shadow');
            }
          }
          // Also clear the element itself
          this.style.removeProperty('border-color');
          this.style.removeProperty('border-width');
          this.style.removeProperty('box-shadow');
        });

        // Clear MultiSelect controls
        $('[data-role="multiselect"], .k-multiselect').each(function () {
          const kendoMultiSelect = $(this).data('kendoMultiSelect');
          if (kendoMultiSelect && kendoMultiSelect.wrapper) {
            kendoMultiSelect.wrapper.removeClass('k-invalid');
            kendoMultiSelect.wrapper.find('.k-multiselect-wrap').removeClass('k-invalid');
            kendoMultiSelect.wrapper.css({
              'border-color': '',
              'border-width': '',
              'box-shadow': ''
            });
            // Force remove inline styles
            if (kendoMultiSelect.wrapper[0]) {
              kendoMultiSelect.wrapper[0].style.removeProperty('border-color');
              kendoMultiSelect.wrapper[0].style.removeProperty('border-width');
              kendoMultiSelect.wrapper[0].style.removeProperty('box-shadow');
            }
          }
          $(this).removeClass('k-invalid is-invalid');
        });

        // Clear DatePicker controls
        $('[data-role="datepicker"], .k-datepicker').each(function () {
          const kendoDatePicker = $(this).data('kendoDatePicker');
          if (kendoDatePicker && kendoDatePicker.wrapper) {
            kendoDatePicker.wrapper.removeClass('k-invalid');
            kendoDatePicker.wrapper.find('.k-picker-wrap').removeClass('k-invalid');
            kendoDatePicker.wrapper.css({
              'border-color': '',
              'border-width': '',
              'box-shadow': ''
            });
            // Force remove inline styles
            if (kendoDatePicker.wrapper[0]) {
              kendoDatePicker.wrapper[0].style.removeProperty('border-color');
              kendoDatePicker.wrapper[0].style.removeProperty('border-width');
              kendoDatePicker.wrapper[0].style.removeProperty('box-shadow');
            }
          }
          $(this).removeClass('k-invalid is-invalid');
        });

        // Clear AutoComplete controls
        $('[data-role="autocomplete"], .k-autocomplete').each(function () {
          const kendoAutoComplete = $(this).data('kendoAutoComplete');
          if (kendoAutoComplete && kendoAutoComplete.wrapper) {
            kendoAutoComplete.wrapper.removeClass('k-invalid');
            kendoAutoComplete.wrapper.css({
              'border-color': '',
              'border-width': '',
              'box-shadow': ''
            });
            // Force remove inline styles
            if (kendoAutoComplete.wrapper[0]) {
              kendoAutoComplete.wrapper[0].style.removeProperty('border-color');
              kendoAutoComplete.wrapper[0].style.removeProperty('border-width');
              kendoAutoComplete.wrapper[0].style.removeProperty('box-shadow');
            }
          }
          $(this).removeClass('k-invalid is-invalid');
        });

        // Clear ComboBox controls
        $('[data-role="combobox"], .k-combobox').each(function () {
          const kendoComboBox = $(this).data('kendoComboBox');
          if (kendoComboBox && kendoComboBox.wrapper) {
            kendoComboBox.wrapper.removeClass('k-invalid');
            kendoComboBox.wrapper.css({
              'border-color': '',
              'border-width': '',
              'box-shadow': ''
            });
            // Force remove inline styles
            if (kendoComboBox.wrapper[0]) {
              kendoComboBox.wrapper[0].style.removeProperty('border-color');
              kendoComboBox.wrapper[0].style.removeProperty('border-width');
              kendoComboBox.wrapper[0].style.removeProperty('box-shadow');
            }
          }
          $(this).removeClass('k-invalid is-invalid');
        });

        // Clear Upload controls
        $('[data-role="upload"], .k-upload').each(function () {
          const kendoUpload = $(this).data('kendoUpload');
          if (kendoUpload && kendoUpload.wrapper) {
            kendoUpload.wrapper.removeClass('k-invalid');
            kendoUpload.wrapper.css({
              'border-color': '',
              'border-width': ''
            });
            // Force remove inline styles
            if (kendoUpload.wrapper[0]) {
              kendoUpload.wrapper[0].style.removeProperty('border-color');
              kendoUpload.wrapper[0].style.removeProperty('border-width');
            }
          }
          $(this).removeClass('k-invalid is-invalid');
        });

        // Clear TimePicker controls
        $('[data-role="timepicker"], .k-timepicker').each(function () {
          const kendoTimePicker = $(this).data('kendoTimePicker');
          if (kendoTimePicker && kendoTimePicker.wrapper) {
            kendoTimePicker.wrapper.removeClass('k-invalid');
            kendoTimePicker.wrapper.find('.k-picker-wrap').removeClass('k-invalid');
            kendoTimePicker.wrapper.css({
              'border-color': '',
              'border-width': '',
              'box-shadow': ''
            });
            // Force remove inline styles
            if (kendoTimePicker.wrapper[0]) {
              kendoTimePicker.wrapper[0].style.removeProperty('border-color');
              kendoTimePicker.wrapper[0].style.removeProperty('border-width');
              kendoTimePicker.wrapper[0].style.removeProperty('box-shadow');
            }
          }
          $(this).removeClass('k-invalid is-invalid');
        });

        // Clear DateTimePicker controls
        $('[data-role="datetimepicker"], .k-datetimepicker').each(function () {
          const kendoDateTimePicker = $(this).data('kendoDateTimePicker');
          if (kendoDateTimePicker && kendoDateTimePicker.wrapper) {
            kendoDateTimePicker.wrapper.removeClass('k-invalid');
            kendoDateTimePicker.wrapper.find('.k-picker-wrap').removeClass('k-invalid');
            kendoDateTimePicker.wrapper.css({
              'border-color': '',
              'border-width': '',
              'box-shadow': ''
            });
            // Force remove inline styles
            if (kendoDateTimePicker.wrapper[0]) {
              kendoDateTimePicker.wrapper[0].style.removeProperty('border-color');
              kendoDateTimePicker.wrapper[0].style.removeProperty('border-width');
              kendoDateTimePicker.wrapper[0].style.removeProperty('box-shadow');
            }
          }
          $(this).removeClass('k-invalid is-invalid');
        });

        // Clear NumericTextBox controls
        $('[data-role="numerictextbox"], .k-numerictextbox').each(function () {
          const kendoNumericTextBox = $(this).data('kendoNumericTextBox');
          if (kendoNumericTextBox && kendoNumericTextBox.wrapper) {
            kendoNumericTextBox.wrapper.removeClass('k-invalid');
            kendoNumericTextBox.wrapper.css({
              'border-color': '',
              'border-width': '',
              'box-shadow': ''
            });
            // Force remove inline styles
            if (kendoNumericTextBox.wrapper[0]) {
              kendoNumericTextBox.wrapper[0].style.removeProperty('border-color');
              kendoNumericTextBox.wrapper[0].style.removeProperty('border-width');
              kendoNumericTextBox.wrapper[0].style.removeProperty('box-shadow');
            }
          }
          $(this).removeClass('k-invalid is-invalid');
        });

        // Clear Editor controls
        $('[data-role="editor"], .k-editor').each(function () {
          const kendoEditor = $(this).data('kendoEditor');
          if (kendoEditor && kendoEditor.wrapper) {
            kendoEditor.wrapper.removeClass('k-invalid');
            kendoEditor.wrapper.css({
              'border-color': '',
              'border-width': '',
              'box-shadow': ''
            });
            // Force remove inline styles
            if (kendoEditor.wrapper[0]) {
              kendoEditor.wrapper[0].style.removeProperty('border-color');
              kendoEditor.wrapper[0].style.removeProperty('border-width');
              kendoEditor.wrapper[0].style.removeProperty('box-shadow');
            }
          }
          $(this).removeClass('k-invalid is-invalid');
        });

        // Clear div/container validation styles
        const validationContainers = document.querySelectorAll('.validation-error-container');
        validationContainers.forEach(container => {
          container.classList.remove('validation-error-container', 'is-invalid', 'k-invalid');
          // Remove properties that were set with !important
          container.style.removeProperty('border');
          container.style.removeProperty('border-radius');
          container.style.removeProperty('box-shadow');
          container.style.removeProperty('background-color');
          container.style.removeProperty('animation');
        });

        // Additional comprehensive cleanup
        const allInvalidElements = document.querySelectorAll('.k-invalid, .is-invalid');
        allInvalidElements.forEach(element => {
          element.classList.remove('k-invalid', 'is-invalid');
          // Clear any inline styles that might be causing the red border
          element.style.removeProperty('border-color');
          element.style.removeProperty('border-width');
          element.style.removeProperty('box-shadow');
          element.style.removeProperty('border');
        });

        // Force clear any Kendo wrapper elements that might have validation styles
        $('.k-widget').each(function () {
          $(this).removeClass('k-invalid');
          this.style.removeProperty('border-color');
          this.style.removeProperty('border-width');
          this.style.removeProperty('box-shadow');
          this.style.removeProperty('border');
        });

        // console.log('Cleared validation from all controls including Kendo UI components');
      },

      validateField: function (fieldId, errorMessage, controlType) {
        const control = document.getElementById(fieldId);
        const errorSpan = tlm.global.validation._getErrorSpan(fieldId);

        if (!control) {
          return false;
        }

        let isValid = true;
        let value = '';

        switch (controlType.toLowerCase()) {
          case 'textbox':
          case 'textarea':
            value = control.value ? control.value.trim() : '';
            isValid = value !== '';
            break;

          case 'dropdown':
          case 'dropdownlist':
            const kendoDropDown = $(control).data('kendoDropDownList');
            value = kendoDropDown ? kendoDropDown.value() : control.value;
            isValid = value && value !== '';
            break;

          case 'dropdowntree':
            const kendoDropDownTree = $(control).data('kendoDropDownTree');
            value = kendoDropDownTree ? kendoDropDownTree.value() : control.value;
            isValid = value && value !== '' && value !== null;
            break;

          case 'multiselect':
            const kendoMultiSelect = $(control).data('kendoMultiSelect');
            const values = kendoMultiSelect ? kendoMultiSelect.value() : [];
            isValid = values && values.length > 0;
            break;

          case 'datepicker':
            const kendoDatePicker = $(control).data('kendoDatePicker');
            value = kendoDatePicker ? kendoDatePicker.value() : control.value;
            isValid = value && value !== '';
            break;

          case 'div':
          case 'container':
          case 'section':
          case 'expert':
          case 'expertcomment':
            const checkboxes = control.querySelectorAll('input[type="checkbox"]:checked');
            const radios = control.querySelectorAll('input[type="radio"]:checked');
            const selectedInputs = control.querySelectorAll('input:checked');

            isValid = checkboxes.length > 0 || radios.length > 0 || selectedInputs.length > 0;
            break;

          default:
            value = control.value ? control.value.trim() : '';
            isValid = value !== '';
            break;
        }

        if (isValid) {
          tlm.global.validation._clearFieldValidation(control, controlType, errorSpan);
        } else {
          tlm.global.validation._applyControlValidation(control, controlType);
          if (errorSpan) {
            errorSpan.textContent = errorMessage;
            errorSpan.style.display = 'block';
            errorSpan.classList.add('validation-error');
          }
        }

        return isValid;
      },

      _createSummaryHtml: function (validationErrors) {
        let itemsHtml = '';

        validationErrors.forEach((error, index) => {
          itemsHtml += `
                    <div class="validation-summary-item" data-field-id="${error.id}" data-control-type="${error.controlType}">
                        <div class="validation-error-dot"></div>
                        <p class="validation-error-text"><b>${error.text}</b>: ${error.msg}</p>
                    </div>
                `;
        });

        return `
                <div class="validation-summary-container">
                    <div class="validation-summary-header">
                        <span class="validation-summary-icon"></span>
                        <h6 class="validation-summary-title">Please correct the following errors:</h6>
                    </div>
                    <div class="validation-summary-body">
                        ${itemsHtml}
                    </div>
                </div>
            `;
      },

      _applyValidationStyles: function (validationErrors) {
        validationErrors.forEach(error => {
          const control = document.getElementById(error.id);
          const errorSpan = tlm.global.validation._getErrorSpan(error.id);

          if (control) {
            tlm.global.validation._applyControlValidation(control, error.controlType);
          }

          if (errorSpan) {
            errorSpan.textContent = error.msg;
            errorSpan.style.display = 'block';
            errorSpan.classList.add('validation-error');
          }
        });
      },

      _applyControlValidation: function (control, controlType) {
        control.classList.add('is-invalid');

        switch (controlType.toLowerCase()) {
          case 'textbox':
            if (control.classList.contains('k-textbox') || $(control).data('kendoTextBox')) {
              control.classList.add('k-invalid');
              const kendoTextBox = $(control).data('kendoTextBox');
              if (kendoTextBox && kendoTextBox.wrapper) {
                kendoTextBox.wrapper.addClass('k-invalid');
              }
            }
            break;
          case 'textarea':
            if (control.classList.contains('k-textarea') || $(control).data('kendoTextArea')) {
              control.classList.add('k-invalid');
              const kendoTextArea = $(control).data('kendoTextArea');
              if (kendoTextArea && kendoTextArea.wrapper) {
                kendoTextArea.wrapper.addClass('k-invalid');
                kendoTextArea.wrapper.css({
                  'border-color': '#dc3545',
                  'border-width': '2px',
                  'box-shadow': '0 0 0 0.1rem rgba(220, 53, 69, 0.15)'
                });
              }
            }
            break;
          case 'dropdown':
          case 'dropdownlist':
            const kendoDropDown = $(control).data('kendoDropDownList');
            if (kendoDropDown) {
              kendoDropDown.wrapper.addClass('k-invalid');
              const dropDownWrap = kendoDropDown.wrapper.find('.k-dropdown-wrap');
              if (dropDownWrap.length > 0) {
                dropDownWrap.addClass('k-invalid');
              }
              kendoDropDown.wrapper.css({
                'border-color': '#dc3545',
                'border-width': '2px',
                'box-shadow': '0 0 0 0.1rem rgba(220, 53, 69, 0.15)'
              });
            }
            break;

          case 'dropdowntree':
            const kendoDropDownTree = $(control).data('kendoDropDownTree');
            if (kendoDropDownTree) {
              kendoDropDownTree.wrapper.addClass('k-invalid');
              kendoDropDownTree.wrapper.css({
                'border-color': '#dc3545',
                'border-width': '2px',
                'box-shadow': '0 0 0 0.1rem rgba(220, 53, 69, 0.15)'
              });
            }
            break;

          case 'multiselect':
            const kendoMultiSelect = $(control).data('kendoMultiSelect');
            if (kendoMultiSelect) {
              kendoMultiSelect.wrapper.addClass('k-invalid');
              const multiSelectWrap = kendoMultiSelect.wrapper.find('.k-multiselect-wrap');
              if (multiSelectWrap.length > 0) {
                multiSelectWrap.addClass('k-invalid');
              }
              kendoMultiSelect.wrapper.css({
                'border-color': '#dc3545',
                'border-width': '2px',
                'box-shadow': '0 0 0 0.1rem rgba(220, 53, 69, 0.15)'
              });
            }
            break;

          case 'datepicker':
            const kendoDatePicker = $(control).data('kendoDatePicker');
            if (kendoDatePicker) {
              kendoDatePicker.wrapper.addClass('k-invalid');
              const pickerWrap = kendoDatePicker.wrapper.find('.k-picker-wrap');
              if (pickerWrap.length > 0) {
                pickerWrap.addClass('k-invalid');
              }
              kendoDatePicker.wrapper.css({
                'border-color': '#dc3545',
                'border-width': '2px',
                'box-shadow': '0 0 0 0.1rem rgba(220, 53, 69, 0.15)'
              });
            }
            break;

          case 'upload':
            const kendoUpload = $(control).data('kendoUpload');
            if (kendoUpload) {
              kendoUpload.wrapper.addClass('k-invalid');
              kendoUpload.wrapper.css({
                'border-color': '#dc3545',
                'border-width': '2px'
              });
            }
            break;

          case 'autocomplete':
            const kendoAutoComplete = $(control).data('kendoAutoComplete');
            if (kendoAutoComplete) {
              kendoAutoComplete.wrapper.addClass('k-invalid');
              kendoAutoComplete.wrapper.css({
                'border-color': '#dc3545',
                'border-width': '2px',
                'box-shadow': '0 0 0 0.1rem rgba(220, 53, 69, 0.15)'
              });
            }
            break;

          case 'combobox':
            const kendoComboBox = $(control).data('kendoComboBox');
            if (kendoComboBox) {
              kendoComboBox.wrapper.addClass('k-invalid');
              kendoComboBox.wrapper.css({
                'border-color': '#dc3545',
                'border-width': '2px',
                'box-shadow': '0 0 0 0.1rem rgba(220, 53, 69, 0.15)'
              });
            }
            break;

          case 'radio':
            control.classList.add('k-invalid');
            break;

          case 'div':
          case 'container':
          case 'section':
          case 'expert':
          case 'expertcomment':
            control.classList.add('validation-error-container');
            control.style.setProperty('border', '2px solid #dc3545', 'important');
            control.style.setProperty('border-radius', '4px', 'important');
            control.style.setProperty('box-shadow', '0 0 0 0.1rem rgba(220, 53, 69, 0.15)', 'important');
            control.style.setProperty('background-color', 'rgba(220, 53, 69, 0.02)', 'important');
            control.style.setProperty('animation', 'inputShake 0.3s ease-in-out');
            setTimeout(() => {
              if (control && control.style) {
                control.style.removeProperty('animation');
              }
            }, 300);
            // console.log('Applied validation to div:', control.id);
            break;

          default:
            break;
        }
      },

      _getErrorSpan: function (controlId) {
        if (controlId === undefined || controlId === null || controlId.trim() === '') {
          return;
        }
        const patterns = [
          `error${controlId}`,
          `error${controlId.replace('txt', '').replace('cbo', '').replace('dtp', '')}`,
          `${controlId}Error`,
          `${controlId}-error`,
          `${controlId}_error`
        ];

        for (const pattern of patterns) {
          const element = document.getElementById(pattern);
          if (element) {
            return element;
          }
        }

        const control = document.getElementById(controlId);
        if (control) {
          const formField = control.closest('.tlm-form-field, .form-group, .mb-3');
          if (formField) {
            return formField.querySelector('.validation-error');
          }
        }

        return null;
      },

      _setupClickHandlers: function () {
        const summaryItems = document.querySelectorAll('.validation-summary-item');

        summaryItems.forEach(item => {
          item.addEventListener('click', function () {
            const fieldId = this.getAttribute('data-field-id');
            const controlType = this.getAttribute('data-control-type');
            const control = document.getElementById(fieldId);

            this.classList.add('clicked');
            setTimeout(() => {
              this.classList.remove('clicked');
            }, 200);

            if (control) {
              tlm.global.validation._scrollToControl(control);

              setTimeout(() => {
                tlm.global.validation._focusControl(control, controlType);
                tlm.global.validation._addHighlightEffect(control, controlType);
              }, 500);
            }
          });
        });
      },

      _scrollToControl: function (control) {
        const formField = control.closest('.tlm-form-field, .form-group, .mb-3') || control;

        formField.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      },

      _focusControl: function (control, controlType) {
        switch (controlType.toLowerCase()) {
          case 'dropdown':
          case 'dropdownlist':
            const kendoDropDown = $(control).data('kendoDropDownList');
            if (kendoDropDown) {
              kendoDropDown.focus();
            } else {
              control.focus();
            }
            break;

          case 'dropdowntree':
            const kendoDropDownTree = $(control).data('kendoDropDownTree');
            if (kendoDropDownTree) {
              kendoDropDownTree.focus();
            } else {
              control.focus();
            }
            break;

          case 'multiselect':
            const kendoMultiSelect = $(control).data('kendoMultiSelect');
            if (kendoMultiSelect) {
              kendoMultiSelect.focus();
            } else {
              control.focus();
            }
            break;

          case 'datepicker':
            const kendoDatePicker = $(control).data('kendoDatePicker');
            if (kendoDatePicker) {
              kendoDatePicker.focus();
            } else {
              control.focus();
            }
            break;

          case 'autocomplete':
            const kendoAutoComplete = $(control).data('kendoAutoComplete');
            if (kendoAutoComplete) {
              kendoAutoComplete.focus();
            } else {
              control.focus();
            }
            break;

          case 'combobox':
            const kendoComboBox = $(control).data('kendoComboBox');
            if (kendoComboBox) {
              kendoComboBox.focus();
            } else {
              control.focus();
            }
            break;

          default:
            control.focus();
            break;
        }
      },

      _addHighlightEffect: function (control, controlType) {
        let targetElement = control;

        switch (controlType.toLowerCase()) {
          case 'dropdown':
          case 'dropdownlist':
            const kendoDropDown = $(control).data('kendoDropDownList');
            if (kendoDropDown) {
              targetElement = kendoDropDown.wrapper[0];
            }
            break;

          case 'dropdowntree':
            const kendoDropDownTree = $(control).data('kendoDropDownTree');
            if (kendoDropDownTree) {
              targetElement = kendoDropDownTree.wrapper[0];
            }
            break;

          case 'multiselect':
            const kendoMultiSelect = $(control).data('kendoMultiSelect');
            if (kendoMultiSelect) {
              targetElement = kendoMultiSelect.wrapper[0];
            }
            break;

          case 'datepicker':
            const kendoDatePicker = $(control).data('kendoDatePicker');
            if (kendoDatePicker) {
              targetElement = kendoDatePicker.wrapper[0];
            }
            break;

          case 'autocomplete':
            const kendoAutoComplete = $(control).data('kendoAutoComplete');
            if (kendoAutoComplete) {
              targetElement = kendoAutoComplete.wrapper[0];
            }
            break;

          case 'combobox':
            const kendoComboBox = $(control).data('kendoComboBox');
            if (kendoComboBox) {
              targetElement = kendoComboBox.wrapper[0];
            }
            break;
        }

        targetElement.style.transition = 'box-shadow 0.3s ease';
        targetElement.style.boxShadow = '0 0 0 0.25rem rgba(13, 110, 253, 0.25)';

        setTimeout(() => {
          targetElement.style.boxShadow = '';
        }, 1500);
      },

      _clearFieldValidation: function (control, controlType, errorSpan) {
        control.classList.remove('is-invalid', 'k-invalid');

        switch (controlType.toLowerCase()) {
          case 'dropdown':
          case 'dropdownlist':
            const kendoDropDown = $(control).data('kendoDropDownList');
            if (kendoDropDown) {
              kendoDropDown.wrapper.removeClass('k-invalid');
              kendoDropDown.wrapper.find('.k-dropdown-wrap').removeClass('k-invalid');
              kendoDropDown.wrapper.css({
                'border-color': '',
                'border-width': '',
                'box-shadow': ''
              });
            }
            break;

          case 'dropdowntree':
            const kendoDropDownTree = $(control).data('kendoDropDownTree');
            if (kendoDropDownTree) {
              kendoDropDownTree.wrapper.removeClass('k-invalid');
              kendoDropDownTree.wrapper.css({
                'border-color': '',
                'border-width': '',
                'box-shadow': ''
              });
            }
            break;

          case 'multiselect':
            const kendoMultiSelect = $(control).data('kendoMultiSelect');
            if (kendoMultiSelect) {
              kendoMultiSelect.wrapper.removeClass('k-invalid');
              kendoMultiSelect.wrapper.find('.k-multiselect-wrap').removeClass('k-invalid');
              kendoMultiSelect.wrapper.css({
                'border-color': '',
                'border-width': '',
                'box-shadow': ''
              });
            }
            break;

          case 'datepicker':
            const kendoDatePicker = $(control).data('kendoDatePicker');
            if (kendoDatePicker) {
              kendoDatePicker.wrapper.removeClass('k-invalid');
              kendoDatePicker.wrapper.find('.k-picker-wrap').removeClass('k-invalid');
              kendoDatePicker.wrapper.css({
                'border-color': '',
                'border-width': '',
                'box-shadow': ''
              });
            }
            break;

          case 'autocomplete':
            const kendoAutoComplete = $(control).data('kendoAutoComplete');
            if (kendoAutoComplete) {
              kendoAutoComplete.wrapper.removeClass('k-invalid');
              kendoAutoComplete.wrapper.css({
                'border-color': '',
                'border-width': '',
                'box-shadow': ''
              });
            }
            break;

          case 'combobox':
            const kendoComboBox = $(control).data('kendoComboBox');
            if (kendoComboBox) {
              kendoComboBox.wrapper.removeClass('k-invalid');
              kendoComboBox.wrapper.css({
                'border-color': '',
                'border-width': '',
                'box-shadow': ''
              });
            }
            break;

          case 'upload':
            const kendoUpload = $(control).data('kendoUpload');
            if (kendoUpload) {
              kendoUpload.wrapper.removeClass('k-invalid');
              kendoUpload.wrapper.css({
                'border-color': '',
                'border-width': ''
              });
            }
            break;

          case 'div':
          case 'container':
          case 'section':
          case 'expert':
          case 'expertcomment':
            control.classList.remove('validation-error-container');
            control.style.removeProperty('border');
            control.style.removeProperty('border-radius');
            control.style.removeProperty('box-shadow');
            control.style.removeProperty('background-color');
            control.style.removeProperty('animation');
            // console.log('Cleared validation from div:', control.id);
            break;
        }

        if (errorSpan) {
          errorSpan.textContent = '';
          errorSpan.style.display = 'none';
        }
      }
    },

    /* ===============================================
       8. LOGGING & ANALYTICS
       =============================================== */

    ActionLogAdd: async function (step, action, page, message) {
      await tlm.global.ajaxCallResult({
        showLoadding: false,
        type: "POST",
        url: `${tlm.global.serviceUrl}/api/common/ActionLogAdd`,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
          Step: step,
          Action: action,
          Page: page,
          Message: message,
        }),
        success: function (data) { },
        error: function (data) { },
      });
    },

    // User Access Log
    logPageAccess: function (moduleName, pageName, subModule = null) {
      try {
        if (tlm.global._disposed) {
          // console.warn("[TLM] Cannot log page access - tlm.global is disposed");
          return;
        }

        const clientInfo = tlm.global.getClientInfo();

        const requestData = {
          moduleName: moduleName,
          pageName: pageName,
          subModule: subModule,
          deviceType: clientInfo.deviceType,
          browser: clientInfo.browser,
          operatingSystem: clientInfo.operatingSystem,
          referrerUrl: document.referrer || 'Direct Access',
          fullUrl: window.location.href,
        };

        tlm.global.ajaxCallResult({
          url: `${tlm.global.serviceUrl}/api/UserAccessLog/log-access`,
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify(requestData),
          showLoadding: false,
          success: function (data) {
            // Log access silently
          },
          error: function (jqXHR, textStatus, errorThrown) {
            // Log error silently
          }
        });

      } catch (error) {
        // console.error('[TLM] Exception in logPageAccess:', error);
      }
    },

    getClientInfo: function () {
      try {
        const getDeviceType = () => {
          const userAgent = navigator.userAgent.toLowerCase();

          if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
            if (/ipad/i.test(userAgent)) return 'Tablet';
            if (/android/i.test(userAgent) && !/mobile/i.test(userAgent)) return 'Tablet';
            return 'Mobile';
          }

          return 'Desktop';
        };

        const getBrowser = () => {
          const userAgent = navigator.userAgent;

          if (userAgent.includes('Edg/')) return 'Microsoft Edge';
          if (userAgent.includes('Chrome/') && !userAgent.includes('Edg/')) return 'Google Chrome';
          if (userAgent.includes('Firefox/')) return 'Mozilla Firefox';
          if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) return 'Safari';
          if (userAgent.includes('Trident/') || userAgent.includes('MSIE')) return 'Internet Explorer';
          if (userAgent.includes('Opera/') || userAgent.includes('OPR/')) return 'Opera';

          return 'Unknown Browser';
        };

        const getOperatingSystem = () => {
          const userAgent = navigator.userAgent;

          if (userAgent.includes('Windows NT 10.0')) return 'Windows 10/11';
          if (userAgent.includes('Windows NT 6.3')) return 'Windows 8.1';
          if (userAgent.includes('Windows NT 6.2')) return 'Windows 8';
          if (userAgent.includes('Windows NT 6.1')) return 'Windows 7';
          if (userAgent.includes('Windows NT')) return 'Windows';

          if (userAgent.includes('Mac OS X')) {
            const macMatch = userAgent.match(/Mac OS X (\d+[._]\d+)/);
            if (macMatch) {
              const version = macMatch[1].replace('_', '.');
              return `macOS ${version}`;
            }
            return 'macOS';
          }

          if (userAgent.includes('Linux')) return 'Linux';
          if (userAgent.includes('Android')) {
            const androidMatch = userAgent.match(/Android (\d+\.\d+)/);
            if (androidMatch) {
              return `Android ${androidMatch[1]}`;
            }
            return 'Android';
          }
          if (userAgent.includes('iPhone OS') || userAgent.includes('iPad')) {
            const iosMatch = userAgent.match(/OS (\d+[._]\d+)/);
            if (iosMatch) {
              const version = iosMatch[1].replace('_', '.');
              return `iOS ${version}`;
            }
            return 'iOS';
          }

          return 'Unknown OS';
        };

        const clientInfo = {
          deviceType: getDeviceType(),
          browser: getBrowser(),
          operatingSystem: getOperatingSystem(),
          userAgent: navigator.userAgent,
          screenResolution: `${screen.width}x${screen.height}`,
          windowSize: `${window.innerWidth}x${window.innerHeight}`,
          colorDepth: screen.colorDepth,
          pixelDepth: screen.pixelDepth,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language || navigator.browserLanguage,
          platform: navigator.platform,
          cookieEnabled: navigator.cookieEnabled,
          onlineStatus: navigator.onLine
        };

        return clientInfo;

      } catch (error) {
        // console.error('[TLM] Error getting client info:', error);

        return {
          deviceType: 'Unknown',
          browser: 'Unknown Browser',
          operatingSystem: 'Unknown OS',
          userAgent: navigator.userAgent || 'Unknown',
          screenResolution: 'Unknown',
          windowSize: 'Unknown',
          colorDepth: 'Unknown',
          pixelDepth: 'Unknown',
          timezone: 'Unknown',
          language: 'Unknown',
          platform: 'Unknown',
          cookieEnabled: false,
          onlineStatus: false
        };
      }
    },

    autoLogPageAccess: function () {
      try {
        const currentUrl = window.location.href;
        const pageTitle = document.title;

        const pathSegments = window.location.pathname.split('/').filter(segment => segment);
        let moduleName = 'Unknown';
        let pageName = pageTitle || 'Unknown Page';

        if (pathSegments.length > 0) {
          const excludedSegments = ['sites', 'sitepages', 'pages'];
          const moduleSegment = pathSegments.find(segment =>
            !excludedSegments.includes(segment.toLowerCase()) &&
            !segment.includes('.aspx')
          );

          if (moduleSegment) {
            moduleName = moduleSegment;
          }
        }

        // Find page name from URL or title
        if (currentUrl.includes('.aspx')) {
          const pageMatch = currentUrl.match(/\/([^\/]+\.aspx)/);
          if (pageMatch) {
            pageName = pageMatch[1].replace('.aspx', '');
          }
        }

        tlm.global.logPageAccess(moduleName, pageName);

      } catch (error) {
        // console.error('[TLM] Error in autoLogPageAccess:', error);
      }
    },

    // User Action Log
    logUserAction: function (actionName, buttonText = null, buttonId = null, actionDetails = null, fullUrl = null, documentNo = null, moduleName = null, pageName = null, subModule = null, actionStatus = null) {
      try {
        if (tlm.global._disposed) {
          // console.warn("[TLM] Cannot log user action - tlm.global is disposed");
          return;
        }

        const requestData = {
          actionName: actionName,
          buttonText: buttonText,
          buttonId: buttonId,
          actionDetails: actionDetails,
          fullUrl: fullUrl || window.location.href,
          documentNo: documentNo,
          moduleName: moduleName,
          pageName: pageName,
          subModule: subModule,
          actionStatus: actionStatus
        };

        return tlm.global.ajaxCallResult({
          url: `${tlm.global.serviceUrl}/api/UserActionLog/log-action`,
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify(requestData),
          showLoadding: false,
          success: function (data) {
            // Log action silently
          },
          error: function (jqXHR, textStatus, errorThrown) {
            // Log error silently
          }
        });

      } catch (error) {
        // console.error('[TLM] Exception in logUserAction:', error);
      }
    },

    logButtonAction: function (buttonElement, actionName = null, actionDetails = null) {
      try {
        const button = $(buttonElement);

        let buttonText = '';

        // For Kendo UI buttons with .k-button-text
        if (button.find('.k-button-text').length > 0) {
          buttonText = button.find('.k-button-text').text().trim();
        }
        // For buttons with aria-label
        else if (button.attr('aria-label')) {
          buttonText = button.attr('aria-label');
        }
        // For input buttons, use value attribute
        else if (button.is('input') && button.val()) {
          buttonText = button.val().trim();
        }
        // For regular buttons with text content
        else {
          buttonText = button.text().trim();
        }

        const computedActionName = actionName || buttonText || 'Button Click';

        // Get current page info
        const pathSegments = window.location.pathname.split('/').filter(segment => segment);
        let moduleName = 'Unknown';
        let pageName = document.title || 'Unknown Page';

        if (pathSegments.length > 0) {
          const excludedSegments = ['sites', 'sitepages', 'pages'];
          const moduleSegment = pathSegments.find(segment =>
            !excludedSegments.includes(segment.toLowerCase()) &&
            !segment.includes('.aspx')
          );

          if (moduleSegment) {
            moduleName = moduleSegment;
          }
        }

        if (window.location.href.includes('.aspx')) {
          const pageMatch = window.location.href.match(/\/([^\/]+\.aspx)/);
          if (pageMatch) {
            pageName = pageMatch[1].replace('.aspx', '');
          }
        }

        // Get documentNo from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const documentNo = urlParams.get('DocumentNo');

        const computedActionDetails = actionDetails || `Click - ${buttonText} on ${pageName}`;
        return tlm.global.logUserAction(
          computedActionName,
          buttonText,
          button.attr('id'),
          computedActionDetails,
          window.location.href,
          documentNo,
          moduleName,
          pageName,
          null,
          null
        );

      } catch (error) {
      }
    },

    logAction: function (actionName, actionDetails, moduleName = "TOPCool", pageName = null, documentNo = null, subModule = null, actionStatus = null) {
      try {
        return tlm.global.logUserAction(
          actionName,
          "",
          "",
          actionDetails,
          window.location.href,
          documentNo,
          moduleName,
          pageName,
          subModule,
          actionStatus
        );

      } catch (error) {
      }
    },

    logActionAdd: function (data) {
      let finalData = {
        actionName: null,
        buttonText: null,
        buttonId: null,
        actionDetails: null,
        moduleName: null,
        pageName: null,
        documentNo: null,
        subModule: null,
        actionStatus: null
      }

      if (data != null) {
        finalData = { ...finalData, ...data }
      }

      try {
        return tlm.global.logUserAction(
          finalData.actionName,
          finalData.buttonText,
          finalData.buttonId,
          finalData.actionDetails,
          window.location.href,
          finalData.documentNo,
          finalData.moduleName,
          finalData.pageName,
          finalData.subModule,
          finalData.actionStatus
        );

      } catch (error) {
      }
    },

    initializeButtonActionLogging: function () {
      try {
        $(document).off('click.tlmActionLog');

        const buttonSelectors = [
          '[data-role="button"]',
          '.btn',
          '.k-button',
        ].join(', ');

        $(document).on('click.tlmActionLog', buttonSelectors, function (e) {
          if ($(this).data('tlm-logging')) return;

          $(this).data('tlm-logging', true);
          tlm.global.logButtonAction(this);

          setTimeout(() => {
            $(this).removeData('tlm-logging');
          }, 10);
        });
      } catch (error) {
      }
    },

    /* ===============================================
       9. ENHANCED MENU SYSTEM
       =============================================== */

    // Enhanced Menu Initialization with Better Error Handling
    initializeMenu: async function () {
      try {
        console.log('[MENU] Initializing enhanced menu system...');

        // Show enhanced loading state
        this._showEnhancedMenuLoading();

        // Enhanced timeout handling
        const menuTimeout = setTimeout(() => {
          console.warn('[MENU] Menu loading timeout, showing fallback');
          this._showMenuLoadingError();
        }, 15000);

        try {
          // Enhanced menu data loading with retry logic
          const menuData = await this._loadMenuDataWithRetry();
          clearTimeout(menuTimeout);

          if (menuData) {
            console.log('[MENU] Menu data loaded successfully');
            this.renderEnhancedMenu(menuData);
          } else {
            this._showMenuLoadingError();
          }
        } catch (error) {
          clearTimeout(menuTimeout);
          console.error('[MENU] Failed to load menu from API:', error);
          this._showMenuLoadingError();
        }
      } catch (error) {
        console.error('[MENU] Error in enhanced menu initialization:', error);
        this._showMenuLoadingError();
      }
    },

    // Enhanced Menu Data Loading with Retry Logic
    _loadMenuDataWithRetry: async function (maxRetries = 3) {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`[MENU] Loading menu data (attempt ${attempt}/${maxRetries})`);

          return await new Promise((resolve, reject) => {
            this.ajaxCall({
              url: `${this.serviceUrl}/api/Menu/Get`,
              timeout: 10000,
              success: function (data) {
                resolve(data.Data || data);
              },
              error: function (jqXHR, textStatus, errorThrown) {
                reject(new Error(`Menu loading failed: ${errorThrown}`));
              }
            });
          });
        } catch (error) {
          console.warn(`[MENU] Attempt ${attempt} failed:`, error.message);

          if (attempt === maxRetries) {
            throw error;
          }

          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    },

    // Enhanced Loading State Display
    _showEnhancedMenuLoading: function () {
      try {
        const loadingElement = document.getElementById('menu-loading-pulse-topmenu');
        if (loadingElement) {
          loadingElement.style.display = 'block';
          loadingElement.innerHTML = `
                       
                    `;
        }
      } catch (error) {
        console.error('[MENU] Error showing enhanced loading:', error);
      }
    },

    // Enhanced Menu Loading Error Display
    _showMenuLoadingError: function () {
      try {
        const loadingElement = document.getElementById('menu-loading-pulse-topmenu');
        if (loadingElement) {
          loadingElement.innerHTML = `
                       
                    `;

          setTimeout(() => {
            loadingElement.style.display = 'none';
          }, 5000);
        }
      } catch (error) {
        console.error('[MENU] Error showing menu error:', error);
      }
    },

    // Enhanced Menu Rendering with Modern Features
    renderEnhancedMenu: function (menuData) {
      try {
        const targetSelectors = [
          '.custom-sp-nav',
          '#custom-navigation',
          '.main-navigation'
        ];

        let targetElement = null;
        for (let selector of targetSelectors) {
          targetElement = document.querySelector(selector);
          if (targetElement) {
            console.log('[MENU] Found menu container:', selector);
            break;
          }
        }

        if (targetElement) {
          const menuHTML = this.generateEnhancedMenuHTML(menuData);
          $(targetElement).html(menuHTML).hide().fadeIn(300);

          this.addEnhancedMenuEventListeners();
          this._setupMenuAccessibility();
          this._setupMenuResponsiveness();

          console.log('[MENU] Enhanced menu rendered successfully');
        } else {
          console.warn('[MENU] Menu container not found, retrying...');
          setTimeout(() => {
            this.renderEnhancedMenu(menuData);
          }, 1000);
        }

        // Hide loading indicator
        const loadingElement = document.getElementById('menu-loading-pulse-topmenu');
        if (loadingElement) {
          loadingElement.style.display = 'none';
        }
      } catch (error) {
        console.error('[MENU] Error in enhanced menu rendering:', error);
        this._showMenuLoadingError();
      }
    },

    // Enhanced Menu HTML Generation with Modern Structure
    generateEnhancedMenuHTML: function (data) {
      if (!data || !data.menuItems) {
        return '<div class="menu-error">No menu data available</div>';
      }

      let menuItemsHTML = '';
      const currentPath = window.location.pathname.toLowerCase();

      data.menuItems.forEach((item, index) => {
        if (item.IsShow === false) {
          return;
        }

        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const itemPath = this._extractPathFromUrl(item.url);
        const isActive = this._isMenuItemActive(currentPath, itemPath);
        const submenuHTML = hasSubmenu ? this.generateEnhancedSubmenuHTML(item.submenu) : '';

        // Enhanced menu item structure
        menuItemsHTML += `
                    <li class="enhanced-nav-item${isActive ? ' active' : ''}" 
                        style="animation-delay: ${index * 0.1}s;"
                        data-menu-id="${item.id}"
                        ${hasSubmenu ? 'data-has-submenu="true"' : ''}>
                        <a href="${item.url}" 
                           class="enhanced-nav-link" 
                           data-menu-id="${item.id}" 
                           data-interception="off"
                           ${hasSubmenu ? 'aria-haspopup="true" aria-expanded="false"' : ''}
                           role="menuitem">
                            ${item.icon ? `<i class="${item.icon} menu-icon"></i>` : ''}
                            <span class="menu-text">${item.title}</span>
                            ${hasSubmenu ? '<i class="fa-solid fa-chevron-down submenu-arrow"></i>' : ''}
                        </a>
                        ${submenuHTML}
                    </li>
                `;
      });

      return `
                <nav class="enhanced-navigation" role="navigation" aria-label="Main navigation">
                    <ul class="enhanced-nav-list" role="menubar">
                        ${menuItemsHTML}
                    </ul>
                </nav>
            `;
    },

    // Enhanced Submenu HTML Generation
    generateEnhancedSubmenuHTML: function (submenuItems) {
      if (!submenuItems || submenuItems.length === 0) {
        return '';
      }

      let submenuHTML = '<ul class="enhanced-submenu" role="menu">';
      submenuItems.forEach(item => {
        if (item.IsShow !== false) {
          submenuHTML += `
                        <li class="enhanced-submenu-item" role="none">
                            <a href="${item.url}" 
                               class="enhanced-submenu-link" 
                               data-menu-id="${item.id}" 
                               data-interception="off"
                               role="menuitem">
                                ${item.icon ? `<i class="${item.icon} submenu-icon"></i>` : ''}
                                <span class="submenu-text">${item.title}</span>
                                ${item.badge ? `<span class="menu-badge">${item.badge}</span>` : ''}
                            </a>
                        </li>
                    `;
        }
      });
      submenuHTML += '</ul>';

      return submenuHTML;
    },

    // Enhanced Menu Item Active State Detection (FIXED FOR HOME)
    _isMenuItemActive: function (currentPath, itemPath) {
      if (!itemPath) return false;

      // Normalize paths by removing trailing slashes for consistent comparison
      const cleanCurrentPath = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
      const cleanItemPath = itemPath.endsWith('/') ? itemPath.slice(0, -1) : itemPath;

      // --- START OF THE FIX ---
      // Define the base path for the site, which we consider the "Home" link's path.
      const basePath = '/sites/cool-qas';

      // If the menu item being checked IS the Home/base path link...
      if (cleanItemPath === basePath) {
        // ...it should only be active if the current page is EXACTLY the home page.
        // The home page could be the base path itself or the default SharePoint page.
        return cleanCurrentPath === basePath || currentPath.endsWith('/sitepages/default.aspx');
      }
      // --- END OF THE FIX ---

      // For ALL OTHER links (not "Home"), the original logic works well for sub-pages.
      // Exact match
      if (cleanCurrentPath === cleanItemPath) return true;

      // Starts with match (for sub-pages like Report/SubReport)
      if (cleanCurrentPath.startsWith(cleanItemPath + '/')) return true;

      // Match without file extension for pages like AssayDatabase.aspx
      const currentPathNoExt = cleanCurrentPath.replace(/\.[^/.]+$/, '');
      const itemPathNoExt = cleanItemPath.replace(/\.[^/.]+$/, '');
      if (currentPathNoExt === itemPathNoExt) return true;

      return false;
    },

    // Enhanced URL Path Extraction
    _extractPathFromUrl: function (url) {
      try {
        if (!url || url === '#' || url === '') return '';

        // Handle relative URLs
        if (url.startsWith('/')) return url.toLowerCase();

        // Handle absolute URLs
        const urlObj = new URL(url, window.location.origin);
        return urlObj.pathname.toLowerCase();
      } catch (error) {
        return '';
      }
    },

    // Enhanced Menu Event Listeners with Modern Interaction Patterns
    addEnhancedMenuEventListeners: function () {
      const navItems = document.querySelectorAll('.enhanced-nav-item');

      navItems.forEach(item => {
        const link = item.querySelector('.enhanced-nav-link');
        const submenu = item.querySelector('.enhanced-submenu');
        const hasSubmenu = item.hasAttribute('data-has-submenu');

        if (link) {
          // Enhanced click handler
          link.addEventListener('click', (e) => {
            const url = link.getAttribute('href');

            // Handle submenu toggle
            if (hasSubmenu && submenu) {
              e.preventDefault();
              this._toggleSubmenu(item, submenu);
              return;
            }

            // Handle navigation
            if (!url || url === '#' || url === '') {
              e.preventDefault();
              return;
            }

            // Update active state
            this._updateActiveMenuState(item);

            // Enhanced logging
            const menuId = link.getAttribute('data-menu-id');
            this.logAction(
              'Menu Navigation',
              `Navigated to: ${link.textContent.trim()} (ID: ${menuId})`,
              'Navigation',
              'Menu',
              null,
              'Menu Item',
              'Success'
            );
          });

          // Enhanced keyboard support
          link.addEventListener('keydown', (e) => {
            switch (e.key) {
              case 'Enter':
              case ' ':
                e.preventDefault();
                link.click();
                break;
              case 'ArrowDown':
                if (hasSubmenu) {
                  e.preventDefault();
                  this._openSubmenu(item, submenu);
                  this._focusFirstSubmenuItem(submenu);
                }
                break;
              case 'Escape':
                if (hasSubmenu && submenu.classList.contains('open')) {
                  this._closeSubmenu(item, submenu);
                  link.focus();
                }
                break;
            }
          });

          // Enhanced hover effects for desktop
          if (!this._isMobileDevice()) {
            link.addEventListener('mouseenter', () => {
              if (hasSubmenu && submenu) {
                this._openSubmenu(item, submenu);
              }
            });

            item.addEventListener('mouseleave', () => {
              if (hasSubmenu && submenu) {
                setTimeout(() => {
                  if (!item.matches(':hover')) {
                    this._closeSubmenu(item, submenu);
                  }
                }, 200);
              }
            });
          }
        }

        // Enhanced submenu item handlers
        if (submenu) {
          const submenuLinks = submenu.querySelectorAll('.enhanced-submenu-link');
          submenuLinks.forEach(submenuLink => {
            submenuLink.addEventListener('click', (e) => {
              const url = submenuLink.getAttribute('href');
              if (!url || url === '#') {
                e.preventDefault();
                return;
              }

              // Update active states
              this._updateActiveMenuState(item);

              // Enhanced logging
              const submenuId = submenuLink.getAttribute('data-menu-id');
              this.logAction(
                'Submenu Navigation',
                `Navigated to: ${submenuLink.textContent.trim()} (ID: ${submenuId})`,
                'Navigation',
                'Submenu',
                null,
                'Submenu Item',
                'Success'
              );
            });

            // Enhanced keyboard navigation for submenu
            submenuLink.addEventListener('keydown', (e) => {
              switch (e.key) {
                case 'Escape':
                  this._closeSubmenu(item, submenu);
                  link.focus();
                  break;
                case 'ArrowUp':
                  e.preventDefault();
                  this._focusPreviousSubmenuItem(submenuLink);
                  break;
                case 'ArrowDown':
                  e.preventDefault();
                  this._focusNextSubmenuItem(submenuLink);
                  break;
              }
            });
          });
        }
      });
    },

    // Enhanced Submenu Control Methods
    _toggleSubmenu: function (item, submenu) {
      const isOpen = submenu.classList.contains('open');

      // Close all other submenus first
      document.querySelectorAll('.enhanced-submenu.open').forEach(otherSubmenu => {
        if (otherSubmenu !== submenu) {
          this._closeSubmenu(otherSubmenu.closest('.enhanced-nav-item'), otherSubmenu);
        }
      });

      if (isOpen) {
        this._closeSubmenu(item, submenu);
      } else {
        this._openSubmenu(item, submenu);
      }
    },

    _openSubmenu: function (item, submenu) {
      submenu.classList.add('open');
      item.classList.add('submenu-open');
      item.querySelector('.enhanced-nav-link').setAttribute('aria-expanded', 'true');
    },

    _closeSubmenu: function (item, submenu) {
      submenu.classList.remove('open');
      item.classList.remove('submenu-open');
      item.querySelector('.enhanced-nav-link').setAttribute('aria-expanded', 'false');
    },

    // Enhanced Submenu Navigation
    _focusFirstSubmenuItem: function (submenu) {
      const firstItem = submenu.querySelector('.enhanced-submenu-link');
      if (firstItem) firstItem.focus();
    },

    _focusPreviousSubmenuItem: function (currentLink) {
      const submenuItems = Array.from(currentLink.closest('.enhanced-submenu').querySelectorAll('.enhanced-submenu-link'));
      const currentIndex = submenuItems.indexOf(currentLink);
      const previousIndex = currentIndex > 0 ? currentIndex - 1 : submenuItems.length - 1;
      submenuItems[previousIndex].focus();
    },

    _focusNextSubmenuItem: function (currentLink) {
      const submenuItems = Array.from(currentLink.closest('.enhanced-submenu').querySelectorAll('.enhanced-submenu-link'));
      const currentIndex = submenuItems.indexOf(currentLink);
      const nextIndex = currentIndex < submenuItems.length - 1 ? currentIndex + 1 : 0;
      submenuItems[nextIndex].focus();
    },

    // Enhanced Active State Management
    _updateActiveMenuState: function (activeItem) {
      // Remove active state from all menu items
      document.querySelectorAll('.enhanced-nav-item').forEach(item => {
        item.classList.remove('active');
      });

      // Add active state to clicked item
      activeItem.classList.add('active');
    },

    // Enhanced Mobile Device Detection
    _isMobileDevice: function () {
      return window.innerWidth <= 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    // Enhanced Menu Accessibility Setup
    _setupMenuAccessibility: function () {
      const navigation = document.querySelector('.enhanced-navigation');
      if (navigation) {
        navigation.setAttribute('aria-label', 'Main navigation');

        // Enhanced ARIA attributes for better screen reader support
        const menuItems = navigation.querySelectorAll('.enhanced-nav-link');
        menuItems.forEach((item, index) => {
          item.setAttribute('tabindex', index === 0 ? '0' : '-1');
        });

        // Enhanced keyboard navigation for menu bar
        navigation.addEventListener('keydown', (e) => {
          const focusedItem = document.activeElement;
          const menuItems = Array.from(navigation.querySelectorAll('.enhanced-nav-link'));
          const currentIndex = menuItems.indexOf(focusedItem);

          switch (e.key) {
            case 'ArrowLeft':
              e.preventDefault();
              const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
              menuItems[prevIndex].focus();
              break;
            case 'ArrowRight':
              e.preventDefault();
              const nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
              menuItems[nextIndex].focus();
              break;
            case 'Home':
              e.preventDefault();
              menuItems[0].focus();
              break;
            case 'End':
              e.preventDefault();
              menuItems[menuItems.length - 1].focus();
              break;
          }
        });
      }
    },

    // Enhanced Menu Responsiveness
    _setupMenuResponsiveness: function () {
      const navigation = document.querySelector('.enhanced-navigation');
      if (!navigation) return;

      // Enhanced responsive behavior
      const handleResize = () => {
        const isMobile = this._isMobileDevice();
        navigation.classList.toggle('mobile-menu', isMobile);

        if (isMobile) {
          // Close all submenus on mobile
          document.querySelectorAll('.enhanced-submenu.open').forEach(submenu => {
            this._closeSubmenu(submenu.closest('.enhanced-nav-item'), submenu);
          });
        }
      };

      window.addEventListener('resize', handleResize);
      handleResize(); // Initial call
    },

    // Impersonate System
    initializeImpersonateBar: async function () {

      await tlm.global.ajaxCall({
        url: `${tlm.global.serviceUrl}/api/common/GetDebugUserInformation`,
        success: function (data) {
          if (data.Data == null || data.Data == undefined) {
            return;
          }

          tlm.global.checkUserPermissionsByRoles(data.Data.ImpersonateUser.Roles);

          // Check permission
          let hasImpersonatePermission = false;

          if (data.Data.RealUser.Permissions && Array.isArray(data.Data.RealUser.Permissions)) {
            const impersonatePermission = data.Data.RealUser.Permissions.find(
              permission => permission.PermissionCode === "Do - Impersonate"
            );

            hasImpersonatePermission = impersonatePermission ? impersonatePermission.CanAllow : false;
          }


          if (!hasImpersonatePermission) {
            return;
          }

          const hasAssayGUID = tlm.global.checkAssayGUID();
          const viewLogButton = hasAssayGUID ? `
                        <button id="btnViewLog" class="k-button k-button-md k-rounded-md">
                            <i class="fa-light fa-file-lines"></i> <span>View Log</span>
                        </button>` : '';

          let impersonateBarHtml = `
              <div id="impersonateBar">
                  <div class="bar-container">
                      <div class="bar-left">
                          <span class="user-info">
                              <i class="fa-light fa-user-shield"></i>
                          </span>
                          <span id="currentImpersonateUser">
                             <strong id="impersonatedUserName">-</strong>
                          </span>
                      </div>
                      <div class="bar-right">
                          <button id="btnImpersonate" class="k-button k-button-md k-rounded-md">
                            <i class="fa-regular fa-user-secret"></i>
                          </button>
                          <button id="btnClearImpersonate" class="k-button k-button-md k-rounded-md">
                              <i class="fa-light fa-user-xmark"></i>
                          </button>
                          ${viewLogButton}
                          
                          <button id="btnDebugMode" class="k-button k-button-md k-rounded-md">
                              <i class="fa-light fa-gear"></i> 
                          </button>
                          
                          <button id="btnCloseBar" class="k-button k-button-md k-rounded-md" title="ปิดแถบ Impersonate">
                              <i class="fa-light fa-xmark"></i>
                          </button>
                          <button id="btnForceLogout" class="k-button k-button-md k-rounded-md" style=" border-color: #dc3545; color: white;" title="Force logout and clear all authentication data">
                              <i class="fa-light fa-power-off"></i>
                          </button>
                      </div>
                  </div>
              </div>
          `;
          // Append to body
          $("body").append(impersonateBarHtml).addClass("impersonate-active");

          // Create empty window
          $("body").append('<div id="impersonateWindow"></div>');
          $("body").append('<div id="viewLogWindow"></div>');

          // Initialize Kendo Window
          $("#impersonateWindow").kendoWindow({
            title: "Impersonate User",
            visible: false,
            modal: true,
            width: "600px",
            resizable: false,
            animation: {
              open: {
                effects: "slideIn:down fadeIn",
                duration: 300,
              },
              close: {
                effects: "slideIn:up fadeIn",
                reverse: true,
                duration: 200,
              },
            },
          });

          // Create debug window
          let debugWindowHtml = `
                        <div id="debugInfoWindow">
                            <div class="debug-header">
                                <strong>Debug Information</strong>
                                <button id="btnCloseDebug">
                                    <i class="fa-light fa-xmark"></i>
                                </button>
                            </div>
                            <div class="debug-body">
                                <div class="debug-item">
                                    <strong>Current User:</strong> 
                                    <span id="debugCurrentUser">-</span>
                                </div>
                                <div class="debug-item">
                                    <strong>Impersonating:</strong> 
                                    <span id="debugImpersonatingUser">-</span>
                                </div>
                                <div class="debug-item">
                                    <strong>Roles:</strong> 
                                    <span id="debugPermissions">-</span>
                                </div>
                            </div>
                        </div>
                    `;
          $("body").append(debugWindowHtml);

          // Bind events
          tlm.global.bindImpersonateEvents();

          tlm.global.updateImpersonateStatus(data.Data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        },
      });
    },

    bindImpersonateEvents: function () {
      let self = this;

      // Impersonate button
      $("#btnImpersonate")
        .off("click")
        .on("click", function () {
          self.openImpersonateWindow();
        });

      // Debug mode button
      $("#btnDebugMode")
        .off("click")
        .on("click", function () {
          self.toggleDebugMode();
        });

      // Close debug button
      $("#btnCloseDebug")
        .off("click")
        .on("click", function () {
          self.closeDebugWindow();
        });

      $("#btnCloseBar")
        .off("click")
        .on("click", function () {
          self.closeImpersonateBar();
        });

      $("#btnClearImpersonate")
        .off("click")
        .on("click", function () {
          self.clearImpersonate();
        });

      $("#btnViewLog")
        .off("click")
        .on("click", function () {
          tlm.global.openViewLogWindow();
        });

      $("#btnForceLogout")
        .off("click")
        .on("click", function () {
          self.forceLogoutWithConfirmation();
        });
    },

    openImpersonateWindow: function () {
      let kendoWindow = $("#impersonateWindow").data("kendoWindow");

      // Create content for the impersonate window
      let windowContent = `
                <style>
                [aria-labelledby="impersonateLoginName_label"]{
                        z-index:20000 !important;
                    }
                </style>
                <div style="padding: 20px;">
                    <div style="margin-bottom: 15px;">
                        <label for="impersonateLoginName" style="display: block; margin-bottom: 5px; font-weight: bold;">Login Name:</label>
                        <input id="impersonateLoginName" style="width: 100%;" />
                    </div>
                    <div style="text-align: right; margin-top: 20px;">
                        <button id="btnDoImpersonate" class="k-button k-button-md k-rounded-md k-button-solid-primary" style="margin-right: 10px;">
                            <i class="fa-light fa-user-switch"></i> Impersonate
                        </button>
                        <button id="btnCancelImpersonate" class="k-button k-button-md k-rounded-md">
                            <i class="fa-light fa-xmark"></i> Cancel
                        </button>
                    </div>
                </div>
            `;

      kendoWindow.content(windowContent);
      kendoWindow.center().open();

      // Initialize Kendo AutoComplete with search functionality
      $("#impersonateLoginName").kendoAutoComplete({
        dataTextField: "DisplayText",
        dataSource: new kendo.data.DataSource({
          serverFiltering: true,
          transport: {
            read: function (options) {
              var keyword = null;
              if (options != null) {
                if (options.data != null) {
                  if (options.data.filter != null) {
                    if (options.data.filter.filters != null) {
                      if (options.data.filter.filters.length > 0) {
                        keyword = options.data.filter.filters[0].value;
                      }
                    }
                  }
                }
              }

              if (keyword != null && keyword.length >= 3) {
                tlm.global.ajaxCallResult({
                  type: "POST",
                  url: `${tlm.global.serviceUrl}/api/UserInformation/SearchForImpersonate`,
                  data: JSON.stringify({
                    KeyWord: keyword,
                  }),
                  showLoadding: false,
                  success: function (result) {
                    // Transform result to include DisplayText
                    const transformedResult = result.map((user) => ({
                      LoginName: user.LoginName,
                      DisplayText: `${user.LoginName} (${user.FullNameEN || user.FullNameTH || ""
                        })`,
                    }));
                    options.success(transformedResult);
                  },
                  error: function (result) {
                    options.error(result);
                  },
                });
              } else {
                options.success([]);
              }
            },
          },
        }),
        filter: "contains",
        placeholder: "Search user to impersonate (minimum 3 characters)...",
        minLength: 3,
      });

      // Bind events for the window buttons
      $("#btnDoImpersonate")
        .off("click")
        .on("click", function () {
          let autoComplete = $("#impersonateLoginName").data(
            "kendoAutoComplete"
          );
          let selectedText = autoComplete.value();

          // Extract LoginName from DisplayText
          let loginName = selectedText;
          if (selectedText.includes(" (")) {
            loginName = selectedText.split(" (")[0];
          }

          if (loginName) {
            tlm.global.doImpersonate(loginName);
          } else {
            alert("Please select a user to impersonate");
          }
        });

      $("#btnCancelImpersonate")
        .off("click")
        .on("click", function () {
          kendoWindow.close();
        });

      // Focus on autocomplete
      setTimeout(function () {
        $("#impersonateLoginName").data("kendoAutoComplete").focus();
      }, 100);
    },

    toggleDebugMode: function () {
      let $btn = $("#btnDebugMode");
      let $debugWindow = $("#debugInfoWindow");
      let isDebugOn = $btn.hasClass("debug-active");

      if (!isDebugOn) {
        $("#debugStatus").text("ON");
        $btn.addClass("debug-active");
        $debugWindow.fadeIn(300);
      } else {
        $("#debugStatus").text("OFF");
        $btn.removeClass("debug-active");
        $debugWindow.fadeOut(200);
      }
    },

    closeDebugWindow: function () {
      $("#debugStatus").text("OFF");
      $("#btnDebugMode").removeClass("debug-active");
      $("#debugInfoWindow").fadeOut(200);
    },

    updateImpersonateStatus: function (userData) {
      if (userData && userData.ImpersonateUser) {
        $("#impersonatedUserName").text(
          userData.ImpersonateUser.LoginName +
          " (" +
          userData.ImpersonateUser.FullNameEN +
          ")"
        );
        $("#currentImpersonateUser").fadeIn(300);
        $("#debugImpersonatingUser").text(
          userData.ImpersonateUser.LoginName +
          " (" +
          userData.ImpersonateUser.FullNameEN +
          ")"
        );

        //debug window
        $("#debugCurrentUser").text(userData.ImpersonateUser.RealLoginName);
        const roleNames = userData.ImpersonateUser.Roles.map(
          (role) => role.RoleName
        ).join(", ");
        $("#debugPermissions").text(roleNames);
      } else {
        $("#currentImpersonateUser").fadeOut(200, function () {
          $("#impersonatedUserName").text("-");
        });
        $("#debugImpersonatingUser").text("-");
      }
    },

    closeImpersonateBar: function () {
      $("#impersonateBar").addClass("hiding");
      setTimeout(function () {
        $("#impersonateBar").remove();
        $("body").removeClass("impersonate-active");

        // Close debug window if open
        $("#debugInfoWindow").remove();
      }, 300);
    },

    clearImpersonate: function () {
      let self = this;

      // Show confirmation dialog before clearing impersonation
      tlm.global.showYesNoDialog({
        title: "Confirm Clear Impersonation",
        content:
          "Are you sure you want to clear the current impersonation? This will return you to your original user account.",
        width: "500px",
        onYes: function (e) {
          // Close the dialog
          e.sender.destroy();

          // Clear cached tokens first
          tlm.global.clearCachedTokens();

          // Proceed with clearing impersonation
          tlm.global.ajaxCallResult({
            url: `${tlm.global.serviceUrl}/api/common/SetImpersonateDebugUserInformation`,
            type: "POST",
            data: JSON.stringify({ targetLoginName: "" }),
            success: function (data) {
              alert("Impersonation cleared successfully");
              window.location.reload();
            },
            error: function (data) {
              alert(
                "Failed to clear impersonation: " +
                (data.Message || "Unknown error")
              );
            },
          });
        },
        onNo: function (e) {
          e.sender.destroy();
        },
      });
    },

    doImpersonate: function (loginName) {
      let self = this;

      // Show confirmation dialog before impersonating
      tlm.global.showYesNoDialog({
        title: "Confirm Impersonation",
        content: `Are you sure you want to impersonate user: <strong>${loginName}</strong>?<br/><br/>This will change your current session to act as this user.`,
        width: "500px",
        onYes: function (e) {
          e.sender.destroy();

          // Proceed with impersonation
          tlm.global.ajaxCallResult({
            url: `${tlm.global.serviceUrl}/api/common/SetImpersonateDebugUserInformation`,
            type: "POST",
            data: JSON.stringify({ targetLoginName: loginName }),
            success: function (data) {
              // Close the impersonate window
              $("#impersonateWindow").data("kendoWindow").close();

              //alert("Impersonate successful for: " + loginName);
              window.location.reload();
            },
            error: function (data) {
              alert(
                "Failed to impersonate user: " +
                (data.Message || "Unknown error")
              );
            },
          });
        },
        onNo: function (e) {
          e.sender.destroy();
        },
      });
    },

    openViewLogWindow: function () {
      let kendoWindow = $("#viewLogWindow").data("kendoWindow");

      if (!kendoWindow) {
        $("#viewLogWindow").kendoWindow({
          title: "View Log - AssayGUID: " + tlm.global.getUrlParameter("AssayGUID"),
          visible: false,
          modal: true,
          width: "90%",
          height: "80%",
          resizable: true,
          animation: {
            open: {
              effects: "slideIn:down fadeIn",
              duration: 300,
            },
            close: {
              effects: "slideIn:up fadeIn",
              reverse: true,
              duration: 200,
            },
          },
        });
        kendoWindow = $("#viewLogWindow").data("kendoWindow");
      }

      // เพิ่ม User Action Log tab
      let windowContent = `
                <div style="height: 100%;">
                    <div id="logTabStrip" style="height: 100%;">
                        <ul>
                            <li class="k-active">Workflow Log</li>
                            <li>Event Log</li>
                            <li>User Action Log</li>
                        </ul>
                        <div>
                            <div id="workflowLogGrid" style="height: 500px;"></div>
                        </div>
                        <div>
                            <div id="eventLogGrid" style="height: 500px;"></div>
                        </div>
                        <div>
                            <div id="userActionLogGrid" style="height: 500px;"></div>
                        </div>
                    </div>
                </div>
            `;

      kendoWindow.content(windowContent);
      kendoWindow.center().open();

      // Initialize TabStrip
      $("#logTabStrip").kendoTabStrip({
        animation: {
          open: {
            effects: "fadeIn"
          }
        }
      });

      // Initialize Grids
      tlm.global.initializeWorkflowLogGrid();
      tlm.global.initializeEventLogGrid();
      tlm.global.initializeUserActionLogGrid();
    },


    forceLogoutWithConfirmation: function () {
      let self = this;

      // Show confirmation dialog with warning
      tlm.global.showYesNoDialog({
        title: "Force Logout Confirmation",
        content: `
                <div style="color: #dc3545; margin-bottom: 15px;">
                    <i class="fa-solid fa-triangle-exclamation" style="margin-right: 8px;"></i>
                    <strong>Warning: Complete Authentication Reset</strong>
                </div>
                <p>This action will:</p>
                <ul style="margin-left: 20px; text-align: left;">
                    <li>Clear ALL authentication tokens and sessions</li>
                    <li>Remove all cached user data</li>
                    <li>Clear browser storage related to authentication</li>
                    <li>Force a complete fresh login</li>
                    <li>Close all other tabs/windows of this application</li>
                </ul>
                <p style="margin-top: 15px;"><strong>Are you sure you want to proceed?</strong></p>
            `,
        width: "400px",
        onYes: function (e) {
          e.sender.destroy();

          // Show progress message
          tlm.global.showFullLoading();
          tlm.global.showMessageDialog({
            title: "Logging Out...",
            content: `
                        <div style="text-align: center; padding: 20px;">
                            <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; color: #0078d4; margin-bottom: 15px;"></i>
                            <p>Clearing all authentication data...</p>
                            <p><small>Please wait while we log you out completely.</small></p>
                        </div>
                    `,
            width: "400px",
            closable: false
          });

          // Log the action
          try {
            tlm.global.logAction(
              "Force Logout",
              "User initiated complete authentication reset via impersonate bar",
              "Authentication",
              "Impersonate Bar",
              null,
              "Force Logout",
              "Initiated"
            );
          } catch (e) {
            console.warn('[TLM] Could not log force logout action:', e);
          }

          // Delay to allow logging to complete, then force logout
          setTimeout(() => {
            tlm.global.forceLogout();
          }, 1000);
        },
        onNo: function (e) {
          e.sender.destroy();
        }
      });
    },

    getWorkflowLogData: function () {
      return new Promise((resolve, reject) => {
        const assayGUID = tlm.global.getUrlParameter("AssayGUID");

        if (!assayGUID) {
          console.warn('[TLM] No AssayGUID found in URL parameters');
          resolve([]); // คืน empty array ถ้าไม่มี AssayGUID
          return;
        }

        tlm.global.ajaxCallResult({
          url: `${tlm.global.serviceUrl}/api/AssayLog/GetWorkflowLog/${assayGUID}`,
          type: 'GET',
          showLoadding: false,
          success: function (data) {
            resolve(data || []);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.error('[TLM] Failed to load workflow log data:', errorThrown);
            resolve([]); // คืน empty array ในกรณี error
          }
        });
      });
    },

    getEventLogData: function () {
      return new Promise((resolve, reject) => {
        const assayGUID = tlm.global.getUrlParameter("AssayGUID");

        if (!assayGUID) {
          console.warn('[TLM] No AssayGUID found in URL parameters');
          resolve([]); // คืน empty array ถ้าไม่มี AssayGUID
          return;
        }

        tlm.global.ajaxCallResult({
          url: `${tlm.global.serviceUrl}/api/AssayLog/GetEventLog/${assayGUID}`,
          type: 'GET',
          showLoadding: false,
          success: function (data) {
            resolve(data || []);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.error('[TLM] Failed to load event log data:', errorThrown);
            resolve([]); // คืน empty array ในกรณี error
          }
        });
      });
    },

    getUserActionLogData: function () {
      return new Promise((resolve, reject) => {
        const assayGUID = tlm.global.getUrlParameter("AssayGUID");

        if (!assayGUID) {
          console.warn('[TLM] No AssayGUID found in URL parameters');
          resolve([]);
          return;
        }

        tlm.global.ajaxCallResult({
          url: `${tlm.global.serviceUrl}/api/AssayLog/GetUserActionLog/${assayGUID}`,
          type: 'GET',
          showLoadding: false,
          success: function (data) {
            resolve(data || []);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.error('[TLM] Failed to load user action log data:', errorThrown);
            resolve([]);
          }
        });
      });
    },

    initializeWorkflowLogGrid: function () {
      tlm.global.getWorkflowLogData().then(function (data) {
        $("#workflowLogGrid").kendoGrid({
          dataSource: {
            data: data,
            sort: { field: "ActionDate", dir: "desc" },
            schema: {
              model: {
                fields: {
                  WorkflowName: { type: "string" },
                  WorkflowStatus: { type: "string" },
                  Type: { type: "string" },
                  Action: { type: "string" },
                  ActionBy: { type: "string" },
                  ActionByImpersonate: { type: "string" },
                  ActionDate: { type: "date" },
                  Remark: { type: "string" }
                }
              }
            }
          },
          height: 450,
          scrollable: true,
          sortable: true,
          filterable: true,
          columns: [
            {
              field: "WorkflowName",
              title: "Workflow Name",
              width: "150px"
            },
            {
              field: "WorkflowStatus",
              title: "Workflow Status",
              width: "180px",
              template: function (dataItem) {
                const statusClass = tlm.global.getWorkflowStatusClass(dataItem.WorkflowStatus);
                return `<span class="log-status-badge ${statusClass}">${dataItem.WorkflowStatus}</span>`;
              }
            },
            {
              field: "Type",
              title: "Type",
              width: "80px",
              template: function (dataItem) {
                const icon = dataItem.Type === "User" ? "fa-user" : "fa-cog";
                return `<i class="fa ${icon}"></i> ${dataItem.Type}`;
              }
            },
            {
              field: "Action",
              title: "Action",
              width: "150px"
            },
            {
              field: "ActionBy",
              title: "Action By",
              width: "200px"
            },
            {
              field: "ActionByImpersonate",
              title: "Action By (Impersonate)",
              width: "200px",
              template: function (dataItem) {
                return dataItem.ActionByImpersonate || "-";
              }
            },
            {
              field: "ActionDate",
              title: "Action Date",
              width: "150px",
              format: "{0:dd/MM/yyyy HH:mm}"
            },
            {
              field: "Remark",
              title: "Remark",
              width: "250px"
            }
          ]
        });
      }).catch(function (error) {
        console.error('[TLM] Error initializing workflow log grid:', error);
      });
    },

    initializeEventLogGrid: function () {
      tlm.global.getEventLogData().then(function (data) {
        $("#eventLogGrid").kendoGrid({
          dataSource: {
            data: data,
            sort: { field: "CreatedDate", dir: "desc" },
            schema: {
              model: {
                fields: {
                  EventLogGUID: { type: "string" },
                  Category: { type: "string" },
                  Sender: { type: "string" },
                  Data: { type: "string" },
                  Status: { type: "string" },
                  Message: { type: "string" },
                  StackTrace: { type: "string" },
                  CreatedByLoginName: { type: "string" },
                  CreatedByRealLoginName: { type: "string" },
                  CreatedByDisplayName: { type: "string" },
                  CreatedDate: { type: "date" },
                  ReferenceGUID: { type: "string" },
                  AssayGUID: { type: "string" }
                }
              }
            }
          },
          height: 450,
          scrollable: true,
          sortable: true,
          filterable: true,
          columns: [
            {
              field: "EventLogGUID",
              title: "Event GUID",
              width: "200px",
              template: function (dataItem) {
                const fullGUID = dataItem.EventLogGUID || '';
                const truncated = fullGUID.length > 20 ? fullGUID.substring(0, 20) + '...' : fullGUID;
                return `<span class="log-guid-cell clickable-data" 
                                            title="Click to copy full GUID\n\nFull GUID: ${fullGUID}" 
                                            data-full-content="${fullGUID}"
                                            style="cursor: pointer; color: #0078d4; text-decoration: underline;">
                                            ${kendo.htmlEncode(truncated)}
                                            <i class="fa fa-copy" style="margin-left: 5px; font-size: 10px; opacity: 0.7;"></i>
                                        </span>`;
              }
            },
            {
              field: "Category",
              title: "Category",
              width: "120px",
              template: function (dataItem) {
                const categoryClass = tlm.global.getCategoryClass(dataItem.Category);
                return `<span class="log-category-badge ${categoryClass}">${dataItem.Category}</span>`;
              }
            },
            {
              field: "Sender",
              title: "Sender",
              width: "150px"
            },
            {
              field: "Data",
              title: "Data",
              width: "200px",
              template: function (dataItem) {
                const fullData = dataItem.Data || '';
                const truncated = fullData.length > 50 ? fullData.substring(0, 50) + "..." : fullData;
                return `<span class="log-data-cell clickable-data" 
                                            title="Click to copy full data\n\nFull data: ${kendo.htmlEncode(fullData)}" 
                                            data-full-content="${kendo.htmlEncode(fullData)}"
                                            style="cursor: pointer; color: #0078d4; text-decoration: underline;">
                                            ${kendo.htmlEncode(truncated)}
                                            <i class="fa fa-copy" style="margin-left: 5px; font-size: 12px; opacity: 0.7;"></i>
                                        </span>`;
              }
            },
            {
              field: "Status",
              title: "Status",
              width: "100px",
              template: function (dataItem) {
                const statusClass = dataItem.Status === "Success" ? "log-status-success" : "log-status-error";
                return `<span class="log-status-badge ${statusClass}">${dataItem.Status}</span>`;
              }
            },
            {
              field: "Message",
              title: "Message",
              width: "250px",
              template: function (dataItem) {
                const fullMessage = dataItem.Message || '';
                const truncated = fullMessage.length > 60 ? fullMessage.substring(0, 60) + "..." : fullMessage;
                return `<span class="log-message-cell clickable-data" 
                                            title="Click to copy full message\n\nFull message: ${kendo.htmlEncode(fullMessage)}" 
                                            data-full-content="${kendo.htmlEncode(fullMessage)}"
                                            style="cursor: pointer; color: #0078d4; text-decoration: underline;">
                                            ${kendo.htmlEncode(truncated)}
                                            <i class="fa fa-copy" style="margin-left: 5px; font-size: 12px; opacity: 0.7;"></i>
                                        </span>`;
              }
            },
            {
              field: "StackTrace",
              title: "Stack Trace",
              width: "200px",
              template: function (dataItem) {
                const fullStackTrace = dataItem.StackTrace || '';
                const truncated = fullStackTrace.length > 40 ? fullStackTrace.substring(0, 40) + "..." : fullStackTrace;
                return `<span title="${kendo.htmlEncode(fullStackTrace)}">${kendo.htmlEncode(truncated)}</span>`;
              }
            },
            {
              field: "CreatedByDisplayName",
              title: "Created By",
              width: "150px",
              template: function (dataItem) {
                const impersonateText = dataItem.CreatedByRealLoginName !== dataItem.CreatedByLoginName && dataItem.CreatedByRealLoginName ?
                  ` <small style="color: #dc3545;">(via ${dataItem.CreatedByRealLoginName})</small>` : '';
                return `${dataItem.CreatedByDisplayName || dataItem.CreatedByLoginName || ''}${impersonateText}`;
              }
            },
            {
              field: "CreatedDate",
              title: "Created Date",
              width: "160px",
              format: "{0:dd/MM/yyyy HH:mm:ss}"
            },
            {
              field: "ReferenceGUID",
              title: "Reference GUID",
              width: "150px",
              template: function (dataItem) {
                const refGUID = dataItem.ReferenceGUID || '';
                if (!refGUID) return '';
                const truncated = refGUID.length > 15 ? refGUID.substring(0, 15) + '...' : refGUID;
                return `<span title="${refGUID}">${truncated}</span>`;
              }
            },
            {
              field: "AssayGUID",
              title: "Assay GUID",
              width: "150px",
              template: function (dataItem) {
                const assayGUID = dataItem.AssayGUID || '';
                if (!assayGUID) return '';
                const truncated = assayGUID.length > 15 ? assayGUID.substring(0, 15) + '...' : assayGUID;
                return `<span title="${assayGUID}">${truncated}</span>`;
              }
            }
          ]
        });

        // Add click handler for data cells
        setTimeout(() => {
          $(document).off('click.eventLogDataCopy').on('click.eventLogDataCopy', '.clickable-data', function (e) {
            e.preventDefault();
            const fullContent = $(this).attr('data-full-content');
            if (fullContent) {
              tlm.global.copyDataToClipboard(fullContent, this);
            }
          });
        }, 100);
      }).catch(function (error) {
        console.error('[TLM] Error initializing event log grid:', error);
      });
    },

    initializeUserActionLogGrid: function () {
      tlm.global.getUserActionLogData().then(function (data) {
        $("#userActionLogGrid").kendoGrid({
          dataSource: {
            data: data,
            sort: { field: "CreatedDate", dir: "desc" },
            schema: {
              model: {
                fields: {
                  LogId: { type: "number" },
                  RealUserLoginName: { type: "string" },
                  RealUserDisplayName: { type: "string" },
                  UserLoginName: { type: "string" },
                  UserDisplayName: { type: "string" },
                  ModuleName: { type: "string" },
                  PageName: { type: "string" },
                  ActionName: { type: "string" },
                  ButtonText: { type: "string" },
                  ActionDetails: { type: "string" },
                  ActionStatus: { type: "string" },
                  ActionTime: { type: "date" },
                  CreatedDate: { type: "date" }
                }
              }
            }
          },
          height: 450,
          scrollable: true,
          sortable: true,
          filterable: true,
          columns: [
            {
              field: "LogId",
              title: "Log ID",
              width: "80px"
            },
            {
              field: "UserDisplayName",
              title: "User",
              width: "150px",
              template: function (dataItem) {
                const impersonateText = dataItem.RealUserLoginName !== dataItem.UserLoginName ?
                  ` <small>(via ${dataItem.RealUserDisplayName})</small>` : '';
                return `${dataItem.UserDisplayName}${impersonateText}`;
              }
            },
            // {
            //     field: "ModuleName",
            //     title: "Module",
            //     width: "120px"
            // },
            {
              field: "PageName",
              title: "Page",
              width: "120px"
            },
            {
              field: "ActionName",
              title: "Action",
              width: "150px"
            },

            {
              field: "ActionDetails",
              title: "Details",
              width: "200px",
              // template: function(dataItem) {
              //     const truncated = dataItem.ActionDetails && dataItem.ActionDetails.length > 50 ? 
              //         dataItem.ActionDetails.substring(0, 50) + "..." : (dataItem.ActionDetails || "-");
              //     return `<span title="${kendo.htmlEncode(dataItem.ActionDetails || '')}">${kendo.htmlEncode(truncated)}</span>`;
              // },
              template: function (dataItem) {
                const truncated = dataItem.ActionDetails && dataItem.ActionDetails.length > 50 ?
                  dataItem.ActionDetails.substring(0, 50) + "..." : (dataItem.ActionDetails || "-");
                return `<span class="log-data-cell clickable-data" 
                                            title="Click to copy full data\n\nFull data: ${kendo.htmlEncode(dataItem.ActionDetails)}" 
                                            data-full-content="${kendo.htmlEncode(dataItem.ActionDetails)}"
                                            style="cursor: pointer; color: #0078d4; text-decoration: underline;">
                                            ${kendo.htmlEncode(truncated)}
                                            <i class="fa fa-copy" style="margin-left: 5px; font-size: 12px; opacity: 0.7;"></i>
                                        </span>`;
              }
            },
            {
              field: "ActionStatus",
              title: "Status",
              width: "100px",
              template: function (dataItem) {
                if (!dataItem.ActionStatus) return "-";
                const statusClass = dataItem.ActionStatus.toLowerCase() === "success" ? "log-status-success" :
                  dataItem.ActionStatus.toLowerCase() === "error" ? "log-status-error" : "log-status-default";
                return `<span class="log-status-badge ${statusClass}">${dataItem.ActionStatus}</span>`;
              }
            },
            {
              field: "CreatedDate",
              title: "Created",
              width: "150px",
              format: "{0:dd/MM/yyyy HH:mm}"
            }
          ]
        });
      }).catch(function (error) {
        console.error('[TLM] Error initializing user action log grid:', error);
      });
    },

    // Helper functions for CSS classes
    getWorkflowStatusClass: function (status) {
      const statusMap = {
        "DRAFT": "log-status-draft",
        "APPROVED": "log-status-approved",
        "WAITING DRAFT CAM APPROVAL": "log-status-waiting-draft",
        "WAITING EXPERT APPROVAL": "log-status-waiting-expert",
        "WAITING FINAL CAM APPROVAL": "log-status-waiting-final",
        "WAITING CREATE FINAL CAM": "log-status-waiting-create"
      };
      return statusMap[status] || "log-status-default";
    },

    getCategoryClass: function (category) {
      const categoryMap = {
        "Authentication": "log-category-auth",
        "Workflow": "log-category-workflow",
        "Error": "log-category-error",
        "System": "log-category-system",
        "Validation": "log-category-validation"
      };
      return categoryMap[category] || "log-category-default";
    },


    /* ===============================================
       10. ENHANCED UTILITY FUNCTIONS
       =============================================== */
    showPageProgress: function (text) {
      let htmlEl = $('.sp-page-header');
      if (htmlEl !== undefined) {
        $(".sp-page-header.sp-page-header-progress").remove();

        let htmlText = `
        <div class="sp-page-header sp-page-header-progress">
            <h1 class="sp-page-title sp-page-header-progress-text"><i class="fa-solid fa-spinner fa-spin"><!--/i--></i> ${text}</h1>
        </div>`;
        htmlEl.after(htmlText);
      }
    },
    hidePageProgress: function () {
      let htmlEl = $(".sp-page-header.sp-page-header-progress");
      if (htmlEl !== undefined) {
        htmlEl.fadeOut(500);
      }
    },
    getParentUrlParameter: function (param) {
      let url_string = window.parent.location.href;
      let url = new URL(url_string);
      return url.searchParams.get(param);
    },

    checkAssayGUID: function () {
      const assayGUID = tlm.global.getUrlParameter("AssayGUID");

      // Return true ถ้ามี AssayGUID และไม่ใช่ค่าว่าง
      return assayGUID && assayGUID.trim() !== '';
    },

    getUrlParameter: function (param, url_string) {
      if (url_string === undefined) url_string = location.href;
      let url = new URL(url_string);
      return url.searchParams.get(param);
    },

    loadCustomWidget: async function () {
      let path = "TLMLib/js/Widget";
      let widgets = [
        "Attachment.html",
      ];

      $("#customWidget").remove();
      let context = $("<div id='customWidget'></div>");
      context.appendTo($(document.body));

      for (let i = 0; i < widgets.length; i++) {
        try {
          let seed = kendo.guid();
          let url = `${tlm.global.webBaseUrl}/${path}/${widgets[i]}?rev=${seed}`;
          const data = await $.get(url);
          context.append(data);
        } catch (error) {
          // console.error(`[TLM] Failed to load widget ${widgets[i]}:`, error);
        }
      }
    },
    WORKFLOW_STATUS_DUMMY_DRAFT: " DRAFT ",
    downloadBase64File(options) {
      tlm.global.ajaxCallResult({
        targetElement: options.targetElement,
        url: options.url,
        type: "POST",
        data: JSON.stringify(options.data),
        success: function (data) {
          const linkSource = `data:${data.ContentType};base64,${data.Base64Data}`;
          const downloadLink = document.createElement("a");
          downloadLink.href = linkSource;
          downloadLink.download = data.FileName;
          downloadLink.click();
        },
        error: function (data) {
          // console.log(JSON.stringify(data));
        },
      });
    },

    isEmpty: function (val) {
      return val === undefined || val == null || val.length <= 0 ? true : false;
    },

    onTextAreaInput: function (e) {
      e.style.height = "";
      e.style.height = e.scrollHeight + 4 + "px";
    },

    compareTrimString(aName, bName) {
      if (
        (aName == null || aName.trim() == "") &&
        (bName == null || bName.trim() == "")
      )
        return true;

      aName = aName == null ? "" : aName;
      bName = bName == null ? "" : bName;

      return aName.trim() == bName.trim();
    },

    compareGUID(aGUID, bGUID) {
      if (aGUID == null) aGUID = "";
      if (bGUID == null) bGUID = "";

      if (typeof aGUID == "string") aGUID = aGUID.trim().toLowerCase();
      if (typeof bGUID == "string") bGUID = bGUID.trim().toLowerCase();

      return aGUID == bGUID;
    },

    base64toBlob(base64Data, contentType) {
      contentType = contentType || "";
      let sliceSize = 1024;
      let byteCharacters = atob(base64Data);
      let bytesLength = byteCharacters.length;
      let slicesCount = Math.ceil(bytesLength / sliceSize);
      let byteArrays = new Array(slicesCount);

      for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        let begin = sliceIndex * sliceSize;
        let end = Math.min(begin + sliceSize, bytesLength);

        let bytes = new Array(end - begin);
        for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
          bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
      }
      return new Blob(byteArrays, { type: contentType });
    },

    // Textarea Universal Auto Resize
    initializeUniversalAutoResize: function (options = {}) {
      const settings = {
        minHeight: 60,
        ...options
      };

      // Auto resize function
      function autoResize(element, minHeight) {
        if (!element) return;

        element.style.height = 'auto';
        let scrollHeight = element.scrollHeight;

        if (scrollHeight < minHeight) {
          element.style.height = minHeight + 'px';
        } else {
          element.style.height = scrollHeight + 'px';
        }

        // Always hide overflow since we're expanding to fit content
        element.style.overflowY = 'hidden';
      }

      // Remove existing event listeners
      $(document).off('input.tlmUniversalAutoResize keyup.tlmUniversalAutoResize paste.tlmUniversalAutoResize');

      // Universal event handler for all textarea types
      $(document).on('input.tlmUniversalAutoResize keyup.tlmUniversalAutoResize paste.tlmUniversalAutoResize',
        'textarea, .k-textarea, [data-role="textarea"]', function () {
          autoResize(this, settings.minHeight);
        });

      // Initialize existing textareas immediately
      setTimeout(() => {
        // Regular textareas
        $('textarea').each(function () {
          autoResize(this, settings.minHeight);
        });

        // Kendo textareas
        $('.k-textarea, [data-role="textarea"]').each(function () {
          autoResize(this, settings.minHeight);
        });

        // Handle Kendo Textarea controls specifically
        $('[data-role="textarea"]').each(function () {
          const kendoTextarea = $(this).data('kendoTextArea');
          if (kendoTextarea) {
            const textareaElement = kendoTextarea.element[0];
            autoResize(textareaElement, settings.minHeight);

            // Bind Kendo events
            kendoTextarea.bind('input', function () {
              autoResize(textareaElement, settings.minHeight);
            });

            kendoTextarea.bind('change', function () {
              autoResize(textareaElement, settings.minHeight);
            });
          }
        });
      }, 100);

      // Handle dynamically created Kendo textareas
      $(document).on('kendoWidgetCreated', function (e) {
        if (e.target && e.target.getAttribute('data-role') === 'textarea') {
          setTimeout(() => {
            autoResize(e.target, settings.minHeight);
          }, 50);
        }
      });

      // console.log('[TLM] Universal auto resize initialized for all textarea controls');
    },

    CamSticky: function (scrollContainer, targetElement, stickyTop) {

      if (window.innerWidth <= 992) {
        console.log('[TLM] CamSticky disabled for mobile view.');
        return;
      }
      var $scrollContainer = $(scrollContainer);
      var $targetElement = $(targetElement);

      // Store initial values
      var originalTop = $targetElement.offset().top;
      var originalLeft = $targetElement.offset().left;
      var originalWidth = $targetElement.outerWidth();
      var originalHeight = $targetElement.outerHeight();

      // Create placeholder
      var placeholderId = targetElement.replace('#', '') + 'Placeholder';
      var $placeholder = $('<div id="' + placeholderId + '"></div>');

      $scrollContainer.scroll(function () {
        var scrollTop = $scrollContainer.scrollTop();

        if (scrollTop > 100) {
          // Add placeholder to maintain space
          if ($('#' + placeholderId).length === 0) {
            $placeholder.css({
              'width': originalWidth + 'px',
              'height': originalHeight + 'px',
              'visibility': 'hidden'
            });
            $targetElement.before($placeholder);
          }

          // Make sticky
          $targetElement.css({
            'position': 'fixed',
            'top': stickyTop + 'px',
            'left': originalLeft + 'px',
            'width': originalWidth + 'px',
            'z-index': '400',
            'max-height': 'calc(100vh - 40px)',
          });
        } else {
          // Remove placeholder and return to normal position
          $('#' + placeholderId).remove();

          $targetElement.css({
            'position': 'static',
            'width': 'auto',
            'border': 'none',
            'box-shadow': 'none',
            'border-radius': '0',
            'max-height': 'none',
            'overflow-y': 'visible'
          });
        }
      });

      // Handle window resize
      $(window).resize(function () {
        if ($targetElement.css('position') === 'static') {
          originalTop = $targetElement.offset().top;
          originalLeft = $targetElement.offset().left;
          originalWidth = $targetElement.outerWidth();
          originalHeight = $targetElement.outerHeight();
        }
      });
    },

    GridHeaderSticky: function (scrollContainer, gridId, stickyTop) {
      if (window.innerWidth <= 992) {
        console.log('[TLM] GridHeaderSticky disabled for mobile view.');
        return;
      }

      var $scrollContainer = $(scrollContainer);
      var $targetElement = $(gridId + ' .k-grid-header');

      // Store original values
      var originalOffset = $targetElement.offset();
      var originalWidth = $targetElement.outerWidth();

      $scrollContainer.scroll(function () {
        var scrollTop = $scrollContainer.scrollTop();
        var containerOffset = $scrollContainer.offset();

        if (scrollTop > stickyTop) {
          // Make sticky - always stick to top of scroll container + scroll position
          $targetElement.css({
            'border-bottom': '4px solid #0073cc',
            'position': 'absolute',
            'top': (containerOffset.top + scrollTop - stickyTop) - 142 + 'px',
            'left': (0) + 'px',
            'width': originalWidth + 'px',
            'z-index': '10000',
            'box-shadow': 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'
          });
        } else {
          // Return to normal position
          $targetElement.css({
            'border': '',
            'position': 'static',
            'top': '',
            'left': '',
            'width': '',
            'z-index': '',
            'box-shadow': ''
          });
        }
      });

      // Handle window resize
      $(window).resize(function () {
        if ($targetElement.css('position') === 'static') {
          originalOffset = $targetElement.offset();
          originalWidth = $targetElement.outerWidth();
        }
      });
    },


    //Pick update 4
    forceLogout: function () {
      console.log('[TLM] Simple force logout initiated...');

      try {
        // 1. Clear ทุกอย่างก่อน
        console.log('[TLM] Clearing all data...');

        // Clear localStorage และ sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // Clear current user
        this._currentUser = null;
        this._currentUserWithPermission = null;
        this.azureToken = null;

        // Reset flags
        this._tokenRefreshInProgress = false;
        this._handling401Error = false;
        this._authenticationInProgress = false;

        // 2. Clear MSAL ถ้ามี
        if (this.msalInstance) {
          try {
            const accounts = this.msalInstance.getAllAccounts();
            accounts.forEach(account => {
              this.msalInstance.removeAccount(account);
            });
            this.msalInstance.clearCache();
            this.msalInstance.setActiveAccount(null);
            console.log('[TLM] MSAL cleared');
          } catch (msalError) {
            console.warn('[TLM] MSAL clear error:', msalError);
          }
        }

        // 3. แสดงหน้า Loading
        document.body.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                          background: white; z-index: 999999; display: flex; 
                          align-items: center; justify-content: center; flex-direction: column;">
                    <h2 style="color: #333; margin-bottom: 20px;">Logging out...</h2>
                    <p style="color: #666;">Redirecting to login page...</p>
                    <div style="margin-top: 20px; width: 40px; height: 40px; 
                              border: 3px solid #f3f3f3; border-top: 3px solid #0078d4; 
                              border-radius: 50%; animation: spin 1s linear infinite;"></div>
                </div>
                <style>
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                </style>
            `;

        // 4. รอสักครู่แล้ว redirect
        setTimeout(() => {
          console.log('[TLM] Redirecting to logout...');

          // วิธีง่ายๆ: ใช้ MSAL logout ถ้ามี
          if (this.msalInstance) {
            try {
              this.msalInstance.logoutRedirect({
                postLogoutRedirectUri: window.location.origin + '/sites/COOL-qas',
                mainWindowRedirectUri: window.location.origin + '/sites/COOL-qas'
              });
              return;
            } catch (error) {
              console.warn('[TLM] MSAL logout failed, using manual method');
            }
          }

          // วิธี manual: ไปหา Azure AD logout โดยตรง
          const tenantId = '894f6e4e-e59c-47ff-be1e-b63a852cfb53';
          const returnUrl = window.location.origin + '/sites/COOL-qas';
          const logoutUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(returnUrl)}`;

          console.log('[TLM] Manual logout to:', logoutUrl);
          window.location.href = logoutUrl;

        }, 1000);

      } catch (error) {
        console.error('[TLM] Force logout error:', error);

        // กรณีฉุกเฉิน: clear แล้ว reload
        localStorage.clear();
        sessionStorage.clear();
        alert('Logging out... Please wait.');
        window.location.reload();
      }
    },

    /* ===============================================
       11-0. KENDO LICENSE OBSERVER
       =============================================== */
    startKendoLicenseObserver: function () {
      // 1. Apply the license immediately on startup
      KendoLicenseManager.setKendoLicenseDebounced();

      // 2. Create an observer to watch for DOM changes
      const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Check if any of the new nodes are or contain Kendo widgets
            let needsLicense = false;
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === 1) { // Check if it's an element
                if (node.matches('[data-role*="kendo"], .k-widget') || node.querySelector('[data-role*="kendo"], .k-widget')) {
                  needsLicense = true;
                }
              }
            });

            if (needsLicense) {
              console.log('[KendoLicenseManager] New Kendo components detected. Applying license...');
              KendoLicenseManager.setKendoLicenseDebounced();
              // We found what we needed, no need to check other mutations in this batch
              return;
            }
          }
        }
      });

      // 3. Configure and start the observer
      const targetNode = document.body;
      const config = { childList: true, subtree: true };
      observer.observe(targetNode, config);

      console.log('[KendoLicenseManager] Observer started. Watching for dynamic components.');
    },



    /* ===============================================
       11. ENHANCED EVENT HANDLERS & INITIALIZATION
       =============================================== */

    // Enhanced Event Listener Management with Modern Patterns
    _setupEventListeners: function () {
      this._cleanupEventListeners();

      // Enhanced page unload cleanup
      const unloadHandler = (e) => {
        this.dispose();

        // Enhanced cleanup logging
        console.log('[TLM] Page unload - cleanup completed');

        // Allow browser to continue with unload
        return undefined;
      };

      window.addEventListener('beforeunload', unloadHandler, { passive: true });
      this._eventListeners.set('beforeunload', unloadHandler);

      // Enhanced cross-tab token synchronization
      const storageHandler = (e) => {
        switch (e.key) {
          case 'tlm_azure_token':
            if (e.newValue && e.newValue !== this.azureToken) {
              console.log('[TLM] Token updated from another tab');
              this.azureToken = e.newValue;
            }
            break;

          case 'tlm_token_expiry':
            if (e.newValue) {
              console.log('[TLM] Token expiry updated from another tab');
              // Trigger refresh check if needed
              this._checkTokenExpiry(parseInt(e.newValue));
            }
            break;

          case 'tlm_token_refresh_lock':
            this._tokenRefreshInProgress = e.newValue === 'locked';
            if (!e.newValue) {
              const newToken = localStorage.getItem('tlm_azure_token');
              if (newToken && newToken !== this.azureToken) {
                this.azureToken = newToken;
                console.log('[TLM] Token refresh completed in another tab');
              }
            }
            break;

          case 'tlm_force_logout':
            if (e.newValue === 'true') {
              console.log('[TLM] Force logout triggered from another tab');
              this.forceLogout();
            }
            break;
        }
      };

      window.addEventListener('storage', storageHandler);
      this._eventListeners.set('storage', storageHandler);

      // Enhanced user activity tracking
      const activityEvents = ['click', 'keypress', 'mousemove', 'touchstart', 'scroll'];
      const activityHandler = this._trackUserActivity.bind(this);

      activityEvents.forEach(event => {
        document.addEventListener(event, activityHandler, { passive: true });
        this._activityListeners.push({ event, handler: activityHandler });
      });

      // Enhanced SPFx navigation detection
      if (window.history && window.history.pushState) {
        const originalPushState = window.history.pushState;
        window.history.pushState = (...args) => {
          console.log('[TLM] SPFx navigation detected, preparing cleanup...');
          this.dispose();
          return originalPushState.apply(window.history, args);
        };
      }

      console.log('[TLM] Enhanced event listeners setup completed');
    },

    // Enhanced Event Listener Cleanup
    _cleanupEventListeners: function () {
      this._eventListeners.forEach((handler, event) => {
        window.removeEventListener(event, handler);
      });
      this._eventListeners.clear();

      this._activityListeners.forEach(({ event, handler }) => {
        document.removeEventListener(event, handler);
      });
      this._activityListeners = [];
    },

    // Enhanced Token Expiry Check
    _checkTokenExpiry: function (expiryTime) {
      const now = Date.now();
      const timeLeft = expiryTime - now;
      const minutesLeft = Math.floor(timeLeft / 60000);

      if (minutesLeft < this.TOKEN_REFRESH_THRESHOLD_MINUTES && minutesLeft > 0) {
        // iOS WebKit: STOP - no auto refresh
        if (this._isIOSWebKit()) {
          console.log('[TLM][iOS WebKit] ⚠️ Token expiry detected - skipping auto refresh');
          return;
        }

        console.log(`[TLM] Token expires in ${minutesLeft} minutes, triggering refresh`);
        this.validateAndRefreshToken().catch(error => {
          console.error('[TLM] Auto refresh failed:', error);
        });
      }
    },

    // Enhanced Disposal with Complete Cleanup
    dispose: function () {
      if (this._disposed) {
        return;
      }

      console.log('[TLM] Enhanced disposal initiated...');
      this._disposed = true;

      // Enhanced cleanup sequence
      try {
        // Stop all intervals and timeouts
        this.stopAutoTokenChecker();

        if (this._tokenRefreshInterval) {
          clearInterval(this._tokenRefreshInterval);
          this._tokenRefreshInterval = null;
        }

        if (this._tokenMonitorInterval) {
          clearInterval(this._tokenMonitorInterval);
          this._tokenMonitorInterval = null;
        }

        // Enhanced state cleanup
        this._pendingRequests = [];
        this._tokenPromise = null;
        this._tokenRefreshPromise = null;
        this._initializationPromise = null;

        // Enhanced event cleanup
        this._cleanupEventListeners();

        // Enhanced MSAL cleanup (preserve localStorage for other tabs)
        if (this.msalInstance) {
          try {
            // Only clear memory cache, not localStorage
            console.log('[TLM] Preserving localStorage for other tabs');
          } catch (error) {
            console.warn('[TLM] Error during enhanced MSAL cleanup:', error);
          }
        }

        // Enhanced state reset
        this.msalInstance = null;
        this._msalReady = false;
        this._dependenciesLoaded = false;
        this._spfxContext = null;
        this._currentUser = null;
        this._handling401Error = false;
        this._tokenRefreshInProgress = false;

        console.log('[TLM] Enhanced disposal completed - localStorage tokens preserved');

      } catch (error) {
        console.error('[TLM] Error during enhanced disposal:', error);
      }
    },

    // Enhanced Ready State Management
    waitForReady: async function (timeout = 20000) {
      const startTime = Date.now();
      const checkInterval = 200;

      while (Date.now() - startTime < timeout) {
        if (this.isReady()) {
          try {
            await this.initialize();
            console.log('[TLM] Enhanced ready state confirmed');
            return true;
          } catch (initError) {
            console.warn('[TLM] Enhanced initialization had issues:', initError);
            return true; // Continue even if init has issues
          }
        }

        await new Promise(resolve => setTimeout(resolve, checkInterval));
      }

      throw new Error('Enhanced tlm.global not ready within timeout period');
    },

    // Enhanced Ready State Check
    isReady: function () {
      return window.tlm &&
        window.tlm.global &&
        typeof window.tlm.global.ajaxCall === 'function' &&
        this._msalReady &&
        this._dependenciesLoaded &&
        !this._disposed;
    },

    // Enhanced Safe Call Wrapper
    safeCall: async function (func, ...args) {
      try {
        await this.waitForReady();
        return await func.apply(this, args);
      } catch (error) {
        console.error('[TLM] Enhanced safe call failed:', error);
        throw error;
      }
    },

    // Enhanced Copy to Clipboard Utilities
    copyDataToClipboard: function (text, element) {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(() => {
            this.showCopySuccess(element);
          }).catch(err => {
            console.error('Enhanced clipboard API failed:', err);
            this.fallbackCopy(text, element);
          });
        } else {
          this.fallbackCopy(text, element);
        }
      } catch (error) {
        console.error('Enhanced copy failed:', error);
        this.showCopyError(element);
      }
    },

    fallbackCopy: function (text, element) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.cssText = 'position:fixed;left:-999999px;top:-999999px;opacity:0;';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
          this.showCopySuccess(element);
        } else {
          this.showCopyError(element);
        }
      } catch (error) {
        console.error('Enhanced fallback copy failed:', error);
        this.showCopyError(element);
      }
    },

    showCopySuccess: function (element) {
      const originalContent = element.innerHTML;
      const originalColor = element.style.color;

      element.innerHTML = '<i class="fa fa-check" style="color: green;"></i> Copied!';
      element.style.color = 'green';

      setTimeout(() => {
        element.innerHTML = originalContent;
        element.style.color = originalColor || '#0078d4';
      }, 2000);
    },

    showCopyError: function (element) {
      const originalContent = element.innerHTML;
      const originalColor = element.style.color;

      element.innerHTML = '<i class="fa fa-times" style="color: red;"></i> Copy failed';
      element.style.color = 'red';

      setTimeout(() => {
        element.innerHTML = originalContent;
        element.style.color = originalColor || '#0078d4';
      }, 2000);
    },

    // Enhanced AJAX Monitoring for Loading Indicators

    handleSharePointEditMode: function () {
      // ตรวจสอบ edit mode
      if (window.location.href.includes('Mode=Edit') ||
        window.location.href.includes('ControlMode=Edit')) {

        // Re-apply license เมื่อ save/publish
        $(document).on('click', '[name*="save"], [name*="publish"]', function () {
          setTimeout(() => {
            KendoLicenseManager.setKendoLicenseWithRetry();
          }, 2000);
        });
      }
    }
    // End of tlm.global enhancements
  };

  // Enhanced Date.prototype.toJSON with improved timezone handling
  Date.prototype.toJSON = function () {
    let date = new Date(this.getTime());
    const targetTimezone = 7; // Thailand, Bangkok
    date.setUTCHours(date.getUTCHours() + targetTimezone);
    return date.toISOString();
  };

  // Enhanced Environment-specific URL parameter handling
  if (tlm.global.getUrlParameter("isDebug") == "1" ||
    tlm.global.getUrlParameter("debug") == "1" ||
    tlm.global.getUrlParameter("d") == "1") {
    tlm.global.serviceUrl = "https://localhost:7188";
    console.log('[TLM] Debug mode enabled, using localhost API');
  }

})(window);

// Enhanced MSAL initialization for token fragments
(async function () {
  const hash = window.location.hash;
  if (hash && (hash.includes('access_token') || hash.includes('id_token') || hash.includes('code='))) {
    console.log('[TLM] Token fragment detected, initializing enhanced MSAL immediately');
    try {
      await tlm.global.initialize();
    } catch (error) {
      console.error('[TLM] Enhanced early initialization failed:', error);
    }
  }
})();

// Enhanced SPFx Integration and Auto-initialization
(function () {
  let autoInitCalled = false;

  const checkForSpfxContext = () => {
    if (autoInitCalled) {
      console.log('[TLM] Enhanced auto-initialization already called, skipping...');
      return;
    }

    if (window.spfxContext) {
      autoInitCalled = true;
      console.log('[TLM] SPFx context detected, starting enhanced initialization...');
      tlm.global.initialize(window.spfxContext);
    } else if (window._spPageContextInfo) {
      autoInitCalled = true;
      console.log('[TLM] SharePoint context detected, starting enhanced initialization...');
      tlm.global.initialize();
    }
  };

  checkForSpfxContext();
  setTimeout(checkForSpfxContext, 1000);
  setTimeout(checkForSpfxContext, 3000); // Additional fallback
})();

// Enhanced Loading Bar Creation
function CreateLoadingBar() {
  const existingBar = document.getElementById('menu-loading-pulse-main');
  if (existingBar) return;

  const menuLoadingPulse = document.createElement('div');
  menuLoadingPulse.className = 'menu-loading-pulse enhanced-loading';
  menuLoadingPulse.id = 'menu-loading-pulse-main';
  menuLoadingPulse.style.cssText = `
        position: absolute; 
        top: 54px; 
        z-index: 40; 
        height: 3px; 
        width: 100%;
        background: linear-gradient(90deg, transparent 0%, #0078d4 30%, #106ebe 50%, #0078d4 70%, transparent 100%);
        background-size: 200% 100%;
        animation: loadingPulse 2s infinite;
    `;

  const headerElement = document.querySelector('.sp-page-header');
  if (headerElement) {
    headerElement.insertAdjacentElement('afterend', menuLoadingPulse);
  }
}

CreateLoadingBar();

// Enhanced jQuery Document Ready with Modern Patterns
// Enhanced jQuery Document Ready with Complete Kendo License Management
$(document).ready(function () {
  console.log('[TLM] Document ready, starting enhanced initialization...');

  // ========================================
  // 1. KENDO LICENSE AGGRESSIVE MONITORING
  // ========================================

  // เริ่ม aggressive monitoring สำหรับ Kendo License ทันที
  if (typeof KendoLicenseManager !== 'undefined') {
    // Start aggressive monitoring
    KendoLicenseManager.startAggressiveMonitoring();

    // Apply license immediately
    KendoLicenseManager.setKendoLicenseWithRetry();

    // Monitor SharePoint edit mode
    if (window.location.href.includes('Mode=Edit') ||
      window.location.href.includes('ControlMode=Edit')) {

      // Re-apply เมื่อมีการ save/publish
      $(document).on('click', '[name*="save"], [name*="publish"], .ms-CalloutLink', function () {
        console.log('[KendoLicenseManager] SharePoint action detected, re-applying license...');
        setTimeout(() => {
          KendoLicenseManager.setKendoLicenseWithRetry();
        }, 2000);
      });
    }

    // Monitor สำหรับ SharePoint ribbon actions
    $(document).on('click', '#Ribbon, .ms-cui-ctl-large, .ms-cui-ctl-medium', function () {
      setTimeout(() => {
        KendoLicenseManager.setKendoLicenseDebounced();
      }, 1000);
    });
  }

  // ========================================
  // 2. TLM INITIALIZATION CHECK
  // ========================================

  // Check if initialization is already in progress
  if (tlm.global._isInitializing || tlm.global._initializationPromise) {
    console.log('[TLM] Initialization already in progress, waiting...');
    tlm.global._initializationPromise.then(() => {
      console.log('[TLM] Initialization completed, setting up features...');
      setupPostInitFeatures();
      setupKendoLicenseRecovery();
    }).catch(error => {
      console.error('[TLM] Waiting for initialization failed:', error);
      fallbackInitialization();
    });
    return;
  }

  // ========================================
  // 3. SHOW LOADING
  // ========================================

  if (typeof tlm !== 'undefined' && tlm.global) {
    tlm.global.showFullLoading();
  }

  // ========================================
  // 4. MAIN INITIALIZATION
  // ========================================

  tlm.global.initialize().then(() => {
    console.log('[TLM] tlm.global initialized successfully');
    setupPostInitFeatures();
    setupKendoLicenseRecovery();
  }).catch(error => {
    console.error('[TLM] Initialization failed:', error);
    fallbackInitialization();
  }).finally(() => {
    setTimeout(() => {
      if (typeof tlm !== 'undefined' && tlm.global) {
        tlm.global.hideFullLoading();
      }
    }, 1000);
  });

  // ========================================
  // 5. POST-INITIALIZATION FEATURES
  // ========================================

  function setupPostInitFeatures() {
    try {
      // Token management
      tlm.global.startAutoTokenChecker();

      // AJAX monitoring
      setupEnhancedAjaxMonitoring();

      // Menu and UI
      tlm.global.initializeMenu();
      tlm.global.initializeUniversalAutoResize();

      // Additional features with delay
      setTimeout(() => {
        tlm.global.autoLogPageAccess();
        tlm.global.initializeImpersonateBar();
        tlm.global.startKendoLicenseObserver();
        setupEnhancedNavigationHandlers();
        setupEnhancedOrientationHandling();

        // Final Kendo license check
        KendoLicenseManager.setKendoLicenseWithRetry();
      }, 2000);

    } catch (error) {
      console.error('[TLM] Error in post-init features:', error);
    }
  }

  // ========================================
  // 6. KENDO LICENSE RECOVERY SETUP
  // ========================================

  function setupKendoLicenseRecovery() {
    // Monitor สำหรับ Kendo widgets ที่ถูกสร้างใหม่
    $(document).on('kendoWidgetCreated', function (e) {
      console.log('[KendoLicenseManager] New Kendo widget created');
      KendoLicenseManager.setKendoLicenseDebounced();
    });

    // Monitor การเปลี่ยนแปลง URL
    let lastUrl = window.location.href;
    setInterval(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        console.log('[KendoLicenseManager] URL changed, re-applying license');
        KendoLicenseManager.setKendoLicenseWithRetry();
      }
    }, 1000);

    // Monitor สำหรับ AJAX calls ที่อาจโหลด Kendo components
    $(document).ajaxComplete(function (event, xhr, settings) {
      // ตรวจสอบว่ามี Kendo components ใหม่หรือไม่
      setTimeout(() => {
        if ($('.k-widget').length > 0 || $('[data-role*="kendo"]').length > 0) {
          KendoLicenseManager.setKendoLicenseDebounced();
        }
      }, 500);
    });

    // SharePoint specific: Monitor page state changes
    if (window._spPageContextInfo) {
      const checkPageState = () => {
        const inEditMode = document.forms[MSOWebPartPageFormName]?.MSOLayout_InDesignMode?.value === "1";
        const inWikiMode = document.forms[MSOWebPartPageFormName]?._wikiPageMode?.value === "Edit";

        if (inEditMode || inWikiMode) {
          console.log('[KendoLicenseManager] Page in edit mode, monitoring for changes');
          KendoLicenseManager.setKendoLicenseDebounced();
        }
      };

      setInterval(checkPageState, 3000);
    }
  }

  // ========================================
  // 7. FALLBACK INITIALIZATION
  // ========================================

  function fallbackInitialization() {
    try {
      // Try to set Kendo license even if main init failed
      KendoLicenseManager.setKendoLicenseWithRetry();

      tlm.global.showAlertDialog({
        title: "Initialization Warning",
        content: "Some features may not work correctly. Please refresh the page if you experience issues.",
        isWarning: true
      });
    } catch (error) {
      console.error('[TLM] Fallback initialization failed:', error);
    }
  }

  // ========================================
  // 8. AJAX MONITORING
  // ========================================

  function setupEnhancedAjaxMonitoring() {
    $(document).ajaxSend(function (event, jqXHR, settings) {
      if (!settings.url || !settings.url.includes(tlm.global.serviceUrl)) {
        return;
      }

      const tokenStatus = tlm.global.checkCurrentTokenStatus();
      if (!tokenStatus.valid && tokenStatus.minutesLeft < -1) {
        console.warn("[TLM] Blocking API call - token expired:", tokenStatus);
        jqXHR.abort();
        tlm.global.showAlertDialog({
          title: "Session Expired",
          content: "Your session has expired. Please refresh the page to continue.",
          width: "400px",
          isError: true,
          onOk: () => window.location.reload()
        });
        return;
      }

      if (tokenStatus.status === 'EXPIRING_SOON' && tokenStatus.hasAccounts) {
        // iOS WebKit: STOP - no background refresh
        if (tlm.global._isIOSWebKit()) {
          console.log('[TLM][iOS WebKit] ⚠️ Token expiring - skipping background refresh in beforeSend');
        } else {
          console.log("[TLM] Background refresh before API call...");
          tlm.global.validateAndRefreshToken().catch(error => {
            console.error("[TLM] Background token refresh failed:", error);
          });
        }
      }
    });
  }

  // ========================================
  // 9. NAVIGATION HANDLERS
  // ========================================

  function setupEnhancedNavigationHandlers() {
    // SharePoint navigation
    $(document).on("click", ".ms-breadcrumb-top a, .ms-core-listMenu-horizontalBox a", function () {
      setTimeout(() => KendoLicenseManager.setKendoLicenseDebounced(), 1000);
    });

    // Browser navigation
    $(window).on("hashchange", function () {
      setTimeout(() => KendoLicenseManager.setKendoLicenseDebounced(), 1000);
    });

    // SPFx navigation
    $(document).on("click", "[data-automationid='ContextualMenu']", function () {
      setTimeout(() => KendoLicenseManager.setKendoLicenseDebounced(), 1500);
    });

    // Modern SharePoint page navigation
    $(document).on("click", "button[data-automationid], a[data-automationid]", function () {
      setTimeout(() => KendoLicenseManager.setKendoLicenseDebounced(), 1000);
    });
  }

  // ========================================
  // 10. ORIENTATION HANDLING
  // ========================================

  function setupEnhancedOrientationHandling() {

    // let isMobileView = window.innerWidth <= 992;
    // let currentOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

    // $(window).on('resize orientationchange', function () {
    //   const newIsMobileView = window.innerWidth <= 992;
    //   const newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

    //   // Re-apply Kendo license on resize
    //   KendoLicenseManager.setKendoLicenseDebounced();

    //   if (isMobileView && !newIsMobileView) {
    //     console.log('[TLM] Menu re-initialization for desktop view');
    //     tlm.global.initializeMenu();
    //   }

    //   if (newOrientation !== currentOrientation) {
    //     console.log(`[TLM] Orientation change: ${currentOrientation} → ${newOrientation}`);
    //     currentOrientation = newOrientation;

    //     tlm.global.showFullLoading();
    //     setTimeout(() => location.reload(), 300);
    //   }

    //   isMobileView = newIsMobileView;
    // });
  }

  // ========================================
  // 11. BROWSER BACK/FORWARD SPECIAL HANDLING
  // ========================================

  window.addEventListener('pageshow', function (event) {
    // pageshow event fires when navigating back
    if (event.persisted) {
      console.log('[KendoLicenseManager] Page restored from cache (back/forward navigation)');
      KendoLicenseManager.setKendoLicenseWithRetry();

      // Re-initialize critical components
      if (typeof tlm !== 'undefined' && tlm.global) {
        // iOS WebKit: STOP - no token refresh on pageshow
        if (!tlm.global._isIOSWebKit || !tlm.global._isIOSWebKit()) {
          tlm.global.validateAndRefreshToken();
        } else {
          console.log('[TLM][iOS WebKit] ⚠️ Skipping validateAndRefreshToken on pageshow');
        }
      }
    }
  });

  // ========================================
  // 12. VISIBILITY CHANGE HANDLING
  // ========================================

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
      console.log('[KendoLicenseManager] Page became visible');
      KendoLicenseManager.setKendoLicenseDebounced();

      // ตรวจสอบ token ด้วย
      if (typeof tlm !== 'undefined' && tlm.global) {
        // iOS WebKit: STOP - no token refresh on visibility change
        if (tlm.global._isIOSWebKit && tlm.global._isIOSWebKit()) {
          console.log('[TLM][iOS WebKit] ⚠️ Skipping validateAndRefreshToken on visibility change');
          
          // 🎯 SAFARI iOS: Cleanup loader if page became visible but no token acquired
          // This handles case where user closes popup without authenticating
          setTimeout(() => {
            const loader = document.getElementById('tlm-token-parsing-loader');
            const hasToken = localStorage.getItem('tlm_azure_token');
            if (loader && !hasToken) {
              console.log('[TLM][Safari iOS] 🧹 Cleaning up orphaned loader (no token acquired)');
              tlm.global._hideTokenParsingLoader();
            }
          }, 2000); // Wait 2s after visibility change
        } else {
          const tokenStatus = tlm.global.checkCurrentTokenStatus();
          if (tokenStatus.minutesLeft < 10) {
            tlm.global.validateAndRefreshToken();
          }
        }
      }
    }
  });

  // ========================================
  // 13. FINAL SETUP
  // ========================================

  // Ensure Kendo license is applied after everything loads
  $(window).on('load', function () {
    setTimeout(() => {
      KendoLicenseManager.setKendoLicenseWithRetry();
      console.log('[TLM] Final Kendo license check on window load');
    }, 1000);
  });

  // Log initialization complete
  console.log('[TLM] Document ready initialization complete');
});

// Enhanced AJAX Event Handlers
$(document).ajaxSend(() => $("#menu-loading-pulse-main").fadeIn());

$(document).ajaxStop(() => {
  setTimeout(() => {
    $("#menu-loading-pulse-main").fadeOut(500);
  }, 1000);
});

$(document).ajaxError((event, request, settings) => {
  console.error('[TLM] Enhanced AJAX Error:', { event, request, settings });
  $(".TLM-k-loading-mask").hide();
});

// Enhanced SPFx Integration Helpers
window.tlmSpfxHelpers = {
  initializeFromWebpart: async function (context) {
    try {
      console.log('[TLM SPFx] Enhanced initialization from webpart');
      window.spfxContext = context;
      await tlm.global.initialize(context);
      return true;
    } catch (error) {
      console.error('[TLM SPFx] Enhanced webpart initialization failed:', error);
      return false;
    }
  },

  disposeFromWebpart: function () {
    try {
      console.log('[TLM SPFx] Enhanced disposal from webpart');
      tlm.global.dispose();
      delete window.spfxContext;
      return true;
    } catch (error) {
      console.error('[TLM SPFx] Enhanced webpart disposal failed:', error);
      return false;
    }
  },

  isReady: () => tlm.global?.isReady() || false,
  waitForReady: (timeout = 15000) => tlm.global?.waitForReady(timeout)
};

// Enhanced Global Debug Commands
window.tlmDebug = {
  // Enhanced health check
  health: async () => {
    console.log('🔍 [TLM DEBUG] Enhanced health check...');

    const health = {
      initialized: !!tlm.global,
      msalReady: tlm.global?._msalReady || false,
      tokenValid: false,
      accountsCount: 0,
      loopDetected: tlm.global?.isLoopDetected() || false,
      lastError: tlm.global?._lastErrorCode || null
    };

    if (tlm.global?.msalInstance) {
      health.accountsCount = tlm.global.msalInstance.getAllAccounts().length;
    }

    const tokenStatus = tlm.global?.checkCurrentTokenStatus();
    if (tokenStatus) {
      health.tokenValid = tokenStatus.valid;
      health.tokenMinutesLeft = tokenStatus.minutesLeft;
      health.tokenStatus = tokenStatus.status;
    }

    const status = health.tokenValid && !health.loopDetected ? '✅ HEALTHY' : '⚠️ NEEDS ATTENTION';
    console.log(`📊 System Status: ${status}`);
    console.table(health);

    return health;
  },

  // Enhanced status check
  status: () => {
    console.log('🔍 [TLM DEBUG] Enhanced authentication status...');

    if (typeof tlm !== 'undefined' && tlm.global) {
      const status = tlm.global.checkCurrentTokenStatus();
      console.table(status);
      return status;
    } else {
      console.log('❌ tlm.global not available');
      return { error: 'tlm.global not available' };
    }
  },

  // Enhanced clear loop function
  clearLoop: () => {
    console.log('🔧 [TLM DEBUG] Enhanced authentication loop clearing...');

    if (typeof tlm !== 'undefined' && tlm.global) {
      tlm.global.clearAuthenticationLoopState();

      if (confirm('Loop state cleared. Refresh page now?')) {
        window.location.reload();
      }
    } else {
      // Enhanced manual clear
      const keysToClear = [
        'tlm_aad_loop_detected', 'tlm_redirect_attempts', 'tlm_last_redirect_time',
        'tlm_azure_token', 'tlm_token_expiry', 'tlm_intended_url', 'tlm_last_login_hint'
      ];

      keysToClear.forEach(key => localStorage.removeItem(key));
      console.log('✅ Enhanced loop state cleared manually');

      if (confirm('Loop state cleared. Refresh page now?')) {
        window.location.reload();
      }
    }
  },

  // Enhanced token refresh
  refresh: async () => {
    console.log('🔄 [TLM DEBUG] Enhanced token refresh...');

    // iOS WebKit: STOP - manual refresh blocked
    if (tlm.global._isIOSWebKit && tlm.global._isIOSWebKit()) {
      console.log('[TLM][iOS WebKit] ⚠️ Manual refresh blocked - use page Refresh button');
      tlm.global._showSafariMobileSetupNotification();
      return false;
    }

    try {
      const result = await tlm.global.validateAndRefreshToken();
      console.log(result ? '✅ Enhanced refresh successful' : '❌ Enhanced refresh failed');
      return result;
    } catch (error) {
      console.error('❌ Enhanced refresh error:', error);
      return false;
    }
  },

  // Enhanced system test
  test: async () => {
    console.log('🧪 [TLM DEBUG] Enhanced system test...');

    const results = {
      initialization: false,
      tokenAcquisition: false,
      apiCall: false,
      menuLoad: false,
      summary: { success: false, issues: [] }
    };

    try {
      // Test initialization
      if (tlm.global?.isReady()) {
        results.initialization = true;
      } else {
        results.summary.issues.push('Initialization failed');
      }

      // Test token acquisition
      const tokenStatus = tlm.global?.checkCurrentTokenStatus();
      if (tokenStatus?.valid) {
        results.tokenAcquisition = true;
      } else {
        results.summary.issues.push('Token acquisition failed');
      }

      // Test API connectivity
      try {
        await new Promise((resolve, reject) => {
          tlm.global.ajaxCall({
            url: `${tlm.global.serviceUrl}/api/health/check`,
            timeout: 5000,
            success: () => {
              results.apiCall = true;
              resolve();
            },
            error: () => reject()
          });
        });
      } catch {
        results.summary.issues.push('API connectivity failed');
      }

      // Test menu functionality
      if (document.querySelector('.enhanced-navigation, .custom-sp-nav')) {
        results.menuLoad = true;
      } else {
        results.summary.issues.push('Menu loading failed');
      }

      results.summary.success = results.summary.issues.length === 0;

      if (results.summary.success) {
        console.log('✅ All enhanced systems operational');
      } else {
        console.log('⚠️ Enhanced issues detected:', results.summary.issues);
      }

      console.table(results);
      return results;

    } catch (error) {
      console.error('❌ Enhanced test failed:', error);
      return { error: error.message };
    }
  },

  help: () => {
    console.log(`
🔧 ENHANCED TLM DEBUG COMMANDS:
┌─────────────────────────────────────────────────────────────┐
│  tlmDebug.health()        - Enhanced system health check    │
│  tlmDebug.status()        - Enhanced authentication status  │
│  tlmDebug.clearLoop()     - Enhanced loop state clearing    │
│  tlmDebug.refresh()       - Enhanced token refresh          │
│  tlmDebug.test()          - Enhanced system functionality   │
│  tlmDebug.help()          - Show this enhanced help         │
└─────────────────────────────────────────────────────────────┘

💡 Enhanced Quick Commands:
• tlmDebug.health() - Check if everything is OK
• tlmDebug.clearLoop() - Fix authentication issues
• tlmDebug.refresh() - Refresh authentication token

📈 Enhanced for SharePoint Online with modern MSAL patterns
        `);
  }
};

// Enhanced startup message with health check
setTimeout(async () => {
  if (typeof tlm !== 'undefined' && tlm.global) {
    const health = await tlmDebug.health();

    console.log(`
🚀 Enhanced TLM Authentication System Ready!

📊 Status: ${health.tokenValid && !health.loopDetected ? '✅ HEALTHY' : '⚠️ NEEDS ATTENTION'}
${health.tokenValid ? `   ⏱️ Token: ${health.tokenMinutesLeft} minutes remaining` : '   🔑 Login required'}
   👥 MSAL Accounts: ${health.accountsCount} (normal in SharePoint: 0)

💻 Enhanced Commands: tlmDebug.help()
        `);
  }
}, 3000);