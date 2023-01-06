(function ($) {
    $.fn.RelatedResource = function (options) {
        const version = "3.0.0";

        if (window.NodeList && !NodeList.prototype.forEach) {
            NodeList.prototype.forEach = Array.prototype.forEach;
        }

        const relatedResourceWrapper = $(this);

        for (var resourceCmp of relatedResourceWrapper) {
            const showAllBtnWrapper = resourceCmp.querySelector(".show-more-button");
            const button = resourceCmp.querySelector("button");
            const buttonText = showAllBtnWrapper.querySelector(".cmp-button__text");
            const buttonIcon = showAllBtnWrapper.querySelector(".icons_space");
            let individualCardArr = resourceCmp.querySelectorAll(".individual-card");

            $(button)
                .off("click")
                .click(function (e) {
                    if (buttonIcon.classList.contains("icon-dls-arrow-down")) {
                        // this will show more items
                        buttonText.innerHTML = buttonText.dataset.showLess;

                        // Remove down arrow and change to up arrow
                        buttonIcon.classList.remove("icon-dls-arrow-down");
                        buttonIcon.classList.add("icon-dls-arrow-up");

                        // Show all items
                        showOrHide("show");
                    } else if (buttonIcon.classList.contains("icon-dls-arrow-up")) {
                        // this will show lesser items
                        buttonText.innerHTML = buttonText.dataset.showAll;

                        // Remove up arrow and change to down arrow
                        buttonIcon.classList.remove("icon-dls-arrow-up");
                        buttonIcon.classList.add("icon-dls-arrow-down");

                        // Hide everything except first 3
                        showOrHide("hide");
                    }
                });

            const showOrHide = (showOrHide) => {
                if (individualCardArr.length < 3) {
                    showAllBtnWrapper.classList.add("hidden");
                } else {
                    showAllBtnWrapper.classList.remove("hidden");
                }

                if (showOrHide == "show") {
                    // remove all hiddens
                    individualCardArr.forEach((cardElement) => {
                        cardElement.classList.remove("hidden");
                    });
                } else if (showOrHide == "hide") {
                    // add all hidden class past the first 3 items
                    for (let i = 0; i < individualCardArr.length; i++) {
                        if (i > 2) {
                            individualCardArr[i].classList.add("hidden");
                        }
                    }
                }
            };

            // Hide everything except first 3
            showOrHide("hide");
        }

        return {
            version,
        };
    };
    /** The script need to be invoked first before the change can be reflected
     * on DLS we invoked it at the stories level so that the script recalculate the dimensions
     * when the options change.
     * To make sure this script is invoked on your site,
     * uncomment the below code to self invoking on DOM ready
     */
    // $(function () {
    //   $.fn.RelatedResource();
    // });
})(jQuery);