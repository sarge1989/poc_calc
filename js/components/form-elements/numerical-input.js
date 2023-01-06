(function ($) {
    $.fn.NumericalInput = function () {
        const version = "3.0.0";

        // Handle multiple instance of datepicker
        const numericalInputContainer = $(this);
        for (let i = 0; i < numericalInputContainer.length; i++) {
            const numericalInput = numericalInputContainer[i].querySelector(
                ".form-control.form-control-number",
            );

            // Added this code to differentiate decimal and whole number field
            const decimalInput = numericalInputContainer[i].querySelector(
                ".form-control.form-control-number.form-control-decimal",
            );

            $(numericalInput).keypress(function (event) {
                if (
                    (event.which != 46 || $(this).val().indexOf(".") != -1) &&
                    (event.which < 48 ||
                        event.which > 57 ||
                        event.whitch === 188 ||
                        event.which === 110)
                ) {
                    event.preventDefault();
                }
            });

            // Added this code to differentiate decimal and whole number field
            if (decimalInput !== null) {
                $(decimalInput).focusout(function (e) {
                    const options = {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    };
                    const inputValue = $(this).val();

                    if (!inputValue) {
                        return;
                    }

                    let num = inputValue.toString();
                    let removeCommas = num.replace(/\,/g, "");
                    let fixedTwoDecimals = parseFloat(removeCommas, 2);
                    const formatted = Number(fixedTwoDecimals).toLocaleString(
                        "en",
                        options,
                    );
                    $(this).val(formatted);
                });
            } else {
                $(numericalInput).focusout(function (e) {
                    // Set this to 0 when it is a whole number
                    const options = {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                    };
                    const inputValue = $(this).val();

                    if (!inputValue) {
                        return;
                    }

                    let num = inputValue.toString();
                    let removeCommas = num.replace(/\,/g, "");
                    let fixedTwoDecimals = parseFloat(removeCommas, 2);
                    const formatted = Number(fixedTwoDecimals).toLocaleString(
                        "en",
                        options,
                    );
                    $(this).val(formatted);
                });
            }

        } //End of loop

        return {
            version,
        };
    };
})(jQuery);