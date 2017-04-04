export class Settings {
    autoPlay: boolean = true;

    load(saved: any) {
      this.autoPlay = !!saved.autoPlay;
    }
}
