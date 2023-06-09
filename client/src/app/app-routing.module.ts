import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DiscoverComponent } from './components/discover/discover.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { GameShelfComponent } from './components/gameshelf/gameshelf.component';
import { GameComponent } from './components/game/game.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { AdminGuard } from './guards/admin.guard';
import { GameLogComponent } from './components/gamelog/gamelog.component';
import { HistoryComponent } from './components/history/history.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'discover', component: DiscoverComponent, canActivate: [AuthGuard] },
  {
    path: 'profile/:uid',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'manage',
    component: ManageUsersComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'gameshelf',
    component: GameShelfComponent,
    canActivate: [AuthGuard],
  },
  { path: 'games/:gid', component: GameComponent, canActivate: [AuthGuard] },
  {
    path: 'gamelogs/:glid',
    component: GameLogComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
