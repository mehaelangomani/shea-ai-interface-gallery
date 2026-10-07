/* =========================================================
   AI IMAG
   FRONTEND JAVASCRIPT
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const navbar = document.getElementById("navbar");

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

const gallery = document.getElementById("gallery");
const galleryCards = document.querySelectorAll(".gallery-card");

const searchInput = document.getElementById("gallerySearch");
const categories = document.querySelectorAll(".category");

const noResults = document.getElementById("noResults");

const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalCategory = document.getElementById("modalCategory");
const modalPrompt = document.getElementById("modalPrompt");

const modalClose = document.getElementById("modalClose");
const modalBackdrop = document.querySelector(".modal-backdrop");

const promptInput = document.getElementById("prompt");
const characterCount = document.getElementById("characterCount");

const generateButton = document.getElementById("generateButton");
const generationLoading = document.getElementById("generationLoading");
const generationResult = document.getElementById("generationResult");

const resultImage = document.getElementById("resultImage");
const resultPrompt = document.getElementById("resultPrompt");
const resultStyle = document.getElementById("resultStyle");
const resultRatio = document.getElementById("resultRatio");
const resultQuality = document.getElementById("resultQuality");

const resultFavorite = document.getElementById("resultFavorite");

const downloadButton = document.getElementById("downloadButton");
const regenerateButton = document.getElementById("regenerateButton");
const variationButton = document.getElementById("variationButton");

const toast = document.getElementById("toast");


/* =========================================================
   SAMPLE AI IMAGES
========================================================= */

const sampleImages = [

    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=90",

    "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=90",

    "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=1000&q=90",

    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=90",

    "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1000&q=90",

    "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1000&q=90"

];


/* =========================================================
   MOBILE MENU
========================================================= */

if (hamburger) {

    hamburger.addEventListener("click", () => {

        mobileMenu.classList.toggle("open");

        hamburger.classList.toggle("active");

    });

}


/* Close mobile menu when link is clicked */

document.querySelectorAll(".mobile-menu a").forEach(link => {

    link.addEventListener("click", () => {

        mobileMenu.classList.remove("open");

    });

});


/* =========================================================
   SMOOTH SCROLL
========================================================= */

function scrollToSection(sectionId) {

    const section = document.getElementById(sectionId);

    if (!section) return;

    const offset = 85;

    const position =
        section.getBoundingClientRect().top +
        window.scrollY -
        offset;

    window.scrollTo({

        top: position,

        behavior: "smooth"

    });

}


/* =========================================================
   NAVBAR SCROLL EFFECT
========================================================= */

window.addEventListener("scroll", () => {

    if (window.scrollY > 40) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections = document.querySelectorAll("section[id]");

const navLinks = document.querySelectorAll(".nav-link");


function updateActiveNavigation() {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 160;

        const sectionHeight =
            section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {

            currentSection = section.id;

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") === `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

}


window.addEventListener(
    "scroll",
    updateActiveNavigation
);


/* =========================================================
   GALLERY FILTERING
========================================================= */

let selectedCategory = "All";


categories.forEach(category => {

    category.addEventListener("click", () => {

        categories.forEach(item => {

            item.classList.remove("active");

        });


        category.classList.add("active");


        selectedCategory =
            category.dataset.category;


        filterGallery();

    });

});


/* =========================================================
   GALLERY SEARCH
========================================================= */

searchInput.addEventListener(
    "input",
    filterGallery
);


function filterGallery() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    let visibleCount = 0;


    galleryCards.forEach(card => {

        const category =
            card.dataset.category.toLowerCase();

        const title =
            card.dataset.title.toLowerCase();

        const prompt =
            card.dataset.prompt.toLowerCase();


        const matchesCategory =
            selectedCategory === "All" ||
            category === selectedCategory.toLowerCase();


        const matchesSearch =
            title.includes(searchTerm) ||
            prompt.includes(searchTerm) ||
            category.includes(searchTerm);


        if (matchesCategory && matchesSearch) {

            card.style.display = "";

            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });


    if (visibleCount === 0) {

        noResults.style.display = "block";

    } else {

        noResults.style.display = "none";

    }

}


/* =========================================================
   IMAGE MODAL
========================================================= */

galleryCards.forEach(card => {

    const openButton =
        card.querySelector(".gallery-open");

    const image =
        card.querySelector("img");

    const favoriteButton =
        card.querySelector(".favorite-btn");


    openButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            openImageModal(card);

        }
    );


    image.addEventListener(
        "click",
        () => {

            openImageModal(card);

        }
    );


    favoriteButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            toggleFavorite(favoriteButton);

        }
    );

});


function openImageModal(card) {

    const image =
        card.querySelector("img");

    const title =
        card.dataset.title;

    const category =
        card.dataset.category;

    const prompt =
        card.dataset.prompt;


    modalImage.src = image.src;

    modalImage.alt = title;

    modalTitle.textContent = title;

    modalCategory.textContent = category;

    modalPrompt.textContent = prompt;


    imageModal.classList.add("open");

    document.body.style.overflow = "hidden";

}


