(function ($) {
    $.fn.FreeContentModal = function () {
        const version = "3.0.0";

        // to make complete text clickable add in css class triggerFreeContentModal and uniqueId of modal
        $(".triggerFreeContentModal").click(function () {
            let classToTriggerModal = $(this)
                .closest(".triggerFreeContentModal")
                .attr("data-classtoclosemodal");
            if (
                classToTriggerModal &&
                $(".modal-overlay." + classToTriggerModal) &&
                $(".modal-overlay." + classToTriggerModal)[0]
            ) {
                $("body").addClass("modal--no-scroll");
                $(".modal-overlay." + classToTriggerModal)[0].style.display = "flex";
                $(".cmp-modal." + classToTriggerModal)[0].style.display = "block";
            }
        });

        // closing the modal with a specific button: FreeContent
        $(".closeFreeContentModal").click(function () {
            let classToCloseModal = $(this).attr("data-classToCloseModal");
            if (
                classToCloseModal &&
                $(".modal-overlay." + classToCloseModal) &&
                $(".modal-overlay." + classToCloseModal)[0]
            ) {
                $("body").removeClass("modal--no-scroll");
                $(".modal-overlay." + classToCloseModal)[0].style.display = "none";
                $(".cmp-modal." + classToCloseModal)[0].style.display = "none";
            }
        });

        // closing modal on click of viewport
        $(".freeContentModal").on("click", ".modal-overlay", function (e) {
            if ($(e.target).parents(".cmp-modal").length === 1) return;
            var styles = $(this).attr("style");
            if (styles === "display: flex;") {
                $(this).css("display", "none");
                $("body").removeClass("modal--no-scroll");
                $(".freeContentModal .cmp-modal").css("display", "none");
            }
        });
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
    //   $.fn.FreeContentModal();
    // });
})(jQuery);