import { Location } from '@angular/common';
import { Component, ElementRef, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { ProfileDto, ProfileServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { ROUTES } from '../sidebar/sidebar.component';

const misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
};
declare var $: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  providers: [AppSessionService, ProfileServiceProxy]
})

export class NavbarComponent extends AppComponentBase implements OnInit {
  user: ProfileDto = new ProfileDto();
  location: Location;
  mobile_menu_visible: any = 0;
  private listTitles: any[];
  private toggleButton: any;
  private sidebarVisible: boolean;

  constructor(
    location: Location, private element: ElementRef,
    private injector: Injector,
    private _authService: AppAuthService,
    private appSessionService: AppSessionService,
    private profileService: ProfileServiceProxy,
    private router: Router) {
    super(injector);
    this.location = location;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    this.getUserName();
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
      const $layer: any = document.getElementsByClassName('close-layer')[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });
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
    const $toggle = document.getElementsByClassName('navbar-toggler')[0];

    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const body = document.getElementsByTagName('body')[0];
    const $layer = document.createElement('div');
    $layer.setAttribute('class', 'close-layer');
    if (this.mobile_menu_visible === 1) {
      // $('html').removeClass('nav-open');
      body.classList.remove('nav-open');

      if ($layer) {
        $layer.remove();
      }
      setTimeout(function () {
        $toggle.classList.remove('toggled');
      }, 400);

      this.mobile_menu_visible = 0;
    } else {
      setTimeout(function () {
        $toggle.classList.add('toggled');
      }, 430);
      if (body.querySelectorAll('.main-panel')) {
        document.getElementsByClassName('main-panel')[0].appendChild($layer);
      } else if (body.classList.contains('off-canvas-sidebar')) {
        document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
      }

      setTimeout(function () {
        $layer.classList.add('visible');
      }, 100);

      $layer.onclick = function () { // asign a function
        body.classList.remove('nav-open');
        this.mobile_menu_visible = 0;
        $layer.classList.remove('visible');
        setTimeout(function () {
          $layer.remove();
          $toggle.classList.remove('toggled');
        }, 400);
      }.bind(this);

      body.classList.add('nav-open');
      this.mobile_menu_visible = 1;
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
    this.profileService.getUserProfile().subscribe((result) => {
      this.user = result;
    });
  }
}
