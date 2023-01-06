(function ($) {
    $.fn.globalHeaderBanner = function () {
      const version = "1.0.0";
      var homepageSliderMobile;
      var sliderDesktop;
      var sliderTour;
      var HomepageBanner = (function () {
        "use strict";
        function analyticsTag() {
          $.each($(".homepage-banner"), function () {
            var $homepageBanner = $(this);
            var $homepageBanners = $homepageBanner.find(
              ".banner-carousel-item .button a",
            );
            $.each($homepageBanners, function (index, banner) {
              var $banner = $(banner);
              if ($banner.data("analytics-click-id")) {
                var bannerTokens = $banner.data("analytics-click-id");
                $banner.attr(
                  "data-analytics-click-id",
                  bannerTokens + (index + 1),
                );
              }
            });
          });
        }
        function initializeBanner() {
          if ($(".homepage-banner .glide__slide .glide__slide").length <= 3) {
            $(".glide").each(function (index, carouselWrapper) {
              $(carouselWrapper).addClass("disabled");
            });
          }
        }
        function _init() {
          const sliderCommonProps = {
            gap: 0,
            startAt: 0,
            classes: {
              direction: {
                ltr: "glide--ltr",
                rtl: "glide--rtl",
              },
              slider: "glide--slider",
              carousel: "glide--carousel",
              swipeable: "glide--swipeable",
              dragging: "glide--dragging",
              cloneSlide: "glide__slide--clone",
              activeNav: "glide__bullet--active",
              activeSlide: "glide__slide--active",
              disabledArrow: "glide__arrow--disabled",
            },
          };
          sliderDesktop = new Glide(
            '.homepage-banner [data-component="card-carousel-desktop"]',
            {
              ...sliderCommonProps,
              type: "carousel",
              hoverpause: true,
              autoplay: 9000,
              perView: 1,
            },
          );
          homepageSliderMobile = new Glide(
            '.homepage-banner [data-component="card-carousel-mobile"]',
            {
              ...sliderCommonProps,
              type: "carousel",
              rewind: true,
              autoplay: 9000,
              perView: 1,
            },
          );
          sliderTour = new Glide(
            '.homepage-banner [data-component="card-carousel-tour"]',
            {
              ...sliderCommonProps,
              type: "slider",
              rewind: false,
              perView: 1,
            },
          );
          var getDarkModeDesk = [];
          var getDarkModeMob = [];
          var aemContainerClass = ".banner-carousel-item";
          function checkArray(value, arr) {
            var exist = false;
            for (var i = 0; i < arr.length; i++) {
              var obj = arr[i];
              if (obj == value) {
                exist = true;
                break;
              }
            }
            return exist;
          }
          if (!$(".banner-carousel-item")[0]) {
            aemContainerClass = ".glide__slide";
          }
          $(".homepage-banner .carousel__container--desktop")
            .find(aemContainerClass)
            .each(function (index) {
              if (
                $(this).children(":first").hasClass("dark-mode") ||
                $(this).hasClass("dark-mode")
              ) {
                getDarkModeDesk.push(index);
              }
            });
          $(".homepage-banner .carousel__container--mobile")
            .find(aemContainerClass)
            .each(function (index) {
              if (
                $(this).children(":first").hasClass("dark-mode") ||
                $(this).hasClass("dark-mode")
              ) {
                getDarkModeMob.push(index);
              }
            });
          const carouselSlides = document.querySelector(
            ".homepage-banner .glide__slides",
          );
          const prevButton = document.querySelector(
            ".homepage-banner .carousel__prev.prev",
          );
          const nextButton = document.querySelector(
            ".homepage-banner .carousel__next.next",
          );
          if (carouselSlides && prevButton && nextButton) {
            const allGlideSlideItem = Array.from(
              carouselSlides.childNodes,
            ).filter(
              (ele) =>
                !!ele.classList && !ele.classList.contains("glide__slide--clone"),
            );
            const config = { attributes: true };
            const callback = function (mutationList, observer) {
              const mutationListClassFilter = mutationList.filter(
                (m) => m.attributeName === "class",
              );
              if (mutationListClassFilter.length > 0) {
                const targetedElement = mutationListClassFilter[0].target;
                if (targetedElement.classList.contains("glide__slide--active")) {
                  const buttonAtom = targetedElement.querySelector(".cmp-button");
                  if (
                    targetedElement.firstElementChild.classList.contains(
                      "dark-mode",
                    )
                  ) {
                    prevButton.classList.add("dark-mode");
                    nextButton.classList.add("dark-mode");
                    if (
                      buttonAtom &&
                      !buttonAtom.classList.contains("cmp-button--inverse")
                    ) {
                      buttonAtom.classList.add("cmp-button--inverse");
                    }
                  } else {
                    prevButton.classList.remove("dark-mode");
                    nextButton.classList.remove("dark-mode");
                    if (
                      buttonAtom &&
                      buttonAtom.classList.contains("cmp-button--inverse")
                    ) {
                      buttonAtom.classList.remove("cmp-button--inverse");
                    }
                  }
                }
              }
              if (!document.body.contains(carouselSlides)) {
                observer.disconnect();
              }
            };
            allGlideSlideItem.forEach((ele) => {
              const mutationObserver = new MutationObserver(callback);
              mutationObserver.observe(ele, config);
            });
          }
          sliderDesktop.on(["mount.after", "run"], function () {
            let index = sliderDesktop.index;
            let tempIndex = index + 1;
            let paginationEls = document.getElementsByClassName(
              "glide__bullet progress-bar",
            );
            let divEl = document.getElementById("dot-" + index);
            let slideDesk = $(".homepage-banner .carousel__container--desktop");
            if (checkArray(index, getDarkModeDesk)) {
              slideDesk.addClass("dark-mode");
            } else {
              slideDesk.removeClass("dark-mode");
            }
            if (!divEl.classList.contains("active")) {
              divEl.className += " active";
              if (index >= 1) {
                var previousIndex = index - 1;
                let previousDot = document.getElementById("dot-" + previousIndex);
                previousDot.classList.remove("active");
                if (tempIndex > index && index < paginationEls.length - 1) {
                  if (
                    document
                      .getElementById("dot-" + tempIndex)
                      .classList.contains("active")
                  ) {
                    document
                      .getElementById("dot-" + tempIndex)
                      .classList.remove("active");
                  } else return;
                } else {
                  document
                    .getElementById("dot-" + (tempIndex - paginationEls.length))
                    .classList.remove("active");
                }
              } else {
                var lastIndex = paginationEls.length - 1;
                let lastDot = document.getElementById("dot-" + lastIndex);
                lastDot.classList.remove("active");
                if (
                  document
                    .getElementById("dot-" + tempIndex)
                    .classList.contains("active")
                ) {
                  document
                    .getElementById("dot-" + tempIndex)
                    .classList.remove("active");
                }
              }
            }
          });
          sliderTour.on(["mount.after", "run"], function () {
            let maxIndex = sliderTour._c.Html.slides.length - 1;
            switch (sliderTour.index) {
              case 0:
                $(".homepage-banner .glide__arrow--left").attr("disabled", true);
                $(".homepage-banner .glide__arrow--right").removeAttr("disabled");
                $(".homepage-banner .glide__arrow--right").html(
                  '<span class="cmp-button__text">Next</span>',
                );
                break;
              case maxIndex:
                $(".homepage-banner .glide__arrow--right").html(
                  '<span class="cmp-button__text">Finish</span>',
                );
                $(".homepage-banner .glide__arrow--left").removeAttr("disabled");
                break;
              default:
                $(".homepage-banner .glide__arrow--left").removeAttr("disabled");
                $(".homepage-banner .glide__arrow--right").html(
                  '<span class="cmp-button__text">Next</span>',
                );
                $(".homepage-banner .glide__arrow--right").removeAttr("disabled");
                break;
            }
          });
          setTimeout(function () {
            var bDom = $(
              '.homepage-banner [data-component="card-carousel-desktop"]',
            );
            var homepageSliderMobileDom = $(
              '.homepage-banner [data-component="card-carousel-mobile"]',
            );
  
            if (!bDom.attr("glide") && 0 < bDom.length) {
              sliderDesktop.mount();
              bDom.attr("glide", "mounted");
            } else {
              sliderDesktop.update();
            }
            if (
              !homepageSliderMobileDom.attr("glide") &&
              0 < homepageSliderMobileDom.length
            ) {
              homepageSliderMobile.mount();
              homepageSliderMobileDom.attr("glide", "mounted");
            } else {
              homepageSliderMobile.update();
            }
          }, 260);
  
          setTimeout(function () {
            sliderTour.mount();
          }, 350);
          $(".homepage-banner .glide__arrow--left").click(function () {
            sliderTour.go("<");
          });
          $(".homepage-banner .glide__arrow--right").click(function () {
            let maxIndex = sliderTour._c.Html.slides.length - 1;
            if (sliderTour.index === maxIndex) {
              $(window.parent.document.getElementById("guideTourComp")).hide();
              localStorage.setItem(guideTour.getId(), "viewed");
              $(document).find("body").removeClass("guide_tour_no_scroll");
              $("body").css("overflow", "initial");
            } else {
              sliderTour.go(">");
            }
          });
        }
        return {
          init: function () {
            _init();
            initializeBanner();
            analyticsTag();
          },
        };
      })();
      jQuery(document).ready(function ($) {
        if ($(".homepage-banner").length) {
          HomepageBanner.init();
        }
        window.dispatchEvent(new Event("resize"));
      });
  
      return {
        version,
      };
    };
  })(jQuery);