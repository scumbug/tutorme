import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubjectFormComponent } from 'src/app/forms/subject-form/subject-form.component';
import { HttpService } from 'src/app/http.service';
import { Subject } from 'src/app/model.interface';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css'],
})
export class SubjectsComponent implements OnInit {
  subjects: Subject[];

  constructor(private backend: HttpService, private modal: NgbModal) {}

  ngOnInit(): void {
    this.backend.getSubjects().then((res) => (this.subjects = res));
  }

  open(i = null) {
    const modalRef = this.modal.open(SubjectFormComponent);
    modalRef.componentInstance.values = this.subjects[i] || '';
    modalRef.result.then((result) => {
      if (result.name && !result.id) {
        this.backend.addSubjects(result).then((res) => {
          if (res.status == 200) {
            // update table
            this.backend.getSubjects().then((res) => (this.subjects = res));
          } else {
            alert(res);
          }
        });
      } else if (result.name && result.id) {
        this.backend.updateSubject(result.id, result).then((res) => {
          if (res.status == 200) {
            // update table
            this.backend.getSubjects().then((res) => (this.subjects = res));
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
    this.backend.deleteSubject(id).then((res) => {
      if (res.status != 200) {
        console.log(res);
      } else {
        // update table
        this.backend.getSubjects().then((res) => (this.subjects = res));
      }
    });
  }
}
