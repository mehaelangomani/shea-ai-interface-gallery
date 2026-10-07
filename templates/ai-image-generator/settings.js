/* =========================================================
   AI IMAG
   SETTINGS JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       USER
    ===================================================== */

    const user =
        JSON.parse(
            localStorage.getItem("aiImagUser")
        ) || {

            name: "AI Imag User",

            email: "user@example.com",

            loggedIn: false

        };


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const menuItems =
        document.querySelectorAll(
            ".settings-menu-item"
        );

    const sections =
        document.querySelectorAll(
            ".settings-section"
        );

    const profileInitial =
        document.getElementById(
            "profileInitial"
        );

    const profileDisplayName =
        document.getElementById(
            "profileDisplayName"
        );

    const profileDisplayEmail =
        document.getElementById(
            "profileDisplayEmail"
        );

    const displayName =
        document.getElementById(
            "displayName"
        );

    const displayEmail =
        document.getElementById(
            "displayEmail"
        );

    const toast =
        document.getElementById(
            "settingsToast"
        );


    /* =====================================================
       LOAD USER
    ===================================================== */

    function loadUser() {

        const name =
            user.name || "AI Imag User";

        const email =
            user.email || "user@example.com";


        profileDisplayName.textContent =
            name;

        profileDisplayEmail.textContent =
            email;

        displayName.value =
            name;

        displayEmail.value =
            email;


        profileInitial.textContent =
            name
                .trim()
                .charAt(0)
                .toUpperCase();

    }


    loadUser();


    /* =====================================================
       SETTINGS NAVIGATION
    ===================================================== */

    menuItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const target =
                    item.dataset.target;


                menuItems.forEach(
                    menuItem => {

                        menuItem.classList.remove(
                            "active"
                        );

                    }
                );


                sections.forEach(
                    section => {

                        section.classList.remove(
                            "active"
                        );

                    }
                );


                item.classList.add(
                    "active"
                );


                const targetSection =
                    document.getElementById(
                        target
                    );


                if (targetSection) {

                    targetSection.classList.add(
                        "active"
                    );

                }

            }
        );

    });


    /* =====================================================
       TOAST
    ===================================================== */

    let toastTimer;


    function showToast(message) {

        toast.querySelector(
            "span"
        ).textContent = message;


        toast.classList.add(
            "show"
        );


        clearTimeout(
            toastTimer
        );


        toastTimer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 2200);

    }


    /* =====================================================
       PROFILE
    ===================================================== */

    document
        .getElementById("saveProfile")
        .addEventListener(
            "click",
            () => {

                const name =
                    displayName.value.trim();

                const email =
                    displayEmail.value.trim();


                if (!name || !email) {

                    showToast(
                        "Please complete your profile."
                    );

                    return;
                }


                user.name =
                    name;

                user.email =
                    email;


                localStorage.setItem(
                    "aiImagUser",
                    JSON.stringify(user)
                );


                loadUser();


                showToast(
                    "Profile updated."
                );

            }
        );


    /* =====================================================
       GENERATION SETTINGS
    ===================================================== */

    const generationControls = {

        style:
            document.getElementById(
                "defaultStyle"
            ),

        ratio:
            document.getElementById(
                "defaultRatio"
            ),

        quantity:
            document.getElementById(
                "defaultQuantity"
            ),

        quality:
            document.getElementById(
                "defaultQuality"
            )

    };


    const savedGeneration =
        JSON.parse(
            localStorage.getItem(
                "aiImagGenerationSettings"
            )
        );


    if (savedGeneration) {

        if (savedGeneration.style)
            generationControls.style.value =
                savedGeneration.style;

        if (savedGeneration.ratio)
            generationControls.ratio.value =
                savedGeneration.ratio;

        if (savedGeneration.quantity)
            generationControls.quantity.value =
                savedGeneration.quantity;

        if (savedGeneration.quality)
            generationControls.quality.value =
                savedGeneration.quality;

    }


    document
        .getElementById("saveGeneration")
        .addEventListener(
            "click",
            () => {

                const settings = {

                    style:
                        generationControls.style.value,

                    ratio:
                        generationControls.ratio.value,

                    quantity:
                        generationControls.quantity.value,

                    quality:
                        generationControls.quality.value

                };


                localStorage.setItem(
                    "aiImagGenerationSettings",
                    JSON.stringify(settings)
                );


                /*
                    Also save these as generator
                    defaults so the main page can
                    use them later.
                */

                localStorage.setItem(
                    "aiImagDefaultStyle",
                    settings.style
                );

                localStorage.setItem(
                    "aiImagDefaultRatio",
                    settings.ratio
                );

                localStorage.setItem(
                    "aiImagDefaultQuantity",
                    settings.quantity
                );

                localStorage.setItem(
                    "aiImagDefaultQuality",
                    settings.quality
                );


                showToast(
                    "Generation defaults saved."
                );

            }
        );


    /* =====================================================
       TOGGLE SETTINGS
    ===================================================== */

    const toggleIds = [

        "animationsToggle",

        "generationNotification",

        "productNotification",

        "emailNotification",

        "historyToggle",

        "publicProfile"

    ];


    toggleIds.forEach(id => {

        const element =
            document.getElementById(id);

        if (!element) return;


        const saved =
            localStorage.getItem(
                "aiImag_" + id
            );


        if (saved !== null) {

            element.checked =
                saved === "true";

        }


        element.addEventListener(
            "change",
            () => {

                localStorage.setItem(
                    "aiImag_" + id,
                    element.checked
                );


                showToast(
                    "Preference updated."
                );

            }
        );

    });


    /* =====================================================
       SIGN OUT
    ===================================================== */

    function signOut() {

        localStorage.removeItem(
            "aiImagUser"
        );

        localStorage.removeItem(
            "aiImagSignupIntent"
        );


        window.location.href =
            "login.html";

    }


    document
        .getElementById("sidebarSignOut")
        .addEventListener(
            "click",
            signOut
        );


    document
        .getElementById("accountSignOut")
        .addEventListener(
            "click",
            signOut
        );


    /* =====================================================
       DELETE ACCOUNT
    ===================================================== */

    document
        .getElementById("deleteAccount")
        .addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "Delete your local AI Imag account data?"
                    );


                if (!confirmed) return;


                /*
                    Remove locally stored account
                    and preference information.
                */

                const keysToRemove = [

                    "aiImagUser",

                    "aiImagRememberedEmail",

                    "aiImagGenerationSettings",

                    "aiImagDefaultStyle",

                    "aiImagDefaultRatio",

                    "aiImagDefaultQuantity",

                    "aiImagDefaultQuality",

                    "aiImagSignupIntent",

                    "aiImag_animationsToggle",

                    "aiImag_generationNotification",

                    "aiImag_productNotification",

                    "aiImag_emailNotification",

                    "aiImag_historyToggle",

                    "aiImag_publicProfile"

                ];


                keysToRemove.forEach(
                    key => {

                        localStorage.removeItem(
                            key
                        );

                    }
                );


                window.location.href =
                    "login.html";

            }
        );

});