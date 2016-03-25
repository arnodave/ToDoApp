function CollectionView(cv) {
    this.render = function (prepend) {
        var template = _.template($(cv.template).html());
        var resultingHtml = $("<div></div>");
        for (var item in cv.items) {
            resultingHtml.append(template(cv.items[item]));
        }
        if (prepend != null) {
            $(cv.childContentContainer).prepend(resultingHtml.html());
        }
        else {
            $(cv.childContentContainer).html(resultingHtml.html());
        }
    }
}