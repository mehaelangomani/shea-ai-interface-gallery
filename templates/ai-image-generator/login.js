/* =========================================================
   AI IMAG
   LOGIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const loginForm =
        document.getElementById("loginForm");

    const emailInput =
        document.getElementById("loginEmail");

    const passwordInput =
        document.getElementById("loginPassword");

    const passwordToggle =
        document.getElementById("passwordToggle");

    const loginSubmit =
        document.getElementById("loginSubmit");

    const loginMessage =
        document.getElementById("loginMessage");

    const rememberMe =
        document.getElementById("rememberMe");

    const forgotPassword =
        document.getElementById("forgotPassword");

    const googleLogin =
        document.getElementById("googleLogin");

    const createAccount =
        document.getElementById("createAccount");


    /* =====================================================
       REMEMBERED EMAIL
    ===================================================== */

    const rememberedEmail =
        localStorage.getItem("aiImagRememberedEmail");

    if (rememberedEmail) {

        emailInput.value =
            rememberedEmail;

        rememberMe.checked = true;
    }


    /* =====================================================
       SHOW / HIDE PASSWORD
    ===================================================== */

    passwordToggle.addEventListener(
        "click",
        () => {

            const isPassword =
                passwordInput.type === "password";

            passwordInput.type =
                isPassword
                    ? "text"
                    : "password";

            passwordToggle.innerHTML =
                isPassword
                    ? '<i class="fa-regular fa-eye-slash"></i>'
                    : '<i class="fa-regular fa-eye"></i>';

            passwordToggle.setAttribute(
                "aria-label",
                isPassword
                    ? "Hide password"
                    : "Show password"
            );

        }
    );


    /* =====================================================
       MESSAGE
    ===================================================== */

    function showMessage(message) {

        loginMessage.textContent =
            message;

        loginMessage.classList.add(
            "show"
        );
    }


    function hideMessage() {

        loginMessage.textContent = "";

        loginMessage.classList.remove(
            "show"
        );
    }


    /* =====================================================
       LOGIN
    ===================================================== */

    loginForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            hideMessage();

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value.trim();


            if (!email || !password) {

                showMessage(
                    "Please enter your email and password."
                );

                return;
            }


            if (!emailInput.checkValidity()) {

                showMessage(
                    "Please enter a valid email address."
                );

                return;
            }


            loginSubmit.classList.add(
                "loading"
            );

            loginSubmit.innerHTML =
                `
                    <span>Signing in...</span>
                    <i class="fa-solid fa-spinner fa-spin"></i>
                `;


            /*
                FRONTEND DEMO LOGIN

                Save login state locally.
            */

            const user = {

                email: email,

                name:
                    email
                        .split("@")[0]
                        .replace(/[._-]/g, " "),

                loggedIn: true,

                loginTime:
                    new Date().toISOString()

            };


            localStorage.setItem(
                "aiImagUser",
                JSON.stringify(user)
            );


            if (rememberMe.checked) {

                localStorage.setItem(
                    "aiImagRememberedEmail",
                    email
                );

            } else {

                localStorage.removeItem(
                    "aiImagRememberedEmail"
                );
            }


            setTimeout(() => {

                window.location.href =
                    "index.html";

            }, 700);

        }
    );


    /* =====================================================
       FORGOT PASSWORD
    ===================================================== */

    forgotPassword.addEventListener(
        "click",
        () => {

            const email =
                emailInput.value.trim();

            if (!email) {

                showMessage(
                    "Enter your email address first."
                );

                emailInput.focus();

                return;
            }


            showMessage(
                "Password reset is ready to be connected to your authentication service."
            );

        }
    );


    /* =====================================================
       GOOGLE LOGIN
    ===================================================== */

    googleLogin.addEventListener(
        "click",
        () => {

            /*
                Placeholder for real Google OAuth.
            */

            showMessage(
                "Google authentication needs to be connected to an authentication provider."
            );

        }
    );


    /* =====================================================
       CREATE ACCOUNT
    ===================================================== */

    createAccount.addEventListener(
        "click",
        () => {

            /*
                For the frontend-only version,
                redirect to the main workspace.

                Replace later with signup.html
                when real authentication is added.
            */

            localStorage.setItem(
                "aiImagSignupIntent",
                "true"
            );

            window.location.href =
                "index.html#generate";

        }
    );

});s