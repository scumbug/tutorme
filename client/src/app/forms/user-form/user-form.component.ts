import { MapsAPILoader } from '@agm/core';
import {
  Component,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  @Input() values;
  @ViewChild('search')
  public searchElementRef: ElementRef;

  admin: boolean;
  userForm: FormGroup;
  username: FormControl;
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  mapsLoaded: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.longitude = this.values.longitude || null;
    this.latitude = this.values.latitude || null;

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
      address: this.values.address,
      role: this.values.role || 1, //always 1, admin added via SQL
      id: this.values.id || null,
      password: this.fb.control(''),
      username: this.username,
      unit: this.fb.control(this.values.unit || '', [Validators.required]),
      longitude: '',
      latitude: '',
    });

    if (!this.values.id) {
      this.username = this.fb.control('', [
        Validators.required,
        Validators.pattern('.*\\S.*[a-zA-z0-9_-]'),
      ]);
    }

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.address = place.formatted_address;
          this.zoom = 12;

          //set form
          this.userForm.get('latitude').setValue(this.latitude);
          this.userForm.get('longitude').setValue(this.longitude);
          this.userForm.get('address').setValue(this.address);
        });
      });
    });
  }
}
