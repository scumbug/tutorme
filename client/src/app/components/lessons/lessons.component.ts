import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CalendarOptions,
  DateSelectArg,
  FullCalendarComponent,
  EventAddArg,
} from '@fullcalendar/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'src/app/http.service';
import { Title, User } from 'src/app/model.interface';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css'],
})
export class LessonsComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  @ViewChild('content') content;

  closeResult = '';
  lessonForm: FormGroup;
  start = { hour: 12, minute: 0 };
  end = { hour: 12, minute: 0 };
  titles: Title[];
  tutees: User[];

  constructor(
    private modal: NgbModal,
    private fb: FormBuilder,
    private backend: HttpService
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
      left: 'prev,next today',
      center: 'title',
      right: '',
    },

    // load additional tooltip
    // eventDidMount: function (info) {
    //   var tooltip = new Tooltip(info.el, {
    //     title: info.event.extendedProps.description,
    //     placement: 'top',
    //     trigger: 'hover',
    //     container: 'body',
    //   });
    // },

    editable: true,
    selectable: true,
    eventClick: this.handleEventClick.bind(this),
    select: this.handleDateSelect.bind(this),
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
        console.log(this.lessonForm.value);
        cal.addEvent({
          title: 'test',
          start: selectedDate.startStr,
          end: selectedDate.endStr,
        });
      }
    });
  }

  handleEventClick(args) {
    alert('event selected');
  }
}
