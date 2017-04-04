import {Injectable} from '@angular/core';

declare global {
  interface Window {
    process?:any;
  }
}

@Injectable()
export class PlatformService {
  isRunningInElectron() {
    return typeof window !== 'undefined' && window.process && window.process.type === "renderer";
  }
}
