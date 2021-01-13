import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.css'],
})
export class SubjectFormComponent implements OnInit {
  @Input() values;
  subjectForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.subjectForm = this.fb.group({
      name: this.fb.control(this.values.name || '', [Validators.required]),
      level: this.fb.control(this.values.level || '', [Validators.required]),
      fees: this.fb.control(parseInt(this.values.fees) || 0, [
        Validators.required,
      ]),
      id: parseInt(this.values.id) || null,
    });
  }
}
