(function ($) {
  $.fn.globalHeader = function () {

    const version = "3.0.0";
    var homepageSliderMobile;
    var header = {
      previousScrollPosition: 0, 
    };

    function loadGlobalHeader() {

      /**
       * Sanitize and encode all HTML characters in a string
       * @param  {String} str  The string to sanitize
       * @return {String} str  The sanitized string
       */
      function sanitizeHTML(str) {
        const map = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#x27;",
          "/": "&#x2F;",
        };
        const reg = /[&<>"'/]/gi;
        return !!str ? str.replace(reg, (match) => map[match]) : undefined;
      }

      $("#searchBox-header-desktop, #searchBox-header-mobile").on(
        "keypress",
        function (e) {
          if (e.which === 13) {
            var siteSectionSearchHeader = $("header").data("siteSectionId");
            if (!siteSectionSearchHeader) {
              siteSectionSearchHeader = "";
            }
            searchPage.trackSearch(
              $(this).val(),
              searchPage.searchBannerCount,
              siteSectionSearchHeader,
            );
            window.location.assign(
              encodeURI(
                $(this).data("searchPageUrl") + "?searchTerm=" + $(this).val(),
              ),
            );
          }
        },
      );

      let hrefVal = encodeURI(location.pathname.split("/")[1]);
      $(
        '.global-header-navbar__left-menu a[href^="/' + hrefVal + '"]',
      ).addClass("global-header-navbar__item-active");

      $(".global-header-megamenu__tab").on("mouseover", () => {
        console.log("mouseover");

        const getSelectedQuickLink = $(
          ".global-header-megamenu-tabpanel:not([hidden]) .global-header-megamenu-tabpanel__quickaction--links ul",
        ).outerHeight();
        const quickLinkRowHeight = 50;

        if (getSelectedQuickLink / quickLinkRowHeight > 1) {
          $(
            ".global-header-megamenu-tabpanel:not([hidden='hidden']) .global-header-megamenu-tabpanel__quickaction--links ul",
          ).addClass("global-header-megamenu-tabpanel__quickaction-left");
        }
      });
      var timer;
      $("#searchBox-header-desktop, #searchBox-header-mobile").keyup(function (
        e,
      ) {
        clearTimeout(timer);
        let searchTerm = $(this).val();
        let searchPageURL =
          $(this).data("searchPageUrl") + "?searchTerm=" + searchTerm;
        let mode = $(this).attr("id").split("-")[2];
        if (searchTerm === "" || searchTerm.length <= 1 || e.which === 13) {
          $(".global-header-suggestion-container-" + mode).html("");
          return;
        }
        let searchResults;
        timer = setTimeout(function () {
          searchPage.searchBannerTerm = searchTerm;
          $.getJSON(
            "/bin/web/search?searchTerm=" +
            searchTerm +
            "&siteSection=" +
            $("#portalIdentifier").val(),
            function (response) {
              searchResults = response["value"];
              searchPage.searchBannerCount = response["@odata.count"];
            },
          )
            .fail(function (response) {
              searchPage.searchBannerCount = 0;
            })
            .always(function () {
              processResult(searchTerm, searchResults, mode, searchPageURL);
            });
        }, 250);
      });

      $(
        "input#searchBox-header-desktop, input#searchBox-header-mobile",
      ).focusin(function () {
        $(this).attr("placeholder", "");
        $(this).css({ "font-weight": "600", color: "#262626" });
      });

      $(
        "input#searchBox-header-desktop, input#searchBox-header-mobile",
      ).focusout(function () {
        $(this).attr("placeholder", Granite.I18n.get("search.placeholder"));
        $(this).css({ "font-weight": "400", color: "#757575" });
      });

      $("input#searchBox-header-desktop, input#searchBox-header-mobile").click(
        function () {
          let mode = $(this).attr("id").split("-")[2];
          $(".global-header-suggestion-container-" + mode).html("");
          $(this).attr("placeholder", "");
          // $(this).val("");
          $(this).css({ "font-weight": "600", color: "#262626" });
        },
      );

      $(
        "#searchBox-header-desktop-button, #searchBox-header-mobile-button",
      ).click(function () {
        var siteSectionSearchHeader = $("header").data("siteSectionId");
        if (!siteSectionSearchHeader) {
          siteSectionSearchHeader = "";
        }
        var searchTerm = $(this).closest(".search-bar").find("input").val();
        searchPage.trackSearch(
          searchTerm,
          searchPage.searchBannerCount,
          siteSectionSearchHeader,
        );
        window.location.assign(
          encodeURI(
            $(this).data("searchPageUrl") + "?searchTerm=" + searchTerm,
          ),
        );
      });

      const processResult = function (
        searchTerm,
        searchResults,
        mode,
        searchPageURL,
      ) {
        var regex = new RegExp(searchTerm, "i");
        var suggestionRc = '<ul class="global-header-suggestion-record">';
        var count = 1;
        var filteredResult = [];

        $.each(searchResults, function (key, val) {
          if (val.Title || val.Description) {
            if (count <= 5) {
              suggestionRc += renderSuggestion(val, searchTerm);
              filteredResult = _.concat(filteredResult, val);
            }
            count++;
          }
        });

        const suggestion = document.querySelector(
          ".global-header-suggestion-container-" + mode,
        );
        suggestion.innerHTML =
          suggestionRc +
          "</ul><div class='suggestion--button-tab'>" +
          renderResultPageBtn(filteredResult.length, searchPageURL) +
          "</div>";
      };

      const renderResultPageBtn = function (recordCount, searchPageURL) {
        var searchIcon = $(".search-bar[data-search-result-icon]").data(
          "search-result-icon",
        );
        return recordCount > 0
          ? `
         <div class='separator'><div class='cmp-separator'><hr class='cmp-separator__horizontal-rule cmp-separator--dotted'></hr></div></div>
         <div class="button">
             <a href="` +
          searchPageURL +
          `"
                 class="cmp-button cmp-button--link">
                 <span class="cmp-button__text">
                     ` +
          Granite.I18n.get("search.viewResults") +
          `
                 </span>
                 <span class="icons_space ` +
          searchIcon +
          `"></span>
             </a>
         </div>`
          : "<div class='suggestion--empty-title'><h5>" +
          Granite.I18n.get("search.noResultsLabel") +
          "</h5></div>";
      };
      const renderSuggestion = function (record, searchTerm) {
        var pattern = new RegExp("(" + searchTerm + ")", "gi");

        return (
          "<li><a href='" +
          record.URL +
          "'><div class='suggestion--content-type'>" +
          record.ContentType +
          "</div><div class='suggestion--title'>" +
          record.Title.replace(pattern, "<b>$1</b>") +
          "</div></a></li>"
        );
      };

      // Navbar function
      $(".global-header-navbar__item--burger").click(function () {
        if ($(".global-header-navbar-mobile__container").hasClass("show")) {
          if (homepageSliderMobile) {
            homepageSliderMobile.play(); // to play homepage banner carousel slider
          }

          $("input#searchBox-header-mobile").val("");
          $("input#searchBox-header-mobile").removeClass("cross-btn");
          $("html, body").animate(
            {
              scrollTop: header.previousScrollPosition,
            },
            200,
            function () {
              window.scroll(0, header.previousScrollPosition);
              $(".root").removeClass("hide-root");
              $(".root").css("display", "block");
              $("footer.footer").css("display", "block");
              $(".global-header-compliance").css({ position: "", top: "" });
              $(".global-header-navbar__container").css({
                position: "",
                top: "",
              });

              animateCSS(
                ".global-header-navbar-mobile__container.show",
                "slideOutRight",
              ).then(() => {
                $(".global-header-navbar-mobile__container").removeClass(
                  "show",
                );
                $(".global-header-navbar-mobile__container--lvl2").removeClass(
                  "show",
                );
                $(".global-header-navbar-mobile__container--lvl3").removeClass(
                  "show",
                );
                if (
                  $(".announcement-bar").length &&
                  $(".announcement-bar").hasClass("cmp-hidden")
                ) {
                  $(".announcement-bar").show();
                  $(".announcement-bar").removeClass("cmp-hidden");
                }
              });

              /**
               * This code is causing Bug 8676 where the anchor bar gets hidden upon opening hamburger
               * This code has been added by Joan for the Bug 7013
               * Bug 7013 is not reproducing anymore, hence removing this code
               */
              /* if(window.scrollY === 0){
                   if($(document).find('.anchor-tab-list').length >0){
                       $(document).find('.anchor-tab-list').closest('.anchor-bar').css('display','none')
                   }
               }else{
                   if($(document).find('.anchor-tab-list').length >0){
                       $(document).find('.anchor-tab-list').closest('.anchor-bar').css('display','block !important')
                   }
               } */
            },
          );
          if ($(this).hasClass("open")) {
            $(this).removeClass("open");
          }
        } else if (
          $(".global-header-navbar-mobile__container--lvl2").hasClass("show")
        ) {
          $("input#searchBox-header-mobile").val("");
          $("input#searchBox-header-mobile").removeClass("cross-btn");
          $("html, body").animate(
            {
              scrollTop: 0,
            },
            200,
            function () {
              $(".root").removeClass("hide-root");
              $(".root").css("display", "block");
              $("footer.footer").css("display", "block");
              $(".global-header-compliance").css({ position: "", top: "" });
              $(".global-header-navbar__container").css({
                position: "",
                top: "",
              });

              animateCSS(
                ".global-header-navbar-mobile__container--lvl2.show",
                "slideOutRight",
              ).then(() => {
                $(".global-header-navbar-mobile__container--lvl2").removeClass(
                  "show",
                );
                $(".global-header-navbar-mobile__container--lvl3").removeClass(
                  "show",
                );
                if (
                  $(".announcement-bar").length &&
                  $(".announcement-bar").hasClass("cmp-hidden")
                ) {
                  $(".announcement-bar").show();
                  $(".announcement-bar").removeClass("cmp-hidden");
                }
              });
            },
          );
          if ($(this).hasClass("open")) {
            $(this).removeClass("open");
          }
        } else if (
          $(".global-header-navbar-mobile__container--lvl3").hasClass("show")
        ) {
          $("input#searchBox-header-mobile").val("");
          $("input#searchBox-header-mobile").removeClass("cross-btn");
          $("html, body").animate(
            {
              scrollTop: 0,
            },
            200,
            function () {
              $(".root").removeClass("hide-root");
              $(".root").css("display", "block");
              $("footer.footer").css("display", "block");
              $(".global-header-compliance").css({ position: "", top: "" });
              $(".global-header-navbar__container").css({
                position: "",
                top: "",
              });

              animateCSS(
                ".global-header-navbar-mobile__container--lvl3.show",
                "slideOutRight",
              ).then(() => {
                $(".global-header-navbar-mobile__container--lvl3").removeClass(
                  "show",
                );
                if (
                  $(".announcement-bar").length &&
                  $(".announcement-bar").hasClass("cmp-hidden")
                ) {
                  $(".announcement-bar").show();
                  $(".announcement-bar").removeClass("cmp-hidden");
                }
              });
            },
          );
          if ($(this).hasClass("open")) {
            $(this).removeClass("open");
          }
        } else {
          if (homepageSliderMobile) {
            homepageSliderMobile.pause(); // to pause homepage banner carousel slider
          }
          if (
            $(".announcement-bar").length &&
            $(".announcement-bar").css("display") !== "none"
          ) {
            $(".announcement-bar").hide();
            $(".announcement-bar").addClass("cmp-hidden");
          }
          $(".global-header-navbar-mobile__container--lvl2").removeClass(
            "show",
          );
          $(".global-header-navbar-mobile__container--lvl3").removeClass(
            "show",
          );

          animateCSS(
            ".global-header-navbar-mobile__container",
            "slideInRight",
          ).then(() => {
            // hide main container and push
            $(".root").addClass("hide-root");
            // hide footer
            $("footer.footer").css("display", "none");
            $(".global-header-compliance").css({ position: "fixed", top: "0" });
            $(".global-header-navbar__container").css({
              position: "fixed",
              top: "0px",
            });
          });
          header.previousScrollPosition = window.scrollY;
          $("html, body").animate({ scrollTop: 0 });
          $(".global-header-navbar-mobile__container").addClass("show");
          $(".floating-container").removeClass("show");
          if (!$(this).hasClass("open")) {
            $(this).addClass("open");
          }
        }
      });

      $(
        '.global-header-navbar-mobile__container .global-header-navbar-mobile__submenu [href^="#"]',
      ).click(function (e) {
        e.preventDefault();
        let _this = this;
        $("html, body").animate(
          {
            scrollTop: 0,
          },
          200,
          function () {
            $(".global-header-compliance").css({ position: "", top: "" });
            $(".global-header-navbar__container").css({
              position: "",
              top: "",
            });
            $(
              `.global-header-navbar-mobile__container--lvl2${$(_this).attr(
                "href",
              )}`,
            ).addClass("show");
            animateCSS(
              `.global-header-navbar-mobile__container--lvl2${$(_this).attr(
                "href",
              )}`,
              "slideInRight",
            ).then(() => {
              $(".global-header-navbar-mobile__container").removeClass("show");
              $(".global-header-compliance").css({
                position: "fixed",
                top: "0",
              });
              $(".global-header-navbar__container").css({
                position: "fixed",
                top: "0px",
              });
              // hide main container and push
              $(".root").css("display", "none");
              // hide footer
              $("footer.footer").css("display", "none");
            });
          },
        );
      });

      $(
        '.global-header-navbar-mobile__container--lvl2 .global-header-navbar-mobile__overview--breadcrumb [href^="#"]',
      ).click(function (e) {
        e.preventDefault();
        $("html, body").animate(
          {
            scrollTop: 0,
          },
          200,
          function () {
            $(".global-header-navbar-mobile__container").addClass("show");
            animateCSS(
              ".global-header-navbar-mobile__container--lvl2.show",
              "slideOutRight",
            ).then(() => {
              $(".global-header-navbar-mobile__container--lvl2").removeClass(
                "show",
              );
            });
          },
        );
      });

      $(
        '.global-header-navbar-mobile__container--lvl2 .global-header-navbar-mobile__links [href^="#"]',
      ).click(function (e) {
        e.preventDefault();
        let _this = this;
        $("html, body").animate(
          {
            scrollTop: 0,
          },
          200,
          function () {
            $(".global-header-compliance").css({ position: "", top: "" });
            $(".global-header-navbar__container").css({
              position: "",
              top: "",
            });
            $(
              `.global-header-navbar-mobile__container--lvl3${$(_this).attr(
                "href",
              )}`,
            ).addClass("show");
            animateCSS(
              `.global-header-navbar-mobile__container--lvl3${$(_this).attr(
                "href",
              )}`,
              "slideInRight",
            ).then(() => {
              $(".global-header-navbar-mobile__container--lvl2").removeClass(
                "show",
              );
              $(".global-header-compliance").css({
                position: "fixed",
                top: "0",
              });
              $(".global-header-navbar__container").css({
                position: "fixed",
                top: "0px",
              });

              // hide main container and push
              $(".root").css("display", "none");
              // hide footer
              $("footer.footer").css("display", "none");
            });
          },
        );
      });

      $(
        '.global-header-navbar-mobile__container--lvl3 .global-header-navbar-mobile__overview--breadcrumb [href^="#"]',
      ).click(function (e) {
        e.preventDefault();
        let _this = this;
        $("html, body").animate(
          {
            scrollTop: 0,
          },
          200,
          function () {
            $(
              `.global-header-navbar-mobile__container--lvl2${$(_this).attr(
                "href",
              )}`,
            ).addClass("show");
            animateCSS(
              ".global-header-navbar-mobile__container--lvl3.show",
              "slideOutRight",
            ).then(() => {
              $(".global-header-navbar-mobile__container--lvl3").removeClass(
                "show",
              );
            });
          },
        );
      });

      //megamenu functions

      $(".global-header-navbar__item--search").click(
        debounce(function () {
          $(this).toggleClass("open");
          if ($(this).hasClass("open")) {
            $(this).attr(
              "data-analytics-click-id",
              "GlobalHeaderIconSearchClose",
            );
            $(".global-header-navbar__searchbar").addClass("open");
            setTimeout(function () {
              $(".global-header-navbar__searchbar").css({
                overflow: "visible",
              });
              $(".global-header-navbar__searchbar .search-bar").css({
                opacity: "1",
                transform: "translate3d(0, 0, 0)",
              });
            }, 600);
          } else {
            $(this).attr(
              "data-analytics-click-id",
              "GlobalHeaderIconSearchOpen",
            );
            $(".global-header-navbar__searchbar").css("overflow", "hidden");
            $(".global-header-navbar__searchbar .search-bar").css({
              opacity: "0",
              transform: "translate3d(80px, 0, 0)",
            });
            setTimeout(function () {
              $(".global-header-navbar__searchbar").removeClass("open");
              $("input#searchBox-header-desktop").val("");
              $("input#searchBox-header-mobile").val("");
              $(".global-header-suggestion-container-desktop").html("");
              $(".global-header-suggestion-container-mobile").html("");
              $("#searchBox-header-desktop").removeClass("cross-btn");
            }, 600);
          }
          hideTabs();
        }, 500),
      );

      $(window).on("click", function (e) {
        if (
          $(".global-header-navbar__searchbar").length &&
          $(".global-header-navbar__item--search").length &&
          !$(".global-header-navbar__searchbar")[0].contains(e.target) &&
          !$(".global-header-navbar__item--search")[0].contains(e.target)
        ) {
          if ($(".global-header-navbar__item--search").hasClass("open")) {
            $(".global-header-navbar__item--search").attr(
              "data-analytics-click-id",
              "GlobalHeaderIconSearchOpen",
            );
            $(".global-header-navbar__searchbar").css("overflow", "hidden");
            $(".global-header-navbar__searchbar .search-bar").css({
              opacity: "0",
              transform: "translate3d(80px, 0, 0)",
            });
            setTimeout(function () {
              $(".global-header-navbar__searchbar").removeClass("open");
              $(".global-header-navbar__item--search").removeClass("open");
              $("input#searchBox-header-desktop").val("");
              $("input#searchBox-header-mobile").val("");
            }, 400);
          }
          $(".global-header-suggestion-container-desktop").html("");
          $(".global-header-suggestion-container-mobile").html("");
          $("#searchBox-header-desktop").removeClass("cross-btn");
        }
      });

      //add active class LVL1 Desktop
      $(
        "body > .header .global-header-navbar__left-menu .global-header-navbar__item",
      ).each(function () {
        let selectedPath = sanitizeHTML($(this).attr("href"));
        let locationPath = sanitizeHTML($(location).attr("pathname"));

        if (
          locationPath === selectedPath &&
          !($(this).attr("data-analytics-click-id") === "GlobalHeaderLogo")
        ) {
          $(this).addClass("global-header-navbar__item--selected");
          $(this).prop("disabled", true);
          $(this).removeAttr("href");
        } else {
          $(this).removeClass("global-header-navbar__item--selected");
        }
      });

      //add active class LVL1 Mobile
      $(
        "body > .header .global-header-navbar-mobile__top-menus .global-header-navbar-mobile__item ",
      ).each(function () {
        let selectedPath = sanitizeHTML($(this).find("a").attr("href"));
        let locationPath = sanitizeHTML($(location).attr("pathname"));

        if (locationPath === selectedPath) {
          $(this).addClass("global-header-navbar-mobile__item--selected");
          $(this).find("a").removeAttr("href");
        } else {
          $(this).removeClass("global-header-navbar-mobile__item--selected");
        }
      });

      //add active class LVL2 Dekstop
      $("body > .header .global-header-megamenu [role='tab']").each(
        function () {
          let title = $(this).find("h5").text();
          let selectedPath = null;
          let locationPath = sanitizeHTML($(location).attr("pathname"));
          let param = null;
          let tabPanelTitle = null;
          let target = $(this).find("a.cmp-button--link").attr("href");

          $(".global-header-megamenu-tabpanel--overview").each(function () {
            param = $(this)
              .find("a[data-analytics-text]")
              .attr("data-analytics-text");
            if (param) {
              if (title === param.substring(0, param.indexOf("_"))) {
                tabPanelTitle = param;
              }
            }
          });

          selectedPath = sanitizeHTML(
            $(".global-header-megamenu-tabpanel--overview")
              .find('a[data-analytics-text="' + tabPanelTitle + '"]')
              .attr("href"),
          );

          if (locationPath === selectedPath) {
            $(this).addClass("global-header-megamenu__tab--active");
          } else {
            $(this).removeClass("global-header-megamenu__tab--active");
          }
          if (target) {
            $(this).click(function () {
              location.href = encodeURI(target);
            })
          }
        },
      );

      //add active class LVL2 Mobile
      $(
        "body > .header .global-header-navbar-mobile__submenu .global-header-navbar-mobile__item",
      ).each(function () {
        let title = $(this).find(".cmp-button__text").text();
        let selectedPath = null;
        let locationPath = sanitizeHTML($(location).attr("pathname"));
        let param = null;
        let tabPanelTitle = null;

        $(".global-header-megamenu-tabpanel--overview").each(function () {
          param = $(this)
            .find("a[data-analytics-text]")
            .attr("data-analytics-text");
          if (param) {
            if (title === param.substring(0, param.indexOf("_"))) {
              tabPanelTitle = param;
            }
          }
        });

        selectedPath = sanitizeHTML(
          $(".global-header-megamenu-tabpanel--overview")
            .find('a[data-analytics-text="' + tabPanelTitle + '"]')
            .attr("href"),
        );
        if (locationPath === selectedPath) {
          $(this).addClass("global-header-navbar-mobile__item--selected");
        } else {
          $(this).removeClass("global-header-navbar-mobile__item--selected");
        }
      });

      $(".global-header-megamenu").each(function () {
        $(".global-header-megamenu [role='tab']").click(function (event) {


          if ($(this).attr('aria-selected') == 'true') {
            console.log("clicked")

            $('.global-header-megamenu [role="tab"]').removeClass("no-animation");
            $(".global-header-megamenu [role='tab']").attr("aria-selected", false);
            $('.global-header-megamenu [role="tabpanel"]').attr("hidden", true);
            $(".global-header-megamenu-tabpanel__bg-container").css({
              "background-color": "",
              "mix-blend-mode": "",
            });

            if (getSelectedTab() !== "") {
              $(
                `.global-header-megamenu [role='tab'][aria-controls='${getSelectedTab()}']`,
              ).attr("aria-selected", true);
            }
            $('.global-header-navbar__item').removeClass("select-focus");
            $('.global-header-navbar-selector').removeClass("select--active");
            $('.header_overlay').attr("hidden", true);
            return;

          }


          if (
            !$(".global-header-megamenu [role='tab']").hasClass(
              "no-animation",
            )
          ) {
            animateCSS(
              `.global-header-megamenu .global-header-megamenu-tabpanel#${$(
                this,
              ).attr("aria-controls")}`,
              "fadeIn",
              "animate__",
              "0.02s",
              true,
              event,
            );
          }
          $(".global-header-megamenu [role='tab']").attr(
            "aria-selected",
            false, //make sure only the selected tab is highlighted in red
          );
          $(this).attr("aria-selected", true);
          $('.global-header-megamenu [role="tab"]').addClass("no-animation");
          $('.global-header-megamenu [role="tabpanel"]').attr("hidden", true); //put true to only release selected menu
          $(this)
            .closest(".global-header-megamenu")
            .find(
              `.global-header-megamenu-tabpanel#${$(this).attr(
                "aria-controls",
              )}`,
            )
            .removeAttr("hidden");
          $('.global-header-navbar-selector').removeClass("select--active");
          $('.global-header-navbar__item').removeClass("select-focus");

          $(".header_overlay").removeAttr("hidden");
          event.stopPropagation();
        });

        $(".global-header-megamenu [role='tabpanel']").click(function (event) {
          event.stopPropagation();
        });
      });

      $(".global-header-navbar, .global-header-megamenu, .global-header-navbar__item, .textbox ").click(function () {
        console.log("hello");
        $('.global-header-megamenu [role="tab"]').removeClass("no-animation");
        $(".global-header-megamenu [role='tab']").attr("aria-selected", false);
        $('.global-header-megamenu [role="tabpanel"]').attr("hidden", true);
        $(".global-header-megamenu-tabpanel__bg-container").css({
          "background-color": "",
          "mix-blend-mode": "",
        });

        if (getSelectedTab() !== "") {
          $(
            `.global-header-megamenu [role='tab'][aria-controls='${getSelectedTab()}']`,
          ).attr("aria-selected", true);
        }
        $(".header_overlay").attr("hidden", true);
        return;
      });


      $(".header_overlay").click(function () {
        $('.global-header-megamenu [role="tab"]').removeClass("no-animation");
        $(".global-header-megamenu [role='tab']").attr("aria-selected", false);
        $('.global-header-megamenu [role="tabpanel"]').attr("hidden", true);
        $(".global-header-megamenu-tabpanel__bg-container").css({
          "background-color": "",
          "mix-blend-mode": "",
        });
        if (getSelectedTab() !== "") {
          $(
            `.global-header-megamenu [role='tab'][aria-controls='${getSelectedTab()}']`,
          ).attr("aria-selected", true);
        }
        $(".header_overlay").attr("hidden", true);
        return;
      });

      function getSelectedTab() {
        switch (sanitizeHTML($(location).attr("pathname"))) {
          case sanitizeHTML("/pages/employer-info/employer-info-d.html"):
          case sanitizeHTML("/pages/employer-info/employer-info-m.html"):
          case sanitizeHTML(
            "/pages/employer-overview/employer-overview-d.html",
          ):
          case sanitizeHTML(
            "/pages/employer-overview/employer-overview-m.html",
          ):
            return "employer-obligations";
          case sanitizeHTML("/pages/rss/rss.html"):
          case sanitizeHTML("/pages/scheme-info/scheme-info.html"):
          case sanitizeHTML("/pages/scheme-info/scheme-info-pl.html"):
          case sanitizeHTML("/pages/scheme-overview/scheme-overview.html"):
            return "retirement";
          default:
            return "";
        }
      }

      const animateCSS = function (
        element,
        animation,
        prefix = "animate__",
        animationDuration = "0.6s",
        isRipple = false,
        buttonEvent,
      ) {
        // We create a Promise and return it
        return new Promise((resolve, reject) => {
          const animationName = `${prefix}${animation}`;
          const node = document.querySelector(element);

          let profileColor = "";
          if (buttonEvent) {
            const masterNode =
              buttonEvent.currentTarget.parentNode.parentNode.parentNode
                .parentNode;
            profileColor = masterNode.classList.contains(
              "global-header-megamenu--employer",
            )
              ? "#F5E1C4"
              : "#E1F1C5";
          }

          node.classList.add(`${prefix}animated`, animationName);
          node.style.setProperty("--animate-duration", animationDuration);

          // When the animation ends, we clean the classes and resolve the Promise
          function handleAnimationEnd(event) {
            event.stopPropagation();

            node.classList.remove(`${prefix}animated`, animationName);

            if (isRipple && buttonEvent) {
              $(".global-header-megamenu-tabpanel__bg-container").css({
                "background-color": "",
                "mix-blend-mode": "",
              });
              const targetEl = node.children[0];
              const circle = document.createElement("span");
              const radius = 40;

              circle.style.width = circle.style.height = `${radius}px`;
              circle.style.left = `${buttonEvent.clientX}px`;
              circle.style.top = `${-radius}px`;
              circle.classList.add("ripple");
              circle.animate(
                [{ transform: `scale(2)` }, { transform: `scale(80)` }],
                {
                  // timing options
                  duration: 800,
                  iterations: 1,
                  easing: "linear",
                },
              );
              $(circle).css({
                "background-color": profileColor,
                "mix-blend-mode": "color",
              });
              targetEl.appendChild(circle);

              setTimeout(() => {
                $(".global-header-megamenu-tabpanel__bg-container").css({
                  "background-color": profileColor,
                  "mix-blend-mode": "color",
                });
                const ripple = node.getElementsByClassName("ripple")[0];
                ripple.remove();
              }, 800);
            }
            resolve();
          }

          node.addEventListener("animationend", handleAnimationEnd, {
            once: true,
          });
        });
      };

      function hideTabs() {
        // Hide all tab panels
        let tabs = document.querySelector(".global-header-megamenu");
        if (tabs) {
          tabs
            .querySelectorAll('[role="tabpanel"]')
            .forEach((p) => p.setAttribute("hidden", true));
          tabs
            .querySelectorAll('[role="tab"]')
            .forEach((p) => p.setAttribute("aria-selected", false));
        }
      }

      // For search clear btn
      function tog(v) {
        return v ? "addClass" : "removeClass";
      }

      $(document)
        .on(
          "input",
          "#searchBox-desktop, #searchBox-header-mobile, #searchBox-header-desktop",
          function () {
            $(this)[tog(this.value)]("cross-btn");
          },
        )
        .on("mousemove", ".cross-btn", function (e) {
          if ($(window).width() > 991) {
            $(this)[
              tog(
                this.offsetWidth - 48 <
                e.clientX - this.getBoundingClientRect().left,
              )
            ]("cross-click");
          } else {
            $(this)[
              tog(
                this.offsetWidth - 0 <
                e.clientX - this.getBoundingClientRect().left,
              )
            ]("cross-click");
          }
        })
        .on("click", ".cross-click", function () {
          $(this).removeClass("cross-btn cross-click").val("");
        });
    }

    loadGlobalHeader();

    // window.addEventListener("load", () => {

    //   /**
    //    * Sanitize and encode all HTML characters in a string
    //    * @param  {String} str  The string to sanitize
    //    * @return {String} str  The sanitized string
    //    */
    //   function sanitizeHTML(str) {
    //     const map = {
    //       "&": "&amp;",
    //       "<": "&lt;",
    //       ">": "&gt;",
    //       '"': "&quot;",
    //       "'": "&#x27;",
    //       "/": "&#x2F;",
    //     };
    //     const reg = /[&<>"'/]/gi;
    //     return !!str ? str.replace(reg, (match) => map[match]) : undefined;
    //   }

    //   $("#searchBox-header-desktop, #searchBox-header-mobile").on(
    //     "keypress",
    //     function (e) {
    //       if (e.which === 13) {
    //         var siteSectionSearchHeader = $("header").data("siteSectionId");
    //         if (!siteSectionSearchHeader) {
    //           siteSectionSearchHeader = "";
    //         }
    //         searchPage.trackSearch(
    //           $(this).val(),
    //           searchPage.searchBannerCount,
    //           siteSectionSearchHeader,
    //         );
    //         window.location.assign(
    //           encodeURI(
    //             $(this).data("searchPageUrl") + "?searchTerm=" + $(this).val(),
    //           ),
    //         );
    //       }
    //     },
    //   );

    //   let hrefVal = encodeURI(location.pathname.split("/")[1]);
    //   $(
    //     '.global-header-navbar__left-menu a[href^="/' + hrefVal + '"]',
    //   ).addClass("global-header-navbar__item-active");

    //   $(".global-header-megamenu__tab").on("mouseover", () => {
    //     console.log("mouseover");

    //     const getSelectedQuickLink = $(
    //       ".global-header-megamenu-tabpanel:not([hidden]) .global-header-megamenu-tabpanel__quickaction--links ul",
    //     ).outerHeight();
    //     const quickLinkRowHeight = 50;

    //     if (getSelectedQuickLink / quickLinkRowHeight > 1) {
    //       $(
    //         ".global-header-megamenu-tabpanel:not([hidden='hidden']) .global-header-megamenu-tabpanel__quickaction--links ul",
    //       ).addClass("global-header-megamenu-tabpanel__quickaction-left");
    //     }
    //   });
    //   var timer;
    //   $("#searchBox-header-desktop, #searchBox-header-mobile").keyup(function (
    //     e,
    //   ) {
    //     clearTimeout(timer);
    //     let searchTerm = $(this).val();
    //     let searchPageURL =
    //       $(this).data("searchPageUrl") + "?searchTerm=" + searchTerm;
    //     let mode = $(this).attr("id").split("-")[2];
    //     if (searchTerm === "" || searchTerm.length <= 1 || e.which === 13) {
    //       $(".global-header-suggestion-container-" + mode).html("");
    //       return;
    //     }
    //     let searchResults;
    //     timer = setTimeout(function () {
    //       searchPage.searchBannerTerm = searchTerm;
    //       $.getJSON(
    //         "/bin/web/search?searchTerm=" +
    //         searchTerm +
    //         "&siteSection=" +
    //         $("#portalIdentifier").val(),
    //         function (response) {
    //           searchResults = response["value"];
    //           searchPage.searchBannerCount = response["@odata.count"];
    //         },
    //       )
    //         .fail(function (response) {
    //           searchPage.searchBannerCount = 0;
    //         })
    //         .always(function () {
    //           processResult(searchTerm, searchResults, mode, searchPageURL);
    //         });
    //     }, 250);
    //   });

    //   $(
    //     "input#searchBox-header-desktop, input#searchBox-header-mobile",
    //   ).focusin(function () {
    //     $(this).attr("placeholder", "");
    //     $(this).css({ "font-weight": "600", color: "#262626" });
    //   });

    //   $(
    //     "input#searchBox-header-desktop, input#searchBox-header-mobile",
    //   ).focusout(function () {
    //     $(this).attr("placeholder", Granite.I18n.get("search.placeholder"));
    //     $(this).css({ "font-weight": "400", color: "#757575" });
    //   });

    //   $("input#searchBox-header-desktop, input#searchBox-header-mobile").click(
    //     function () {
    //       let mode = $(this).attr("id").split("-")[2];
    //       $(".global-header-suggestion-container-" + mode).html("");
    //       $(this).attr("placeholder", "");
    //       // $(this).val("");
    //       $(this).css({ "font-weight": "600", color: "#262626" });
    //     },
    //   );

    //   $(
    //     "#searchBox-header-desktop-button, #searchBox-header-mobile-button",
    //   ).click(function () {
    //     var siteSectionSearchHeader = $("header").data("siteSectionId");
    //     if (!siteSectionSearchHeader) {
    //       siteSectionSearchHeader = "";
    //     }
    //     var searchTerm = $(this).closest(".search-bar").find("input").val();
    //     searchPage.trackSearch(
    //       searchTerm,
    //       searchPage.searchBannerCount,
    //       siteSectionSearchHeader,
    //     );
    //     window.location.assign(
    //       encodeURI(
    //         $(this).data("searchPageUrl") + "?searchTerm=" + searchTerm,
    //       ),
    //     );
    //   });

    //   const processResult = function (
    //     searchTerm,
    //     searchResults,
    //     mode,
    //     searchPageURL,
    //   ) {
    //     var regex = new RegExp(searchTerm, "i");
    //     var suggestionRc = '<ul class="global-header-suggestion-record">';
    //     var count = 1;
    //     var filteredResult = [];

    //     $.each(searchResults, function (key, val) {
    //       if (val.Title || val.Description) {
    //         if (count <= 5) {
    //           suggestionRc += renderSuggestion(val, searchTerm);
    //           filteredResult = _.concat(filteredResult, val);
    //         }
    //         count++;
    //       }
    //     });

    //     const suggestion = document.querySelector(
    //       ".global-header-suggestion-container-" + mode,
    //     );
    //     suggestion.innerHTML =
    //       suggestionRc +
    //       "</ul><div class='suggestion--button-tab'>" +
    //       renderResultPageBtn(filteredResult.length, searchPageURL) +
    //       "</div>";
    //   };

    //   const renderResultPageBtn = function (recordCount, searchPageURL) {
    //     var searchIcon = $(".search-bar[data-search-result-icon]").data(
    //       "search-result-icon",
    //     );
    //     return recordCount > 0
    //       ? `
    //      <div class='separator'><div class='cmp-separator'><hr class='cmp-separator__horizontal-rule cmp-separator--dotted'></hr></div></div>
    //      <div class="button">
    //          <a href="` +
    //       searchPageURL +
    //       `"
    //              class="cmp-button cmp-button--link">
    //              <span class="cmp-button__text">
    //                  ` +
    //       Granite.I18n.get("search.viewResults") +
    //       `
    //              </span>
    //              <span class="icons_space ` +
    //       searchIcon +
    //       `"></span>
    //          </a>
    //      </div>`
    //       : "<div class='suggestion--empty-title'><h5>" +
    //       Granite.I18n.get("search.noResultsLabel") +
    //       "</h5></div>";
    //   };
    //   const renderSuggestion = function (record, searchTerm) {
    //     var pattern = new RegExp("(" + searchTerm + ")", "gi");

    //     return (
    //       "<li><a href='" +
    //       record.URL +
    //       "'><div class='suggestion--content-type'>" +
    //       record.ContentType +
    //       "</div><div class='suggestion--title'>" +
    //       record.Title.replace(pattern, "<b>$1</b>") +
    //       "</div></a></li>"
    //     );
    //   };

    //   // Navbar function
    //   $(".global-header-navbar__item--burger").click(function () {
    //     if ($(".global-header-navbar-mobile__container").hasClass("show")) {
    //       if (homepageSliderMobile) {
    //         homepageSliderMobile.play(); // to play homepage banner carousel slider
    //       }

    //       $("input#searchBox-header-mobile").val("");
    //       $("input#searchBox-header-mobile").removeClass("cross-btn");
    //       $("html, body").animate(
    //         {
    //           scrollTop: header.previousScrollPosition,
    //         },
    //         200,
    //         function () {
    //           window.scroll(0, header.previousScrollPosition);
    //           $(".root").removeClass("hide-root");
    //           $(".root").css("display", "block");
    //           $("footer.footer").css("display", "block");
    //           $(".global-header-compliance").css({ position: "", top: "" });
    //           $(".global-header-navbar__container").css({
    //             position: "",
    //             top: "",
    //           });

    //           animateCSS(
    //             ".global-header-navbar-mobile__container.show",
    //             "slideOutRight",
    //           ).then(() => {
    //             $(".global-header-navbar-mobile__container").removeClass(
    //               "show",
    //             );
    //             $(".global-header-navbar-mobile__container--lvl2").removeClass(
    //               "show",
    //             );
    //             $(".global-header-navbar-mobile__container--lvl3").removeClass(
    //               "show",
    //             );
    //             if (
    //               $(".announcement-bar").length &&
    //               $(".announcement-bar").hasClass("cmp-hidden")
    //             ) {
    //               $(".announcement-bar").show();
    //               $(".announcement-bar").removeClass("cmp-hidden");
    //             }
    //           });

    //           /**
    //            * This code is causing Bug 8676 where the anchor bar gets hidden upon opening hamburger
    //            * This code has been added by Joan for the Bug 7013
    //            * Bug 7013 is not reproducing anymore, hence removing this code
    //            */
    //           /* if(window.scrollY === 0){
    //                if($(document).find('.anchor-tab-list').length >0){
    //                    $(document).find('.anchor-tab-list').closest('.anchor-bar').css('display','none')
    //                }
    //            }else{
    //                if($(document).find('.anchor-tab-list').length >0){
    //                    $(document).find('.anchor-tab-list').closest('.anchor-bar').css('display','block !important')
    //                }
    //            } */
    //         },
    //       );
    //       if ($(this).hasClass("open")) {
    //         $(this).removeClass("open");
    //       }
    //     } else if (
    //       $(".global-header-navbar-mobile__container--lvl2").hasClass("show")
    //     ) {
    //       $("input#searchBox-header-mobile").val("");
    //       $("input#searchBox-header-mobile").removeClass("cross-btn");
    //       $("html, body").animate(
    //         {
    //           scrollTop: 0,
    //         },
    //         200,
    //         function () {
    //           $(".root").removeClass("hide-root");
    //           $(".root").css("display", "block");
    //           $("footer.footer").css("display", "block");
    //           $(".global-header-compliance").css({ position: "", top: "" });
    //           $(".global-header-navbar__container").css({
    //             position: "",
    //             top: "",
    //           });

    //           animateCSS(
    //             ".global-header-navbar-mobile__container--lvl2.show",
    //             "slideOutRight",
    //           ).then(() => {
    //             $(".global-header-navbar-mobile__container--lvl2").removeClass(
    //               "show",
    //             );
    //             $(".global-header-navbar-mobile__container--lvl3").removeClass(
    //               "show",
    //             );
    //             if (
    //               $(".announcement-bar").length &&
    //               $(".announcement-bar").hasClass("cmp-hidden")
    //             ) {
    //               $(".announcement-bar").show();
    //               $(".announcement-bar").removeClass("cmp-hidden");
    //             }
    //           });
    //         },
    //       );
    //       if ($(this).hasClass("open")) {
    //         $(this).removeClass("open");
    //       }
    //     } else if (
    //       $(".global-header-navbar-mobile__container--lvl3").hasClass("show")
    //     ) {
    //       $("input#searchBox-header-mobile").val("");
    //       $("input#searchBox-header-mobile").removeClass("cross-btn");
    //       $("html, body").animate(
    //         {
    //           scrollTop: 0,
    //         },
    //         200,
    //         function () {
    //           $(".root").removeClass("hide-root");
    //           $(".root").css("display", "block");
    //           $("footer.footer").css("display", "block");
    //           $(".global-header-compliance").css({ position: "", top: "" });
    //           $(".global-header-navbar__container").css({
    //             position: "",
    //             top: "",
    //           });

    //           animateCSS(
    //             ".global-header-navbar-mobile__container--lvl3.show",
    //             "slideOutRight",
    //           ).then(() => {
    //             $(".global-header-navbar-mobile__container--lvl3").removeClass(
    //               "show",
    //             );
    //             if (
    //               $(".announcement-bar").length &&
    //               $(".announcement-bar").hasClass("cmp-hidden")
    //             ) {
    //               $(".announcement-bar").show();
    //               $(".announcement-bar").removeClass("cmp-hidden");
    //             }
    //           });
    //         },
    //       );
    //       if ($(this).hasClass("open")) {
    //         $(this).removeClass("open");
    //       }
    //     } else {
    //       if (homepageSliderMobile) {
    //         homepageSliderMobile.pause(); // to pause homepage banner carousel slider
    //       }
    //       if (
    //         $(".announcement-bar").length &&
    //         $(".announcement-bar").css("display") !== "none"
    //       ) {
    //         $(".announcement-bar").hide();
    //         $(".announcement-bar").addClass("cmp-hidden");
    //       }
    //       $(".global-header-navbar-mobile__container--lvl2").removeClass(
    //         "show",
    //       );
    //       $(".global-header-navbar-mobile__container--lvl3").removeClass(
    //         "show",
    //       );

    //       animateCSS(
    //         ".global-header-navbar-mobile__container",
    //         "slideInRight",
    //       ).then(() => {
    //         // hide main container and push
    //         $(".root").addClass("hide-root");
    //         // hide footer
    //         $("footer.footer").css("display", "none");
    //         $(".global-header-compliance").css({ position: "fixed", top: "0" });
    //         $(".global-header-navbar__container").css({
    //           position: "fixed",
    //           top: "0px",
    //         });
    //       });
    //       header.previousScrollPosition = window.scrollY;
    //       $("html, body").animate({ scrollTop: 0 });
    //       $(".global-header-navbar-mobile__container").addClass("show");
    //       $(".floating-container").removeClass("show");
    //       if (!$(this).hasClass("open")) {
    //         $(this).addClass("open");
    //       }
    //     }
    //   });

    //   $(
    //     '.global-header-navbar-mobile__container .global-header-navbar-mobile__submenu [href^="#"]',
    //   ).click(function (e) {
    //     e.preventDefault();
    //     let _this = this;
    //     $("html, body").animate(
    //       {
    //         scrollTop: 0,
    //       },
    //       200,
    //       function () {
    //         $(".global-header-compliance").css({ position: "", top: "" });
    //         $(".global-header-navbar__container").css({
    //           position: "",
    //           top: "",
    //         });
    //         $(
    //           `.global-header-navbar-mobile__container--lvl2${$(_this).attr(
    //             "href",
    //           )}`,
    //         ).addClass("show");
    //         animateCSS(
    //           `.global-header-navbar-mobile__container--lvl2${$(_this).attr(
    //             "href",
    //           )}`,
    //           "slideInRight",
    //         ).then(() => {
    //           $(".global-header-navbar-mobile__container").removeClass("show");
    //           $(".global-header-compliance").css({
    //             position: "fixed",
    //             top: "0",
    //           });
    //           $(".global-header-navbar__container").css({
    //             position: "fixed",
    //             top: "0px",
    //           });
    //           // hide main container and push
    //           $(".root").css("display", "none");
    //           // hide footer
    //           $("footer.footer").css("display", "none");
    //         });
    //       },
    //     );
    //   });

    //   $(
    //     '.global-header-navbar-mobile__container--lvl2 .global-header-navbar-mobile__overview--breadcrumb [href^="#"]',
    //   ).click(function (e) {
    //     e.preventDefault();
    //     $("html, body").animate(
    //       {
    //         scrollTop: 0,
    //       },
    //       200,
    //       function () {
    //         $(".global-header-navbar-mobile__container").addClass("show");
    //         animateCSS(
    //           ".global-header-navbar-mobile__container--lvl2.show",
    //           "slideOutRight",
    //         ).then(() => {
    //           $(".global-header-navbar-mobile__container--lvl2").removeClass(
    //             "show",
    //           );
    //         });
    //       },
    //     );
    //   });

    //   $(
    //     '.global-header-navbar-mobile__container--lvl2 .global-header-navbar-mobile__links [href^="#"]',
    //   ).click(function (e) {
    //     e.preventDefault();
    //     let _this = this;
    //     $("html, body").animate(
    //       {
    //         scrollTop: 0,
    //       },
    //       200,
    //       function () {
    //         $(".global-header-compliance").css({ position: "", top: "" });
    //         $(".global-header-navbar__container").css({
    //           position: "",
    //           top: "",
    //         });
    //         $(
    //           `.global-header-navbar-mobile__container--lvl3${$(_this).attr(
    //             "href",
    //           )}`,
    //         ).addClass("show");
    //         animateCSS(
    //           `.global-header-navbar-mobile__container--lvl3${$(_this).attr(
    //             "href",
    //           )}`,
    //           "slideInRight",
    //         ).then(() => {
    //           $(".global-header-navbar-mobile__container--lvl2").removeClass(
    //             "show",
    //           );
    //           $(".global-header-compliance").css({
    //             position: "fixed",
    //             top: "0",
    //           });
    //           $(".global-header-navbar__container").css({
    //             position: "fixed",
    //             top: "0px",
    //           });

    //           // hide main container and push
    //           $(".root").css("display", "none");
    //           // hide footer
    //           $("footer.footer").css("display", "none");
    //         });
    //       },
    //     );
    //   });

    //   $(
    //     '.global-header-navbar-mobile__container--lvl3 .global-header-navbar-mobile__overview--breadcrumb [href^="#"]',
    //   ).click(function (e) {
    //     e.preventDefault();
    //     let _this = this;
    //     $("html, body").animate(
    //       {
    //         scrollTop: 0,
    //       },
    //       200,
    //       function () {
    //         $(
    //           `.global-header-navbar-mobile__container--lvl2${$(_this).attr(
    //             "href",
    //           )}`,
    //         ).addClass("show");
    //         animateCSS(
    //           ".global-header-navbar-mobile__container--lvl3.show",
    //           "slideOutRight",
    //         ).then(() => {
    //           $(".global-header-navbar-mobile__container--lvl3").removeClass(
    //             "show",
    //           );
    //         });
    //       },
    //     );
    //   });

    //   //megamenu functions

    //   $(".global-header-navbar__item--search").click(
    //     debounce(function () {
    //       $(this).toggleClass("open");
    //       if ($(this).hasClass("open")) {
    //         $(this).attr(
    //           "data-analytics-click-id",
    //           "GlobalHeaderIconSearchClose",
    //         );
    //         $(".global-header-navbar__searchbar").addClass("open");
    //         setTimeout(function () {
    //           $(".global-header-navbar__searchbar").css({
    //             overflow: "visible",
    //           });
    //           $(".global-header-navbar__searchbar .search-bar").css({
    //             opacity: "1",
    //             transform: "translate3d(0, 0, 0)",
    //           });
    //         }, 600);
    //       } else {
    //         $(this).attr(
    //           "data-analytics-click-id",
    //           "GlobalHeaderIconSearchOpen",
    //         );
    //         $(".global-header-navbar__searchbar").css("overflow", "hidden");
    //         $(".global-header-navbar__searchbar .search-bar").css({
    //           opacity: "0",
    //           transform: "translate3d(80px, 0, 0)",
    //         });
    //         setTimeout(function () {
    //           $(".global-header-navbar__searchbar").removeClass("open");
    //           $("input#searchBox-header-desktop").val("");
    //           $("input#searchBox-header-mobile").val("");
    //           $(".global-header-suggestion-container-desktop").html("");
    //           $(".global-header-suggestion-container-mobile").html("");
    //           $("#searchBox-header-desktop").removeClass("cross-btn");
    //         }, 600);
    //       }
    //       hideTabs();
    //     }, 500),
    //   );

    //   $(window).on("click", function (e) {
    //     if (
    //       $(".global-header-navbar__searchbar").length &&
    //       $(".global-header-navbar__item--search").length &&
    //       !$(".global-header-navbar__searchbar")[0].contains(e.target) &&
    //       !$(".global-header-navbar__item--search")[0].contains(e.target)
    //     ) {
    //       if ($(".global-header-navbar__item--search").hasClass("open")) {
    //         $(".global-header-navbar__item--search").attr(
    //           "data-analytics-click-id",
    //           "GlobalHeaderIconSearchOpen",
    //         );
    //         $(".global-header-navbar__searchbar").css("overflow", "hidden");
    //         $(".global-header-navbar__searchbar .search-bar").css({
    //           opacity: "0",
    //           transform: "translate3d(80px, 0, 0)",
    //         });
    //         setTimeout(function () {
    //           $(".global-header-navbar__searchbar").removeClass("open");
    //           $(".global-header-navbar__item--search").removeClass("open");
    //           $("input#searchBox-header-desktop").val("");
    //           $("input#searchBox-header-mobile").val("");
    //         }, 400);
    //       }
    //       $(".global-header-suggestion-container-desktop").html("");
    //       $(".global-header-suggestion-container-mobile").html("");
    //       $("#searchBox-header-desktop").removeClass("cross-btn");
    //     }
    //   });

    //   //add active class LVL1 Desktop
    //   $(
    //     "body > .header .global-header-navbar__left-menu .global-header-navbar__item",
    //   ).each(function () {
    //     let selectedPath = sanitizeHTML($(this).attr("href"));
    //     let locationPath = sanitizeHTML($(location).attr("pathname"));

    //     if (
    //       locationPath === selectedPath &&
    //       !($(this).attr("data-analytics-click-id") === "GlobalHeaderLogo")
    //     ) {
    //       $(this).addClass("global-header-navbar__item--selected");
    //       $(this).prop("disabled", true);
    //       $(this).removeAttr("href");
    //     } else {
    //       $(this).removeClass("global-header-navbar__item--selected");
    //     }
    //   });

    //   //add active class LVL1 Mobile
    //   $(
    //     "body > .header .global-header-navbar-mobile__top-menus .global-header-navbar-mobile__item ",
    //   ).each(function () {
    //     let selectedPath = sanitizeHTML($(this).find("a").attr("href"));
    //     let locationPath = sanitizeHTML($(location).attr("pathname"));

    //     if (locationPath === selectedPath) {
    //       $(this).addClass("global-header-navbar-mobile__item--selected");
    //       $(this).find("a").removeAttr("href");
    //     } else {
    //       $(this).removeClass("global-header-navbar-mobile__item--selected");
    //     }
    //   });

    //   //add active class LVL2 Dekstop
    //   $("body > .header .global-header-megamenu [role='tab']").each(
    //     function () {
    //       let title = $(this).find("h5").text();
    //       let selectedPath = null;
    //       let locationPath = sanitizeHTML($(location).attr("pathname"));
    //       let param = null;
    //       let tabPanelTitle = null;
    //       let target = $(this).find("a.cmp-button--link").attr("href");

    //       $(".global-header-megamenu-tabpanel--overview").each(function () {
    //         param = $(this)
    //           .find("a[data-analytics-text]")
    //           .attr("data-analytics-text");
    //         if (param) {
    //           if (title === param.substring(0, param.indexOf("_"))) {
    //             tabPanelTitle = param;
    //           }
    //         }
    //       });

    //       selectedPath = sanitizeHTML(
    //         $(".global-header-megamenu-tabpanel--overview")
    //           .find('a[data-analytics-text="' + tabPanelTitle + '"]')
    //           .attr("href"),
    //       );

    //       if (locationPath === selectedPath) {
    //         $(this).addClass("global-header-megamenu__tab--active");
    //       } else {
    //         $(this).removeClass("global-header-megamenu__tab--active");
    //       }
    //       if (target) {
    //         $(this).click(function () {
    //           location.href = encodeURI(target);
    //         })
    //       }
    //     },
    //   );

    //   //add active class LVL2 Mobile
    //   $(
    //     "body > .header .global-header-navbar-mobile__submenu .global-header-navbar-mobile__item",
    //   ).each(function () {
    //     let title = $(this).find(".cmp-button__text").text();
    //     let selectedPath = null;
    //     let locationPath = sanitizeHTML($(location).attr("pathname"));
    //     let param = null;
    //     let tabPanelTitle = null;

    //     $(".global-header-megamenu-tabpanel--overview").each(function () {
    //       param = $(this)
    //         .find("a[data-analytics-text]")
    //         .attr("data-analytics-text");
    //       if (param) {
    //         if (title === param.substring(0, param.indexOf("_"))) {
    //           tabPanelTitle = param;
    //         }
    //       }
    //     });

    //     selectedPath = sanitizeHTML(
    //       $(".global-header-megamenu-tabpanel--overview")
    //         .find('a[data-analytics-text="' + tabPanelTitle + '"]')
    //         .attr("href"),
    //     );
    //     if (locationPath === selectedPath) {
    //       $(this).addClass("global-header-navbar-mobile__item--selected");
    //     } else {
    //       $(this).removeClass("global-header-navbar-mobile__item--selected");
    //     }
    //   });

    //   $(".global-header-megamenu").each(function () {
    //     $(".global-header-megamenu [role='tab']").click(function (event) {


    //       if ($(this).attr('aria-selected') == 'true') {
    //         console.log("clicked")

    //         $('.global-header-megamenu [role="tab"]').removeClass("no-animation");
    //         $(".global-header-megamenu [role='tab']").attr("aria-selected", false);
    //         $('.global-header-megamenu [role="tabpanel"]').attr("hidden", true);
    //         $(".global-header-megamenu-tabpanel__bg-container").css({
    //           "background-color": "",
    //           "mix-blend-mode": "",
    //         });

    //         if (getSelectedTab() !== "") {
    //           $(
    //             `.global-header-megamenu [role='tab'][aria-controls='${getSelectedTab()}']`,
    //           ).attr("aria-selected", true);
    //         }
    //         $('.global-header-navbar__item').removeClass("select-focus");
    //         $('.global-header-navbar-selector').removeClass("select--active");
    //         $('.header_overlay').attr("hidden", true);
    //         return;

    //       }


    //       if (
    //         !$(".global-header-megamenu [role='tab']").hasClass(
    //           "no-animation",
    //         )
    //       ) {
    //         animateCSS(
    //           `.global-header-megamenu .global-header-megamenu-tabpanel#${$(
    //             this,
    //           ).attr("aria-controls")}`,
    //           "fadeIn",
    //           "animate__",
    //           "0.02s",
    //           true,
    //           event,
    //         );
    //       }
    //       $(".global-header-megamenu [role='tab']").attr(
    //         "aria-selected",
    //         false, //make sure only the selected tab is highlighted in red
    //       );
    //       $(this).attr("aria-selected", true);
    //       $('.global-header-megamenu [role="tab"]').addClass("no-animation");
    //       $('.global-header-megamenu [role="tabpanel"]').attr("hidden", true); //put true to only release selected menu
    //       $(this)
    //         .closest(".global-header-megamenu")
    //         .find(
    //           `.global-header-megamenu-tabpanel#${$(this).attr(
    //             "aria-controls",
    //           )}`,
    //         )
    //         .removeAttr("hidden");
    //       $('.global-header-navbar-selector').removeClass("select--active");
    //       $('.global-header-navbar__item').removeClass("select-focus");

    //       $(".header_overlay").removeAttr("hidden");
    //       event.stopPropagation();
    //     });

    //     $(".global-header-megamenu [role='tabpanel']").click(function (event) {
    //       event.stopPropagation();
    //     });
    //   });

    //   $(".global-header-navbar, .global-header-megamenu, .global-header-navbar__item, .textbox ").click(function () {
    //     console.log("hello");
    //     $('.global-header-megamenu [role="tab"]').removeClass("no-animation");
    //     $(".global-header-megamenu [role='tab']").attr("aria-selected", false);
    //     $('.global-header-megamenu [role="tabpanel"]').attr("hidden", true);
    //     $(".global-header-megamenu-tabpanel__bg-container").css({
    //       "background-color": "",
    //       "mix-blend-mode": "",
    //     });

    //     if (getSelectedTab() !== "") {
    //       $(
    //         `.global-header-megamenu [role='tab'][aria-controls='${getSelectedTab()}']`,
    //       ).attr("aria-selected", true);
    //     }
    //     $(".header_overlay").attr("hidden", true);
    //     return;
    //   });


    //   $(".header_overlay").click(function () {
    //     $('.global-header-megamenu [role="tab"]').removeClass("no-animation");
    //     $(".global-header-megamenu [role='tab']").attr("aria-selected", false);
    //     $('.global-header-megamenu [role="tabpanel"]').attr("hidden", true);
    //     $(".global-header-megamenu-tabpanel__bg-container").css({
    //       "background-color": "",
    //       "mix-blend-mode": "",
    //     });
    //     if (getSelectedTab() !== "") {
    //       $(
    //         `.global-header-megamenu [role='tab'][aria-controls='${getSelectedTab()}']`,
    //       ).attr("aria-selected", true);
    //     }
    //     $(".header_overlay").attr("hidden", true);
    //     return;
    //   });

    //   function getSelectedTab() {
    //     switch (sanitizeHTML($(location).attr("pathname"))) {
    //       case sanitizeHTML("/pages/employer-info/employer-info-d.html"):
    //       case sanitizeHTML("/pages/employer-info/employer-info-m.html"):
    //       case sanitizeHTML(
    //         "/pages/employer-overview/employer-overview-d.html",
    //       ):
    //       case sanitizeHTML(
    //         "/pages/employer-overview/employer-overview-m.html",
    //       ):
    //         return "employer-obligations";
    //       case sanitizeHTML("/pages/rss/rss.html"):
    //       case sanitizeHTML("/pages/scheme-info/scheme-info.html"):
    //       case sanitizeHTML("/pages/scheme-info/scheme-info-pl.html"):
    //       case sanitizeHTML("/pages/scheme-overview/scheme-overview.html"):
    //         return "retirement";
    //       default:
    //         return "";
    //     }
    //   }

    //   const animateCSS = function (
    //     element,
    //     animation,
    //     prefix = "animate__",
    //     animationDuration = "0.6s",
    //     isRipple = false,
    //     buttonEvent,
    //   ) {
    //     // We create a Promise and return it
    //     return new Promise((resolve, reject) => {
    //       const animationName = `${prefix}${animation}`;
    //       const node = document.querySelector(element);

    //       let profileColor = "";
    //       if (buttonEvent) {
    //         const masterNode =
    //           buttonEvent.currentTarget.parentNode.parentNode.parentNode
    //             .parentNode;
    //         profileColor = masterNode.classList.contains(
    //           "global-header-megamenu--employer",
    //         )
    //           ? "#F5E1C4"
    //           : "#E1F1C5";
    //       }

    //       node.classList.add(`${prefix}animated`, animationName);
    //       node.style.setProperty("--animate-duration", animationDuration);

    //       // When the animation ends, we clean the classes and resolve the Promise
    //       function handleAnimationEnd(event) {
    //         event.stopPropagation();

    //         node.classList.remove(`${prefix}animated`, animationName);

    //         if (isRipple && buttonEvent) {
    //           $(".global-header-megamenu-tabpanel__bg-container").css({
    //             "background-color": "",
    //             "mix-blend-mode": "",
    //           });
    //           const targetEl = node.children[0];
    //           const circle = document.createElement("span");
    //           const radius = 40;

    //           circle.style.width = circle.style.height = `${radius}px`;
    //           circle.style.left = `${buttonEvent.clientX}px`;
    //           circle.style.top = `${-radius}px`;
    //           circle.classList.add("ripple");
    //           circle.animate(
    //             [{ transform: `scale(2)` }, { transform: `scale(80)` }],
    //             {
    //               // timing options
    //               duration: 800,
    //               iterations: 1,
    //               easing: "linear",
    //             },
    //           );
    //           $(circle).css({
    //             "background-color": profileColor,
    //             "mix-blend-mode": "color",
    //           });
    //           targetEl.appendChild(circle);

    //           setTimeout(() => {
    //             $(".global-header-megamenu-tabpanel__bg-container").css({
    //               "background-color": profileColor,
    //               "mix-blend-mode": "color",
    //             });
    //             const ripple = node.getElementsByClassName("ripple")[0];
    //             ripple.remove();
    //           }, 800);
    //         }
    //         resolve();
    //       }

    //       node.addEventListener("animationend", handleAnimationEnd, {
    //         once: true,
    //       });
    //     });
    //   };

    //   function hideTabs() {
    //     // Hide all tab panels
    //     let tabs = document.querySelector(".global-header-megamenu");
    //     if (tabs) {
    //       tabs
    //         .querySelectorAll('[role="tabpanel"]')
    //         .forEach((p) => p.setAttribute("hidden", true));
    //       tabs
    //         .querySelectorAll('[role="tab"]')
    //         .forEach((p) => p.setAttribute("aria-selected", false));
    //     }
    //   }

    //   // For search clear btn
    //   function tog(v) {
    //     return v ? "addClass" : "removeClass";
    //   }

    //   $(document)
    //     .on(
    //       "input",
    //       "#searchBox-desktop, #searchBox-header-mobile, #searchBox-header-desktop",
    //       function () {
    //         $(this)[tog(this.value)]("cross-btn");
    //       },
    //     )
    //     .on("mousemove", ".cross-btn", function (e) {
    //       if ($(window).width() > 991) {
    //         $(this)[
    //           tog(
    //             this.offsetWidth - 48 <
    //             e.clientX - this.getBoundingClientRect().left,
    //           )
    //         ]("cross-click");
    //       } else {
    //         $(this)[
    //           tog(
    //             this.offsetWidth - 0 <
    //             e.clientX - this.getBoundingClientRect().left,
    //           )
    //         ]("cross-click");
    //       }
    //     })
    //     .on("click", ".cross-click", function () {
    //       $(this).removeClass("cross-btn cross-click").val("");
    //     });
    // });

    function logout(type) {
      location.href =
        type === "member"
          ? encodeURI("/index.html")
          : encodeURI("/pages/employer-homepage/employer-homepage-d.html");
    }

    function login(type) {
      if (type === "member") {
        $("#member-header").attr("postlogin", true);
      } else {
        $("#employer-header").attr("postlogin", true);
      }
    }

    function debounce(func, wait, immediate) {
      var timeout;
      return function executedFunction() {
        var context = this;
        var args = arguments;
        var later = function () {
          timeout = null;
          if (!immediate) {
            func.apply(context, args);
          }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
          func.apply(context, args);
        }
      };
    }

    window.onresize = function () {
      if ($("html").width() > 767) {
        $(".root").css("display", "block");
        $("footer.footer").css("display", "block");
        $(".global-header-compliance").css({ position: "", top: "" });
        $(".global-header-navbar__container").css({ position: "", top: "" });
      }
    };

    window.onscroll = function () {
      if (!$(".global-header-megamenu").is(":visible")) return;
      const lvl1Menu = $(".global-header-navbar-mobile__container.show").length;
      const lvl2Menu = $(
        ".global-header-navbar-mobile__container--lvl2.show",
      ).length;
      const lvl3Menu = $(
        ".global-header-navbar-mobile__container--lvl3.show",
      ).length;

      var time;
      clearTimeout(time);
      time = setTimeout(function () {
        if (
          $("html").width() < 1200 &&
          lvl1Menu === 0 &&
          lvl2Menu === 0 &&
          lvl3Menu === 0
        ) {
          if (this.oldScroll > this.scrollY && this.scrollY > 42) {
            // Excluding the code on docking
            // $(".global-header-compliance").css({ position: "fixed", top: "0" });
            // $(".global-header-navbar__container").css({
            //   position: "fixed",
            //   top: "0px",
            // });

            // if ($(".anchor-tab-list.stick-tabs--full-width").length > 0) {
            //   $(".anchor-tab-list.stick-tabs--full-width").css("top", 138);
            // }
          } else {
            $(".global-header-compliance").css({ position: "", top: "" });
            $(".global-header-navbar__container").css({
              position: "",
              top: "",
            });

            if ($(".anchor-tab-list.stick-tabs--full-width").length > 0) {
              $(".anchor-tab-list.stick-tabs--full-width").css("top", "");
            }
          }
          this.oldScroll = this.scrollY;
        }
      }, 50);
    };
    return {
      version,
    };
  };

  $.fn.globalHeader();
})(jQuery);