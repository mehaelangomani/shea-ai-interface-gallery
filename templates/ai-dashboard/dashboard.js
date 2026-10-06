/* ============================================
   NEXUS AI — DASHBOARD
   Pure JavaScript
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {

  const navItems = document.querySelectorAll(".nav-item[data-page]");
  const pages = document.querySelectorAll(".page");

  const promptInput = document.getElementById("promptInput");
  const sendBtn = document.getElementById("sendBtn");
  const newChatBtn = document.getElementById("newChatBtn");

  const toast = document.getElementById("toast");


  /* --------------------------------------------
     PAGE NAVIGATION
     -------------------------------------------- */

  function showPage(pageName) {

    pages.forEach(page => {
      page.classList.remove("active-page");
    });

    const target = document.getElementById(pageName);

    if (target) {
      target.classList.add("active-page");
    }

    navItems.forEach(item => {

      item.classList.toggle(
        "active",
        item.dataset.page === pageName
      );

    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  navItems.forEach(item => {

    item.addEventListener("click", () => {

      showPage(item.dataset.page);

    });

  });


  /* --------------------------------------------
     NEW CHAT
     -------------------------------------------- */

  newChatBtn.addEventListener("click", () => {

    showPage("home");

    setTimeout(() => {

      promptInput.focus();

    }, 400);

  });


  /* --------------------------------------------
     QUICK ACTIONS
     -------------------------------------------- */

  const actionCards =
    document.querySelectorAll(".action-card");

  actionCards.forEach(card => {

    card.addEventListener("click", () => {

      const action = card.dataset.action;

      if (action === "chat") {

        showPage("home");

        setTimeout(() => {

          promptInput.focus();

        }, 350);

      }

      if (action === "research") {

        showPage("research");

      }

      if (action === "create") {

        showPage("create");

      }

      if (action === "build") {

        showPage("home");

        promptInput.value =
          "I want to build a new project.";

        setTimeout(() => {

          promptInput.focus();

        }, 350);

      }

    });

  });


  /* --------------------------------------------
     SEND PROMPT
     -------------------------------------------- */

  sendBtn.addEventListener("click", () => {

    const prompt =
      promptInput.value.trim();

    if (!prompt) {

      showToast(
        "Tell Nexus AI what you want to build."
      );

      promptInput.focus();

      return;

    }

    showToast(
      "Your request has been added to the workspace."
    );

    promptInput.value = "";

  });


  /* --------------------------------------------
     ENTER TO SEND
     -------------------------------------------- */

  promptInput.addEventListener("keydown", event => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendBtn.click();

    }

  });


  /* --------------------------------------------
     SEARCH
     -------------------------------------------- */

  const searchBtn =
    document.getElementById("searchBtn");

  searchBtn.addEventListener("click", () => {

    showToast(
      "Workspace search is ready."
    );

  });


  /* --------------------------------------------
     NOTIFICATIONS
     -------------------------------------------- */

  const notificationBtn =
    document.getElementById("notificationBtn");

  notificationBtn.addEventListener("click", () => {

    showToast(
      "You're all caught up."
    );

  });


  /* --------------------------------------------
     ATTACH
     -------------------------------------------- */

  const attachBtn =
    document.getElementById("attachBtn");

  attachBtn.addEventListener("click", () => {

    const input =
      document.createElement("input");

    input.type = "file";

    input.multiple = true;

    input.click();

    input.addEventListener("change", () => {

      if (input.files.length) {

        showToast(
          `${input.files.length} file${
            input.files.length > 1
              ? "s"
              : ""
          } attached.`
        );

      }

    });

  });


  /* --------------------------------------------
     RESEARCH
     -------------------------------------------- */

  const researchBtn =
    document.getElementById("researchBtn");

  const researchInput =
    document.getElementById("researchInput");

  if (researchBtn) {

    researchBtn.addEventListener(
      "click",
      () => {

        const value =
          researchInput.value.trim();

        if (!value) {

          showToast(
            "Enter something to research."
          );

          researchInput.focus();

          return;

        }

        showToast(
          `Research started for "${value}".`
        );

      }
    );

  }


  /* --------------------------------------------
     CREATE TOOLS
     -------------------------------------------- */

  document
    .querySelectorAll(".tool-card")
    .forEach(card => {

      card.addEventListener("click", () => {

        showToast(
          "Creation workspace selected."
        );

      });

    });


  /* --------------------------------------------
     PROJECT
     -------------------------------------------- */

  const addProject =
    document.querySelector(".add-project");

  if (addProject) {

    addProject.addEventListener("click", () => {

      showToast(
        "New project creation coming next."
      );

    });

  }


  /* --------------------------------------------
     UPGRADE
     -------------------------------------------- */

  const upgradeProBtn =
    document.getElementById("upgradeProBtn");

  if (upgradeProBtn) {

    upgradeProBtn.addEventListener("click", () => {

      window.location.href = "pricing.html";

    });

  }
const upgradeBtn =
  document.getElementById("upgradeBtn");

if (upgradeBtn) {
  upgradeBtn.addEventListener("click", () => {
    window.location.href = "pricing.html";
  });
}s

  /* --------------------------------------------
     VIEW ALL
     -------------------------------------------- */

  document
    .getElementById("viewAllBtn")
    .addEventListener("click", () => {

      showPage("chats");

    });


  /* --------------------------------------------
     TOAST
     -------------------------------------------- */

  let toastTimer;

  function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

      toast.classList.remove("show");

    }, 2800);

  }


  /* --------------------------------------------
     BUTTON MICRO-INTERACTION
     -------------------------------------------- */

  document
    .querySelectorAll("button")
    .forEach(button => {

      button.addEventListener(
        "mousedown",
        () => {

          button.style.transform =
            "scale(.97)";

        }
      );

      button.addEventListener(
        "mouseup",
        () => {

          button.style.transform = "";

        }
      );

      button.addEventListener(
        "mouseleave",
        () => {

          button.style.transform = "";

        }
      );

    });


  /* --------------------------------------------
     FLOATING MOUSE PARALLAX
     -------------------------------------------- */

  const floatingCards =
    document.querySelectorAll(
      ".action-card, .recent-card"
    );

  document.addEventListener(
    "mousemove",
    event => {

      if (window.innerWidth < 900) return;

      const x =
        (event.clientX / window.innerWidth - .5);

      const y =
        (event.clientY / window.innerHeight - .5);

      floatingCards.forEach((card, index) => {

        const strength =
          (index % 3 + 1) * 1.2;

        card.style.setProperty(
          "--mx",
          `${x * strength}px`
        );

        card.style.setProperty(
          "--my",
          `${y * strength}px`
        );

      });

    }
  );


  /* --------------------------------------------
     INITIAL STATE
     -------------------------------------------- */

  showPage("home");

});


