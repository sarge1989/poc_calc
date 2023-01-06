(function ($) {
    $.fn.Tooltips = function () {
        // Loop through all existing cmp-tooltip on page and assign individual functions to them. so multiple wont bug out.
        let tooltipCmp = document.getElementsByClassName("cmp-tooltip");
        for (let x = 0; x < tooltipCmp.length; x++) {
            const individualTooltip = tooltipCmp[x];
            let tooltipWrapper = individualTooltip.querySelector(
                ".cmp-tooltip-wrapper",
            );
            let tooltipPopup = individualTooltip.querySelector(
                ".cmp-tooltip-wrapper-popup",
            );
            let tooltipOverlayBG = individualTooltip.querySelector(
                ".cmp-tooltip-overlay-bg",
            );

            let tooltipOverlayClose =
                individualTooltip.querySelector(".cmp-tooltip-close");

            // Function to trigger when M and below viewport
            // This will make the tooltip click to open the popup.
            $(tooltipWrapper).click(function () {
                const closestHtmlTag = $(this).closest("html");
                if (closestHtmlTag.width() < 992) {
                    $(tooltipPopup).addClass(`mobile--show`);
                    $("body").addClass(`noscroll`);
                    $(tooltipOverlayBG).show();

                    // Clicking on BG closes
                    $(tooltipOverlayBG).click(function (e) {
                        e.stopPropagation();
                        $(tooltipPopup).removeClass(`mobile--show`);
                        $("body").removeClass(`noscroll`);
                        $(tooltipOverlayBG).hide();
                    });

                    // Clicking on close btn closes
                    $(tooltipOverlayClose).click(function (e) {
                        e.stopPropagation();
                        $(tooltipPopup).removeClass(`mobile--show`);
                        $("body").removeClass(`noscroll`);
                        $(tooltipOverlayBG).hide();
                    });
                }
            });
        }

        // Function to check for which position of popup to open
        // let i = 0;
        // const popupPositions = ["top", "bottom", "left", "right"];
        // $(".cmp-tooltip-wrapper").mouseover(function () {
        //   while (popupPositions[i]) {
        //     console.log(
        //       "Is this visible on screen? >",
        //       $(`.cmp-tooltip-wrapper-popup`).is(":entireonscreen"),
        //     );
        //     if ($(`.cmp-tooltip-wrapper-popup`).is(":entireonscreen")) {
        //       console.log("BREAK");
        //       break;
        //     } else {
        //       $(".cmp-tooltip-wrapper-popup")
        //         .removeClass(`${popupPositions[i - 1]}`)
        //         .addClass(`${popupPositions[i]}`);
        //       console.log("Discarded position >", popupPositions[i - 1]);
        //       console.log("Final position >", popupPositions[i]);
        //       i++;
        //     }
        //   }
        // });
    };

    $(function () {
        // $.fn.Tooltips();
    });

    // Helper functions to calculate if item is visible
    $.fn.isOnScreen = function (partial) {
        //let's be sure we're checking only one element (in case function is called on set)
        var t = $(this).first();

        //we're using getBoundingClientRect to get position of element relative to viewport
        //so we dont need to care about scroll position
        var box = t[0].getBoundingClientRect();

        //let's save window size
        var win = {
            h: $(window).height(),
            w: $(window).width(),
        };

        //now we check against edges of element

        //firstly we check one axis
        //for example we check if left edge of element is between left and right edge of scree (still might be above/below)
        var topEdgeInRange = box.top >= 0 && box.top <= win.h;
        var bottomEdgeInRange = box.bottom >= 0 && box.bottom <= win.h;

        var leftEdgeInRange = box.left >= 0 && box.left <= win.w;
        var rightEdgeInRange = box.right >= 0 && box.right <= win.w;

        //here we check if element is bigger then window and 'covers' the screen in given axis
        var coverScreenHorizontally = box.left <= 0 && box.right >= win.w;
        var coverScreenVertically = box.top <= 0 && box.bottom >= win.h;

        //now we check 2nd axis
        var topEdgeInScreen =
            topEdgeInRange &&
            (leftEdgeInRange || rightEdgeInRange || coverScreenHorizontally);
        var bottomEdgeInScreen =
            bottomEdgeInRange &&
            (leftEdgeInRange || rightEdgeInRange || coverScreenHorizontally);

        var leftEdgeInScreen =
            leftEdgeInRange &&
            (topEdgeInRange || bottomEdgeInRange || coverScreenVertically);
        var rightEdgeInScreen =
            rightEdgeInRange &&
            (topEdgeInRange || bottomEdgeInRange || coverScreenVertically);

        //now knowing presence of each edge on screen, we check if element is partially or entirely present on screen
        var isPartiallyOnScreen =
            topEdgeInScreen ||
            bottomEdgeInScreen ||
            leftEdgeInScreen ||
            rightEdgeInScreen;
        var isEntirelyOnScreen =
            topEdgeInScreen &&
            bottomEdgeInScreen &&
            leftEdgeInScreen &&
            rightEdgeInScreen;

        return partial ? isPartiallyOnScreen : isEntirelyOnScreen;
    };

    $.expr.filters.onscreen = function (elem) {
        return $(elem).isOnScreen(true);
    };

    $.expr.filters.entireonscreen = function (elem) {
        return $(elem).isOnScreen(true);
    };

    $.fn.Tooltips();
})(jQuery);