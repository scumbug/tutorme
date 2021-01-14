import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-questions-form',
  templateUrl: './questions-form.component.html',
  styleUrls: ['./questions-form.component.css'],
})
export class QuestionsFormComponent implements OnInit {
  @ViewChild('upload') upload: ElementRef;
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  uploadImg(name) {
    const data = new FormData();
    data.set('upload', this.upload.nativeElement.files[0]);
    data.set('form', JSON.stringify({ name }));
    this.activeModal.close(data);
  }
}
