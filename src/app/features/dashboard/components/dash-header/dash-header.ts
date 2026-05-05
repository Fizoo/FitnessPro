import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {UserAvatarComponent} from '../../../../shared/components/user-avatar-component/user-avatar-component';

@Component({
  selector: 'app-dash-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    UserAvatarComponent
  ],
  templateUrl: './dash-header.html',
  styleUrl: './dash-header.scss'
})
export class DashHeader {



  protected edit() {

  }
}
