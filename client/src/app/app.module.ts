import { NgModule } from '@angular/core';
import { Location } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DiscoverComponent } from './components/discover/discover.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GameShelfComponent } from './components/gameshelf/gameshelf.component';
import { GameComponent } from './components/game/game.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { GameLogComponent } from './components/gamelog/gamelog.component';
import { HistoryComponent } from './components/history/history.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DiscoverComponent,
    NavbarComponent,
    GameShelfComponent,
    GameComponent,
    ProfileComponent,
    RegisterComponent,
    ManageUsersComponent,
    GameLogComponent,
    HistoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
  ],
  providers: [Location],
  bootstrap: [AppComponent],
})
export class AppModule {}
