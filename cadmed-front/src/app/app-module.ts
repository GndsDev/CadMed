import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // <-- NECESSÁRIO PARA ngClass, ngIf, ngFor
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastComponent } from './components/toast/toast';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AppComponent } from './app';
import { routes } from './app.routes';
import { BreadcrumbComponent } from './components/breadcrumb';
import { FinanceiroComponent } from './financeiro/financeiro';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';


@NgModule({
  declarations: [
    AppComponent,
    FinanceiroComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(routes),
    NgxMaskDirective,
    NgxMaskPipe,
    BreadcrumbComponent,
    ToastComponent
  ],
  providers: [provideNgxMask( { dropSpecialCharacters: false } ), { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
