/* =========================================================

   RESEARCH AI — VANILLA JAVASCRIPT

========================================================= */


/* =========================================================

   SAMPLE RESEARCH RESOURCES

========================================================= */

const resources = [


    {

        title: "The Impact of Generative AI on Higher Education",

        description:
            "An overview of how generative AI is transforming teaching, assessment, learning and academic research.",

        category: "AI",

        type: "Research Paper",

        year: "2026"

    },


    {

        title: "Large Language Models for Scientific Discovery",

        description:
            "Exploring how large language models can assist researchers with literature review, hypothesis generation and analysis.",

        category: "AI",

        type: "Research Paper",

        year: "2026"

    },


    {

        title: "The Future of Human-AI Collaboration",

        description:
            "A study examining how AI systems and humans can collaborate to improve knowledge work and decision making.",

        category: "Technology",

        type: "Research Report",

        year: "2025"

    },


    {

        title: "AI-Assisted Learning in Universities",

        description:
            "Research into personalized learning systems and the role of artificial intelligence in higher education.",

        category: "Education",

        type: "Journal Article",

        year: "2025"

    },


    {

        title: "Machine Learning for Climate Research",

        description:
            "An introduction to modern machine learning approaches used to analyze climate and environmental datasets.",

        category: "Technology",

        type: "Research Paper",

        year: "2025"

    },


    {

        title: "Responsible AI in Academic Research",

        description:
            "Understanding transparency, reproducibility, bias and ethical considerations when using AI in research.",

        category: "AI",

        type: "Research Report",

        year: "2026"

    },


    {

        title: "Personalized Education with Artificial Intelligence",

        description:
            "How adaptive AI systems can personalize educational content according to student needs.",

        category: "Education",

        type: "Journal Article",

        year: "2024"

    },


    {

        title: "The Evolution of Digital Research Workflows",

        description:
            "How researchers are moving from traditional workflows toward AI-assisted discovery and analysis.",

        category: "Technology",

        type: "Research Report",

        year: "2025"

    },


    {

        title: "Generative AI and Scientific Writing",

        description:
            "Examining opportunities and challenges associated with using AI tools during scientific writing.",

        category: "AI",

        type: "Research Paper",

        year: "2026"

    }

];



/* =========================================================

   RESOURCE ELEMENTS

========================================================= */

const resourceGrid =
    document.getElementById("resourceGrid");


const resourceSearch =
    document.getElementById("resourceSearch");


const filterButtons =
    document.querySelectorAll(".filter-button");


let currentCategory = "All";



/* =========================================================

   RENDER RESOURCES

========================================================= */

function renderResources() {

    if (!resourceGrid || !resourceSearch) return;

    const searchTerm =
        resourceSearch.value
            .toLowerCase()
            .trim();


    const filteredResources =
        resources.filter(resource => {


            const matchesCategory =
                currentCategory === "All" ||
                resource.category === currentCategory;


            const matchesSearch =
                resource.title
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                resource.description
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                resource.category
                    .toLowerCase()
                    .includes(searchTerm);


            return matchesCategory && matchesSearch;

        });


    resourceGrid.innerHTML = "";


    if (filteredResources.length === 0) {


        resourceGrid.innerHTML = `

            <div class="resource-card">

                <h3>
                    No resources found
                </h3>

                <p>
                    Try another search term or category.
                </p>

            </div>

        `;

        return;

    }


    filteredResources.forEach(resource => {


        const card =
            document.createElement("article");


        card.className =
            "resource-card";


        card.innerHTML = `

            <span class="resource-category">
                ${resource.category}
            </span>

            <h3>
                ${resource.title}
            </h3>

            <p>
                ${resource.description}
            </p>

            <div class="resource-meta">

                <span>
                    ${resource.type}
                </span>

                <span>
                    ${resource.year}
                </span>

            </div>

        `;


        resourceGrid.appendChild(card);

    });

}


/* =========================================================

   RESOURCE SEARCH

========================================================= */

