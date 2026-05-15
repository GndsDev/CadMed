import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastComponent } from './components/toast/toast';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AppComponent } from './app';
import { routes } from './app.routes';
import { BreadcrumbComponent } from './components/breadcrumb';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(routes),
    NgxMaskDirective,
    NgxMaskPipe,
    BreadcrumbComponent,
    ToastComponent
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideNgxMask({ dropSpecialCharacters: false }),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
