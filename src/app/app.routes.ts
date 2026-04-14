import {Routes} from '@angular/router';
import {LayoutComponent} from './features/main/layout-component/layout-component';
import {LoginPage} from './features/auth/pages/login-page/login-page';
import {DashboardPage} from './features/dashboard/dashboard-page';
import {DashboardMainPage} from './features/dashboard/pages/dashboard-main-page/dashboard-main-page';
import {WorkoutsPage} from './features/dashboard/pages/workouts-page/workouts-page';
import {ExercisesPage} from './features/exercises/pages/exercises-page/exercises-page';
import {MuscleGroupsList} from './features/exercises/pages/muscle-groups-list/muscle-groups-list';
import {ExerciseListPage} from './features/exercises/pages/exercise-list-page/exercise-list-page';
import {ExerciseDetailPage} from './features/exercises/pages/exercise-detail-page/exercise-detail-page';
import {DataDowload} from './core/services/data-dowload/data-dowload';
import {ExerciseCardWork} from './features/exercises/pages/exercise-card-work/exercise-card-work';
import {WorkoutResultComponent} from './features/workouts/components/workout-result-component/workout-result-component';
import {
  WorkoutProgramComponent
} from './features/workouts/pages/workout-program-component/workout-program-component';
import {AnalyticsComponent} from './features/AnalyticsPage/analytics-component/analytics-component';
import {DashboardWidget} from './features/AnalyticsPage/dashboard-widget/dashboard-widget';
import {WorkoutDayDetailComponent} from './features/workouts/pages/workout-day-detail-component/workout-day-detail-component';
import {
  ExerciseWorkDetailComponent
} from './features/exercises/pages/exercise-work-detail-component/exercise-work-detail-component';
import {authGuard} from './core/guards/auth-guard-guard';
import {guestGuard} from './core/guards/guest-guard-guard';
import {ProfilePageComponent} from './features/settings/profile-page-component/profile-page-component';

export const routes: Routes = [
  // 🏠 Layout (без children!)
  { path: '', component: LayoutComponent },

  // 📊 Dashboard
  {
    path: 'dashboard',
    component: DashboardPage,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', component: DashboardMainPage },
      { path: 'workouts', component: WorkoutsPage }
    ]
  },

  // 🏋️ Workouts
  { path: 'workout-day/:dayId', component: WorkoutDayDetailComponent },
  { path: 'workout-day/:dayId/:exerciseId', component: ExerciseWorkDetailComponent },

  // 💪 Exercises
  {
    path: 'exercises',
    component: ExercisesPage,
    children: [
      { path: '', component: MuscleGroupsList },
      { path: ':muscleGroup', component: ExerciseListPage },
      { path: ':muscleGroup/:exerciseId', component: ExerciseDetailPage }
    ]
  },

  // 📈 Analytics / Results
  { path: 'result/:date', component: WorkoutResultComponent },
  { path: 'analytics', component: AnalyticsComponent },

  // 📦 Інше
  { path: 'program', component: WorkoutProgramComponent },
  { path: 'dashboards', component: DashboardWidget },
  { path: 'exerciseWork', component: ExerciseCardWork },
  { path: 'download-data', component: DataDowload },

  { path: 'profile', component: ProfilePageComponent ,canActivate: [authGuard],},
  // 🔑 Auth
  { path: 'login', component: LoginPage ,canActivate: [guestGuard]},

  // 🚫 fallback
  { path: '**', redirectTo: 'dashboard' }
];

/*export const routes: Routes = [
  {path: '', component: LayoutComponent},
  {
    path: 'dashboard', component: DashboardPage,
    children: [
      {path: '', redirectTo: 'main', pathMatch: 'full'},
      {path: 'main', component: DashboardMainPage},
      {path: 'workouts', component: WorkoutsPage},

      /!* { path: 'exercises', component: ExercisesPage },
       { path: 'statistics', component: StatisticsPage },
       { path: 'profile', component: ProfilePage }*!/
    ]
  },
  { path: 'workout-day/:dayId', component: WorkoutDayDetailComponent },
  { path: 'workout-day/:dayId/:exerciseId', component: ExerciseWorkDetailComponent },
  {
    path: 'exercises', component: ExercisesPage,
    children: [
      {path: '', component: MuscleGroupsList},
      {path: ':muscleGroup', component: ExerciseListPage},
      {path: ':muscleGroup/:exerciseId', component: ExerciseDetailPage}
    ]
  },
  {
    path: 'result/:date', component: WorkoutResultComponent
  },
  {
    path: ':exerciseId/:id', component: ExerciseDetailPage
  },
  {
    path: 'analytics', component: AnalyticsComponent
  },
  {
    path: 'dashboards', component: DashboardWidget
  },
  {
    path: 'exerciseWork', component: ExerciseCardWork
  },
  {
    path: 'program', component: WorkoutProgramComponent
  },

  /!*{path: '**', redirectTo: 'dashboard'},*!/
  {path: 'login', component: LoginPage},
  {
    path: 'download-data', component: DataDowload
  }
];*/
