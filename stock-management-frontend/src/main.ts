import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config'; // ✅ importer la config

bootstrapApplication(AppComponent, appConfig); // ✅ utiliser la config centralisée
