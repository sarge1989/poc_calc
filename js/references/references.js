
// All js are imported here
import "../base/jquery-3.6.1.min.js";
import "../base/less.js";
import "../base/remove-comments.js";

import { dataInclude } from "../base/data-include.js";

// For testing purpose only. Not to be used in prod. To be removed
import "../global-navigation/header.js";
import "../global-navigation/homepage-banner.js";

// Components required for the page
import "../components/dropdown.js";


$(function () {
    const init = function () {
        console.log("executing init now");
        $.fn.globalHeader(); 
        $.fn.DropDownMenu();
        console.log("all done! ");
    };

    dataInclude((res)=>{
        // ensure that the dataInclude has completed execution before calling the initialisation for all components
        if (res == "done") {
            init();
        }
    })
});