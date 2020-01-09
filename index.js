const durationInput = document.querySelector('#duration');
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');
const resetButton = document.querySelector('#reset');
const timeDisplay = document.querySelector('#timestring');
const timeInfo = document.querySelector('.info');
const circle = document.querySelector('circle');

const perimeter = circle.getAttribute('r') * 2 * Math.PI;
circle.setAttribute('stroke-dasharray', perimeter + 1);

let duration;

const timer = new Timer(durationInput, startButton, pauseButton, resetButton, timeDisplay, timeInfo, {
    onStart(totalDuration) {
        if(!this.paused) {
            duration = totalDuration;
            this.animator = new ColorAnimator(totalDuration, circle)
        }
        this.animator.startAnimation();
    },
    onTick(timeRemaining) {
        circle.setAttribute('stroke-dashoffset',
            perimeter * timeRemaining / duration - perimeter
        );
    },
    onComplete() {
        if(this.animator) {
            this.animator.blinkTimer();
            this.animator.resetAnimation();
        }
    },
    onPause() {
        if(this.animator) { this.animator.stopAnimation() }
    }
});