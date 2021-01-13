import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth.service';
import { UserFormComponent } from 'src/app/forms/user-form/user-form.component';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  admin: boolean;
  user: any = { name: '' };

  constructor(
    private auth: AuthService,
    private backend: HttpService,
    private modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.admin = this.auth.isAdmin();
    this.backend.getUser(this.auth.getID()).then((res) => (this.user = res));
  }

  async updateProfile() {
    const modalRef = this.modal.open(UserFormComponent);
    modalRef.componentInstance.values = this.user;
    modalRef.result.then((result) => {
      console.log(result);
      this.backend.updateUser(result.id, result).then((res) => {
        if (res.status == 200) {
          this.backend
            .getUser(this.auth.getID())
            .then((res) => (this.user = res));

          alert('update successful');
        } else {
          console.log(res);
        }
      });
    });
  }
}
