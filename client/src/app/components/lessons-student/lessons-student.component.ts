import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/angular';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-lessons-student',
  templateUrl: './lessons-student.component.html',
  styleUrls: ['./lessons-student.component.css'],
})
export class LessonsStudentComponent implements OnInit {
  constructor(private backend: HttpService, private actRoute: ActivatedRoute) {}

  ngOnInit(): void {}

  calendarOptions: CalendarOptions = {
    initialView: 'listWeek',
    themeSystem: 'bootstrap',
    events: (info, successCallback, failureCallback) => {
      return this.backend.getLessonFeed(
        info.start.toISOString(),
        info.end.toISOString(),
        this.actRoute.snapshot.params['id']
      );
    },
    headerToolbar: {
      left: 'today',
      center: 'title',
      right: 'prev next',
    },
    editable: false,
    selectable: false,
    //eventDidMount: this.handlePopover.bind(this),
    /* you can update a remote database when these fire:
    eventAdd: 
    eventChange:
    eventRemove:
    */
  };
}
