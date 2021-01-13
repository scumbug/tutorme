import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminService } from './admin.service';
import { AuthService } from './auth.service';
import { LandingComponent } from './components/landing/landing.component';
import { LessonsComponent } from './components/lessons/lessons.component';
import { LoginComponent } from './components/login/login.component';
import { StudentsComponent } from './components/students/students.component';
import { SubjectsComponent } from './components/subjects/subjects.component';
import { UserFormComponent } from './forms/user-form/user-form.component';

const routes: Routes = [
  { path: '', component: LandingComponent, canActivate: [AuthService] },
  { path: 'login', component: LoginComponent },
  {
    path: 'profile',
    component: UserFormComponent,
    canActivate: [AuthService],
  },
  {
    path: 'subjects',
    component: SubjectsComponent,
    canActivate: [AuthService, AdminService],
  },
  {
    path: 'lessons',
    component: LessonsComponent,
    canActivate: [AuthService, AdminService],
  },
  {
    path: 'students',
    component: StudentsComponent,
    canActivate: [AuthService],
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
