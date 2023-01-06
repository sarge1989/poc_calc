
// All js are imported here
import "./base/jquery-3.6.1.min.js";
import "./base/less.js";
import "./base/remove-comments.js";
// import "../less/calculator_template.less";

import { dataInclude } from "./base/data-include.js";

// For testing purpose only. Not to be used in prod. To be removed
import "./global-navigation/header.js";
import "./global-navigation/homepage-banner.js";

// Components required for the page
import "./components/dropdown.js";
import { selectionChangeCheckbox, selectionChangeCheckboxDOM } from "./components/form-elements/selectionChangeCheckbox.js";
import "./components/datepicker/datepicker-lib.js"; // Remove if date picker is not required
import "./components/datepicker/datepicker-day.js"; // Remove if date picker is not required
import "./components/line-item.js"; // Remove if line item in results page is not required
import "./components/related-resources.js";

$(function () {
    $("html, body").animate({ scrollTop: "0"}, 100);

    const coverPanel = "div[panel-name=coverPage]", formPanel = "div[panel-name=formPage]", resultsPanel = "div[panel-name=resultsPage]";
    const backBtn = "#backBtn", nextBtn = "#nextBtn", editBtn = "#editBtn", newBtn = "#newBtn";

    const maxStep = 1; // define how many steps in total (this ensures scalability of the app)
    let currStep = 0; // cover page; results page = maxStep + 1;

    const init = function () {
        console.log("executing init now");
        // Do not modify the codes that are added here
        $.fn.globalHeader();
        $.fn.DropDownMenu(); 
        $("input[type='checkbox']:not(#coverCheckbox)").on('change', selectionChangeCheckbox);

        // Remove if day picker is not required
        $(".sb-datepicker-container.cmp-inputs.sb-datepicker-container--day").DatepickerDate();

        // Remove if line item in results page is not required
        $.fn.LineItem();
        $(".form-resources").RelatedResource();

        $("#coverCheckbox").change(function () {
            selectionChangeCheckboxDOM(this);

            if (this.checked) {
                $("#coverStartBtn").removeAttr("disabled");
            } else {
                $("#coverStartBtn").attr("disabled", "disabled");
            }
        });

        $(coverStartBtn).on("click", (e) => {
            if (maxStep == 1) {
                $("#nextBtn > .cmp-button__text").text("Submit");
            }

            window.scrollTo({ top: $("#mainPanel").position().top });
            $(coverPanel).addClass("hidden");
            $(formPanel).removeClass("hidden");
            currStep = 1; // currStep = 0 (i.e. step 1)
        });

        $(backBtn).on("click", (e) => {
            if (currStep == 1) {
                $(formPanel).addClass("hidden");
                $(coverPanel).removeClass("hidden");
                window.scrollTo({ top: 0 });
            } else {
                if (currStep == maxStep) {
                    $("#nextBtn > .cmp-button__text").text("Next");
                }

                $("div[panel-name=step-" + currStep + "]").addClass("hidden");
                $("div[panel-name=step-" + (currStep - 1) + "]").removeClass("hidden");
                window.scrollTo({ top: $("div.formContent").position().top });
            }
            currStep -= 1;
        });

        $(nextBtn).on("click", (e) => {
            if (currStep == maxStep) { // last step
                // format data into an object so that it is easier to pass to the processData() function
                var data = {};

                // Process data results
                processData(data, () => {
                    // Added a callback to ensure the results page is shown ONLY when all the data has been processed and updated to the html elements
                    $("div[panel-name=step-" + currStep + "]").addClass("hidden");
                    $(formPanel).addClass("hidden");
                    $(resultsPanel).removeClass("hidden");
                    window.scrollTo({ top: 0 });
                });
            } else {
                if (currStep + 1 == maxStep) {
                    $("#nextBtn > .cmp-button__text").text("Submit");
                }

                $("div[panel-name=step-" + currStep + "]").addClass("hidden");
                $("div[panel-name=step-" + (currStep + 1) + "]").removeClass("hidden");

                window.scrollTo({ top: $("div.formContent").position().top });          
            }

            currStep += 1;
        });

        $(editBtn).on("click", (e) => {
            window.scrollTo({ top: $("#mainPanel").position().top });
            $(resultsPanel).addClass("hidden");
            $(formPanel).removeClass("hidden");
            $("div[panel-name=step-1]").removeClass("hidden");
            currStep = 1; // return to step 1
        });

        $(newBtn).on("click", (e)=>{
            location.reload();
        });
        console.log("all done! ");
    };

    // Do the data processing here... you can create more functions if required
    const processData = function (data, callback) {
        // Add logic

        // Always end with this callback
        callback();
    };

    dataInclude((res) => {
        // ensure that the dataInclude has completed execution before calling the initialisation for all components
        if (res == "done") {
            init();
        }
    });
});