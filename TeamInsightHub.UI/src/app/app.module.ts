import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfilComponent } from './components/profil/profil.component';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { FormUserComponent } from './components/form-user/form-user.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { ConfirmationPopupComponent } from './components/common/confirmation-popup/confirmation-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListClientComponent } from './components/list-client/list-client.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormClientComponent } from './components/form-client/form-client.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BreadcrumbComponent } from './components/common/breadcrumb/breadcrumb.component';
import { ToastrModule } from 'ngx-toastr';
import { ClientDetailsComponent } from './components/client-details/client-details.component';
import { FormProjectComponent } from './components/form-project/form-project.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { AuthGuard } from './guards/auth.guard';
import { ChangePasswordPopupComponent } from './components/common/change-password-popup/change-password-popup.component';
import { PostComponent } from './components/post/post.component';
import { ProjectComponent } from './components/project/project.component';
import { ChangeRolePopupComponent } from './components/common/change-role-popup/change-role-popup.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LoginComponent,
    SignupComponent,
    ProfilComponent,
    SidebarComponent,
    ListUsersComponent,
    FormUserComponent,
    BreadcrumbComponent,
    ConfirmationPopupComponent,
    ListClientComponent,
    FormClientComponent,
    SidebarComponent,
    ConfirmationPopupComponent,
    BreadcrumbComponent,
    ClientDetailsComponent,
    FormProjectComponent,
    ProjectDetailsComponent,
    NotFoundPageComponent,
    ChangePasswordPopupComponent,
    PostComponent,
    ProjectComponent,
    ChangeRolePopupComponent,
    UserDetailsComponent,

  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true
    })
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, DatePipe, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
