import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { UsersModule } from './users/users.module';
import { LoginModule } from './login/login.module';
import { FormsModule } from '@angular/forms';
import { FetchService } from './fetch.service';
import { ChatModule } from './chat/chat.module';
import { WebsocketService } from './websocket.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    UsersModule,
    LoginModule,
    ChatModule,
	FormsModule,
  ],
  providers: [
	FetchService,
	WebsocketService,
  ],
  bootstrap: [
	AppComponent,
]
})
export class AppModule { }
