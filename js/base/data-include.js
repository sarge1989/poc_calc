// JS for component rendering 
import { renderComponent, getCmp } from "./render-component.js";

export const dataInclude = function (callback) {
    console.log("starting data include!")
    var includes = $('[data-include]');
    var count = 0;

    $.each(includes, async function () {
        var compName = $(this).data('include');
        var compRoot = $(this).data('compRoot') != undefined ? $(this).data('compRoot') : "";
        var file =  compRoot + 'components/' + compName + '.html'

        await loadfile($(this), compName, file, () => {
            count += 1;

            if (count == includes.length) {
                callback("done");
            }
        })
    })
}

const loadfile = async function (ele, compName, file, callback) {
    await ele.load(file, async function () {
        ele[0].querySelector(':first-child').id = ele.data('id');

        if (ele.data('render') || ele.data('render') == 'true') {
            await renderComponent[compName](ele);
        }

        await removeDataIncludeDiv(ele);
        callback();
    });
}

const removeDataIncludeDiv = function (cmpWrapper) {
    var parent = getCmp(cmpWrapper.data('id')).parent();
    var content = parent.contents();
    parent.replaceWith(content);

    return new Promise(resolve => {
        resolve('removed datainclude div');
    });
}