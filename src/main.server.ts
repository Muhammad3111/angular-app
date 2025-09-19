import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = () =>
  bootstrapApplication(App, {
    ...config,
    providers: [...(config.providers ?? [])],
  });

export default bootstrap;
