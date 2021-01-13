import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from './auth.service';
import { LandingComponent } from './components/landing/landing.component';
import { LessonsComponent } from './components/lessons/lessons.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SubjectsComponent } from './components/subjects/subjects.component';

const routes: Routes = [
  { path: '', component: LandingComponent, canActivate: [AuthService] },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthService] },
  {
    path: 'subjects',
    component: SubjectsComponent,
    canActivate: [AuthService],
  },
  { path: 'lessons', component: LessonsComponent, canActivate: [AuthService] },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
