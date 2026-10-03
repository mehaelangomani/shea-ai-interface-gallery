/**
 * wander — shared vanilla interactions across all pages
 */

(function () {
  "use strict";

  var toastEl = document.getElementById("toast");
  var toastTimeoutId = null;

  function initLucide() {
    if (typeof lucide !== "undefined" && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  function showToast(message, durationMs) {
    if (!toastEl) return;

    var duration = durationMs !== undefined ? durationMs : 2800;

    if (toastTimeoutId !== null) {
      clearTimeout(toastTimeoutId);
      toastTimeoutId = null;
    }

    toastEl.textContent = message;
    toastEl.hidden = false;
    toastEl.classList.add("is-visible");

    toastTimeoutId = window.setTimeout(function () {
      toastEl.classList.remove("is-visible");
      toastTimeoutId = window.setTimeout(function () {
        toastEl.hidden = true;
        toastTimeoutId = null;
      }, 250);
    }, duration);
  }

  function initMobileNav() {
    var toggle = document.getElementById("navToggle");
    var mobileNav = document.getElementById("mobileNav");

    if (!toggle || !mobileNav) return;

    function setMobileNavOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      mobileNav.hidden = !open;
      mobileNav.classList.toggle("is-open", open);

      var icon = toggle.querySelector("[data-lucide]");
      if (icon) {
        icon.setAttribute("data-lucide", open ? "x" : "menu");
        initLucide();
      }
    }

    setMobileNavOpen(false);

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      setMobileNavOpen(!isOpen);
    });

    document.addEventListener("click", function (event) {
      if (
        !mobileNav.classList.contains("is-open") ||
        mobileNav.contains(event.target) ||
        toggle.contains(event.target)
      ) {
        return;
      }
      setMobileNavOpen(false);
    });
  }

  function initHomepage() {
    var fileInput = document.getElementById("fileInput");
    var uploadButton = document.getElementById("uploadButton");
    var fileNameEl = document.getElementById("fileName");
    var promptTextEl = document.getElementById("promptText");
    var planTripButtons = document.querySelectorAll("[data-plan-trip]");

    function handlePlanTrip() {
      var prompt =
        promptTextEl && promptTextEl.textContent
          ? promptTextEl.textContent.trim()
          : "";

      if (prompt) {
        console.info("[wander] Plan trip requested with prompt:", prompt);
      }

      showToast("Planning your trip...");
    }

    planTripButtons.forEach(function (button) {
      button.addEventListener("click", handlePlanTrip);
    });

    if (uploadButton && fileInput) {
      uploadButton.addEventListener("click", function () {
        fileInput.click();
      });

      fileInput.addEventListener("change", function () {
        var file = fileInput.files && fileInput.files[0];
        if (!file) {
          if (fileNameEl) {
            fileNameEl.hidden = true;
            fileNameEl.textContent = "";
          }
          return;
        }

        var isImage = file.type.indexOf("image/") === 0;
        var isPdf =
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf");

        if (!isImage && !isPdf) {
          showToast("Please choose an image or PDF.");
          fileInput.value = "";
          return;
        }

        if (fileNameEl) {
          fileNameEl.textContent = file.name;
          fileNameEl.hidden = false;
        }
      });
    }
  }

  function setPanelHeight(panel, open) {
    if (open) {
      panel.style.maxHeight = panel.scrollHeight + "px";
      panel.style.opacity = "1";
    } else {
      panel.style.maxHeight = "0px";
      panel.style.opacity = "0";
    }
  }

  function initAccordionScope(scopeSelector) {
    var scope = document.querySelector(scopeSelector);
    if (!scope) return;

    var items = scope.querySelectorAll(".accordion-item");

    items.forEach(function (item) {
      var trigger = item.querySelector(".accordion-trigger");
      var panel = item.querySelector(".accordion-panel");
      if (!trigger || !panel) return;

      panel.hidden = false;
      panel.style.overflow = "hidden";
      panel.style.transition =
        "max-height 0.38s ease, opacity 0.28s ease";
      setPanelHeight(panel, false);

      trigger.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");

        items.forEach(function (other) {
          if (other === item) return;
          other.classList.remove("is-open");
          var otherTrigger = other.querySelector(".accordion-trigger");
          var otherPanel = other.querySelector(".accordion-panel");
          if (otherTrigger) {
            otherTrigger.setAttribute("aria-expanded", "false");
          }
          if (otherPanel) {
            setPanelHeight(otherPanel, false);
          }
        });

        if (!isOpen) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
          setPanelHeight(panel, true);
        } else {
          item.classList.remove("is-open");
          trigger.setAttribute("aria-expanded", "false");
          setPanelHeight(panel, false);
        }
      });
    });
  }

  function initFaqSearch() {
    var searchInput = document.getElementById("faqSearch");
    var faqList = document.getElementById("faqList");
    var emptyState = document.getElementById("faqEmpty");

    if (!searchInput || !faqList) return;

    var categories = faqList.querySelectorAll(".faq-category");
    var faqItems = faqList.querySelectorAll(".faq-item");

    searchInput.addEventListener("input", function () {
      var query = searchInput.value.trim().toLowerCase();
      var visibleCount = 0;

      faqItems.forEach(function (item) {
        var text = item.textContent.toLowerCase();
        var match = !query || text.indexOf(query) !== -1;
        item.classList.toggle("is-hidden", !match);
        if (match) visibleCount += 1;
      });

      categories.forEach(function (category) {
        var visibleInCategory = category.querySelectorAll(
          ".faq-item:not(.is-hidden)"
        ).length;
        category.classList.toggle("is-hidden", visibleInCategory === 0);
      });

      if (emptyState) {
        emptyState.hidden = visibleCount > 0;
      }
    });
  }

  function initPricingToggle() {
    var toggleButtons = document.querySelectorAll(".billing-toggle__btn");
    var savingsEl = document.getElementById("billingSavings");
    var pricePlus = document.querySelector("[data-price-plus]");
    var pricePro = document.querySelector("[data-price-pro]");
    var periodPlus = document.querySelector("[data-period-plus]");
    var periodPro = document.querySelector("[data-period-pro]");

    if (!toggleButtons.length) return;

    var prices = {
      monthly: { plus: "$9.99", pro: "$19.99", period: "/ month" },
      yearly: { plus: "$99.90", pro: "$199.90", period: "/ year" },
    };

    function setBilling(mode) {
      var data = prices[mode];
      if (!data) return;

      toggleButtons.forEach(function (btn) {
        btn.classList.toggle(
          "is-active",
          btn.getAttribute("data-billing") === mode
        );
      });

      if (savingsEl) {
        savingsEl.hidden = mode !== "yearly";
      }

      if (pricePlus) pricePlus.textContent = data.plus;
      if (pricePro) pricePro.textContent = data.pro;
      if (periodPlus) periodPlus.textContent = data.period;
      if (periodPro) periodPro.textContent = data.period;
    }

    toggleButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        setBilling(btn.getAttribute("data-billing") || "monthly");
      });
    });

    setBilling("monthly");
  }

  function initPricingCtas() {
    document.querySelectorAll("[data-pricing-cta]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        showToast("Thanks for your interest — checkout coming soon.");
      });
    });
  }

  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;

    var fields = {
      name: {
        input: document.getElementById("contactName"),
        error: document.getElementById("contactNameError"),
      },
      email: {
        input: document.getElementById("contactEmail"),
        error: document.getElementById("contactEmailError"),
      },
      interest: {
        input: document.getElementById("contactInterest"),
        error: document.getElementById("contactInterestError"),
      },
      message: {
        input: document.getElementById("contactMessage"),
        error: document.getElementById("contactMessageError"),
      },
    };

    var successEl = document.getElementById("contactSuccess");

    function setError(field, message) {
      if (!field.error) return;
      field.error.textContent = message;
      field.error.hidden = !message;
    }

    function clearErrors() {
      Object.keys(fields).forEach(function (key) {
        setError(fields[key], "");
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors();
      if (successEl) successEl.hidden = true;

      var valid = true;

      if (!fields.name.input.value.trim()) {
        setError(fields.name, "Please enter your name.");
        valid = false;
      }

      var email = fields.email.input.value.trim();
      if (!email) {
        setError(fields.email, "Please enter your email.");
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError(fields.email, "Please enter a valid email address.");
        valid = false;
      }

      if (!fields.interest.input.value) {
        setError(fields.interest, "Please select a trip interest.");
        valid = false;
      }

      if (!fields.message.input.value.trim()) {
        setError(fields.message, "Please enter a message.");
        valid = false;
      }

      if (!valid) return;

      if (successEl) {
        successEl.hidden = false;
      }

      form.reset();
      showToast("Thanks! We'll get back to you soon.");
    });
  }

  function initLoginForm() {
    var form = document.getElementById("loginForm");
    if (!form) return;

    var emailInput = document.getElementById("loginEmail");
    var passwordInput = document.getElementById("loginPassword");
    var emailError = document.getElementById("loginEmailError");
    var passwordError = document.getElementById("loginPasswordError");
    var statusEl = document.getElementById("loginStatus");
    var forgotBtn = document.getElementById("forgotPassword");
    var createBtn = document.getElementById("createAccount");
    var googleBtn = document.getElementById("googleSignIn");

    function setFieldError(el, message) {
      if (!el) return;
      el.textContent = message;
      el.hidden = !message;
    }

    function setStatus(message, type) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.hidden = !message;
      statusEl.classList.remove("is-error", "is-success");
      if (type) statusEl.classList.add(type);
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      setFieldError(emailError, "");
      setFieldError(passwordError, "");
      setStatus("", "");

      var email = emailInput.value.trim();
      var password = passwordInput.value;
      var valid = true;

      if (!email) {
        setFieldError(emailError, "Email is required.");
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFieldError(emailError, "Enter a valid email address.");
        valid = false;
      }

      if (!password) {
        setFieldError(passwordError, "Password is required.");
        valid = false;
      }

      if (!valid) {
        setStatus("Please fix the errors above.", "is-error");
        return;
      }

      setStatus("Signed in successfully. Welcome back!", "is-success");
      showToast("Welcome back to wander.");
    });

    if (forgotBtn) {
      forgotBtn.addEventListener("click", function () {
        showToast("Password reset — coming soon.");
      });
    }

    if (createBtn) {
      createBtn.addEventListener("click", function () {
        showToast("Create account — coming soon.");
      });
    }

    if (googleBtn) {
      googleBtn.addEventListener("click", function () {
        showToast("Google sign-in — coming soon.");
      });
    }
  }

  initLucide();
  initMobileNav();
  initHomepage();
  initAccordionScope(".mini-faq");
  initAccordionScope(".page-faq");
  initFaqSearch();
  initPricingToggle();
  initPricingCtas();
  initContactForm();
  initLoginForm();
})();
