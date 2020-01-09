class ColorAnimator {
    constructor(initial, element) {
        // allow SVG styling in jquery color
        jQuery.Color.hook("stroke");
        // we want to animate SVG fill and stroke properties

        // set up variables
        this.jqueryCircle = $("circle");
        this.newColors();
        this.secondColor = this.getRandColor();
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
        // animate between last random and new random color for 1000ms
        this.jqueryCircle.animate({
            'stroke': this.firstColor,
        }, 1000, () => {
            // animate between two random colors for the duration of the timer - 6000ms for other animations
            this.jqueryCircle.animate({
                'stroke': this.secondColor,
            }, (this.initial * 1000) - 6000, () => {
                // for last five seconds, pulsate
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

        this.firstColor = jQuery.Color(this.getRandColor()).toHexString()
        this.secondColor = jQuery.Color(this.getRandColor()).toHexString()


    }
    blinkTimer = () => {

        this.timerBlink = setInterval(function() {
            $('.timer').animate({ opacity: 0.5 }, 500).animate({ opacity: 1 }, 500);
        }, 1000);
    }


}