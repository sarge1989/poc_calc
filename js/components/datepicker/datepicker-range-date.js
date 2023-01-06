(function ($) {
    $.fn.DatepickerRangeDate = function () {
      const version = "4.1.0";
  
      // Handle multiple instance of datepicker
      const datePickerContainer = $(this);
  
      for (let i = 0; i < datePickerContainer.length; i++) {
        const datepickerInputRange = datePickerContainer[i];
        const datepickerInputFrom = datePickerContainer[i].querySelector(
          'input[name="datepickerFrom"]',
        );
        const datepickerInputTo = datePickerContainer[i].querySelector(
          'input[name="datepickerTo"]',
        );
        const datepickerErrorFrom = datePickerContainer[i].querySelector(
          "#datePickerErrorFrom",
        );
        const datepickerErrorTo =
          datePickerContainer[i].querySelector("#datePickerErrorTo");
        const datepickerIconFrom = datePickerContainer[i].querySelector(
          "#datepickerIconFrom",
        );
        const datepickerIconTo =
          datePickerContainer[i].querySelector("#datepickerIconTo");
        const minDate = "1 Nov 2021"; // set min date
        const minDateParse = Date.parse(minDate);
        const maxDate = "28 Feb 2025"; // set max date
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
        const todayDate = `${today.getDate()} ${
          monthsArr[today.getMonth()]
        } ${today.getFullYear()}`;
  
        if (datepickerInputRange && datepickerInputRange.rangepicker) {
          datepickerInputRange.rangepicker.destroy();
        }
  
        if (datepickerInputRange) {
          new DateRangePicker(datepickerInputRange, {
            autohide: true,
            clearBtn: true,
            nextArrow: "",
            prevArrow: "",
            buttonClass: "cmp-button--tertiary",
            format: "d M yyyy",
            todayHighlight: true,
            weekStart: 1,
            showOnClick: false,
            minDate: minDateParse,
            maxDate: maxDateParse,
            defaultViewDate: todayDate,
          });
  
          // Setting default from and to dates
          datepickerInputFrom.datepicker.setDate(todayDate); // set default date value From
          datepickerInputTo.datepicker.setDate(todayDate); // set default date value To
  
          // Helper function to check if input is valid
          function checkValidInput(isInputFrom) {
            const val = isInputFrom
              ? datepickerInputFrom.datepicker.dates[0]
              : datepickerInputTo.datepicker.dates[0];
            if (isInputFrom) {
              if (
                !datepickerInputFrom.datepicker.isDateValidFormat ||
                isNaN(val) ||
                val < minDateParse ||
                val > maxDateParse
              ) {
                datepickerErrorFrom.classList.add("error");
                datepickerInputFrom.classList.add("error");
              } else {
                datepickerErrorFrom.classList.remove("error");
                datepickerInputFrom.classList.remove("error");
              }
            } else {
              if (
                !datepickerInputTo.datepicker.isDateValidFormat ||
                isNaN(val) ||
                val < minDateParse ||
                val > maxDateParse
              ) {
                datepickerErrorTo.classList.add("error");
                datepickerInputTo.classList.add("error");
              } else {
                datepickerErrorTo.classList.remove("error");
                datepickerInputTo.classList.remove("error");
              }
            }
          }
  
          // When user focus on the input, hide the calendar
          datepickerInputFrom.addEventListener("focusin", function (event) {
            datepickerInputFrom.datepicker.hide();
          });
          datepickerInputTo.addEventListener("focusin", function (event) {
            datepickerInputTo.datepicker.hide();
          });
  
          // When user focus out, validate the date
          datepickerInputFrom.addEventListener("focusout", function (event) {
            checkValidInput(true);
          });
          datepickerInputTo.addEventListener("focusout", function (event) {
            checkValidInput(false);
          });
  
          // Upon user click on a different date on the picker, set the active calendar to the correct value
          datepickerInputFrom.addEventListener("changeDate", function (detail) {
            checkValidInput(true);
          });
          datepickerInputTo.addEventListener("changeDate", function (detail) {
            checkValidInput(false);
          });
  
          // Open calendar picker when calendar icon is clicked
          $(datepickerIconFrom).unbind("mousedown").bind("mousedown", function (event) {
            event.stopPropagation();
            if (datepickerInputFrom.datepicker.active) {
              datepickerInputFrom.datepicker.hide();
            } else {
              datepickerInputFrom.datepicker.show();
            }
          });
          $(datepickerIconTo).unbind("mousedown").bind("mousedown", function (event) {
            event.stopPropagation();
            if (datepickerInputTo.datepicker.active) {
              datepickerInputTo.datepicker.hide();
            } else {
              datepickerInputTo.datepicker.show();
            }
          });
  
          // Call datepicker.destroy() when navigate away
          window.addEventListener("unload", function (event) {
            datepickerInputRange.rangepicker.destroy();
          });
        }
      } // End of loop
  
      return {
        version,
      };
    };
  })(jQuery);