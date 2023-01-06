(function ($) {
    $.fn.ShowHideInput = function () {
        const version = "4.0.0";

        // Handle multiple instance of input
        const singleInputContainer = $(this);

        for (const singleInput of singleInputContainer) {
            let showPassword = false;
            const passwordInput = singleInput.querySelector(".form-control-input");
            const showHideIcon = singleInput.querySelector("i");

            if (showHideIcon) {
                showHideIcon.addEventListener("click", function (event) {
                    event.stopPropagation();
                    if (!passwordInput.readOnly && !passwordInput.disabled) {
                        if (showPassword) {
                            showHideIcon.classList.remove("icon-dls-password-hide");
                            showHideIcon.classList.add("icon-dls-password-show");
                            showPassword = false;
                            passwordInput.type = "password";
                        } else {
                            showHideIcon.classList.remove("icon-dls-password-show");
                            showHideIcon.classList.add("icon-dls-password-hide");
                            showPassword = true;
                            passwordInput.type = "text";
                        }
                    }
                });
            }
        }

        return {
            version,
        };
    };
})(jQuery);