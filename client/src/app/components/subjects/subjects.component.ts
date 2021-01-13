import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpService } from 'src/app/http.service';
import { Subject } from 'src/app/model.interface';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css'],
})
export class SubjectsComponent implements OnInit {
  subjects: Subject[];

  constructor(private backend: HttpService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.backend.getSubjects().then((res) => (this.subjects = res));
  }
}
