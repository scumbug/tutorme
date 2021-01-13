import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  @Input() values;
  admin: boolean;
  userForm: FormGroup;
  username: FormControl;
  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: this.fb.control(this.values.name || '', [Validators.required]),
      phone: this.fb.control(this.values.phone || '', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/),
      ]),
      email: this.fb.control(this.values.email || '', [
        Validators.required,
        Validators.email,
      ]),
      address: this.fb.control(this.values.address || '', [
        Validators.required,
      ]),
      role: this.values.role || 1, //always 1, admin added via SQL
      id: this.values.id || null,
      password: this.fb.control(''),
      username: this.username,
    });

    if (!this.values.id) {
      this.username = this.fb.control('', [
        Validators.required,
        Validators.pattern('.*\\S.*[a-zA-z0-9_-]'),
      ]);
    }
  }
}
