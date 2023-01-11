// $(this).data('includeClass')

export const renderComponent = {
    standard_button: function (cmpWrapper) {
        var cmp = getCmp(cmpWrapper.data('id'));

        setCmpClass(cmp, cmpWrapper.data('class'));
        setEleText(cmp, '.cmp-button__text', cmpWrapper.data('btntext'));

        if (!cmpWrapper.data('includeIcon')) {
            cmp.find('.icons_space').remove();
        }

        if (cmpWrapper.data('href') != undefined) {
            var a = $("<a>", {
                id: cmpWrapper.data('id'),
                "class": cmp.attr('class'),
                "href": cmpWrapper.data('href'),
                "html": cmp.html()
            });

            cmp.replaceWith(a);
        }

        return new Promise(resolve => {
            resolve();
        });
    },
    text_link: function (cmpWrapper) {
        var cmp = getCmp(cmpWrapper.data('id'));

        if (cmpWrapper.data('class') != undefined) {
            setCmpClass(cmp, cmpWrapper.data('class'));
        }

        setEleText(cmp, '.cmp-button__text', cmpWrapper.data('linktext'));

        if (cmpWrapper.data('iconleft')) {
            cmp.find('.icons_space.icon-dls-arrow-right').remove();
        } else {
            cmp.find('.icons_space.icon-dls-arrow-left').remove();
        }

        cmp.attr('href', cmpWrapper.data('href'));

        return new Promise(resolve => {
            resolve();
        });
    },
    dropdown_button: function (cmpWrapper) {
        var cmp = getCmp(cmpWrapper.data('id'));
        var options = cmpWrapper.data('options').split("|");

        setCmpClass(cmp, cmpWrapper.data('class'));
        setPlaceholder(cmp, undefined, cmpWrapper.data('placeholder'));
        setFieldName(cmp, undefined, cmpWrapper.data('name'))

        options.forEach(option => {
            var opt = document.createElement('option');
            option = JSON.parse(option);

            opt.value = option.value;
            opt.textContent = option.text;

            cmp.append(opt);
        });

        return new Promise(resolve => {
            resolve();
        });
    },
    horizontal_separator: function (cmpWrapper) {
        var cmp = getCmp(cmpWrapper.data('id'));
        setCmpClass(cmp.find("hr"), cmpWrapper.data('class'));

        return new Promise(resolve => {
            resolve();
        });
    },
    vertical_separator: function (cmpWrapper) {
        console.log("rendering " + cmpWrapper.data('id'));

        var cmp = getCmp(cmpWrapper.data('id'));
        setCmpClass(cmp, cmpWrapper.data('class'));

        return new Promise(resolve => {
            resolve();
        });
    },
    single_checkbox: function (cmpWrapper) {
        var cmp = getCmp(cmpWrapper.data('id'));

        setFieldName(cmp, 'input', cmpWrapper.data('name'));
        setEleText(cmp, '.cmp-form-options__field-description', cmpWrapper.data('label'));

        return new Promise(resolve => {
            resolve();
        });
    },
    radio_button: function (cmpWrapper) {
        var cmp = getCmp(cmpWrapper.data('id'));
        var options = cmpWrapper.data('options').split("|");
        var inputName = cmpWrapper.data('name');
        var isDisabled = cmpWrapper.data('isDisabled');
        var isHorizontalStack = cmpWrapper.data('isHorizontalStack');

        setTooltipAndLabel(cmp, '.cmp-selection-tooltip', cmpWrapper.data('inputLabel'), cmpWrapper.data('tooltipContent'));
        setCaptionText(cmp, '.cmp-input-caption', cmpWrapper.data('caption'));

        if (isHorizontalStack) {
            setCmpClass(cmp.find("fieldset"), "is-horizontal-stack");
        }

        options.forEach(option => {
            option = JSON.parse(option);
            var selected = option.selected;

            var optionHTML = `<label class="cmp-form-options__field-label  ${isDisabled != undefined ? "disabled" : ""} ${selected != undefined ? "selected" : ""}">
                <input class="cmp-form-options__field cmp-form-options__field--radio" name="${inputName}" type="radio"
                    value="${option.value}" ${selected != undefined ? "checked" : ""} ${isDisabled != undefined ? "disabled" : ""}/>
                <div class="cmp-form-options__field-description">${option.text}</div>`;

            if (option.caption != undefined) {
                optionHTML += `<div class="caption">${option.caption}</label>`;
            }

            cmp.find("fieldset").append(optionHTML);
        });

        return new Promise(resolve => {
            resolve();
        });
    },
    numerical_input: function (cmpWrapper) {
        var cmp = getCmp(cmpWrapper.data('id'));
        var classNames = "";
        var inputField = cmp.find('input');
        setFieldName(cmp, 'input', cmpWrapper.data('name'));

        setTooltipAndLabel(cmp, '.cmp-input-label', cmpWrapper.data('inputLabel'), cmpWrapper.data('tooltipContent'));
        setCaptionText(cmp, '.cmp-input-caption', cmpWrapper.data('caption'));
        setPlaceholder(cmp, 'input', cmpWrapper.data('placeholder'));

        inputField.attr('value', cmpWrapper.data('defaultValue'));
        inputField.attr('data-step', cmpWrapper.data('step'));
        inputField.attr('id', cmpWrapper.data('fieldId'));

        if (cmpWrapper.data('prefix') != undefined) {
            cmp.find('.prefix').text(cmpWrapper.data('prefix'));
            classNames += "form-control-prefix ";
        } else {
            cmp.find('.prefix').remove();
        }

        if (cmpWrapper.data('suffix') != undefined) {
            cmp.find('.suffix').text(cmpWrapper.data('suffix'));
            classNames += "form-control-suffix ";
        } else {
            cmp.find('.suffix').remove();
        }

        if (cmpWrapper.data('isDecimal')) {
            classNames += "form-control-decimal ";
        }

        setCmpClass(inputField, classNames);

        return new Promise(resolve => {
            resolve();
        });
    },
    dropdown_selector_basic: function (cmpWrapper) {
        var cmp = getCmp(cmpWrapper.data('id'));
        var options = cmpWrapper.data('options').split("|");
        var inputField = cmp.find('select');

        setFieldName(cmp, 'input', cmpWrapper.data('name'));
        setTooltipAndLabel(cmp, '.cmp-input-label', cmpWrapper.data('inputLabel'), cmpWrapper.data('tooltipContent'));
        setCaptionText(cmp, '.cmp-input-caption', cmpWrapper.data('caption'));
        inputField.attr('id', cmpWrapper.data('fieldId'));

        if (cmpWrapper.data('placeholder') != undefined) {
            inputField.attr('placeholder', cmpWrapper.data('placeholder'));
        }

        options.forEach(option => {
            var opt = document.createElement('option');
            option = JSON.parse(option);

            opt.value = option.value;
            opt.textContent = option.text;

            if (option.value == cmpWrapper.data('defaultValue')) {
                opt.setAttribute("selected", "selected");
                opt.classList.add("select--active-item");
                setCmpClass(inputField, "select--item-selected")
            }

            inputField.append(opt);
        });

        return new Promise(resolve => {
            resolve();
        });
    },
    single_date_picker: function (cmpWrapper) {

        const monthsArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var cmp = getCmp(cmpWrapper.data('id'));
        var inputField = cmp.find('input');

        inputField.attr('id', cmpWrapper.data('fieldId'));
        setTooltipAndLabel(cmp, '.cmp-form-label', cmpWrapper.data('inputLabel'), cmpWrapper.data('tooltipContent'));

        if (cmpWrapper.data('tooltipContent') != undefined) {
            cmp.find('.cmp-form-label').remove();
        }

        setCaptionText(cmp, '.cmp-input-caption', cmpWrapper.data('caption'));

        if (cmpWrapper.data('default') != undefined) {
            inputField.attr('data-default-date', cmpWrapper.data('default'));
        }

        // Age checking takes priority over min/max date
        if (cmpWrapper.data('checkAge')) {
            // data-min-age="21" data-max-age="65"
            let today = new Date();
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            let minDate = tomorrow.getDate() + " " + monthsArr[tomorrow.getMonth()] + " " + (tomorrow.getFullYear() - cmpWrapper.data('maxAge'));
            let maxDate = today.getDate() + " " + monthsArr[today.getMonth()] + " " + (today.getFullYear() - cmpWrapper.data('minAge'));

            inputField.attr('data-min-date', minDate); // min date should not include today's date (should be +1 day)
            inputField.attr('data-max-date', maxDate);
        } else {
            if (cmpWrapper.data('minDate') != undefined && cmpWrapper.data('maxDate') != undefined) {
                inputField.attr('data-min-date', cmpWrapper.data('minDate'));
                inputField.attr('data-max-date', cmpWrapper.data('maxDate'));
            }
        }

        if (cmpWrapper.data('datepickerType') == 'day') {
            cmp.addClass('sb-datepicker-container--day');
            inputField.attr('data-picker-distance', "4");
            inputField.attr('maxlength', "10");
            inputField.attr('data-focus-format', "dd/mm/yyyy");
            inputField.attr('data-unfocus-format', "d M yyyy");
            setPlaceholder(cmp, 'input', "DD/MM/YYYY");
        } else if (cmpWrapper.data('datepickerType') == 'month') {
            cmp.addClass('sb-datepicker-container--month');
            inputField.attr('data-picker-distance', "4");
            inputField.attr('maxlength', "7");
            inputField.attr('data-focus-format', "mm/yyyy");
            inputField.attr('data-unfocus-format', "M yyyy");
            setPlaceholder(cmp, 'input', "MM/YYYY");
        } else if (cmpWrapper.data('datepickerType') == 'year') {
            cmp.addClass('sb-datepicker-container--year');
            inputField.attr('data-picker-distance', "4");
            inputField.attr('maxlength', "4");
            setPlaceholder(cmp, 'input', "YYYY");
        }

        return new Promise(resolve => {
            resolve();
        });
    },
    section_header: function (cmpWrapper) {
        var cmp = getCmp(cmpWrapper.data('id'));
        var headlineStyle = cmpWrapper.data('headlineStyle');

        if (cmpWrapper.data('overline') != undefined) {
            setEleText(cmp, '.headline-6', cmpWrapper.data('overline'));
        } else {
            cmp.find('.headline-6').remove();
        }

        if (cmpWrapper.data('headline') != undefined) {
            if (headlineStyle != undefined && headlineStyle != "H3") {
                var newHeadline = $("<" + headlineStyle + ">", {
                    "class": cmp.find('.title__text').attr('class'),
                    "text": cmpWrapper.data('headline')
                });

                cmp.find('.title__text').replaceWith(newHeadline);
            } else {
                setEleText(cmp, '.title__text', cmpWrapper.data('headline'));
            }
        } else {
            cmp.find('.title__text').remove();
        }

        if (cmpWrapper.data('headlinePara') != undefined) {
            setEleText(cmp, '.para_1', cmpWrapper.data('headlinePara'));
        } else {
            cmp.find('.para_1').remove();
        }

        if (cmpWrapper.data('subsectionHeadline') != undefined) {
            setEleText(cmp, '.subsection_title', cmpWrapper.data('subsectionHeadline'));
        } else {
            cmp.find('.section-header__subsection').remove();
        }

        if (cmpWrapper.data('subsectionHeadlinePara') != undefined) {
            setEleText(cmp, '.para_2', cmpWrapper.data('subsectionHeadlinePara'));
        } else {
            cmp.find('.para_2').remove();
        }

        if (cmpWrapper.data('href') != undefined) {
            cmp.find('.cmp-button.cmp-button--link').attr('href', cmpWrapper.data('href'));
            cmp.find('.cmp-button.cmp-button--link .cmp-button__text').text(cmpWrapper.data('linktext'));
        } else {
            cmp.find('.cmp-button.cmp-button--link').remove();
        }

        if (cmpWrapper.data('class') != undefined) {
            cmp.find('.section-head').addClass(cmpWrapper.data('class'));
        }

        return new Promise(resolve => {
            resolve();
        }); z

    },
    // template: function (cmpWrapper) {
    //     var cmp = getCmp(cmpWrapper.data('id'));
    //     var inputField = cmp.find('select');

    //     setFieldName(cmp, 'input', cmpWrapper.data('name'));
    //     setTooltipAndLabel(cmp, '.cmp-input-label', cmpWrapper.data('inputLabel'), cmpWrapper.data('tooltipContent'));
    //     setEleText(cmp, '.cmp-input-caption', cmpWrapper.data('caption'));
    //     inputField.attr('id', cmpWrapper.data('fieldId'));
    // }
};


