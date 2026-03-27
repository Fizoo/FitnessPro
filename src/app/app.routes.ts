import {Routes} from '@angular/router';
import {LayoutComponent} from './features/main/layout-component/layout-component';
import {LoginPage} from './features/auth/pages/login-page/login-page';
import {DashboardPage} from './features/dashboard/dashboard-page';
import {DashboardMainPage} from './features/dashboard/pages/dashboard-main-page/dashboard-main-page';
import {WorkoutsPage} from './features/dashboard/pages/workouts-page/workouts-page';
import {ExercisesPage} from './features/dashboard/pages/exercises-page/exercises-page';
import {MuscleGroupsList} from './features/dashboard/pages/exercises-page/muscle-groups-list/muscle-groups-list';
import {ExerciseListPage} from './features/dashboard/pages/exercises-page/exercise-list-page/exercise-list-page';
import {ExerciseDetailPage} from './shared/components/exercise-detail-page/exercise-detail-page';
import {DataDowload} from './core/services/data-dowload/data-dowload';
import {ExerciseCardWork} from './shared/components/exercise-card-work/exercise-card-work';

export const routes: Routes = [
  {path: '', component: LayoutComponent},
  {
    path: 'dashboard', component: DashboardPage,
    children: [
      {path: '', redirectTo: 'main', pathMatch: 'full'},
      {path: 'main', component: DashboardMainPage},
      {path: 'workouts', component: WorkoutsPage},

      /* { path: 'exercises', component: ExercisesPage },
       { path: 'statistics', component: StatisticsPage },
       { path: 'profile', component: ProfilePage }*/
    ]
  },
  {
    path: 'exercises', component: ExercisesPage,
    children: [
      {
        path: '', component: MuscleGroupsList
      },
      {
        path: ':muscleGroup', component: ExerciseListPage
      },
      {
        path: ':muscleGroup/:exerciseId',
        component: ExerciseDetailPage
      }
    ]

  },
  {
    path: ':exerciseId/:id',
    component: ExerciseDetailPage
  }, {
    path: 'exerciseWork',
    component: ExerciseCardWork
  },
  /*{path: '**', redirectTo: 'dashboard'},*/
  {path: 'login', component: LoginPage},
  {
    path: 'download-data',
    component: DataDowload
  }
];
