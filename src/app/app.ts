import {Component, inject, OnInit, signal} from '@angular/core';
import Bowser from 'bowser';
import InAppSpy from 'inapp-spy';
import {doc, Firestore, getDoc} from '@angular/fire/firestore';

enum OS {
  IOS,
  ANDROID,
  DESKTOP,
}

interface Config {
  title: string;
  subtitle?: string;
  links: {
    icon: string,
    label: string,
    url: string,
  }[]
}

const DEFAULT_CONFIG: Config = {
  title: 'Servicios de enfermería veterinaria en casa',
  links: [
    {
      icon: 'whatsapp',
      label: 'Agenda tu cita',
      url: 'wa.me/573007615952',
    },
    {
      icon: 'file-earmark-richtext',
      label: 'Nuestro portafolio',
      url: 'drive.google.com/file/d/1oI5zeF3WA4Y-ojx2TqvZJ7GFbxPiQ1oV/view?fbclid=PAZnRzaAMxpERleHRuA2FlbQIxMQABp17V5ib2Sze8DoasXYGEif5QDksS8IO7nSxK63dFzF5IsBCwXvZKhjQ_VCzT_aem_aXE2lafYoKXOK7STnatT1w',
    },
    {
      icon: 'instagram',
      label: 'Más de lo que hacemos',
      url: 'www.instagram.com/saracatnela',
    }
  ]
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly _firestore = inject(Firestore);
  private readonly _browser: Bowser.Parser.Parser = Bowser.getParser(window.navigator.userAgent);
  private readonly _currentOS: OS = this.getCurrentOS();
  private readonly _isInApp: boolean = InAppSpy().isInApp;
  config = signal<Config | undefined>(undefined);

  async ngOnInit(): Promise<void> {
    let config: Config;
    try {
      const docRef = doc(this._firestore, "config", '0');
      const docSnap = await getDoc(docRef);
      config = docSnap.exists() ? (docSnap.data() as Config) : DEFAULT_CONFIG;
    } catch (e) {
      console.error('Error fetching config:', e);
      config = DEFAULT_CONFIG;
    }

    config.links = config.links.map(link => ({
      ...link,
      url: this._getParsedUrl(link.url),
    }));

    this.config.set(config);
  }

  openLink(url: string): void {
    window.open(url, "_blank");
  }

  private getCurrentOS(): OS {
    if (this._browser.getPlatformType(true) === 'desktop') {
      return OS.DESKTOP;
    }
    return this._browser.getOSName() === 'iOS' ? OS.IOS : OS.ANDROID;
  }

  private _getParsedUrl(url: string): string {
    if (!this._isInApp) {
      return 'https://' + url;
    }

    if (this._currentOS === OS.IOS) {
      return 'x-safari-https://' + url;
    }

    return 'intent://' + url + '#Intent;scheme=https;end';
  }
}
