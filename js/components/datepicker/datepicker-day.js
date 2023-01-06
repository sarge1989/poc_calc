(function ($) {
  $.fn.DatepickerDate = function () {
    const version = "4.1.0";

    // Handle multiple instance of datepicker
    const datePickerContainer = $(this);

    for (let i = 0; i < datePickerContainer.length; i++) {
      const datepickerInput = datePickerContainer[i].querySelector(
        'input[name="datepicker"]',
      );
      const datepickerError =
        datePickerContainer[i].querySelector("#datePickerError");
      const datepickerIcon =
        datePickerContainer[i].querySelector("#datepickerIcon");

      let minDate = datepickerInput.getAttribute("data-min-date");
      let maxDate = datepickerInput.getAttribute("data-max-date");

      // const minDate = "5 Nov 2021"; // set min date
      const minDateParse = Date.parse(minDate);
      // const maxDate = "1 Feb 2025"; // set max date
      const maxDateParse = Date.parse(maxDate);

      const monthsArr = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const today = new Date();
      const todayDate = `${today.getDate()} ${monthsArr[today.getMonth()]
        } ${today.getFullYear()}`;

      if (datepickerInput && datepickerInput.datepicker) {
        datepickerInput.datepicker.destroy();
      }

      let defaultDate = datepickerInput.getAttribute("data-default-date");

      if (defaultDate == undefined) {
        defaultDate = null;
      } else if (defaultDate == 'today') {
        defaultDate = todayDate;
      }

      let datePickerOptions = {
        autohide: true,
        clearBtn: true,
        nextArrow: "",
        prevArrow: "",
        buttonClass: "cmp-button--tertiary",
        format: "d M yyyy",
        todayHighlight: true,
        weekStart: 1,
        showOnClick: false,
        defaultViewDate: defaultDate,
      }

      if (minDateParse != NaN) {
        datePickerOptions.minDate = minDateParse
      }

      if (maxDateParse != NaN) {
        datePickerOptions.maxDate = maxDateParse
      }

      if (datepickerInput) {
        // attached the Datepicker instance to the input field
        new Datepicker(datepickerInput, datePickerOptions);

        datepickerInput.datepicker.setDate(defaultDate); // set default date value

        // Helper function to check if input is valid
        function checkValidInput() {
          const val = datepickerInput.datepicker.dates[0];
          if (
            !datepickerInput.datepicker.isDateValidFormat ||
            isNaN(val) ||
            val < minDateParse ||
            val > maxDateParse
          ) {
            datepickerError.classList.add("error");
            datepickerInput.classList.add("error");
          } else {
            datepickerError.classList.remove("error");
            datepickerInput.classList.remove("error");
          }
        }

        // When user focus on the input, hide the calendar
        datepickerInput.addEventListener("focusin", function (event) {
          datepickerInput.datepicker.hide();
        });

        // When user focus out, validate the date
        datepickerInput.addEventListener("focusout", function (event) {
          checkValidInput();
        });

        // Upon user click on a different date on the picker, set the active calendar to the correct value
        datepickerInput.addEventListener("changeDate", function (detail) {
          checkValidInput();
        });

        // Open calendar picker when calendar icon is clicked
        $(datepickerIcon).unbind("mousedown").bind("mousedown", function (event) {
          event.stopPropagation();
          if (datepickerInput.datepicker.active) {
            datepickerInput.datepicker.hide();
          } else {
            datepickerInput.datepicker.show();
          }
        });

        // Call datepickerInput.datepicker.destroy() when navigate away
        window.addEventListener("unload", function (event) {
          datepickerInput.datepicker.destroy();
        });
      }
    } // End of loop

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
  //   $.fn.DatepickerDate();
  // });
})(jQuery);