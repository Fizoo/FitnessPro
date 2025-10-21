import { Routes } from '@angular/router';
import {LayoutComponent} from './features/main/layout-component/layout-component';
import {LoginPage} from './features/auth/pages/login-page/login-page';

export const routes: Routes = [
  {path: '', component: LayoutComponent},
  {path: 'login', component: LoginPage},
];
