export class Settings {
    autoPlay: boolean = true;
    playRandom: boolean = true;
    songOnly: boolean = true;

    load(saved: any) {
      this.autoPlay = !!saved.autoPlay;
    }
}
