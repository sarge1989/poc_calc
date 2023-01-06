(function ($) {
    $.fn.PageLoader = function () {
        const version = "1.0.0";
        const loaderText = $(".animation-child")[0]?.lastElementChild;
        if (loaderText) {
            setTimeout(() => {
                loaderText.innerText = "Sorry, this is taking longer than expected.";
            }, 5000);
        }
        return {
            version,
        };
    };

    $(function () {
        $.fn.PageLoader();
    });
})(jQuery);