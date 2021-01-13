import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CalendarOptions,
  DateSelectArg,
  FullCalendarComponent,
} from '@fullcalendar/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'src/app/http.service';
import { Title, User } from 'src/app/model.interface';
import { TippyService, TippyInstance } from '@ngneat/helipopper';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css'],
})
export class LessonsComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  @ViewChild('content') content;

  popover: TippyInstance;
  closeResult = '';
  lessonForm: FormGroup;
  start = { hour: 12, minute: 0 };
  end = { hour: 12, minute: 0 };
  titles: Title[];
  tutees: User[];

  constructor(
    private modal: NgbModal,
    private fb: FormBuilder,
    private backend: HttpService,
    private tippy: TippyService
  ) {}

  ngOnInit(): void {
    // Init select options
    this.backend.getTitles().then((res) => (this.titles = res));
    this.backend.getTutees().then((res) => (this.tutees = res));

    // Init Form
    this.lessonForm = this.fb.group({
      title: this.fb.control('', [Validators.required]),
      tutee: this.fb.control('', [Validators.required]),
      startTime: this.fb.control(this.start, [Validators.required]),
      endTime: this.fb.control(this.end, [Validators.required]),
      date: '',
    });
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    themeSystem: 'bootstrap',
    events: (info, successCallback, failureCallback) => {
      return this.backend.getLessonFeed(
        info.start.toISOString(),
        info.end.toISOString()
      );
    },
    headerToolbar: {
      left: 'today',
      center: 'title',
      right: 'prev next',
    },
    editable: true,
    selectable: true,
    eventClick: this.handleEventClick.bind(this),
    select: this.handleDateSelect.bind(this),
    eventDidMount: this.handlePopover.bind(this),
    /* you can update a remote database when these fire:
    eventAdd: 
    eventChange:
    eventRemove:
    */
  };

  handleDateSelect(selectedDate: DateSelectArg) {
    const cal = selectedDate.view.calendar;
    cal.unselect();
    //set date
    this.lessonForm.get('date').setValue(selectedDate.startStr);
    //open modal
    this.modal.open(this.content).result.then((result) => {
      if (result == 'submit') {
        // Post to backend. If status 200 then addEvent, otherwise prompt error
        this.backend.addLesson(this.lessonForm.value).then((res) => {
          if (res.status == 200) {
            // refresh calendar
            cal.refetchEvents();
          } else {
            alert(res.body.message);
          }
        });
      }
    });
  }

  handleEventClick(args) {
    // send event details to form
    this.lessonForm.setValue({
      tutee: args.event.extendedProps.uid,
      title: args.event.extendedProps.sid,
      startTime: {
        hour: args.event.start.getHours(),
        minute: args.event.start.getMinutes(),
      },
      endTime: {
        hour: args.event.end.getHours(),
        minute: args.event.end.getMinutes(),
      },
      date: args.event.start,
    });
    // open modal
    this.modal.open(this.content).result.then((result) => {
      if (result == 'submit') {
        this.backend
          .updateLesson(args.event.extendedProps.lid, this.lessonForm.value)
          .then((res) => {
            if (res.status == 200) {
              // refresh calendar
              args.view.calendar.refetchEvents();
            } else {
              alert(res.body.message);
            }
          });
      } else if (result == 'delete') {
        // delete event
        this.backend.deleteLesson(args.event.extendedProps.lid).then((res) => {
          if (res.status == 200) {
            //refresh calendar
            args.view.calendar.refetchEvents();
          } else {
            alert(res.body.message);
          }
        });
      }
    });
  }

  handlePopover(args) {
    this.popover = this.tippy.create(args.el, args.event.title);
  }
}