resourceSearch?.addEventListener(

    "input",

    renderResources

);


/* =========================================================

   RESOURCE FILTERS

========================================================= */

filterButtons.forEach(button => {


    button.addEventListener(

        "click",

        () => {


            filterButtons.forEach(btn => {

                btn.classList.remove("active");

            });


            button.classList.add("active");


            currentCategory =
                button.dataset.category;


            if (resourceGrid && resourceSearch) {
                renderResources();
            }


        }

    );

});



/* =========================================================

   MOBILE MENU

========================================================= */

const mobileMenu =
    document.getElementById("mobileMenu");


const mobileNavigation =
    document.getElementById("mobileNavigation");


mobileMenu.addEventListener(

    "click",

    () => {

        mobileNavigation.classList.toggle("show");

    }

);


/* =========================================================

   CLOSE MOBILE MENU WHEN LINK IS CLICKED

========================================================= */

document

    .querySelectorAll(".mobile-navigation a")

    .forEach(link => {


        link.addEventListener(

            "click",

            () => {

                mobileNavigation.classList.remove(
                    "show"
                );

            }

        );

    });



/* =========================================================

   SEARCH MODAL

========================================================= */

const searchModal =
    document.getElementById("searchModal");


const openSearch =
    document.getElementById("openSearch");


const closeSearch =
    document.getElementById("closeSearch");


openSearch?.addEventListener(

    "click",

    () => {


        searchModal.classList.add("show");


        setTimeout(() => {


            document

                .getElementById("globalSearch")

                .focus();


        }, 100);


    }

);


closeSearch?.addEventListener(

    "click",

    () => {


        searchModal.classList.remove("show");


    }

);



/* =========================================================

   SIGN IN MODAL

========================================================= */

const signInModal =
    document.getElementById("signInModal");


const signInBtn =
    document.getElementById("signInBtn");


const closeSignIn =
    document.getElementById("closeSignIn");


signInBtn?.addEventListener(

    "click",

    () => {


        signInModal.classList.add("show");


    }

);


closeSignIn?.addEventListener(

    "click",

    () => {


        signInModal.classList.remove("show");


    }

);



/* =========================================================

   START RESEARCH BUTTONS

========================================================= */

const startResearchBtn =
    document.getElementById("startResearchBtn");


const getStartedBtn =
    document.getElementById("getStartedBtn");


const mobileStart =
    document.getElementById("mobileStart");


function startResearch() {

    window.location.href = "solutions.html";

}


startResearchBtn?.addEventListener(

    "click",

    startResearch

);


getStartedBtn?.addEventListener(

    "click",

    startResearch

);


mobileStart?.addEventListener(

    "click",

    () => {


        mobileNavigation.classList.remove(
            "show"
        );


        startResearch();


    }

);



/* =========================================================

   WATCH VIDEO

========================================================= */

const videoModal =
    document.getElementById("videoModal");


const watchVideoBtn =
    document.getElementById("watchVideoBtn");


const closeVideo =
    document.getElementById("closeVideo");


watchVideoBtn?.addEventListener(

    "click",

    () => {


        videoModal.classList.add("show");


    }

);


closeVideo?.addEventListener(

    "click",

    () => {


        videoModal.classList.remove("show");


    }

);



/* =========================================================

   RESEARCH SEARCH

========================================================= */

const researchInput =
    document.getElementById("researchInput");


const researchSearchBtn =
    document.getElementById("researchSearchBtn");


researchSearchBtn?.addEventListener(

    "click",

    () => {


        const query =
            researchInput.value.trim();


        if (!query) {


            researchInput.focus();


            return;

        }


        researchSearchBtn.textContent =
            "Researching...";


        setTimeout(() => {


            researchSearchBtn.textContent =
                "Research";


            alert(
                `Research started for:\n\n"${query}"`
            );


        }, 1000);


    }

);



/* =========================================================

   ENTER KEY FOR RESEARCH

========================================================= */