/* =========================================
   SETTINGS SUB-PAGE NAVIGATION
   ========================================= */

document.querySelectorAll(".settings-link").forEach(card => {

  card.addEventListener("click", () => {

    const targetId = card.dataset.settingsPage;

    document.querySelectorAll(".page").forEach(page => {
      page.classList.remove("active-page");
    });

    document.querySelectorAll(".nav-item").forEach(item => {
      item.classList.remove("active");
    });

    const targetPage =
      document.getElementById(targetId);

    if (targetPage) {
      targetPage.classList.add("active-page");
    }

  });

});


/* -----------------------------------------
   BACK TO SETTINGS
   ----------------------------------------- */

document
  .querySelectorAll("[data-back-settings]")
  .forEach(button => {

    button.addEventListener("click", () => {

      document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
      });

      document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
      });

      const settingsPage =
        document.getElementById("settings");

      const settingsNav =
        document.querySelector(
          '.nav-item[data-page="settings"]'
        );

      if (settingsPage) {
        settingsPage.classList.add("active-page");
      }

      if (settingsNav) {
        settingsNav.classList.add("active");
      }

    });

  });


/* =========================================
   APPEARANCE SETTINGS
   ========================================= */

const darkThemeToggle =
  document.getElementById("darkThemeToggle");

const glassToggle =
  document.getElementById("glassToggle");

const motionToggle =
  document.getElementById("motionToggle");


/* -----------------------------------------
   DARK / LIGHT THEME
   ----------------------------------------- */

if (darkThemeToggle) {

  darkThemeToggle.addEventListener("change", () => {

    document.body.classList.toggle(
      "light-dashboard",
      !darkThemeToggle.checked
    );

  });

}


/* -----------------------------------------
   GLASS EFFECT
   ----------------------------------------- */

if (glassToggle) {

  glassToggle.addEventListener("change", () => {

    document.body.classList.toggle(
      "no-glass",
      !glassToggle.checked
    );

  });

}


/* -----------------------------------------
   MOTION EFFECTS
   ----------------------------------------- */

if (motionToggle) {

  motionToggle.addEventListener("change", () => {

    document.body.classList.toggle(
      "no-motion",
      !motionToggle.checked
    );

  });

}

