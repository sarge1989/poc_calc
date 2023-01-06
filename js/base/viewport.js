(function ($) {
    // jQuery singleton pattern
    if ($.fn.viewport) return;
    const version = "3.0.0";
    $.fn.viewport = function () {
        return version;
    };

    const timer = 100;
    $(window).resize(function () {
        updateViewportHeight();
    });

    const viewportHeight = () => {
        return `${window.innerHeight}px`;
    };

    const cssViewportHeight = () => {
        return document.documentElement.style.getPropertyValue("--vh");
    };

    const updateViewportHeight = () => {
        document.documentElement.style.setProperty("--vh", viewportHeight());
    };

    // initalise a timer to resolve a safari bug
    setInterval(() => {
        if (viewportHeight() !== cssViewportHeight()) updateViewportHeight();
    }, timer);
})(jQuery);