import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PurchListComponent } from './purchase/purch-list/purch-list.component';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
   { path: '',               component: PurchListComponent, pathMatch: 'full' ,data: {  option: JgMockTableOption }, resolve: { isLoad:AppResolverService  }   },
   { path: '**',             component: PurchListComponent }
 ];


@NgModule({
  declarations: [
    AppComponent,
    PurchListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
