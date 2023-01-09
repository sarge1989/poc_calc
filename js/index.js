
// All js are imported here
import "./base/jquery-3.6.1.min.js";
import "./base/less.js";
import "./base/remove-comments.js";
// import "../less/hps_premium_calculator.less";

import { dataInclude } from "./base/data-include.js";

// For testing purpose only. Not to be used in prod. To be removed
import "./global-navigation/header.js";
import "./global-navigation/homepage-banner.js";

// Components required for the page
import "./components/dropdown.js";
import "./components/tooltips.js";
import { selectionChangeCheckbox, selectionChangeCheckboxDOM } from "./components/form-elements/selectionChangeCheckbox.js";
import { selectionChangeRadioButton } from "./components/form-elements/selectionChangeRadioButton.js";
import "./components/datepicker/datepicker-lib.js"; // Remove if date picker is not required
import "./components/datepicker/datepicker-day.js"; // Remove if date picker is not required
import "./components/line-item.js"; // Remove if line item in results page is not required
import "./components/related-resources.js";
import "./components/form-elements/numerical-input.js";

$(function () {
    $("html, body").animate({ scrollTop: "0" }, 100);

    const coverPanel = "div[panel-name=coverPage]", formPanel = "div[panel-name=formPage]", resultsPanel = "div[panel-name=resultsPage]";
    const backBtn = "#backBtn", nextBtn = "#nextBtn", editBtn = "#editBtn", newBtn = "#newBtn";
    const dobInput = "#dob", genderInput = 'input[name="gender"]', loanAmountInput = "#loan_amount", interestRateInput = 'input[name="interest_rate"]', termOfLoanInput = "#term_of_loan", coverageInput = "#coverage";

    const maxStep = 1; // define how many steps in total (this ensures scalability of the app)
    let currStep = 0; // cover page; results page = maxStep + 1;

    const file = "Tables/HPS Premium Table.csv"
    const lookupTable = {}

    // load data into lookup table upfront
    const processCSV = function (csvString) {

        let lines = csvString.split("\n");
        for (const line of lines.slice(1)) {
            let lineItems = line.split(",");
            lineItems.reduce((acc, currVal, currIdx, arr) => {
                if (currIdx < 3) {
                    return acc[currVal] = acc[currVal] ?? {}
                } else if (currIdx == 3) {
                    return acc[currVal] = arr[currIdx + 1]
                }
            }, lookupTable)
        }
    };

    const extractFromFile = function () {
        $.ajax({
            type: "GET",
            url: file,
            dataType: "text",
            success: function (response) {
                processCSV(response);
            }
        });
    }

    extractFromFile();

    const init = function () {
        console.log("executing init now");
        // Do not modify the codes that are added here
        $.fn.globalHeader();
        $.fn.Tooltips();
        $.fn.DropDownMenu();
        $("input[type='checkbox']:not(#coverCheckbox)").on('change', selectionChangeCheckbox);
        $("input[type='radio']").on('change', selectionChangeRadioButton);
        $(".cmp-inputs").NumericalInput();

        // Remove if day picker is not required
        $(".sb-datepicker-container.cmp-inputs.sb-datepicker-container--day").DatepickerDate();
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
                $("#nextBtn > .cmp-button__text").text("Calculate");
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

                var data = {
                    dob: $(dobInput).val(),
                    gender: {
                        value: $(genderInput + ":checked").val(),
                        text: $(genderInput + ":checked + .cmp-form-options__field-description").text()
                    },
                    loanAmount: $(loanAmountInput).val(),
                    interestRate: {
                        value: $(interestRateInput + ":checked").val(),
                        text: $(interestRateInput + ":checked + .cmp-form-options__field-description").text()
                    },
                    termOfLoan: $(termOfLoanInput).val(),
                    coverage: $(coverageInput).val()
                };

                console.log(data)

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

        // $(dobInput).on("keyup", (e) => {
        //     // if empty, update error message. else, return to original message
        //     // if ($("#dob").val().length == 0) {
        //     //     $("#dob_wrapper #datePickerError").text("Please key in a valid date.").addClass("error");
        //     // } else {
        //     //     $("#dob_wrapper #datePickerError").removeClass("error");

        //     //     console.log($("#dob").val());
        //     // }
        //     // checkEmptyFields();
        // });

        $(dobInput).on("focusout", (e) => {
            // let minDate = new Date($(dobInput).attr("data-min-date"));
            // let maxDate = new Date($(dobInput).attr("data-max-date"));
            // let selectedDate = new Date($("#dob").val());
            // console.log("defocused");

            // if (minDate > selectedDate || maxDate < selectedDate) {
            //     $("#dob_wrapper #datePickerError").text("Please key in a valid date.")
            // }
            checkEmptyFields();
        });

        $(dobInput).on("changeDate", (e) => {
            checkEmptyFields();
        });

        $(genderInput).on("change", (e) => {
            checkEmptyFields();
        });

        $(loanAmountInput).on("focusout", (e) => {
            checkEmptyFields();
        });

        $(interestRateInput).on("change", (e) => {
            checkEmptyFields();
        });

        $(termOfLoanInput).on("focusout", (e) => {
            checkEmptyFields();
        });

        $(coverageInput).on("focusout", (e) => {
            checkEmptyFields();
        });

        $(editBtn).on("click", (e) => {
            window.scrollTo({ top: $("#mainPanel").position().top });
            $(resultsPanel).addClass("hidden");
            $(formPanel).removeClass("hidden");
            $("div[panel-name=step-1]").removeClass("hidden");
            currStep = 1; // return to step 1
        });

        $(newBtn).on("click", (e) => {
            location.reload();
        });

        console.log("all done! ");
    };

    // empty form validation - check that all fields are complete to remove disable button else, throw error message
    function checkEmptyFields() {

        if (($(dobInput).val() != "" && $(dobInput).val() != undefined) &&
            ($(genderInput + ":checked").val() != "" && $(genderInput + ":checked").val() != undefined) &&
            ($(loanAmountInput).val() != "" && $(loanAmountInput).val() != undefined) &&
            ($(interestRateInput + ":checked").val() != "" && $(interestRateInput + ":checked").val() != undefined) &&
            ($(termOfLoanInput).val() != "" && $(termOfLoanInput).val() != undefined) &&
            ($(coverageInput).val() != "" && $(coverageInput).val() != undefined)) {
            $(nextBtn).removeAttr("disabled");
        } else {
            $(nextBtn).attr("disabled", "disabled");
        }
    }

    // Do the data processing here... you can create more functions if required
    const processData = function (data, callback) {
        // Add logic

        const getAge = function (dobStr) {
            const today = new Date()
            const dob = new Date(dobStr)
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff > 0 || (monthDiff === 0 && today.getDate() >= dob.getDate())) {
                age++;
            }
            return age;
        }

        const gender = data.gender.value.toUpperCase();
        const relevantRate = data.interestRate.value === "concessionary" ? "0.03" : "0.04"
        const age = getAge(data.dob);
        const loanTerm = data.termOfLoan;
        const coverage = parseFloat(data.coverage) / 100;
        const loanAmount = parseFloat(data.loanAmount.replaceAll(",", ""));
        const sumAssured = Math.round(coverage * loanAmount * 100) / 100 //rounded to 2 dp
        const premiumRate = lookupTable[gender][relevantRate][age][loanTerm];
        const premiumPayable = (Math.round(sumAssured * premiumRate / 10000 * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) //rounded to 2 dp

        $("#term_of_loan_result").text("For a " + data.termOfLoan + " years loan");
        $("#result_loan_amount").text("$" + data.loanAmount);
        $("#result_interest_rate").text(data.interestRate.text);
        $("#result_coverage").text(data.coverage + "%");
        $("#premium_payment_term").text(`${loanTerm} Years`)
        $("#premium_payable").text(`$${premiumPayable}`)

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
