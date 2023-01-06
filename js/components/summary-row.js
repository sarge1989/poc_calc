(function ($) {
  $.fn.SummaryRowHeight = function () {
    const version = "3.0.0";

    const summaryRowCmp = document.querySelectorAll(".cmp-summaryRow");

    for (let k = 0; k < summaryRowCmp.length; k++) {
      const summaryRow = summaryRowCmp[k];

      let tallestHeight = 0;
      let tallestElement;

      // .cmp-summaryRow-grouped-article-header h1
      // article h1
      let findTallestHeight = () => {
        // Loop through every grouped h1 height and find the tallest
        let groupedHeader = summaryRow.querySelectorAll(
          ".cmp-summaryRow-grouped-article-header h1",
        );
        for (let i = 0; i < groupedHeader.length; i++) {
          const groupedElement = groupedHeader[i];
          if (groupedElement.getBoundingClientRect().height > tallestHeight) {
            tallestElement = groupedElement;
            tallestHeight = tallestElement.getBoundingClientRect().height;
          }
        }

        // Loop through every individual h1 height and find the tallest
        let individualHeader = summaryRow.querySelectorAll("article h1");
        for (let i = 0; i < individualHeader.length; i++) {
          const individualElement = individualHeader[i];
          if (
            individualElement.getBoundingClientRect().height > tallestHeight
          ) {
            tallestElement = individualElement;
            tallestHeight = tallestElement.getBoundingClientRect().height;
          }
        }
        return tallestHeight;
      };

      // Set all of the height for both individual / grouped h1 to the tallest height
      let setAllHeight = (setHeight) => {
        if (setHeight == "auto") {
          setHeight = "auto";
        } else {
          setHeight = `${setHeight}px`;
        }

        let groupedHeader = summaryRow.querySelectorAll(
          ".cmp-summaryRow-grouped-article-header",
        );
        for (let i = 0; i < groupedHeader.length; i++) {
          const groupedElement = groupedHeader[i];
          groupedElement.style.height = setHeight;
        }

        let individualHeader = summaryRow.querySelectorAll("article h1");
        for (let i = 0; i < individualHeader.length; i++) {
          const individualElement = individualHeader[i];
          individualElement.style.height = setHeight;
        }
      };

      let checkSummaryRowViewport = () => {
        const vw = Math.max(
          document.documentElement.clientWidth || 0,
          window.innerWidth || 0,
        );

        if (vw > 991) {
          let heightToSet = findTallestHeight();
          setAllHeight(heightToSet);
        } else {
          setAllHeight("auto");
        }
      };

      // Fire off once on ready
      $("document").ready(function () {
        // Ensure that the component is properly loaded before executing checkSummaryRowViewport()
        const checkInitialisedElement = function () {
          let elem = document.querySelector('.cmp-summaryRow');
          let rect = elem.getBoundingClientRect();

          if (rect.height != 0) {
            clearInterval(myInterval);
            checkSummaryRowViewport();
          }
        };

        const myInterval = setInterval(checkInitialisedElement, 1000);
      });

      // All this will NOT occur below a viewport size of M and below. viewport < 992px
      window.addEventListener("resize", checkSummaryRowViewport);
    }

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
  //   $.fn.SummaryRowHeight();
  // });
})(jQuery);