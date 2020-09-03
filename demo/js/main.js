var colorList = ["#FFCFA4", "#FFD8CF", "#FDDAF3", "#E0D2FF", "#C3F0EB", "#D7EFFC", "#DAF5C9", "#EDE8C3", "#FAD5B4", "#DEE5F2", "#B2E1EF", "#FFE1D0", "#F4CBFF", "#DEE3FF", "#F1E2B3", "#C5DCFF", "#BEEEC0", "#D5D3FF", "#FFC7C7", "#FFDF8C", "#FFEBB3", "#EDE2FE", "#FEE2D5", "#D0F0FD", "#FFBDC7", "#BFBCFF", "#FFE189", "#D1F7C4", "#B5F2EB", "#F8DCD6", "#FFC59E", "#AEE5FF"];
var defaultColors = ['rgba(0, 0, 0, 0)', 'rgb(245, 245, 245)', 'rgb(255, 255, 255)'];
var speed = 1.1;

var getInitialBottomOfImage = function (image) {
    var $wrapperEl = $(image).closest('.template-wrapper');
    return $wrapperEl.height() - image.getBoundingClientRect().height;
};
var onImgLoaded = function () {
    this.style.bottom = getInitialBottomOfImage(this) + 'px';
};
var calculateMaxDuration = function (image) {
    return image.getBoundingClientRect().height / speed;
};
var calculateDuration = function (image, direction) {
    var imageHeight = image.getBoundingClientRect().height;
    var currentBottom = Math.abs(parseFloat(image.style.bottom.slice(0, -2)));
    var maxDuration = calculateMaxDuration(image);
    var dx = direction === 'up' ? imageHeight - currentBottom : currentBottom;
    return Math.floor((dx * maxDuration) / imageHeight);
};

$.each(window.results, function (i, result) {
    var $a = $('<a href="https://www.jotform.com/' + result.formID + '" target="_blank"></a>');
    var $backgroundEl = $('<div class="template-bg"></div>');
    var backgroundEl = $backgroundEl.get(0);
    var $wrapperEl = $('<div class="template-wrapper"></div>');
    var $image = $('<img class="template-form" src="../' + result.form + '" alt="" />').load(onImgLoaded);
    $a.append($backgroundEl);
    $backgroundEl.append($wrapperEl);
    $wrapperEl.append($image);
    $('#container').append($a);
    
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
        var currentImage = $currentImage[0];
        var firstBottom = getInitialBottomOfImage(currentImage);
        var duration = calculateDuration(currentImage, 'down');
        $currentImage.stop()
            .animate({bottom: '0'}, duration, 'linear', function () {
                    console.log('DONE!!!');
                    setTimeout(
                        function () {
                            $currentImage.animate({bottom: firstBottom}, duration, 'linear');
                        },
                        1000
                    );
                }
            );
    });
    
    $backgroundEl.mouseleave(function () {
        var $currentImage = $(this).find('img');
        var currentImage = $currentImage[0];
        var firstBottom = getInitialBottomOfImage(currentImage);
        var duration = calculateDuration(currentImage, 'up');
        $currentImage.stop().animate({bottom: firstBottom}, duration, 'linear');
    });
    
    backgroundEl.addEventListener('wheel', function (event) {
        event.preventDefault();
        var $currentImage = $(this).find('img');
        var bottomValue = parseFloat($currentImage.stop().css('bottom').slice(0, -2));
        var calculatedBottomValue = bottomValue + (5 * event.deltaY);
        calculatedBottomValue = calculatedBottomValue > 0 ? 0 : calculatedBottomValue;
        calculatedBottomValue = calculatedBottomValue < getInitialBottomOfImage($currentImage[0]) ? getInitialBottomOfImage($currentImage[0]) : calculatedBottomValue;
        $currentImage.css({bottom: calculatedBottomValue + 'px'});
    });
});
