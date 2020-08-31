var colorList = ["#FFCFA4", "#FFD8CF", "#FDDAF3", "#E0D2FF", "#C3F0EB", "#D7EFFC", "#DAF5C9", "#EDE8C3", "#FAD5B4", "#DEE5F2", "#B2E1EF", "#FFE1D0", "#F4CBFF", "#DEE3FF", "#F1E2B3", "#C5DCFF", "#BEEEC0", "#D5D3FF", "#FFC7C7", "#FFDF8C", "#FFEBB3", "#EDE2FE", "#FEE2D5", "#D0F0FD", "#FFBDC7", "#BFBCFF", "#FFE189", "#D1F7C4", "#B5F2EB", "#F8DCD6", "#FFC59E", "#AEE5FF"];
var defaultColors = ['rgba(0, 0, 0, 0)', 'rgb(245, 245, 245)', 'rgb(255, 255, 255)'];

$.each(window.results, function (i, result) {
    var $backgroundEl = $('<div class="template-bg"></div>');
    var backgroundEl = $backgroundEl.get(0);
    $backgroundEl.append($('<img class="template-form" src="../' + result.form + '" alt=""/>'));
    $('#container').append($backgroundEl);
    
    if (result.backgroundType === 'image') {
        $backgroundEl.css('background-image', 'url(../' + result.background + ')');
    } else {
        var color = result.background;
        if (defaultColors.indexOf(result.background) !== -1) {
            color = colorList[Math.floor(Math.random() * colorList.length)];
        }
        $backgroundEl.css('background-color', color);
    }
    
    $backgroundEl.mouseenter(function () {
        var maxScrollTop = backgroundEl.scrollHeight - backgroundEl.clientHeight;
        backgroundEl.scroll({top: maxScrollTop, behavior: 'smooth'});
    });
    
    $backgroundEl.mouseleave(function () {
        backgroundEl.scroll({top: 0, behavior: 'smooth'});
    });
    
    backgroundEl.addEventListener('wheel', function (event) {
        event.preventDefault();
        backgroundEl.scroll({top: backgroundEl.scrollTop + (5 * event.deltaY)});
    });
});