// ===============================
// EDIT PROFILE - WORKING VERSION
// ===============================

document.addEventListener("DOMContentLoaded", function () {

  const editProfileBtn = document.getElementById("editProfileBtn");

  if (!editProfileBtn) {
    console.error("Edit Profile button not found.");
    return;
  }

  editProfileBtn.addEventListener("click", function () {

    // Remove existing modal if any
    const oldModal = document.getElementById("editProfileModal");
    if (oldModal) oldModal.remove();

    const modal = document.createElement("div");

    modal.id = "editProfileModal";

    modal.innerHTML = `
      <div style="
        position:fixed;
        inset:0;
        z-index:99999;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
        background:rgba(0,0,0,.65);
        backdrop-filter:blur(12px);
      ">

        <div style="
          width:100%;
          max-width:480px;
          background:#181b24;
          color:#f3f4f6;
          border:1px solid rgba(255,255,255,.12);
          border-radius:20px;
          padding:28px;
          box-shadow:0 30px 80px rgba(0,0,0,.45);
        ">

          <div style="
            display:flex;
            align-items:center;
            justify-content:space-between;
            margin-bottom:24px;
          ">

            <h2 style="
              margin:0;
              font-size:22px;
              color:#fff;
            ">
              Edit Profile
            </h2>

            <button
              id="closeEditProfileModal"
              type="button"
              style="
                width:34px;
                height:34px;
                border:0;
                border-radius:10px;
                background:rgba(255,255,255,.08);
                color:#fff;
                font-size:22px;
                cursor:pointer;
              "
            >
              ×
            </button>

          </div>

          <div style="margin-bottom:18px;">
            <label style="
              display:block;
              margin-bottom:7px;
              font-size:13px;
              font-weight:600;
              color:#c7cad4;
            ">
              Full Name
            </label>

            <input
              id="editProfileName"
              type="text"
              value="Meha"
              style="
                width:100%;
                padding:12px 14px;
                border-radius:10px;
                border:1px solid rgba(255,255,255,.12);
                background:#0f1117;
                color:#fff;
                outline:none;
                box-sizing:border-box;
              "
            >
          </div>

          <div style="margin-bottom:18px;">
            <label style="
              display:block;
              margin-bottom:7px;
              font-size:13px;
              font-weight:600;
              color:#c7cad4;
            ">
              Email Address
            </label>

            <input
              id="editProfileEmail"
              type="email"
              value="mehaelangomani22@gmail.com"
              style="
                width:100%;
                padding:12px 14px;
                border-radius:10px;
                border:1px solid rgba(255,255,255,.12);
                background:#0f1117;
                color:#fff;
                outline:none;
                box-sizing:border-box;
              "
            >
          </div>

          <div style="margin-bottom:24px;">
            <label style="
              display:block;
              margin-bottom:7px;
              font-size:13px;
              font-weight:600;
              color:#c7cad4;
            ">
              About
            </label>

            <textarea
              id="editProfileAbout"
              rows="4"
              placeholder="Tell us about yourself..."
              style="
                width:100%;
                padding:12px 14px;
                border-radius:10px;
                border:1px solid rgba(255,255,255,.12);
                background:#0f1117;
                color:#fff;
                outline:none;
                resize:vertical;
                box-sizing:border-box;
              "
            ></textarea>
          </div>

          <div style="
            display:flex;
            justify-content:flex-end;
            gap:10px;
          ">

            <button
              id="cancelEditProfile"
              type="button"
              style="
                padding:11px 18px;
                border-radius:10px;
                border:1px solid rgba(255,255,255,.12);
                background:rgba(255,255,255,.06);
                color:#fff;
                cursor:pointer;
              "
            >
              Cancel
            </button>

            <button
              id="saveEditProfile"
              type="button"
              style="
                padding:11px 20px;
                border-radius:10px;
                border:0;
                background:linear-gradient(135deg,#26384d,#7c5cfc);
                color:#fff;
                font-weight:600;
                cursor:pointer;
              "
            >
              Save Changes
            </button>

          </div>

        </div>

      </div>
    `;

    document.body.appendChild(modal);

    // Close button
    document
      .getElementById("closeEditProfileModal")
      .addEventListener("click", function () {
        modal.remove();
      });

    // Cancel button
    document
      .getElementById("cancelEditProfile")
      .addEventListener("click", function () {
        modal.remove();
      });

    // Save button
    document
      .getElementById("saveEditProfile")
      .addEventListener("click", function () {

        const name =
          document.getElementById("editProfileName").value.trim();

        const email =
          document.getElementById("editProfileEmail").value.trim();

        const about =
          document.getElementById("editProfileAbout").value.trim();

        if (!name || !email) {
          alert("Please enter your name and email.");
          return;
        }

        localStorage.setItem("nexusProfileName", name);
        localStorage.setItem("nexusProfileEmail", email);
        localStorage.setItem("nexusProfileAbout", about);

        alert("Profile updated successfully!");

        modal.remove();
      });

  });

});

