var colorList = ["#FFCFA4", "#FFD8CF", "#FDDAF3", "#E0D2FF", "#C3F0EB", "#D7EFFC", "#DAF5C9", "#EDE8C3", "#FAD5B4", "#DEE5F2", "#B2E1EF", "#FFE1D0", "#F4CBFF", "#DEE3FF", "#F1E2B3", "#C5DCFF", "#BEEEC0", "#D5D3FF", "#FFC7C7", "#FFDF8C", "#FFEBB3", "#EDE2FE", "#FEE2D5", "#D0F0FD", "#FFBDC7", "#BFBCFF", "#FFE189", "#D1F7C4", "#B5F2EB", "#F8DCD6", "#FFC59E", "#AEE5FF"];
var defaultColors = ['rgba(0, 0, 0, 0)', 'rgb(245, 245, 245)', 'rgb(255, 255, 255)'];

$.each(window.results, function (i, result) {
    var $backgroundEl = $('<div class="template-bg"></div>');
    var backgroundEl = $backgroundEl.get(0);
    var $wrapperEl = $('<div class="template-wrapper"></div>');
    var getInitialBottomOfImage = function (image) {
        var $wrapperEl = $(image).closest('.template-wrapper');
        return $wrapperEl.height() - image.getBoundingClientRect().height;
    };
    var onImgLoaded = function () {
        this.style.bottom = getInitialBottomOfImage(this) + 'px';
    };
    var $image = $('<img class="template-form" src="../' + result.form + '" alt="" />').load(onImgLoaded);
    $backgroundEl.append($wrapperEl);
    $wrapperEl.append($image);
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
        var $currentImage = $(this).find('img');
        var firstBottom = getInitialBottomOfImage($currentImage[0]);
        $currentImage.stop().animate({bottom: '0'}, 2000, function () {
            setTimeout(function () {
                $currentImage.animate({bottom: firstBottom}, 2000);
            }, 2000);
        });
    });
    
    $backgroundEl.mouseleave(function () {
        var $currentImage = $(this).find('img');
        var firstBottom = getInitialBottomOfImage($currentImage[0]);
        $currentImage.stop().animate({bottom: firstBottom}, 500);
    });
    
    backgroundEl.addEventListener('wheel', function (event) {
        event.preventDefault();
        var $currentImage = $(this).find('img');
        var bottomValue = parseFloat($currentImage.stop().css('bottom').slice(0, -2));
        var calculatedBottomValue = bottomValue + (3 * event.deltaY);
        calculatedBottomValue = calculatedBottomValue > 0 ? 0 : calculatedBottomValue;
        calculatedBottomValue = calculatedBottomValue < getInitialBottomOfImage($currentImage[0]) ? getInitialBottomOfImage($currentImage[0]) : calculatedBottomValue;
        $currentImage.css({bottom: calculatedBottomValue + 'px'});
    });
});