researchInput?.addEventListener(

    "keydown",

    event => {


        if (event.key === "Enter") {


            researchSearchBtn.click();


        }


    }

);



/* =========================================================

   CLOSE MODALS BY CLICKING OUTSIDE

========================================================= */

document

    .querySelectorAll(".modal-overlay")

    .forEach(modal => {


        modal.addEventListener(

            "click",

            event => {


                if (event.target === modal) {


                    modal.classList.remove(
                        "show"
                    );


                }


            }

        );


    });



/* =========================================================

   ESC KEY

========================================================= */

document.addEventListener(

    "keydown",

    event => {


        if (event.key === "Escape") {


            document

                .querySelectorAll(".modal-overlay")

                .forEach(modal => {


                    modal.classList.remove(
                        "show"
                    );


                });


            mobileNavigation.classList.remove(
                "show"
            );


        }


    }

);



/* =========================================================

   ACTIVE NAVIGATION ON SCROLL

========================================================= */

const sections =
    document.querySelectorAll(
        "main section[id]"
    );


const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


window.addEventListener(

    "scroll",

    () => {


        if (sections.length === 0) return;

        if (!document.querySelector('.nav-link[href^="#"]')) return;

        let current = "home";


        sections.forEach(section => {


            const sectionTop =
                section.offsetTop - 180;


            if (

                window.scrollY >=
                sectionTop

            ) {


                current =
                    section.getAttribute("id");


            }


        });


        navLinks.forEach(link => {


            link.classList.remove(
                "active"
            );


            const href =
                link.getAttribute("href");


            if (

                href === "#" + current

            ) {


                link.classList.add(
                    "active"
                );


            }


        });


    }

);



/* =========================================================

   INITIALIZE

========================================================= */

if (resourceGrid && resourceSearch) {

    renderResources();

}
/* =========================================================
   RESEARCH AI — AUTOMATIC TEXT ANIMATION SYSTEM
   =========================================================
   
   IMPORTANT:
   This section automatically adds the animations.
   No HTML classes are required.
   
   Nothing else in the application is modified.
   ========================================================= */


/* ---------------------------------------------------------
   ELEMENT SAFETY CHECK
   --------------------------------------------------------- */

function shouldSkipAnimation(element) {

    if (!element) {
        return true;
    }


    /*
       Never animate navigation,
       buttons, inputs or controls.
    */

    if (
        element.closest(
            "nav, header, footer, button, a, input, textarea, select, option"
        )
    ) {
        return true;
    }


    /*
       Never animate the existing animation
       elements twice.
    */

    if (
        element.classList.contains("auto-word-reveal") ||
        element.classList.contains("auto-scroll-reveal") ||
        element.classList.contains("auto-ai-label")
    ) {
        return true;
    }


    /*
       Never animate hidden elements.
    */

    if (
        element.hidden ||
        element.getAttribute("aria-hidden") === "true"
    ) {
        return true;
    }


    return false;
}


/* ---------------------------------------------------------
   1. AUTOMATIC WORD-BY-WORD HEADINGS
   --------------------------------------------------------- */

