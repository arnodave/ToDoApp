function CollectionView(cv) {
    this.render = function () {
        var template = _.template($(cv.template).html());
        var resultingHtml = "";
        for (var item in cv.items) {
            resultingHtml += template(cv.items[item]);
        }
        $(cv.childContentContainer).prepend(resultingHtml);
    }
}