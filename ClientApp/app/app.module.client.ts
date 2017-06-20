import * as Raven from 'raven-js';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { sharedConfig } from './app.module.shared';
import { AppErrorHandler } from "./app.error-handler";

Raven.config('https://779848203f144fc7ada77ead5efe2121@sentry.io/181795').install();

@NgModule({
    bootstrap: sharedConfig.bootstrap,
    declarations: sharedConfig.declarations,
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        ...sharedConfig.imports
    ],
    providers: [
        { provide: 'ORIGIN_URL', useValue: location.origin },
        { provide: ErrorHandler, useClass: AppErrorHandler }
    ]
})
export class AppModule {
}
