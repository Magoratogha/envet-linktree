import { Component } from '@angular/core';
import Bowser from 'bowser';
import InAppSpy from 'inapp-spy';

enum OS {
  IOS,
  ANDROID,
  DESKTOP,
}

enum Links {
  INSTAGRAM = 'www.instagram.com/saracatnela',
  WHATSAPP = 'wa.me/573007615952',
  GDRIVE = 'drive.google.com/file/d/1oI5zeF3WA4Y-ojx2TqvZJ7GFbxPiQ1oV/view?fbclid=PAZnRzaAMxpERleHRuA2FlbQIxMQABp17V5ib2Sze8DoasXYGEif5QDksS8IO7nSxK63dFzF5IsBCwXvZKhjQ_VCzT_aem_aXE2lafYoKXOK7STnatT1w',
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  browser: Bowser.Parser.Parser;
  currentOS: OS = OS.DESKTOP;
  isInApp: boolean = false;
  links = Links;

  constructor() {
    this.browser = Bowser.getParser(window.navigator.userAgent);

    // OS detection
    if (this.browser.getPlatformType(true) === 'desktop') {
      this.currentOS = OS.DESKTOP;
    } else {
      this.currentOS = this.browser.getOSName() === 'iOS' ? OS.IOS : OS.ANDROID;
    }

    // InApp detection
    this.isInApp = InAppSpy().isInApp;
  }

  getParsedUrl(url: Links): string {
    if (!this.isInApp) {
      return 'https://' + url;
    } else if (this.currentOS === OS.IOS) {
      return 'x-safari-https://' + url;
    } else {
      return 'intent://' + url + '#Intent;scheme=https;end';
    }
  }
}
