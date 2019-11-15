/* 
    AUTHOR: MORTEN BEUCHERT
    DATE: 12TH NOVEMBER 2019
*/

class AudioPlayer {
    constructor(containerId, url, title, volume = .3) {
        this.audio = new Audio(url);
        this.title = title;
        this.volume = volume;

        this.containerId = containerId;

        this.createElements();
        this.addEventListeners();
    }

    createElements() {
        this.playerEl = document.getElementById(this.containerId);
        this.playerEl.style.color = "#fff";

        // TITLE
        let titleEl = document.createElement("h3");
        titleEl.style.color = "#fff";
        titleEl.innerText = this.title;

        // PLAY BUTTON
        this.playEl = document.createElement("i");
        this.playEl.className = "fa fa-play-circle";

        // PAUSE BUTTON
        this.pauseEl = document.createElement("i");
        this.pauseEl.className = "fa fa-pause-circle";
        this.pauseEl.style.marginLeft = "5px";

        // CURRENT TIME
        this.timeCurrentEl = document.createElement("span");
        this.timeCurrentEl.innerText = "00:00";
        this.timeCurrentEl.style.marginLeft = "5px";

        // SEEK SLIDER
        this.seekerEl = document.createElement("input");
        this.seekerEl.id = "seeker";
        this.seekerEl.type = "range";
        this.seekerEl.min = 0;
        this.seekerEl.max = 100;
        this.seekerEl.step = 0.1;
        this.seekerEl.value = 0;
        this.seekerEl.style.marginLeft = "5px";

        // TIME END
        this.timeEndEl = document.createElement("span");
        this.timeEndEl.innerText = "00:00";
        this.timeEndEl.style.marginLeft = "5px";

        // VOLUME ICON
        this.volumeIconEl = document.createElement("i");
        this.volumeIconEl.className = "fa fa-volume-up";
        this.volumeIconEl.style.marginLeft = "5px";

        // VOLUME CONTROL
        this.volumeEl = document.createElement("input");
        this.volumeEl.id = "volume";
        this.volumeEl.type = "range";
        this.volumeEl.min = 0;
        this.volumeEl.max = 1;
        this.volumeEl.step = 0.01;
        this.volumeEl.value = String(this.volume);
        this.volumeEl.style.marginLeft = "5px";

        // Append elements
        this.playerEl.appendChild(titleEl);
        this.playerEl.appendChild(this.playEl);
        this.playerEl.appendChild(this.pauseEl);
        this.playerEl.appendChild(this.timeCurrentEl);
        this.playerEl.appendChild(this.seekerEl);
        this.playerEl.appendChild(this.timeEndEl);
        this.playerEl.appendChild(this.volumeIconEl);
        this.playerEl.appendChild(this.volumeEl);
    }

    addEventListeners() {
        this.playEl.addEventListener("click", event => {
            this.audio.play();
        });

        this.pauseEl.addEventListener("click", event => {
            this.audio.paused ? this.audio.play() : this.audio.pause();
        });

        this.volumeEl.addEventListener("change", event => {
            this.audio.volume = event.target.value / 1;
        });

        this.audio.addEventListener("durationchange", event => {
            //console.log("durationchange");
            this.audioDurationMs = this.audio.duration * 1000;
            this.setCurrentTimeLabel();
            this.setEndTimeLabel();
        });

        let canPlayThroughHandler = event => {
            //console.log("canplaythrough");
            this.audioDurationMs = this.audio.duration * 1000;
            this.setEndTimeLabel();
        }

        this.audio.addEventListener("canplaythrough", canPlayThroughHandler);

        let timeUpdateHandler = event => {
            const newValue = this.audio.currentTime * 1000 * 100 / this.audioDurationMs;
            this.seekerEl.value = newValue;

            this.setCurrentTimeLabel();
        }

        this.audio.addEventListener("timeupdate", timeUpdateHandler);

        this.seekerEl.addEventListener("mousedown", event => {
            this.audio.removeEventListener("timeupdate", timeUpdateHandler);
        })

        this.seekerEl.addEventListener("mouseup", event => {
            this.audio.addEventListener("timeupdate", timeUpdateHandler);
        })
        
        this.seekerEl.addEventListener("change", event => {
            const newValue = event.target.value / 100 * this.audio.duration;
            this.audio.currentTime = newValue;
            this.seekerEl.value = event.target.value;
        
            this.setCurrentTimeLabel();
        });
    }

    setCurrentTimeLabel() {
        let currentMinutes = Math.floor(this.audio.currentTime / 60);
        let currentSeconds = Math.floor(this.audio.currentTime % 60);
    
        if (currentMinutes < 10) {
            currentMinutes = "0" + currentMinutes;
        }
        if (currentSeconds < 10) {
            currentSeconds = "0" + currentSeconds;
        }
        this.timeCurrentEl.innerText = currentMinutes + ":" + currentSeconds;
    }

    setEndTimeLabel() {
        let durationMinutes = Math.floor(this.audio.duration / 60);
        if (durationMinutes < 10) {
            durationMinutes = "0" + durationMinutes;
        }
        let durationSeconds = Math.floor(this.audio.duration % 60);
        if (durationSeconds < 10) {
            durationSeconds = "0" + durationSeconds;
        }
        this.timeEndEl.innerText = durationMinutes + ":" + durationSeconds;
    }
}