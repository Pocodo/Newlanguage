import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: any = FormGroup;
  responeMessage: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    public dialogRef: MatDialogRef<LoginComponent>,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)],
      ],
      password: [null, Validators.required],
    });
  }
  handleSubmit() {
    this.ngxService.start();
    var formData = this.loginForm.value;
    var data = {
      email: formData.email,
      password: formData.password,
    };
    this.userService.login(data).subscribe(
      (respone: any) => {
        this.ngxService.stop();
        this.dialogRef.close();
        localStorage.setItem('token', respone.token);
        this.router.navigate(['/cafe/IndexProduct']);
      },
      (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responeMessage = error.error?.message;
        } else {
          this.responeMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(
          this.responeMessage,
          GlobalConstants.error
        );
      }
    );
  }
}
