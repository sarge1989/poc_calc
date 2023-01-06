(function ($) {
    $.fn.DotsIndicator = function () {
        const version = "1.0.0";
        $(".dot-pagination").click(function () {
            $(".dot-pagination").removeClass("active-bullet active");
            $(this).addClass("active-bullet active");
        });
        return {
            version,
        };
    };
    $(function () {
        $.fn.DotsIndicator();
    });
})(jQuery);