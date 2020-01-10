class ColorAnimator {
    constructor(initial, element) {
        // allow SVG styling in jquery color
        jQuery.Color.hook("stroke");

        // set up variables
        this.infoBox = $('.info');
        this.jqueryCircle = $("circle");
        this.circleParent = $('svg');
        this.dispInput = $('input');
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

    pulsate = () => {

        // for last five seconds, pulsate circle
        for(var i = 0; i < 5; i++) {
            this.circleParent.animate({ 'opacity': 0.2 }, 500).animate({ 'opacity': 1 }, 500);
        }
    }


    startAnimation = () => {
        this.infoBox.hide();
        // !TODO Refactor to avoid callback nesting
        // animate between last random and new random color for 1000ms

        let animationDuration;
        animationDuration = this.initial * 1000
        console.log(animationDuration);
        if(!this.isAnimationPaused) {
            this.jqueryCircle.animate({
                'stroke': this.firstColor,
            }, 250, () => {
                // animate between two random colors for the duration of the timer - 6000ms for other animations
                this.jqueryCircle.animate({
                        'stroke': this.secondColor
                    },
                    animationDuration - 250);
            });
        }

    }

    stopAnimation = () => {
        // stop animating the colors and all subsequent animation calls
        this.jqueryCircle.stop();
    }
    toggleBackground = (toggle) => {
        console.log(toggle);
        if(toggle) {
            $("body").get(0).style.setProperty("--bg-color", "white");
            $("body").get(0).style.setProperty("--fg-color", "black");
        } else {
            $("body").get(0).style.setProperty("--bg-color", "2f3136");
            $("body").get(0).style.setProperty("--fg-color", "white");
        }

    }
    pauseAnimation = () => {

        this.jqueryCircle.pause();
        this.isAnimationPaused = true;
    }
    resumeAnimation = () => {
        this.jqueryCircle.resume();
        this.isAnimationPaused = false;
    }
    completeAnimation = ({ duration }) => {
        for(var i = 0; i < 10; i++) {
            this.dispInput.animate({ 'color': 'red' }, 125).animate({ 'color': 'white' }, 125);
        }

    }

    resetAnimation = () => {
        this.infoBox.show();
        this.jqueryCircle.stop({
            clearQueue: true,
            jumpToEnd: true
        });
        this.newColors();

    }

    newColors = () => {
        // get two random colours and then save them as clas vars
        this.firstColor = jQuery.Color(this.getRandColor()).toHexString()
        this.secondColor = jQuery.Color(this.getRandColor()).toHexString()
    }



}