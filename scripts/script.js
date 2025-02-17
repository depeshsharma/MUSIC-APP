new Vue({
  el: "#app",
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      tracks: [
        {
          name: "Mexico",
          artist: "Karan Aujla",
          cover: "../img/1.webp",
          source: "../mp3/1.mp3",
          url: "https://youtu.be/5d3EuRN43bU?si=hCRGrHsVZlLXULP3",
          favorited: false
        },
        {
          name: "Wavy ",
          artist: "Karan Aujla",
          cover: "../img/2.webp",
          source: "../mp3/2.mp3",
          url: "https://youtu.be/XTp5jaRU3Ws?si=3JQZHVCVKisfKS62",
          favorited: true
        },

        {
          name: "Bandook",
          artist: "Karan Aujla",
          cover: "../img/3.webp",
          source: "../mp3/3.mp3",
          url: "https://youtu.be/9rfOzfwcDK8?si=-MmXnykad5cvTw2z",
          favorited: false
        },

        {
          name: "Payal",
          artist: "Yo Yo Honey Singh",
          cover: "../img/4.webp",
          source: "../mp3/4.mp3",
          url: "https://youtu.be/a-PAcmi5Kas?si=nTyAW-_24_DTTXyx",
          favorited: false
        },
        {
          name: "Let's am play",
          artist: "Karan Aujla",
          cover: "../img/5.webp",
          source: "../mp3/5.mp3",
          url: "https://youtu.be/FS8G--sfa1s?si=hPE_yL_P813abYfH",
          favorited: true
        },
        {
          name: "Hold On",
          artist: "Arjan Dhillon",
          cover: "../img/6.webp",
          source: "../mp3/6.mp3",
          url: "https://youtu.be/YutKJBZd_bw?si=yvJTyk_1M_lPDM_X",
          favorited: false
        },
        {
          name: "Old skool",
          artist: "Prem Dhillon ft. Sidhu Moosewala",
          cover: "../img/7.webp",
          source: "../mp3/7.mp3",
          url: "https://youtu.be/hBlO1i_WTiY?si=gSKBi6LhlYXgyDOb",
          favorited: true
        },
        {
          name: "Few Days",
          artist: "Karan Aujla , Amantej Hundal",
          cover: "../img/8.webp",
          source: "../mp3/8.mp3",
          url: "https://youtu.be/Obij2jXpifY?si=bK_yh34tq7aTxGz-",
          favorited: false
        },
        {
          name: "315",
          artist: "AP Dhillon",
          cover: "../img/9.webp",
          source: "../mp3/9.mp3",
          url: "https://youtu.be/HfYzeyxNH6U?si=zLUafgMgQy2vGCYs",
          favorited: false
        }
      ],
      currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null
    };
  },
  methods: {
    play() {
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.pageX);
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    nextTrack() {
      this.transitionName = "scale-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if(this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    favorite() {
      this.tracks[this.currentTrackIndex].favorited = !this.tracks[
        this.currentTrackIndex
      ].favorited;
    }
  },
  created() {
    let vm = this;
    this.currentTrack = this.tracks[0];
    this.audio = new Audio();
    this.audio.src = this.currentTrack.source;
    this.audio.ontimeupdate = function() {
      vm.generateTime();
    };
    this.audio.onloadedmetadata = function() {
      vm.generateTime();
    };
    this.audio.onended = function() {
      vm.nextTrack();
      this.isTimerPlaying = true;
    };

    // this is optional (for preload covers)
    for (let index = 0; index < this.tracks.length; index++) {
      const element = this.tracks[index];
      let link = document.createElement('link');
      link.rel = "prefetch";
      link.href = element.cover;
      link.as = "image"
      document.head.appendChild(link)
    }
  }
});
