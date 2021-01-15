import { BrowserModule } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { LessonsComponent } from './components/lessons/lessons.component';
import { AuthService } from './auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';

import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

import { HttpService } from './http.service';
import { SubjectsComponent } from './components/subjects/subjects.component';

import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { plusSquare, trash2, pencilSquare } from 'ngx-bootstrap-icons';
import { SubjectFormComponent } from './forms/subject-form/subject-form.component';
import {
  TippyModule,
  tooltipVariation,
  popperVariation,
} from '@ngneat/helipopper';
import { AdminService } from './admin.service';
import { UserFormComponent } from './forms/user-form/user-form.component';
import { StudentsComponent } from './components/students/students.component';
import { LessonsStudentComponent } from './components/lessons-student/lessons-student.component';
import {
  LAZY_MAPS_API_CONFIG,
  LazyMapsAPILoaderConfigLiteral,
  AgmCoreModule,
} from '@agm/core';
import { ResourcesComponent } from './components/resources/resources.component';
import { QuestionsFormComponent } from './forms/questions-form/questions-form.component';

FullCalendarModule.registerPlugins([
  // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  listPlugin,
]);

@Injectable()
export class GoogleMapsConfig implements LazyMapsAPILoaderConfigLiteral {
  public apiKey: string;
  public libraries = ['places'];
  constructor(private http: HttpService) {
    this.http.getMapsKey().then((res) => {
      this.apiKey = res.mapskey;
      this.http.setApiKeyLoaded();
    });
  }
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingComponent,
    LessonsComponent,
    SubjectsComponent,
    SubjectFormComponent,
    UserFormComponent,
    StudentsComponent,
    LessonsStudentComponent,
    ResourcesComponent,
    QuestionsFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    NgxBootstrapIconsModule.pick({ plusSquare, trash2, pencilSquare }),
    TippyModule.forRoot({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
      },
    }),
    AgmCoreModule.forRoot({}),
  ],
  providers: [
    AuthService,
    HttpService,
    AdminService,
    { provide: LAZY_MAPS_API_CONFIG, useClass: GoogleMapsConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
