import { Component, OnInit, AfterViewInit } from '@angular/core';

declare const $: any;
export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icon: string;
  // icon: string;
  children?: ChildrenItems[];
}
export interface ChildrenItems {
  path: string;
  title: string;
  ab: string;
  type?: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/admin/dashboard', title: 'Dashboard', icon: 'th-large', type: 'link' },
  { path: '/admin/lawfirms', title: 'Law Firms', icon: 'university', type: 'link' },
  {
    path: '/admin/attorneys', title: 'Attorneys', icon: 'gavel', type: 'sub',
    children: [
      { path: 'list', title: 'Attorney List', ab: 'A' },
      { path: 'clients', title: 'Clients', ab: 'C' }
    ]
  },
  { path: '/admin/job-descriptions', title: 'Job Descriptions', icon: 'th-list', type: 'link' },
  { path: '/admin/reports', title: 'Reports', icon: 'bar-chart', type: 'link' },
  { path: '/admin/activity-log', title: 'Activity Log', icon: 'history', type: 'link' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit, AfterViewInit {

  menuItems: any[];

  constructor() { }
  isNotMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
  ngOnInit() {
    let isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

    if (isWindows) {
      // if we are on windows OS we activate the perfectScrollbar function
      $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();
      $('html').addClass('perfect-scrollbar-on');
    } else {
      $('html').addClass('perfect-scrollbar-off');
    }
  }
  ngAfterViewInit(): void {
    const $sidebarParent = $('.sidebar .nav > li.active .collapse li.active > a').parent().parent().parent();
    const collapseId = $sidebarParent.siblings('a').attr('href');

    $(collapseId).collapse('show');
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
