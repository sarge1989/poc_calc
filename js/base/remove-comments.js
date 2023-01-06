$('*').contents().each(function () {
    if (this.nodeType === Node.COMMENT_NODE) {
        $(this).remove();
    }
});