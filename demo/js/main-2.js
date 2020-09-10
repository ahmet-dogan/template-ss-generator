var colorList = ["#FFCFA4", "#FFD8CF", "#FDDAF3", "#E0D2FF", "#C3F0EB", "#D7EFFC", "#DAF5C9", "#EDE8C3", "#FAD5B4", "#DEE5F2", "#B2E1EF", "#FFE1D0", "#F4CBFF", "#DEE3FF", "#F1E2B3", "#C5DCFF", "#BEEEC0", "#D5D3FF", "#FFC7C7", "#FFDF8C", "#FFEBB3", "#EDE2FE", "#FEE2D5", "#D0F0FD", "#FFBDC7", "#BFBCFF", "#FFE189", "#D1F7C4", "#B5F2EB", "#F8DCD6", "#FFC59E", "#AEE5FF"];
var defaultColors = ['rgba(0, 0, 0, 0)', 'rgb(245, 245, 245)', 'rgb(255, 255, 255)'];
var defaultSpeed = 0.25;
var maxScrollableDistance = 1000;

var getScrollableHightOfElement = function ($element, withoutLimit) {
    var $wrapperEl = $element.closest('.template-wrapper');
    var distance = $element.height() - $wrapperEl.height();
    distance = !withoutLimit && distance >= maxScrollableDistance ? maxScrollableDistance : distance;
    return -distance;
};

var calculateDuration = function ($element, direction, speed) {
    var distance = Math.abs(getScrollableHightOfElement($element));
    var currentPosition = Math.abs(parseFloat($element.css('top').slice(0, -2)));
    var dx = direction === 'up' ? currentPosition : distance - currentPosition;
    return Math.floor(dx / (speed || defaultSpeed));
};

$.each(window.results, function (i, result) {
    var $a = $('<a href="https://www.jotform.com/' + result.formID + '" target="_blank"></a>');
    var $backgroundEl = $('<div class="template-bg"></div>');
    var backgroundEl = $backgroundEl.get(0);
    $a.append($backgroundEl);
    
    var $wrapperEl = $('<div class="template-wrapper"></div>');
    $backgroundEl.append($wrapperEl);
    
    var $contentEl = $('<div class="template-content"></div>');
    $wrapperEl.append($contentEl);
    
    var $logo = $('<div class="template-logo">LOGO</div>')
    $contentEl.append($logo);
    
    var $image = $('<img class="template-form" src="../' + result.form + '" alt="" />');
    $contentEl.append($image);
    
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
        var $this = $(this);
        var $scrollEl = $this.find('.template-content');
        var $currentLogo = $this.find('.template-logo');
        $currentLogo.slideDown();
        setTimeout(function () {
            if ($this.attr('stop-animation') == 'true') {
                $this.removeAttr('stop-animation');
                return;
            }
            var topValue = getScrollableHightOfElement($scrollEl);
            var duration = calculateDuration($scrollEl, 'down');
            $scrollEl.stop()
                .animate({top: topValue + 'px'}, duration, 'linear', function () {
                        setTimeout(
                            function () {
                                $scrollEl.animate({top: '0px'}, duration, 'linear');
                            },
                            1000
                        );
                    }
                );
        }, 500);
    });
    
    $backgroundEl.mouseleave(function () {
        var $this = $(this);
        $this.attr('stop-animation', true);
        var $scrollEl = $this.find('.template-content');
        var $currentLogo = $this.find('.template-logo');
        var duration = calculateDuration($scrollEl, 'up', defaultSpeed * 2);
        $currentLogo.slideUp();
        $scrollEl.stop().animate({top: '0px'}, duration, 'linear');
        setTimeout(function () {
            $this.removeAttr('stop-animation');
        }, 550);
    });
    
    backgroundEl.addEventListener('wheel', function (event) {
        event.preventDefault();
        var $scrollEl = $(this).find('.template-content');
        var topValue = parseFloat($scrollEl.stop().css('top').slice(0, -2));
        var calculatedTopValue = topValue - (2 * event.deltaY);
        calculatedTopValue = calculatedTopValue > 0 ? 0 : calculatedTopValue;
        calculatedTopValue = calculatedTopValue < getScrollableHightOfElement($scrollEl, true) ? getScrollableHightOfElement($scrollEl, true) : calculatedTopValue;
        $scrollEl.css({top: calculatedTopValue + 'px'});
    });
});
