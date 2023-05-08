import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePopupComponent } from './profile-popup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    ProfilePopupComponent
  ],
  exports: [
	ProfilePopupComponent,
  ],
  imports: [
    CommonModule,
	NgbModule,
  ],
  providers: [],
  bootstrap: [ProfilePopupComponent],
})
export class ProfilePopupModule { }
