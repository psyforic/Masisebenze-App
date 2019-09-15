import { Component, OnInit, ElementRef, Injector } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ROUTES } from '../sidebar/sidebar.component';
import { AppComponentBase } from '@shared/app-component-base';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { AppSessionService } from '@shared/session/app-session.service';
import { UserLoginInfoDto } from '@shared/service-proxies/service-proxies';

const misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
}
declare var $: any;
@Component({
  // moduleId: module.id,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  providers: [AppSessionService]
})

export class NavbarComponent extends AppComponentBase implements OnInit {
  user: UserLoginInfoDto = new UserLoginInfoDto();
  location: Location;
  private listTitles: any[];

  private toggleButton: any;
  private sidebarVisible: boolean;

  constructor(
    location: Location, private element: ElementRef,
    private injector: Injector,
    private _authService: AppAuthService,
    private appSessionService: AppSessionService) {
    super(injector);
    this.location = location;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    this.getUserName();
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    if ($('body').hasClass('sidebar-mini')) {
      misc.sidebar_mini_active = true;
    }
    $('#minimizeSidebar').click(function () {
      const $btn = $(this);

      if (misc.sidebar_mini_active === true) {
        $('body').removeClass('sidebar-mini');
        misc.sidebar_mini_active = false;

      } else {
        setTimeout(function () {
          $('body').addClass('sidebar-mini');

          misc.sidebar_mini_active = true;
        }, 300);
      }

      // we simulate the window Resize so the charts will get updated in realtime.
      const simulateWindowResize = setInterval(function () {
        window.dispatchEvent(new Event('resize'));
      }, 180);

      // we stop the simulation of Window Resize after the animations are completed
      setTimeout(function () {
        clearInterval(simulateWindowResize);
      }, 1000);
    });
  }
  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName('body')[0];
    setTimeout(function () {
      toggleButton.classList.add('toggled');
    }, 500);
    body.classList.add('nav-open');

    this.sidebarVisible = true;
  }

  sidebarClose() {
    const body = document.getElementsByTagName('body')[0];
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    body.classList.remove('nav-open');
  }

  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }

  getTitle() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    for (let item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }

  logout(): void {
    this._authService.logout();
  }

  getUserName() {
    this.user = this.appSessionService.user;
    console.log('User', this.appSessionService.user);
  }
}
