import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ContactUsService } from './contact-us.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  contactForm: any;

  constructor(private _formBuilder: FormBuilder, private contactService: ContactUsService) { }

  ngOnInit() {
    this.contactForm = this._formBuilder.group({
      name: ["", Validators.required],
      email: ["", Validators.required],
      message: ["", Validators.required]
    });
  }

  get f() { return this.contactForm.controls; }

  onSubmit() {
    if (this.contactForm.invalid) {
      return;
    }

    if (this.contactForm.valid) {
      this.contactService.create(this.contactForm.value).subscribe(() => {
        console.log('wooo');
        this.contactForm.reset();
      });
    }
  }

}
