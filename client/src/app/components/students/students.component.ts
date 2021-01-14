import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserFormComponent } from 'src/app/forms/user-form/user-form.component';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit {
  users;
  constructor(private backend: HttpService, private modal: NgbModal) {}

  ngOnInit(): void {
    this.backend.getTutees().then((res) => (this.users = res));
  }

  open(i = null) {
    const modalRef = this.modal.open(UserFormComponent);
    modalRef.componentInstance.values = i == null ? '' : this.users[i];
    modalRef.result
      .then((result) => {
        if (result.name && !result.id) {
          this.backend
            .addUser(result)
            .then((res) => {
              // update table
              if (res.status == 200)
                this.backend.getTutees().then((res) => (this.users = res));
            })
            .catch((e) => alert(e.error.message));
        } else if (result.name && result.id) {
          this.backend
            .updateUser(result.id, result)
            .then((res) => {
              // update table
              if (res.status == 200)
                this.backend.getTutees().then((res) => (this.users = res));
            })
            .catch((e) => alert(e.error.message));
        }
      })
      .catch((e) => null);
  }

  delete(id) {
    this.backend
      .deleteUser(id)
      .then((res) => {
        // update table
        if (res.status == 200)
          this.backend.getTutees().then((res) => (this.users = res));
      })
      .catch((e) => alert(e.error.message));
  }
}