/* Close modal */

function closeModal() {

    imageModal.classList.remove("open");

    document.body.style.overflow = "";

}


modalClose.addEventListener(
    "click",
    closeModal
);


modalBackdrop.addEventListener(
    "click",
    closeModal
);


/* ESC key */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            imageModal.classList.contains("open")
        ) {

            closeModal();

        }

    }
);
function toggleFavorite(button) {

    button.classList.toggle("favorited");

    const icon =
        button.querySelector("i");

    if (button.classList.contains("favorited")) {

        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");

        showToast("Added to favorites.");

    } else {

        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");

        showToast("Removed from favorites.");

    }

}


/* Modal favorite */

document
    .getElementById("modalFavorite")
    .addEventListener("click", function () {

        const icon =
            this.querySelector("i");

        this.classList.toggle("active");

        if (this.classList.contains("active")) {

            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");

            showToast("Added to favorites.");

        } else {

            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");

            showToast("Removed from favorites.");

        }

    });


/* Generated result favorite */

resultFavorite.addEventListener("click", () => {

    const icon =
        resultFavorite.querySelector("i");

    resultFavorite.classList.toggle("active");

    if (resultFavorite.classList.contains("active")) {

        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");

        showToast("Generated image saved.");

    } else {

        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");

    }

});


/* =========================================================
   PROMPT CHARACTER COUNT
========================================================= */

promptInput.addEventListener("input", () => {

    const maxLength = 500;

    if (promptInput.value.length > maxLength) {

        promptInput.value =
            promptInput.value.substring(0, maxLength);

    }

    characterCount.textContent =
        `${promptInput.value.length} / ${maxLength}`;

});


/* =========================================================
   GENERATION
========================================================= */

generateButton.addEventListener(
    "click",
    () => {

        const prompt =
            promptInput.value.trim();


        /* Empty prompt */

        if (!prompt) {

    promptInput.focus();

    promptInput.style.borderColor = "#ff5c5c";

    showToast("Please add something to your prompt.");

    setTimeout(() => {
        promptInput.style.borderColor = "";
    }, 2000);

    return;
}


        startGeneration();

    }
);


function startGeneration() {

    const prompt =
        promptInput.value.trim();


    const style =
        document.getElementById("style").value;


    const ratio =
        document.getElementById("ratio").value;


    const quality =
        document.getElementById("quality").value;


    /* Hide previous result */

    generationResult.classList.remove("active");


    /* Show loading */

    generationLoading.classList.add("active");

    generateButton.disabled = true;

    generateButton.style.opacity = ".6";


    /* Simulated AI delay */

    setTimeout(() => {

        const randomImage =
            sampleImages[
                Math.floor(
                    Math.random() * sampleImages.length
                )
            ];


        resultImage.src = randomImage;

        resultPrompt.textContent = prompt;

        resultStyle.textContent = style;

        resultRatio.textContent = ratio;

        resultQuality.textContent = quality;


        generationLoading.classList.remove("active");

        generationResult.classList.add("active");


        generateButton.disabled = false;

        generateButton.style.opacity = "1";


        showToast(
            "Your image has been generated."
        );


    }, 1800);

}


/* =========================================================
   REGENERATE
========================================================= */

regenerateButton.addEventListener("click", () => {

    if (!promptInput.value.trim()) {

        showToast(
            "Create an image first."
        );

        return;

    }

    startGeneration();

});


/* =========================================================
   CREATE VARIATION
========================================================= */

variationButton.addEventListener("click", () => {

    if (!promptInput.value.trim()) {

        showToast(
            "Create an image first."
        );

        return;

    }


    generationResult.classList.remove("active");

    generationLoading.classList.add("active");


    setTimeout(() => {

        const currentImage =
            resultImage.src;


        let newImage =
            sampleImages[
                Math.floor(
                    Math.random() * sampleImages.length
                )
            ];


        /* Try to choose a different image */

        while (
            newImage === currentImage &&
            sampleImages.length > 1
        ) {

            newImage =
                sampleImages[
                    Math.floor(
                        Math.random() * sampleImages.length
                    )
                ];

        }


        resultImage.src = newImage;

        generationLoading.classList.remove("active");

        generationResult.classList.add("active");


        showToast(
            "New variation created."
        );


    }, 1500);

});


/* =========================================================
   DOWNLOAD SIMULATION
========================================================= */

downloadButton.addEventListener("click", () => {

    const imageURL =
        resultImage.src;


    if (!imageURL) {

        showToast(
            "Generate an image first."
        );

        return;

    }


    const link =
        document.createElement("a");


    link.href = imageURL;

    link.download =
        "ai-imag-generation.jpg";

    link.target = "_blank";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    showToast(
        "Download started."
    );

});


/* =========================================================
   MODAL DOWNLOAD
========================================================= */

