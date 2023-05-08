import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    ProfileComponent,
  ],
  exports: [
	ProfileComponent,
  ],
  imports: [
    CommonModule,
	NgbModule,
  ],
  providers: [],
  bootstrap: [ProfileComponent],
})
export class ProfileModule { }
