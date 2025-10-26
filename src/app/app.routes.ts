import { Routes } from '@angular/router';
import {LayoutComponent} from './features/main/layout-component/layout-component';
import {LoginPage} from './features/auth/pages/login-page/login-page';
import {DashboardPage} from './features/dashboard/dashboard-page';
import {DashboardMainPage} from './features/dashboard/pages/dashboard-main-page/dashboard-main-page';
import {WorkoutsPage} from './features/dashboard/pages/workouts-page/workouts-page';
import {ExercisesPage} from './features/dashboard/pages/exercises-page/exercises-page';

export const routes: Routes = [
  {path: '', component: LayoutComponent},
  {path: 'dashboard', component: DashboardPage,
  children:[
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    { path: 'main', component: DashboardMainPage },
    { path: 'workouts', component: WorkoutsPage },
    { path: 'exercises', component: ExercisesPage },
   /* { path: 'exercises', component: ExercisesPage },
    { path: 'statistics', component: StatisticsPage },
    { path: 'profile', component: ProfilePage }*/
  ]
  },
  { path: '**', redirectTo: 'dashboard' },
  {path: 'login', component: LoginPage},
];
