import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { ProfilComponent } from './components/profil/profil.component';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { FormUserComponent } from './components/form-user/form-user.component';
import { ListClientComponent } from './components/list-client/list-client.component';
import { FormClientComponent } from './components/form-client/form-client.component';
import { ClientDetailsComponent } from './components/client-details/client-details.component';
import { AuthGuard } from './guards/auth.guard';
import { FormProjectComponent } from './components/form-project/form-project.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { LoggedInGuard } from './guards/logged-in.guard';
import { PostComponent } from './components/post/post.component';
import { ProjectComponent } from './components/project/project.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedInGuard],
    data: { redirectAuthenticated: true },
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [LoggedInGuard],
    data: { redirectAuthenticated: true },
  },
  { path: 'clients', component: ListClientComponent, canActivate: [AuthGuard] },
  {
    path: 'clients/create',
    component: FormClientComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'clients/edit',
    component: FormClientComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'client/details',
    component: ClientDetailsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'home', component: PostComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfilComponent, canActivate: [AuthGuard] },
  { path: 'users', component: ListUsersComponent, canActivate: [AuthGuard] },
  {
    path: 'users/create',
    component: FormUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'users/edit',
    component: FormUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'users/details',
    component: UserDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'client/details/Add',
    component: FormProjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'client/details/edit',
    component: FormProjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'project/details',
    component: ProjectDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'project/edit',
    component: FormProjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/edit',
    component: FormUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'projects',
    component: ProjectComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
