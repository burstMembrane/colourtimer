class Timer {
    constructor(durationInput,
        startButton,
        pauseButton,
        resetButton,
        timeDisplay,
        timeInfo,
        callbacks) {

        // load HTML elements to local variables
        this.durationInput = durationInput;
        this.startButton = startButton;
        this.pauseButton = pauseButton;
        this.resetButton = resetButton;
        this.timeDisplay = timeDisplay;
        this.timeInfo = timeInfo;
        // setup local boolean
        this.paused = false;
        if(callbacks) {
            this.onStart = callbacks.onStart;
            this.onTick = callbacks.onTick;
            this.onComplete = callbacks.onComplete;
            this.onPause = callbacks.onPause;
            this.onFiveSeconds = callbacks.onFiveSeconds;
            this.onReset = callbacks.onReset;
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
        if(this.onReset) {

            this.onReset();
        }

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



    }
    tick = () => {
        if(this.onTick) {
            this.onTick(this.timeRemaining);
        }

        if(this.timeRemaining <= 0) {
            this.durationInput.value = 0
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

        if(Math.floor(this.timeRemaining) == 5) {

            if(this.onFiveSeconds) {
                this.onFiveSeconds();
            }
        }
        if(this.timeRemaining > 60) {
            // converts seconds into minutes and seconds for use as HTML string
            this.minutes = Math.floor(this.timeRemaining / 60);
            this.seconds = Math.floor(this.timeRemaining - this.minutes * 60);
            this.timeString = `${this.minutes}m ${this.seconds}s`;
            this.timeDisplay.innerHTML = this.timeString;
        } else {
            this.seconds = Math.floor(this.timeRemaining);
            this.timeString = `${this.seconds}s`;
            this.timeDisplay.innerHTML = this.timeString;
        }
    }
    onValChange = () => {
        let val;
        // debounce input
        let timeoutId;
        if(timeoutId) { clearTimeout(timeoutId) } else {
            timeoutId = setTimeout(() => {
                val = this.durationInput.value;
                this.convert();
                this.showDisplay = false;
                this.timeDisplay.style = "display: none;"
                if(val > 0 && val < 1000) {
                    this.timeInfo.style = "font-size: 32px";
                    this.timeInfo.innerHTML = this.timeString;
                } else if(val >= 1000) {
                    this.timeInfo.style = "font-size: 24px";
                    this.timeInfo.innerHTML = this.timeString;;
                } else {
                    this.timeInfo.innerHTML = "";
                }
            }, 500);
        }
        // live show seconds input in minutes
    };
}