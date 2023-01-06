(function ($) {
    $.fn.ShowSuggestions = function () {
        const version = "4.1.0";

        $(document).ready(function () {
            const datalist = document.getElementById("suggestions");
            const input = document.getElementById("text-field-column");
            var firstIndex, lastIndex, currentFocus, count = 0;

            for (let option of datalist.options) {
                option.onclick = function () {
                    input.value = option.value;
                    $(datalist).css({
                        display: "none",
                    });
                    currentFocus = 0;
                    removeActive(datalist.options);
                };
            }

            input.oninput = function () {
                var text = input.value.toUpperCase();
                for (let option of datalist.options) {
                    if (option.value.toUpperCase().indexOf(text) > -1) {
                        $(datalist).css({
                            display: "block",
                        });
                        $(option).css({
                            display: "block",
                        });
                        $(option).removeClass('changed');
                    }
                    else {
                        $(option).css({
                            display: "none",
                        });
                    }
                }
                count = $(datalist.options).filter(function () {
                    return $(this).css('display') === 'block';
                }).length;

                getLastIndex(datalist.options);
                getFirstIndex(datalist.options);

                if (input.value == "" || (count == 0)) {
                    $(datalist).css({
                        display: "none",
                    });
                }
                currentFocus = 0;
                removeActive(datalist.options);
            };

            input.onkeydown = function (e) {
                if (e.key === 'ArrowDown') {
                    currentFocus++;
                    if (currentFocus > 3) {
                        $(datalist).animate({ scrollTop: ($(datalist).scrollTop() + $(datalist).position().top) }, 10);
                    }
                    if ($(datalist.options[currentFocus]).is(':hidden')) {
                        if (count < 3) {
                            currentFocus = lastIndex;
                        }
                        else {
                            currentFocus = lastIndex;
                        }
                        addActive(datalist.options);
                        return;
                    }
                    addActive(datalist.options);
                }
                else if (e.key === 'ArrowUp') {
                    currentFocus--;
                    if (currentFocus >= (datalist.options).length) {
                        currentFocus--;
                    }
                    if ($(datalist.options[currentFocus]).is(':hidden')) {
                        if (count < 3) {
                            currentFocus = firstIndex;
                        }
                        else {
                            currentFocus = lastIndex;
                        }
                        addActive(datalist.options);
                        return;
                    }
                    if (currentFocus < 5) {
                        $(datalist).animate({ scrollTop: ($(datalist).scrollTop() - $(datalist).position().top) }, 10);
                    }
                    addActive(datalist.options);
                }
                else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (currentFocus > -1) {
                        if (datalist.options) {
                            datalist.options[currentFocus].click();
                        }
                    }
                    $(datalist.options).css({
                        display: "none",
                    });
                    $(datalist).css({
                        display: "none",
                    });
                    currentFocus = 0;
                    removeActive(datalist.options);
                }
            };

            function addActive(x) {
                removeActive(x);
                if (currentFocus >= x.length) {
                    currentFocus = x.length - 1;
                }
                else if (currentFocus < 0) {
                    currentFocus = 0
                }
                x[currentFocus].classList.add("active");
            }

            function removeActive(x) {
                for (var i = 0; i < x.length; i++) {
                    x[i].classList.remove("active");
                }
            }

            function getLastIndex(x) {
                lastIndex = $(x).filter(function () {
                    return $(this).css('display') === 'block';
                }).last().index();

                $(x[lastIndex]).addClass('changed');
            }

            function getFirstIndex(x) {
                firstIndex = $(x).filter(function () {
                    return $(this).css('display') === 'block';
                }).first().index();
            }

        });

        return {
            version,
        };
    };
})(jQuery);