document
    .getElementById("modalDownload")
    .addEventListener("click", () => {

        const link =
            document.createElement("a");


        link.href =
            modalImage.src;

        link.download =
            "ai-imag-gallery.jpg";

        link.target = "_blank";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);


        showToast(
            "Download started."
        );

    });


/* =========================================================
   DEMO MESSAGE
========================================================= */

function demoMessage() {

    showToast(
        "This is a demo template."
    );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(message) {

    const text =
        toast.querySelector(".toast-text");


    text.textContent = message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.15
        }
    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =========================================================
   PREMIUM WORD SCROLL ANIMATION
========================================================= */

(function () {

    const textSelectors = [

        ".hero h1",

        ".hero-description",

        ".section-heading h2",

        ".section-heading p",

        ".section-top h2",

        ".section-top p",

        ".about-content h2",

        ".about-content p",

        ".about-block h3",

        ".about-block p",

        ".feature-large h3",

        ".feature-large p",

        ".price-card h3",

        ".price-card > p",

        ".cta-section h2",

        ".cta-section p"

    ];


    const textElements =
        document.querySelectorAll(
            textSelectors.join(",")
        );


    textElements.forEach(element => {

        if (
            element.dataset.scrollWordsReady ===
            "true"
        ) {

            return;

        }


        element.dataset.scrollWordsReady =
            "true";


        const walker =
            document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT
            );


        const textNodes = [];


        while (walker.nextNode()) {

            textNodes.push(
                walker.currentNode
            );

        }


        textNodes.forEach(node => {

            const text =
                node.textContent;


            if (!text.trim()) {

                return;

            }


            const fragment =
                document.createDocumentFragment();


            const parts =
                text.split(/(\s+)/);


            parts.forEach(part => {

                if (!part.trim()) {

                    fragment.appendChild(
                        document.createTextNode(part)
                    );

                    return;

                }


                const span =
                    document.createElement("span");


                span.className =
                    "scroll-word";


                span.textContent =
                    part;


                fragment.appendChild(span);

            });


            node.parentNode.replaceChild(
                fragment,
                node
            );

        });

    });


    const words =
        document.querySelectorAll(
            ".scroll-word"
        );


    const wordObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {

                        return;

                    }


                    const word =
                        entry.target;


                    const parent =
                        word.closest(
                            "h1, h2, h3, p"
                        );


                    let index = 0;


                    if (parent) {

                        const parentWords =
                            parent.querySelectorAll(
                                ".scroll-word"
                            );


                        parentWords.forEach(
                            (item, i) => {

                                if (
                                    item === word
                                ) {

                                    index = i;

                                }

                            }
                        );

                    }


                    const delay =
                        Math.min(
                            index * 35,
                            350
                        );


                    setTimeout(() => {

                        word.classList.add(
                            "word-visible"
                        );

                    }, delay);


                    wordObserver.unobserve(
                        word
                    );

                });

            },
            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -5% 0px"
            }
        );


    words.forEach(word => {

        wordObserver.observe(word);

    });

})();


/* =========================================================
   CARD TOUCH FEEDBACK
========================================================= */

(function () {

    const cards =
        document.querySelectorAll(
            ".preview-card, .about-block, .feature-large, .price-card"
        );


    cards.forEach(card => {

        card.addEventListener(
            "touchstart",
            () => {

                card.classList.add(
                    "touch-active"
                );

            },
            {
                passive: true
            }
        );


        card.addEventListener(
            "touchend",
            () => {

                setTimeout(() => {

                    card.classList.remove(
                        "touch-active"
                    );

                }, 180);

            },
            {
                passive: true
            }
        );


        card.addEventListener(
            "touchcancel",
            () => {

                card.classList.remove(
                    "touch-active"
                );

            },
            {
                passive: true
            }
        );

    });

})();
/* =========================================================
   FINAL INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    updateActiveNavigation();

    filterGallery();

});
/* =========================================================
   AI IMAG
   LOAD SAVED GENERATION SETTINGS
========================================================= */

(function loadSavedGenerationSettings() {

    const savedStyle =
        localStorage.getItem(
            "aiImagDefaultStyle"
        );

    const savedRatio =
        localStorage.getItem(
            "aiImagDefaultRatio"
        );

    const savedQuantity =
        localStorage.getItem(
            "aiImagDefaultQuantity"
        );

    const savedQuality =
        localStorage.getItem(
            "aiImagDefaultQuality"
        );


    const style =
        document.getElementById("style");

    const ratio =
        document.getElementById("ratio");

    const quantity =
        document.getElementById("quantity");

    const quality =
        document.getElementById("quality");


    if (style && savedStyle) {

        const option =
            [...style.options].find(
                option =>
                    option.value === savedStyle ||
                    option.text === savedStyle
            );

        if (option) {
            style.value = option.value;
        }

    }


    if (ratio && savedRatio) {

        ratio.value =
            savedRatio;

    }


    if (quantity && savedQuantity) {

        quantity.value =
            savedQuantity;

    }


    if (quality && savedQuality) {

        quality.value =
            savedQuality;

    }

})();