// =====================================================
// PRIVACY & SECURITY ACTIONS
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

  // -------------------------------
  // MANAGE DATA CONTROLS
  // -------------------------------

  const manageDataBtn =
    document.getElementById("manageDataBtn");

  if (manageDataBtn) {

    manageDataBtn.addEventListener("click", function () {

      const modal = document.createElement("div");

      modal.className = "settings-action-modal";

      modal.innerHTML = `
        <div class="settings-action-backdrop">

          <div class="settings-action-card">

            <button
              class="settings-action-close"
              type="button"
            >
              ×
            </button>

            <div class="settings-action-eyebrow">
              PRIVACY & SECURITY
            </div>

            <h2>Data Controls</h2>

            <p>
              Control how your conversations and workspace
              data are handled.
            </p>

            <div class="settings-option">
              <div>
                <strong>Conversation history</strong>
                <span>
                  Keep conversations available in your workspace.
                </span>
              </div>

              <label class="action-switch">
                <input type="checkbox" checked>
                <span></span>
              </label>
            </div>

            <div class="settings-option">
              <div>
                <strong>Improve AI responses</strong>
                <span>
                  Allow anonymized usage data to improve the experience.
                </span>
              </div>

              <label class="action-switch">
                <input type="checkbox" checked>
                <span></span>
              </label>
            </div>

            <div class="settings-option">
              <div>
                <strong>Personalized suggestions</strong>
                <span>
                  Use workspace activity to improve recommendations.
                </span>
              </div>

              <label class="action-switch">
                <input type="checkbox" checked>
                <span></span>
              </label>
            </div>

            <button
              class="settings-action-save"
              type="button"
            >
              Save Preferences
            </button>

          </div>

        </div>
      `;

      document.body.appendChild(modal);

      requestAnimationFrame(() => {
        modal.classList.add("visible");
      });

      const closeModal = () => {
        modal.classList.remove("visible");

        setTimeout(() => {
          modal.remove();
        }, 250);
      };

      modal
        .querySelector(".settings-action-close")
        .addEventListener("click", closeModal);

      modal
        .querySelector(".settings-action-backdrop")
        .addEventListener("click", function (event) {

          if (event.target === this) {
            closeModal();
          }

        });

      modal
        .querySelector(".settings-action-save")
        .addEventListener("click", function () {

          closeModal();

          if (typeof showToast === "function") {
            showToast(
              "Data preferences updated successfully.",
              "success"
            );
          } else {
            alert("Data preferences updated successfully.");
          }

        });

    });

  }


  // -------------------------------
  // VIEW ACTIVE SESSIONS
  // -------------------------------

  const viewSessionsBtn =
    document.getElementById("viewSessionsBtn");

  if (viewSessionsBtn) {

    viewSessionsBtn.addEventListener("click", function () {

      const modal = document.createElement("div");

      modal.className = "settings-action-modal";

      modal.innerHTML = `
        <div class="settings-action-backdrop">

          <div class="settings-action-card">

            <button
              class="settings-action-close"
              type="button"
            >
              ×
            </button>

            <div class="settings-action-eyebrow">
              SECURITY
            </div>

            <h2>Active Sessions</h2>

            <p>
              Review devices currently signed into your account.
            </p>

            <div class="session-item">

              <div class="session-icon">
                ◉
              </div>

              <div class="session-info">
                <strong>Current browser</strong>
                <span>
                  Windows · Chrome · Current session
                </span>
              </div>

              <span class="session-current">
                Active
              </span>

            </div>

            <div class="session-item">

              <div class="session-icon">
                ◌
              </div>

              <div class="session-info">
                <strong>Desktop session</strong>
                <span>
                  Windows · Recently active
                </span>
              </div>

              <button
                class="session-revoke"
                type="button"
              >
                Revoke
              </button>

            </div>

            <button
              class="settings-action-save"
              type="button"
            >
              Done
            </button>

          </div>

        </div>
      `;

      document.body.appendChild(modal);

      requestAnimationFrame(() => {
        modal.classList.add("visible");
      });

      const closeModal = () => {
        modal.classList.remove("visible");

        setTimeout(() => {
          modal.remove();
        }, 250);
      };

      modal
        .querySelector(".settings-action-close")
        .addEventListener("click", closeModal);

      modal
        .querySelector(".settings-action-save")
        .addEventListener("click", closeModal);

      modal
        .querySelector(".settings-action-backdrop")
        .addEventListener("click", function (event) {

          if (event.target === this) {
            closeModal();
          }

        });

      const revokeBtn =
        modal.querySelector(".session-revoke");

      if (revokeBtn) {

        revokeBtn.addEventListener("click", function () {

          const session =
            revokeBtn.closest(".session-item");

          session.style.opacity = "0";
          session.style.transform = "translateX(20px)";

          setTimeout(() => {
            session.remove();
          }, 250);

          if (typeof showToast === "function") {
            showToast(
              "Session revoked.",
              "success"
            );
          }

        });

      }

    });

  }


  // -------------------------------
  // DELETE ACCOUNT
  // -------------------------------

  const deleteAccountBtn =
    document.getElementById("deleteAccountBtn");

  if (deleteAccountBtn) {

    deleteAccountBtn.addEventListener("click", function () {

      const modal = document.createElement("div");

      modal.className = "settings-action-modal";

      modal.innerHTML = `
        <div class="settings-action-backdrop">

          <div class="settings-action-card delete-card">

            <button
              class="settings-action-close"
              type="button"
            >
              ×
            </button>

            <div class="delete-warning">
              !
            </div>

            <div class="settings-action-eyebrow danger-text">
              DANGER ZONE
            </div>

            <h2>Delete your account?</h2>

            <p>
              This action will permanently remove your
              NexusAI account and workspace data.
            </p>

            <div class="delete-warning-box">
              <strong>This cannot be undone.</strong>
              <span>
                Your conversations, files and workspace
                information will be removed.
              </span>
            </div>

            <div class="delete-actions">

              <button
                class="delete-cancel"
                type="button"
              >
                Keep Account
              </button>

              <button
                class="delete-confirm"
                type="button"
              >
                Delete Account
              </button>

            </div>

          </div>

        </div>
      `;

      document.body.appendChild(modal);

      requestAnimationFrame(() => {
        modal.classList.add("visible");
      });

      const closeModal = () => {
        modal.classList.remove("visible");

        setTimeout(() => {
          modal.remove();
        }, 250);
      };

      modal
        .querySelector(".settings-action-close")
        .addEventListener("click", closeModal);

      modal
        .querySelector(".delete-cancel")
        .addEventListener("click", closeModal);

      modal
        .querySelector(".settings-action-backdrop")
        .addEventListener("click", function (event) {

          if (event.target === this) {
            closeModal();
          }

        });

      modal
        .querySelector(".delete-confirm")
        .addEventListener("click", function () {

          closeModal();

          if (typeof showToast === "function") {
            showToast(
              "Account deletion request submitted.",
              "success"
            );
          } else {
            alert("Account deletion request submitted.");
          }

        });

    });

  }

});

