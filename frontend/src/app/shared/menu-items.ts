import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  icon: string;
  role: string;
}
const MENUITEMS = [
  {
    state: 'IndexProduct',
    name: 'Index',
    icon: 'inventory',
    role: '',
  },

  {
    state: 'dashboard',
    name: 'Dashboard',
    icon: 'dashboard',
    role: '',
  },
  {
    state: 'category',
    name: 'Manage Category',
    icon: 'category',
    role: 'admin',
  },
  {
    state: 'product',
    name: 'Manage Product',
    icon: 'inventory_2',
    role: 'admin',
  },
];
@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
