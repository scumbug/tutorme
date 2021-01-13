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
    modalRef.result.then((result) => {
      if (result.name && !result.id) {
        this.backend.addUser(result).then((res) => {
          if (res.status == 200) {
            // update table
            this.backend.getTutees().then((res) => (this.users = res));
          } else {
            alert(res);
          }
        });
      } else if (result.name && result.id) {
        this.backend.updateUser(result.id, result).then((res) => {
          if (res.status == 200) {
            // update table
            this.backend.getTutees().then((res) => (this.users = res));
          } else {
            console.log(res);
          }
        });
      } else {
        alert('close box');
      }
    });
  }

  delete(id) {
    this.backend.deleteUser(id).then((res) => {
      if (res.status != 200) {
        console.log(res);
      } else {
        // update table
        this.backend.getTutees().then((res) => (this.users = res));
      }
    });
  }
}
