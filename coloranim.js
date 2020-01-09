class ColorAnimator {
    constructor(initial, element) {
        // allow SVG styling in jquery color
        jQuery.Color.hook("stroke");

        // set up variables
        this.infoBox = $('.info');
        this.jqueryCircle = $("circle");
        this.newColors();
        this.initial = initial;
        this.element = element;
    }

    getRandColor = () => {
        // returns random RGB color string
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);
        return `rgb(${r},${g},${b})`
    }
    startAnimation = () => {
        this.infoBox.hide();
        // !TODO Refactor to avoid callback nesting
        // animate between last random and new random color for 1000ms
        this.jqueryCircle.animate({
            'stroke': this.firstColor,
        }, 250, () => {
            // animate between two random colors for the duration of the timer - 6000ms for other animations
            this.jqueryCircle.animate({
                'stroke': this.secondColor,
            }, (this.initial * 1000) - 5750, () => {
                // for last five seconds, pulsate circle
                for(var i = 0; i < 5; i++) {
                    this.jqueryCircle.fadeTo(500, 0.5).fadeTo(500, 1.0);
                }
            });
        });
    }
    stopAnimation = () => {
        this.jqueryCircle.stop();
    }
    resetAnimation = () => {
        this.infoBox.show();
        clearInterval(this.timerBlink);
        this.jqueryCircle.stop({
            clearQueue: true,
            jumpToEnd: true
        });
        this.newColors();
        this.jqueryCircle.animate({
            'stroke': this.firstColor,
        }, 500);
    }
    newColors = () => {
        // get two random colours and then save them as clas vars
        this.firstColor = jQuery.Color(this.getRandColor()).toHexString()
        this.secondColor = jQuery.Color(this.getRandColor()).toHexString()
    }
    blinkTimer = () => {
        // blink the timer
        this.timerBlink = setInterval(function() {
            $('.timer').animate({ opacity: 0.5 }, 500).animate({ opacity: 1 }, 500);
        }, 1000);
    }


}