// =====================================================
// FILES & STORAGE ACTIONS
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

  // ===================================================
  // VIEW UPLOADED FILES
  // ===================================================

  const viewFilesBtn =
    document.getElementById("viewFilesBtn");

  if (viewFilesBtn) {

    viewFilesBtn.addEventListener("click", function () {

      const modal = document.createElement("div");

      modal.className = "storage-action-modal";

      modal.innerHTML = `
        <div class="storage-action-backdrop">

          <div class="storage-action-card">

            <button
              type="button"
              class="storage-action-close"
            >
              ×
            </button>

            <div class="storage-eyebrow">
              FILES & STORAGE
            </div>

            <h2>Uploaded files.</h2>

            <p class="storage-description">
              View and manage documents and assets in your workspace.
            </p>

            <div class="storage-summary">
              <div>
                <strong>3 files</strong>
                <span>1.2 GB used</span>
              </div>

              <div class="storage-summary-bar">
                <span></span>
              </div>
            </div>

            <div class="uploaded-file-list">

              <div class="uploaded-file">
                <div class="file-icon">PDF</div>

                <div class="file-info">
                  <strong>Research_Report.pdf</strong>
                  <span>428 MB · Uploaded recently</span>
                </div>

                <button
                  type="button"
                  class="file-action"
                  data-file="Research_Report.pdf"
                >
                  ⋯
                </button>
              </div>

              <div class="uploaded-file">
                <div class="file-icon">DOC</div>

                <div class="file-info">
                  <strong>Project_Document.docx</strong>
                  <span>312 MB · Uploaded yesterday</span>
                </div>

                <button
                  type="button"
                  class="file-action"
                  data-file="Project_Document.docx"
                >
                  ⋯
                </button>
              </div>

              <div class="uploaded-file">
                <div class="file-icon">ZIP</div>

                <div class="file-info">
                  <strong>Workspace_Assets.zip</strong>
                  <span>460 MB · Uploaded 3 days ago</span>
                </div>

                <button
                  type="button"
                  class="file-action"
                  data-file="Workspace_Assets.zip"
                >
                  ⋯
                </button>
              </div>

            </div>

            <button
              type="button"
              class="storage-done-btn"
            >
              Done
            </button>

          </div>

        </div>
      `;

      document.body.appendChild(modal);

      requestAnimationFrame(() => {
        modal.classList.add("visible");
      });

      const closeModal = () => {

        modal.classList.remove("visible");

        setTimeout(() => {
          modal.remove();
        }, 280);

      };

      modal
        .querySelector(".storage-action-close")
        .addEventListener("click", closeModal);

      modal
        .querySelector(".storage-done-btn")
        .addEventListener("click", closeModal);

      modal
        .querySelector(".storage-action-backdrop")
        .addEventListener("click", function (event) {

          if (event.target === this) {
            closeModal();
          }

        });

      // File action buttons
      modal
        .querySelectorAll(".file-action")
        .forEach(button => {

          button.addEventListener("click", function () {

            const fileName =
              this.dataset.file;

            if (typeof showToast === "function") {

              showToast(
                `${fileName} selected.`,
                "success"
              );

            } else {

              alert(`${fileName} selected.`);

            }

          });

        });

    });

  }


  // ===================================================
  // MANAGE FILE PREFERENCES
  // ===================================================

  const manageFilePreferencesBtn =
    document.getElementById("manageFilePreferencesBtn");

  if (manageFilePreferencesBtn) {

    manageFilePreferencesBtn.addEventListener(
      "click",
      function () {

        const modal = document.createElement("div");

        modal.className = "storage-action-modal";

        modal.innerHTML = `
          <div class="storage-action-backdrop">

            <div class="storage-action-card">

              <button
                type="button"
                class="storage-action-close"
              >
                ×
              </button>

              <div class="storage-eyebrow">
                FILES & STORAGE
              </div>

              <h2>File preferences.</h2>

              <p class="storage-description">
                Control how files are uploaded, stored and handled
                inside your workspace.
              </p>

              <div class="file-preference">

                <div>
                  <strong>Automatic file organization</strong>

                  <span>
                    Organize uploaded files by project automatically.
                  </span>
                </div>

                <label class="storage-switch">
                  <input
                    type="checkbox"
                    checked
                  >
                  <span></span>
                </label>

              </div>

              <div class="file-preference">

                <div>
                  <strong>Keep recent uploads</strong>

                  <span>
                    Keep recently uploaded files available for quick access.
                  </span>
                </div>

                <label class="storage-switch">
                  <input
                    type="checkbox"
                    checked
                  >
                  <span></span>
                </label>

              </div>

              <div class="file-preference">

                <div>
                  <strong>Compress large files</strong>

                  <span>
                    Automatically optimize large uploads to save storage.
                  </span>
                </div>

                <label class="storage-switch">
                  <input
                    type="checkbox"
                  >
                  <span></span>
                </label>

              </div>

              <button
                type="button"
                class="storage-save-btn"
              >
                Save Preferences
              </button>

            </div>

          </div>
        `;

        document.body.appendChild(modal);

        requestAnimationFrame(() => {
          modal.classList.add("visible");
        });

        const closeModal = () => {

          modal.classList.remove("visible");

          setTimeout(() => {
            modal.remove();
          }, 280);

        };

        modal
          .querySelector(".storage-action-close")
          .addEventListener("click", closeModal);

        modal
          .querySelector(".storage-action-backdrop")
          .addEventListener("click", function (event) {

            if (event.target === this) {
              closeModal();
            }

          });

        modal
          .querySelector(".storage-save-btn")
          .addEventListener("click", function () {

            closeModal();

            if (typeof showToast === "function") {

              showToast(
                "File preferences saved.",
                "success"
              );

            } else {

              alert("File preferences saved.");

            }

          });

      }
    );

  }

});