function setupAutomaticWordReveal() {

    const headings =
        document.querySelectorAll(
            "main h1, main h2"
        );


    headings.forEach(function (heading) {

        if (shouldSkipAnimation(heading)) {
            return;
        }


        /*
           Do not destroy headings that contain
           important nested elements such as
           colored spans.
        */

        const childElements =
            heading.querySelectorAll(
                ":scope > span, :scope > em, :scope > strong"
            );


        /*
           If the heading contains styled child
           elements, animate the direct text nodes
           without removing the children.
        */

        if (childElements.length > 0) {

            heading.classList.add(
                "auto-word-reveal"
            );


            childElements.forEach(function (child) {

                const childText =
                    child.textContent.trim();


                if (!childText) {
                    return;
                }


                child.textContent = "";


                childText
                    .split(/\s+/)
                    .forEach(function (word, index) {

                        const span =
                            document.createElement("span");


                        span.className =
                            "auto-reveal-word";


                        span.textContent =
                            word;


                        span.style.setProperty(
                            "--auto-word-delay",
                            `${index * 0.08}s`
                        );


                        child.appendChild(span);


                        if (
                            index <
                            childText.split(/\s+/).length - 1
                        ) {

                            child.appendChild(
                                document.createTextNode(" ")
                            );

                        }

                    });

            });


            return;
        }


        /*
           Normal heading:
           safely preserve its text.
        */

        const text =
            heading.textContent.trim();


        if (!text) {
            return;
        }


        heading.textContent = "";

        heading.classList.add(
            "auto-word-reveal"
        );


        const words =
            text.split(/\s+/);


        words.forEach(function (word, index) {

            const span =
                document.createElement("span");


            span.className =
                "auto-reveal-word";


            span.textContent =
                word;


            span.style.setProperty(
                "--auto-word-delay",
                `${index * 0.08}s`
            );


            heading.appendChild(span);


            if (index < words.length - 1) {

                heading.appendChild(
                    document.createTextNode(" ")
                );

            }

        });

    });

}


/* ---------------------------------------------------------
   2. AUTOMATIC AI LABELS
   --------------------------------------------------------- */

function setupAutomaticAILabels() {

    const labels =
        document.querySelectorAll(
            "main .small-label, \
             main .result-type, \
             main .resource-category, \
             main .modal-label, \
             main .plan-name, \
             main .section-heading > span"
        );


    labels.forEach(function (label) {

        if (shouldSkipAnimation(label)) {
            return;
        }


        label.classList.add(
            "auto-ai-label"
        );

    });

}


/* ---------------------------------------------------------
   3. AUTOMATIC SCROLL REVEAL
   --------------------------------------------------------- */

function setupAutomaticScrollReveal() {

    const elements =
        document.querySelectorAll(
            "main p, \
             main .feature-card, \
             main .result-card, \
             main .resource-card, \
             main .pricing-card, \
             main .workspace-top, \
             main .workspace-results, \
             main .section-heading"
        );


    let staggerIndex = 0;


    elements.forEach(function (element) {

        if (shouldSkipAnimation(element)) {
            return;
        }


        /*
           Do not reveal tiny pieces of text
           individually if they are inside
           another animated element.
        */

        if (
            element.closest(
                ".auto-scroll-reveal"
            )
        ) {
            return;
        }


        element.classList.add(
            "auto-scroll-reveal"
        );


        /*
           Add subtle stagger only to cards.
        */

        if (
            element.classList.contains("feature-card") ||
            element.classList.contains("result-card") ||
            element.classList.contains("resource-card") ||
            element.classList.contains("pricing-card")
        ) {

            staggerIndex =
                staggerIndex % 5 + 1;


            element.classList.add(
                "auto-stagger-" + staggerIndex
            );

        }

    });


    /*
       Fallback for browsers that do not
       support IntersectionObserver.
    */

    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(function (element) {

            element.classList.add(
                "auto-visible"
            );

        });

        return;
    }


    const observer =
        new IntersectionObserver(

            function (entries) {

                entries.forEach(function (entry) {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "auto-visible"
                        );


                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -40px 0px"
            }

        );


    elements.forEach(function (element) {

        observer.observe(element);

    });

}


/* ---------------------------------------------------------
   INITIALIZE AUTOMATIC ANIMATIONS
   --------------------------------------------------------- */

function initializeResearchAnimations() {

    setupAutomaticWordReveal();

    setupAutomaticAILabels();

    setupAutomaticScrollReveal();

}


