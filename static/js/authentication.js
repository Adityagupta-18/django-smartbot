document.addEventListener("DOMContentLoaded", () => {

    const toggleButtons = document.querySelectorAll(".password-toggle");

    toggleButtons.forEach(button => {

        button.addEventListener("click", () => {

            const targetId = button.dataset.target;
            const passwordInput = document.getElementById(targetId);

            if (!passwordInput) return;


            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                button.classList.add("password-visible");

                button.setAttribute(
                    "aria-label",
                    "Hide password"
                );

                button.setAttribute(
                    "aria-pressed",
                    "true"
                );

            } else {

                passwordInput.type = "password";

                button.classList.remove("password-visible");

                button.setAttribute(
                    "aria-label",
                    "Show password"
                );

                button.setAttribute(
                    "aria-pressed",
                    "false"
                );
            }

        });

    });

});