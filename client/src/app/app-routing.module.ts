import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DiscoverComponent } from './components/discover/discover.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { GameShelfComponent } from './components/gameshelf/gameshelf.component';
import { GameComponent } from './components/game/game.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'discover', component: DiscoverComponent, canActivate: [AuthGuard] },
  {
    path: 'gameshelf',
    component: GameShelfComponent,
    canActivate: [AuthGuard],
  },
  { path: 'games/:gid', component: GameComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
