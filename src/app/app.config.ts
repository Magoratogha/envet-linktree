import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection,} from '@angular/core';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {FIREBASE_CONFIG} from '../../firebase-config';
import {connectFirestoreEmulator, getFirestore, provideFirestore} from '@angular/fire/firestore';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideFirebaseApp(() => initializeApp(FIREBASE_CONFIG)),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (location.hostname === 'localhost') {
        connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
      }
      return firestore;
    })
  ],
};