export const getCmp = function (id) { return $("#" + id) }

const setCmpClass = function (cmp, classListString) {
    var classArr = classListString.split(" ");

    classArr.forEach(className => {
        cmp.addClass(className);
    });
}

const setEleText = function (cmp, ele, value) {
    if (value == undefined) {
        cmp.find(ele).remove();
    } else {
        cmp.find(ele).text(value);
    }
}

const setCaptionText = function (cmp, ele, value) {
    if (value != undefined) {
        cmp.find(ele).text(value);
    } else {
        cmp.find(ele).text("");
    }
}

const setTooltipAndLabel = function (cmp, labelWrapper, label, tooltipContent) {
    if (tooltipContent != undefined) {
        setEleText(cmp, '.cmp-tooltip-demo-wrapper .cmp-input-label--text', label);
        setEleText(cmp, '.cmp-tooltip-demo-wrapper .cmp-tooltip--content', tooltipContent);
        cmp.find(labelWrapper + ' > .cmp-input-label--text').remove();
    } else {
        setEleText(cmp, labelWrapper + ' > .cmp-input-label--text', label);
        cmp.find('.cmp-tooltip-demo-wrapper').remove();
    }
}

const setFieldName = function (cmp, ele, value) {
    if (ele == undefined) {
        cmp.attr('name', value);
    } else {
        cmp.find(ele).attr('name', value);
    }

}

const setPlaceholder = function (cmp, ele, value) {
    if (ele == undefined) {
        cmp.attr('placeholder', value);
    } else {
        cmp.find(ele).attr('placeholder', value);
    }
}