(function ($) {
  $.fn.DestroyElementOnURLChange = function () {
    const version = "4.0.0";

    let lastUrl = location.href;

    // Destroy datepicker or correct body scrolling when URL change
    // This code is the way we detect changes in URL on storybook.
    // For production, if the datepicker is already destroyed as user navigate away,
    // there's no need to add this code

    new MutationObserver(() => {
      const url = location.href;
      if (url.split("&")[0] !== lastUrl.split("&")[0]) {
        lastUrl = url;

        try {
          // Correct body scrolling
          if ($("body").hasClass("modal--no-scroll")) {
            $("body").removeClass("modal--no-scroll");
          }

          // Destroy datepicker
          const datepickerInput =
            document.querySelector('input[name="datepicker"]') || false;
          if (datepickerInput) {
            datepickerInput.datepicker.destroy();
          }

          // Destroy datepicker range
          const datepickerInputFrom =
            document.querySelector('input[name="datepickerFrom"]') || false;
          const datepickerInputTo =
            document.querySelector('input[name="datepickerTo"]') || false;
          if (datepickerInputFrom) {
            datepickerInputFrom.datepicker.destroy();
          }
          if (datepickerInputTo) {
            datepickerInputTo.datepicker.destroy();
          }
        } catch (e) {
          console.warn(e);
        }
      }
    }).observe(document, { subtree: true, childList: true });

    return {
      version,
    };
  };
})(jQuery);
