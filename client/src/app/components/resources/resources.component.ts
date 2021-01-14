import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuestionsFormComponent } from 'src/app/forms/questions-form/questions-form.component';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css'],
})
export class ResourcesComponent implements OnInit {
  questions;
  constructor(private modal: NgbModal, private backend: HttpService) {}

  ngOnInit(): void {
    this.backend.getQuestions().then((res) => (this.questions = res));
  }

  open() {
    const modalRef = this.modal.open(QuestionsFormComponent);
    modalRef.result
      .then((result) => {
        this.backend
          .addQuestions(result)
          .then((res) => {
            // update table
            if (res.status == 200)
              this.backend.getQuestions().then((res) => (this.questions = res));
          })
          .catch((e) => alert(e.error.message));
      })
      .catch((e) => null);
  }
}
