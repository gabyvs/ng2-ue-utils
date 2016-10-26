import { platformBrowserDynamic }    from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import './main.less';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
