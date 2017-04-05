export class Preference {
    autoPlay: boolean = true;
    playRandom: boolean = true;
    songOnly: boolean = true;

    load(saved: any) {
      this.autoPlay = !!saved.autoPlay;
      this.playRandom = !!saved.playRandom;
      this.songOnly = !!saved.songOnly;
    }

    toJSON() {
      return {
        autoPlay: this.autoPlay,
        playRandom: this.playRandom,
        songOnly: this.songOnly
      };
    }
}
