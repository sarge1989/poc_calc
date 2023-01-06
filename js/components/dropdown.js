/**
 * @author []
 * @email [theon.thai@accenture.com]
 * @create date 2021-11-16 15:10:38
 * @modify date 2022-03-01 10:46:13
 * @desc [
 * JS document for dropdowns to occur. Currently known use place is as stated below.
 *   - SelectionMenu
 *   - Anchor link navigation
 *   - Anchor card navigation
 *
 * Multi-selection occurs by looking at specific class "select-multi-select"
 *
 */
(function ($) {
  // Class utilities
  $.fn.DropDownMenu = function () {

    const version = "3.0.0";
    const hasClass = function (el, cl) {
      if (el && cl) {
        if (el.classList) {
          return (el.classList + "").indexOf(cl) > -1;
        } else if (el.className) {
          return !!el.className.match(new RegExp("(\\s|^)" + cl + "(\\s|$)"));
        }
      } else {
        return false;
      }
    };

    const addClass = function (el, cl) {
      if (el) {
        if (el.classList) {
          el.classList.add(cl);
        } else {
          if (!hasClass(el, cl)) el.className += " " + cl;
        }
      }
    };

    const removeClass = function (el, cl) {
      if (el) {
        if (el.classList) {
          el.classList.remove(cl);
        } else {
          if (hasClass(el, cl)) {
            var reg = new RegExp("(\\s|^)" + cl + "(\\s|$)");
            el.className = el.className.replace(reg, " ");
          }
        }
      }
    };

    const redirectToTarget = function (target) {
      if (target === "null" || target === "undefined") {
        return "#!";
      } else {
        if (target.indexOf("#") != -1) {
          var uri = $(location).attr("href") + target;
          return encodeURI(uri);
        } else {
          return target;
        }
      }
    };

    const cleanup = function () {
      $("div.select").remove();
      $("select.select").removeAttr("Style");
    };

    cleanup();

    //Script to generate basic textbox
    // Utility function to create non-input textbox.
    const createTextBox = function (label, placeholder, nodeType) {
      var el = nodeType || "div"; // Because IE < 11 doesn't support default parameter.

      var textBoxNode = document.createElement(el);
      textBoxNode.className = "textbox";

      var inputNode = document.createElement("div");
      inputNode.className = "textbox__input";

      var truncationTitle = document.createElement("span");

      truncationTitle.innerHTML = placeholder;

      var placeholderNode = document.createElement("div");
      placeholderNode.className = "textbox__placeholder";

      var placeholderSpanNode = document.createElement("span");
      placeholderSpanNode.className = "textbox__spanPlaceholder";

      var placeholderOverflowSpanNode = document.createElement("span");
      placeholderOverflowSpanNode.className =
        "textbox__spanPlaceholderOverflow";

      placeholderNode.dataset.counter = 0;

      placeholderOverflowSpanNode.innerHTML = placeholder;

      inputNode.appendChild(truncationTitle);
      inputNode.appendChild(placeholderNode);
      placeholderNode.appendChild(placeholderSpanNode);
      placeholderSpanNode.appendChild(placeholderOverflowSpanNode);

      textBoxNode.appendChild(inputNode);

      return textBoxNode;
    };

    // Select component script

    // Check if Select eventlistener is already applied to document.
    var closeAllEvent = false;

    // Select component class.
    const Select = function (node) {
      this.node = node;
      this.name = node.getAttribute("name");
      this.excludeClassName = "";
      if (!this.name) {
        throw new Error("Each select node must have a unique name!");
      }

      this.label = node.getAttribute("label") || "";
      this.placeholder =
        node.getAttribute("placeholder") ||
        (node.options[node.selectedIndex] &&
          node.options[node.selectedIndex].text) ||
        "Select option";
      this.parentNode = node.parentNode;
      this.multiLine = node.dataset.multiline;
      this.type = node.getAttribute("type");
      this.optgroups = node.getElementsByTagName("optgroup");
      this.optgroupChildren = {};
      if (this.optgroups && this.optgroups.length) {
        for (var i = 0; i < this.optgroups.length; i++) {
          this.optgroupChildren[this.optgroups[i].label] =
            this.optgroups[i].getElementsByTagName("option");
        }
      } else {
        this.options = node.getElementsByTagName("option");
      }
      this.row = node.getAttribute("row")
        ? parseInt(node.getAttribute("row"), 10)
        : 5;

      // Pre-generate nodes.
      // Main select node.
      this.select = document.createElement("div");
      // Dropdown button to toggle and display currently selected item.
      this.selectToggle = document.createElement("div");
      // Dropdown placeholder.
      this.selectPlaceholder = createTextBox(
        this.label,
        this.placeholder,
        "li",
      );
      // Dropdown options, including placeholder.
      this.selectOptions = document.createElement("ul");
      // Dropdown selectable options.
      this.selectableOptions = document.createElement("ul");
      // Dropdown Multi Select
      this.selectMulti = document.createElement("div");

      // Store currently selected option to implement better interaction.

      this.currentlySelected = null;
    };

    // Close all select dropdown except provided exclude node.
    //It is defined as Static method to hook once to global document object.

    Select.closeAll = function (exclude) {
      var activeNodes = document.getElementsByClassName("select--active");

      Object.keys(activeNodes).forEach(function (key) {
        var node = activeNodes[key];

        if (!node) {
          return;
        }

        if (node.item) {
          node = node.item(0);
        }

        if (node === exclude) {
          return;
        }

        // REMOVE ME: For demonstration only. Can be removed on production.
        // if (hasClass(node, this.excludeClassName)) {
        //   return;
        // }

        removeClass(node, "select--active");
        removeClass(node.parentNode, "select-focus");
      });
    };

    // Handle click.

    Select.prototype.onClick = function () {
      if (
        hasClass(this.select, "readonly") ||
        hasClass(this.select, "disabled")
      ) {
        // Do nothing if readonly / disabled
      } else if (hasClass(this.select, "select--active")) {
        // If it's open, close it
        removeClass(this.select, "select--active");
        $(this).parent().removeClass("select-focus");
      } else {
        // If it all clears. Open it.
        addClass(this.select, "select--active");
        $(this).parent().addClass("select-focus");
      }

      Select.closeAll(this.select);
    };

    // Handle item select.

    Select.prototype.onSelect = function (target, index) {
      // For demonstration only.
      if (hasClass(this.node, this.excludeClassName)) {
        return;
      }
      if (
        hasClass(this.select, "dropdown-menu-selector") ||
        hasClass(this.select, "icon-selector") ||
        hasClass(this.select, "breadcrumb-selector")
      ) {
        var e = new CustomEvent("change");
        this.node.dispatchEvent(e);

        Select.closeAll();
        return;
      }

      if (this.currentlySelected === target) {
        return;
      }

      if (hasClass(target, "textbox")) {
        this.node.selectedIndex = index;
        this.selectToggle.innerHTML = target.innerHTML;
        removeClass(this.select, "select--item-selected");

        if (this.currentlySelected) {
          removeClass(this.currentlySelected, "select--active-item");
        }

        this.currentlySelected = null;
      } else {
        var textBoxNode = createTextBox(this.label, target.innerHTML);
        this.selectToggle.innerHTML = textBoxNode.innerHTML;
        addClass(this.select, "select--item-selected");
        this.node.selectedIndex = index;

        if (this.currentlySelected) {
          removeClass(this.currentlySelected, "select--active-item");
        }

        this.currentlySelected = target;
        addClass(this.currentlySelected, "select--active-item");

        if (hasClass(this.select, "cmp-button-dropdown-alt")) {
          this.select.title = target.innerHTML;
        }
      }

      // Trigger synthetic change event for future extensibility.

      var e = new CustomEvent("change");
      this.node.dispatchEvent(e);

      Select.closeAll();
    };

    Select.prototype.onSelectMulti = function (target, index, optgroupID) {
      target.classList.toggle("select--active-item");

      let placeholderText = this.selectToggle.querySelector(
        ".textbox__placeholder",
      );

      let placeholderSpanText = this.selectToggle.querySelector(
        ".textbox__spanPlaceholder",
      );

      if (target.classList.contains("select--active-item")) {
        (this.currentlySelected = this.currentlySelected || []).push([optgroupID, index]);
        let placeholderDataCounter = placeholderText.dataset.counter;

        // Counter functions
        let incrementDataCounter = parseFloat(placeholderDataCounter) + 1;
        // Increment
        placeholderText.dataset.counter = incrementDataCounter;

        if (incrementDataCounter > 1) {
          // Multiple option text
          placeholderSpanText.innerHTML = `${incrementDataCounter} options selected`;
          placeholderText.classList.add("selected");
        } else if (incrementDataCounter == 0) {
          // Default text
          placeholderSpanText.innerHTML = "Select option";
          placeholderText.classList.remove("selected");
        } else {
          // 1 option text
          placeholderSpanText.innerHTML =
            this.node.options[this.currentlySelected[0][1]].text;
          placeholderText.classList.add("selected");
        }
      } else {

        this.currentlySelected = this.currentlySelected.filter((item) => {
          return !(item[0] === optgroupID && item[1] === index)
        }
        );
        let placeholderDataCounter = placeholderText.dataset.counter;

        // Remove from text
        let decrementDataCounter = parseFloat(placeholderDataCounter) - 1;

        // Decrement
        placeholderText.dataset.counter = decrementDataCounter;

        if (decrementDataCounter > 1) {
          // Multiple option text
          placeholderSpanText.innerHTML = `${decrementDataCounter} options selected`;
          placeholderText.classList.add("selected");
        } else if (decrementDataCounter == 0) {
          // Default text
          placeholderSpanText.innerHTML = "Select option";
          placeholderText.classList.remove("selected");
        } else {
          // 1 option text
          placeholderSpanText.innerHTML =
            this.node.options[this.currentlySelected[0][1]].text;
          placeholderText.classList.add("selected");
        }
        decrementDataCounter;
      }

      var e = new CustomEvent("change");
      this.node.dispatchEvent(e);
    };

    // Set option dropdown height.

    Select.prototype.setOptionHeight = function () {
      var rowHeight =
        this.selectableOptions.children[0]?.getBoundingClientRect().height;
      this.selectableOptions.style.height = (rowHeight + 1) * this.row + "px";
    };

    // Initialisation methods.
    // Methods are micro-defined as prototypes so initialisation scripts can be
    // easily extended to child classes.

    // 1. Set class names.

    Select.prototype.initClassNames = function () {
      this.select.className = this.node.className;
      this.selectToggle.className = "textbox dropdown_selected";
      addClass(this.selectPlaceholder, "dropdown_placeholder");
      this.selectOptions.className = "dropdown_options";
      this.selectableOptions.className = "dropdown_selectable-options";
      this.selectMulti.className = "select-multi-select";
    };

    // 2. Add select display button and hook event.

    Select.prototype.initButton = function () {
      var _this = this;

      this.selectOptions.appendChild(this.selectPlaceholder);
      this.selectPlaceholder.addEventListener("click", function (e) {
        e.stopPropagation();
        _this.onSelect(_this.selectPlaceholder, -1);
      });
    };

    // 3. Generate options.

    Select.prototype.initOptions = function () {

      var _this = this;

      var socialIocn = $(".icon-default .cmp-button span");
      var $pdfIcon = $(".icon-default .cmp-button .icon-dls-pdf");
      var $printIcon = $(".icon-default .cmp-button .icon-dls-print");
      if ($(socialIocn).hasClass("icon-dls-pdf")) {
        $pdfIcon.parent().parent().addClass("icon-divider");
      } else if ($(socialIocn).hasClass("icon-dls-print")) {
        $printIcon.parent().parent().addClass("icon-divider");
      }

      if (this.optgroups && this.optgroups.length) {
        Object.keys(this.optgroups).forEach(function (key, index) {
          var optgroup = _this.optgroups[key];
          var optionGroupName = optgroup.label;

          var listItem = document.createElement("li");
          listItem.className = "dropdown_optGroup";

          listItem.appendChild(document.createTextNode(optionGroupName));
          _this.selectableOptions.appendChild(listItem);

          Object.keys(_this.optgroupChildren[optgroup.label]).forEach(function (
            key,
            index,
          ) {
            var option = _this.optgroupChildren[optgroup.label][key];
            var optionName = option.textContent;
            var optionDescription = option.dataset.description;
            var optionIcon = option.getAttribute("icon");
            var optionIconPath = option.getAttribute("icon-path");

            var listItem = document.createElement("li");
            listItem.className = "dropdown_selectable";
            listItem.className = "dropdown_selectable sub__item";

            if (option.className) {
              addClass(listItem, option.className);
            }
            listItem.appendChild(document.createTextNode(optionName));

            if (_this.multiLine) {
              var subtitle = document.createElement("div");
              subtitle.className = "dropdown_selectable--subtitle";
              subtitle.appendChild(document.createTextNode(optionDescription));
              listItem.appendChild(subtitle);
            } else if (_this.type === "icon") {
              var iconContainer = document.createElement("div");
              var icon = document.createElement("span");
              icon.className = "dropdown-icons_space";
              var iconEl = document.createElement("i");
              iconEl.className = optionIcon;
              icon.appendChild(iconEl);
              if (option.className) {
                addClass(iconContainer, option.className);
              }
              iconContainer.appendChild(icon);
              iconContainer.appendChild(document.createTextNode(optionName));
              listItem.appendChild(iconContainer);
            }

            // Added functionality of multi-select within the category list
            var stringMultiSelect = "";

            // DLS TODO: This code is incorrect as it will search through the whole dom to find this classname
            // i.e. it will incorrectly set selection menu that are not supposed to have multi-select functionality to be able to choose multiple values
            // var rowMultiSelect = document.getElementsByClassName(
            //   "select-multi-select",
            // ); 
            // if (rowMultiSelect.length) {
            //   stringMultiSelect = rowMultiSelect[0].className;
            // }

            // DLS TODO: Fixed incorrect code
            var currentNode = document.getElementById(_this.node.id);

            if (currentNode.classList.contains("select-multi-select")) {
              stringMultiSelect = currentNode.className;
            }

            // Logic checks if select-multi-select class is present.
            listItem.addEventListener("click", function (e) {
              if (stringMultiSelect.includes("select-multi-select")) {
                let optgroupID = [...optgroup.parentElement.children].indexOf(optgroup)
                e.stopPropagation();
                _this.onSelectMulti(listItem, index, optgroupID);
              } else {
                e.stopPropagation();
                _this.onSelect(listItem, index);
              }
            });

            _this.selectableOptions.appendChild(listItem);
          });
        });
      } else {
        setTimeout(() => {
          var elms = document.getElementsByClassName(
            this.selectableOptions.className,
          );
          if (this.options.length > 5) {
            for (var i = 0; i < elms.length; i++) {
              elms[i].className += " options-exceed";
            }
          }
          var shareIconTablet = $(".select-list-item-icon.icon-tablet");

          var shareIconMore = $(".icon-share-more");

          if (shareIconTablet.length == 0) {
            if (shareIconMore) {
              for (var i = 0; i < shareIconMore.length; i++) {
                if (shareIconMore[i]) {
                  shareIconMore[i].className += " icon-phone";
                }
              }
            }
          }
        }, 0);

        var stringMultiSelect = "";
        // Incorrect code
        // var rowMultiSelect = document.getElementsByClassName(
        //   this.selectMulti.className,
        // );

        // if (rowMultiSelect.length) {
        //   stringMultiSelect = rowMultiSelect[0].className;
        // }

        // DLS TODO: Fixed incorrect code
        var currentNode = document.getElementById(_this.node.id);

        if (currentNode.classList.contains(this.selectMulti.className)) {
          stringMultiSelect = currentNode.className;
        }

        Object.keys(this.options).forEach(function (key, index) {
          var option = _this.options[key];
          var optionName = option.textContent;

          var optionDescription = option.dataset.description;
          var optionIcon = option.getAttribute("icon");
          var optionValue = option.getAttribute("value");
          var clickId = option.getAttribute("data-analytics-click-id");
          var clickText = option.getAttribute("data-analytics-text");
          var analyticSession = option.getAttribute("data-analytics-section");
          var target = option.getAttribute("target");

          var listItem = document.createElement("li");
          listItem.className = "dropdown_selectable";

          if (_this.type === "icon") {
            var iconContainer = document.createElement("a");
            var iconEl = document.createElement("span");
            iconEl.className = optionIcon;
            if (optionValue) {
              iconContainer.setAttribute("href", redirectToTarget(optionValue));
            }
            if (clickId) {
              iconContainer.dataset["analyticsClickId"] = clickId;
            }
            iconContainer.dataset["analyticsText"] = clickText ? clickText : "";
            if (analyticSession) {
              iconContainer.dataset["analyticsSection"] = analyticSession;
            }
            iconContainer.target = "_blank";
            if (target) {
              iconContainer.target = target;
            }
            iconContainer.appendChild(iconEl);

            var textDiv = document.createElement("div");
            textDiv.innerHTML = optionName;
            iconContainer.appendChild(textDiv);
            if (option.className) {
              var classNames = option.className.split(" ");
              classNames.forEach((val) => {
                addClass(listItem, val);
              });
            }
            listItem.appendChild(iconContainer);
          } else if (
            hasClass(_this.select, "breadcrumb-selector") ||
            hasClass(_this.select, "global-header-navbar-selector")
          ) {
            var itemContainer = document.createElement("a");
            if (optionValue) {
              itemContainer.setAttribute("href", redirectToTarget(optionValue));
            }
            if (clickId) {
              itemContainer.dataset["analyticsClickId"] = clickId;
            }
            if (clickText) {
              itemContainer.dataset["analyticsText"] = clickText;
            }
            if (analyticSession) {
              itemContainer.dataset["analyticsSection"] = analyticSession;
            }
            itemContainer.appendChild(document.createTextNode(optionName));
            if (option.className) {
              var classNames = option.className.split(" ");
              classNames.forEach((val) => {
                addClass(listItem, val);
              });
            }
            listItem.appendChild(itemContainer);
          } else {
            if (option.className) {
              addClass(listItem, option.className);
            }
            listItem.appendChild(document.createTextNode(optionName));

            // set default selected value
            if (listItem.classList.contains("select--active-item")) {
              _this.currentlySelected = listItem;
            }
          }

          if (_this.multiLine) {
            var subtitle = document.createElement("div");
            subtitle.className = "dropdown_selectable--subtitle";
            subtitle.appendChild(document.createTextNode(optionDescription));
            listItem.appendChild(subtitle);
          }

          listItem.addEventListener("click", function (e) {
            if (stringMultiSelect.includes("select-multi-select")) {
              e.stopPropagation();
              _this.onSelectMulti(listItem, index);
            } else {
              e.stopPropagation();
              _this.onSelect(listItem, index);
            }
          });

          _this.selectableOptions.appendChild(listItem);
        });
      }

      this.selectOptions.appendChild(this.selectableOptions);
    };

    // 4. Hook events.

    Select.prototype.initEventListener = function () {
      var _this = this;

      this.select.addEventListener("click", function (e) {
        e.stopPropagation();
        _this.onClick();
      });
    };

    // 5. First initialisation.

    Select.prototype.initSetup = function () {
      if (
        hasClass(this.select, "dropdown-menu-selector") ||
        hasClass(this.select, "icon-selector")
      ) {
        var iconContainer = document.createElement("div");
        iconContainer.className = "icons_space icons_round";
        var iconEl = document.createElement("span");
        iconEl.className = this.node.getAttribute("icon-src");
        iconEl.innerHTML = this.node.getAttribute("trigger-name");
        iconEl.alt = this.node.getAttribute("icon-alt");
        iconContainer.appendChild(iconEl);

        this.selectToggle.innerHTML = iconContainer.outerHTML;
        this.select.appendChild(this.selectToggle);
      } else if (hasClass(this.select, "breadcrumb-selector")) {
        var divContainer = document.createElement("div");
        divContainer.className = "button";
        var linkContainer = document.createElement("span");
        linkContainer.className = "cmp-button cmp-button--link";
        var linkDescEl = document.createElement("span");
        linkDescEl.className = "cmp-button__text";
        linkDescEl.innerHTML = "...";
        var linkArrowEl = document.createElement("span");
        linkArrowEl.className = "icons_space icon-dls-arrow-right";
        linkContainer.appendChild(linkDescEl);
        //linkContainer.appendChild(linkArrowEl);
        divContainer.appendChild(linkContainer);

        this.selectToggle.innerHTML = divContainer.outerHTML;
        this.select.appendChild(this.selectToggle);
      } else {
        this.selectToggle.innerHTML = this.selectPlaceholder.innerHTML;
        this.select.appendChild(this.selectToggle);
      }

      this.select.appendChild(this.selectOptions);
      this.node.style.display = "none";
      this.node.selectedIndex = -1;
      this.parentNode.insertBefore(this.select, this.node);

      this.setOptionHeight();

      if (!closeAllEvent) {
        document.addEventListener("click", Select.closeAll);
        closeAllEvent = true;
      }
    };

    // 6. Finally, initialise!

    Select.prototype.init = function () {
      this.initClassNames();
      this.initButton();
      this.initOptions();
      this.initEventListener();
      this.initSetup();
    };

    // Medium Dropdown list
    var medDropdown = $(".select.dropdown.select-medium-list");

    medDropdown.each(function () {
      var medContainer = $(this),
        medTextBox = medContainer.find(".textbox__spanPlaceholder"),
        medButton = medContainer.find(".textbox__input");

      medButton.click(function (e) {
        e.preventDefault();

        medContainer.addClass("select-medium--active");
      });

      medContainer.find(".dropdown_selectable.sub__item").click(function (e) {
        e.preventDefault();

        medContainer
          .find(".dropdown_selectable.sub__item")
          .removeClass("select--active-item");

        var valuetext = $(this).data("val");

        $(this).addClass("select--active-item");

        medTextBox.text(valuetext);
        medContainer.removeClass("select-medium--active");
      });

      $(document).click(function (e) {
        e.stopPropagation();

        if (medContainer.has(e.target).length === 0) {
          medContainer.removeClass("select-medium--active");
        }
      });
    });

    // 5. Initialise component.

    // Detect all select component and initialise.
    // Prefer querySelectorAll over getElementsByClassName as each iteration will cause
    // changes in class name, resulting in unexpected result for HTMLCollection reference.

    var selectNodes = document.querySelectorAll("select.select");

    // Use Object.keys as IE browsers do not support forEach for querySelectorAll list.
    Object.keys(selectNodes).forEach(function (key) {
      var selectNode = selectNodes[key],
        checkExist = $(selectNode.parentNode).find("div.select").length;

      if (checkExist > 0) {
        return;
      }

      var select = new Select(selectNode);
      select.init();
      // window.addEventListener("scroll", Select.closeAll);
    });

    var inputColumnDropdown = document.getElementById("input-column-dropdown");
    if (inputColumnDropdown !== null) {
      if (inputColumnDropdown.classList.contains("disabled")) {
        inputColumnDropdown.disabled = true;
      } else {
        inputColumnDropdown.disabled = false;
      }
      if (inputColumnDropdown.classList.contains("readonly")) {
        inputColumnDropdown.readOnly = true;
      } else {
        inputColumnDropdown.readOnly = false;
      }
    }

    $('.social-sharing-list a[target="_blank"]').removeAttr("target");

    $(".cmp-button-dropdown-alt").mousemove(function (event) {
      var relX = event.pageX - $(this).offset().left;
      var relY = event.pageY - $(this).offset().top;
      $(this).find(".textbox__input > span").css({
        top: relY,
        left: relX,
      });
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
  $(function () {
    // $.fn.DropDownMenu();
  });
})(jQuery);