(function ($) {
    $.fn.LineItem = function () {
        const version = "2.0.0";

        let accordionButtons;

        $(document).ready(function () {
            accordionButtons = $(".cmp-button--expand-accordion");

            accordionButtons.each(function (index) {
                toggleAccordion(this, index);
            });
        });

        function toggleAccordion(button, index) {
            button.addEventListener("click", function (e) {
                e.preventDefault();

                let accordionId = `#accordionContainer${index + 1}`;
                let arrowId = `#expandAccordion${index + 1} .icons_space`;
                if ($(accordionId).hasClass("accordion_container-expaned")) {
                    $(accordionId).removeClass("accordion_container-expaned");
                    $(arrowId).removeClass("icon-dls-arrow-up");
                    $(arrowId).addClass("icon-dls-arrow-down");
                } else {
                    $(accordionId).addClass("accordion_container-expaned");
                    $(arrowId).removeClass("icon-dls-arrow-down");
                    $(arrowId).addClass("icon-dls-arrow-up");
                }
            });
        }

        return {
            version,
        };
    };
})(jQuery);