/* ---------------------------------------------------------
   DOM READY
   --------------------------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeResearchAnimations();

    }
);
/* =========================================
   PROFILE + SETTINGS NAVIGATION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const profileButton =
        document.getElementById("profileButton");

    const profilePage =
        document.getElementById("profilePage");

    const settingsPage =
        document.getElementById("settingsPage");


    /*
     * Profile button
     */

    if (profileButton && profilePage) {

        profileButton.addEventListener("click", function () {

            document.querySelectorAll(".account-page")
                .forEach(function (page) {
                    page.classList.remove("active");
                });

            profilePage.classList.add("active");

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }




    /*
     * Save settings button
     */

    const saveButton =
        document.querySelector(".save-settings-btn");

    if (saveButton) {

        saveButton.addEventListener("click", function () {

            const originalText =
                saveButton.textContent;

            saveButton.textContent =
                "Saved ✓";

            setTimeout(function () {

                saveButton.textContent =
                    originalText;

            }, 1800);

        });

    }


    /*
     * Edit profile button
     */

    const editProfileButton =
        document.getElementById("editProfileBtn");

    if (editProfileButton) {

        editProfileButton.addEventListener("click", function () {

            const name =
                prompt(
                    "Enter your name:",
                    "Alex Morgan"
                );

            if (name && name.trim() !== "") {

                const profileName =
                    document.querySelector(
                        "#profilePage .account-header h1"
                    );

                const nameRow =
                    document.querySelector(
                        "#profilePage .profile-row strong"
                    );

                if (profileName) {
                    profileName.textContent =
                        name.trim();
                }

                if (nameRow) {
                    nameRow.textContent =
                        name.trim();
                }

                /*
                 * Update avatar initials
                 */

                const initials =
                    name
                        .trim()
                        .split(/\s+/)
                        .map(function (word) {
                            return word[0];
                        })
                        .slice(0, 2)
                        .join("")
                        .toUpperCase();

                const avatar =
                    document.querySelector(
                        "#profileButton span"
                    );

                const largeAvatar =
                    document.querySelector(
                        ".large-profile-avatar"
                    );

                if (avatar) {
                    avatar.textContent =
                        initials;
                }

                if (largeAvatar) {
                    largeAvatar.textContent =
                        initials;
                }

            }

        });

    }

});
/* =========================================================
   RESEARCHAI THEME SWITCHER
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const themeButtons =
        document.querySelectorAll(".theme-option");

    if (!themeButtons.length) {
        return;
    }


    /* -----------------------------------------------------
       Apply a theme
    ----------------------------------------------------- */

    function applyTheme(theme) {

        document.body.classList.remove(
            "theme-dark",
            "theme-midnight",
            "theme-system"
        );

        document.body.classList.add(
            "theme-" + theme
        );


        /* Update active button */

        themeButtons.forEach(function (button) {

            const buttonTheme =
                button
                    .querySelector("strong")
                    .textContent
                    .trim()
                    .toLowerCase();

            button.classList.toggle(
                "active",
                buttonTheme === theme
            );

        });


        /* Save theme */

        localStorage.setItem(
            "researchAITheme",
            theme
        );

    }


    /* -----------------------------------------------------
       Theme button clicks
    ----------------------------------------------------- */

    themeButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const theme =
                button
                    .querySelector("strong")
                    .textContent
                    .trim()
                    .toLowerCase();

            applyTheme(theme);

        });

    });


    /* -----------------------------------------------------
       Load saved theme
    ----------------------------------------------------- */

    const savedTheme =
        localStorage.getItem("researchAITheme");


    if (
        savedTheme === "dark" ||
        savedTheme === "midnight" ||
        savedTheme === "system"
    ) {

        applyTheme(savedTheme);

    } else {

        /* Default theme */

        applyTheme("dark");

    }

});

/* =========================================
   SETTINGS TEXT REVEAL
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const settingsRevealElements =
        document.querySelectorAll(".settings-reveal");

    if (!settingsRevealElements.length) {
        return;
    }

    const settingsRevealObserver =
        new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "settings-visible"
                        );

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.15
            }
        );

    settingsRevealElements.forEach(function (element) {

        settingsRevealObserver.observe(element);

    });

});