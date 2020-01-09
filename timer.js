class Timer {
    constructor(durationInput, startButton, pauseButton, resetButton, timeDisplay, callbacks) {
        this.durationInput = durationInput;
        this.startButton = startButton;
        this.pauseButton = pauseButton;
        this.resetButton = resetButton;
        this.timeDisplay = timeDisplay;

        this.paused = false;
        if(callbacks) {
            this.onStart = callbacks.onStart;
            this.onTick = callbacks.onTick;
            this.onComplete = callbacks.onComplete;
            this.onPause = callbacks.onPause;
        }
        this.startButton.addEventListener('click', this.start);
        this.pauseButton.addEventListener('click', this.pause);
        this.resetButton.addEventListener('click', this.reset);
        this.durationInput.addEventListener('keyup', this.onValChange)
    }


    start = () => {
        if(!this.isRunning) {
            if(this.onStart) {
                this.onStart(this.timeRemaining);
                this.convert(this.timeRemaining);
                this.convertInterval = setInterval(this.convert, 1000);
                // if its paused then restart
                // if value has changed from stored maxTime then start and reinit
                if(!this.paused && this.timeRemaining !== this.durationInput.value) {
                    this.maxTime = this.timeRemaining;
                }
                if(this.paused && this.durationInput.value !== this.timeRemaining) {
                    // value was changed while paused

                    this.maxTime = this.durationInput.value;
                    this.paused = false;
                    this.onStart(this.timeRemaining);
                }
            }
            // start value for timer

            // call tick method immediately and then once every second 
            this.tick();
            this.interval = setInterval(this.tick, 20);

            //  if display isnt showing, show the display
            if(!this.showDisplay) {
                this.showDisplay = true;
                this.display();
            }
            this.isRunning = true;
        }

    };
    pause = () => {
        this.isRunning = false;
        this.showDisplay = false;
        this.display();
        if(this.onPause) {
            this.onPause();
        }
        this.paused = true;
        clearInterval(this.interval);
        clearInterval(this.convertInterval);
        this.convert();
    }

    reset = () => {
        this.isRunning = false;
        this.paused = false;
        // reset to initial time
        if(this.maxTime) {
            this.convert();

            this.durationInput.value = this.maxTime;
            this.onStart(this.timeRemaining);
            this.onTick(this.timeRemaining);

            this.showDisplay = false;
            this.display();
        }
        if(this.onComplete) {
            this.isRunning = false;
            this.onComplete();
        }
    }
    tick = () => {
        if(this.onTick) {
            this.onTick(this.timeRemaining);
        }

        if(this.timeRemaining <= 0) {
            // if at zero, pause
            if(this.onComplete) {
                this.onComplete();
            }
            this.pause()
        } else {
            this.timeRemaining = this.timeRemaining - 0.02;
        }
    };
    display = () => {
        if(this.showDisplay) {
            // show minutes seconds display and hide input
            this.timeDisplay.style = "display: block";
            this.timeDisplay.innerHTML = this.timeString;
            this.durationInput.style = "display: none";
        } else {
            // else allow editing
            this.timeDisplay.style = "display: none";
            this.durationInput.style = "display: block";
        }
    }

    // getter and setter for time remaining
    get timeRemaining() {
        return parseFloat(this.durationInput.value);
    }
    set timeRemaining(time) {
        let currTime = time.toFixed(2);
        // int portion
        this.durationInput.value = currTime;
    }

    convert = () => {
        if(this.timeRemaining) {
            // converts seconds into minutes and seconds for use as HTML string
            this.minutes = Math.floor(this.timeRemaining / 60);
            this.seconds = Math.floor(this.timeRemaining - this.minutes * 60)
            this.timeString = `${this.minutes}m ${this.seconds}s`
            this.timeDisplay.innerHTML = this.timeString;
        }
    }
    onValChange = () => {

    }
}