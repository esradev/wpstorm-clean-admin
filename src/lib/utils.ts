import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { __ } from '@wordpress/i18n';
import { Fingerprint, UserCog } from 'lucide-react';

import Dashboard from '@/layouts/dashboard/dashboard';
import Generals from '@/layouts/generals';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const items = [
  {
    title: __('Dashboard', 'storm-clean-admin'),
    url: '/',
    restRoute: 'dashboard_options',
    isVisiable: true,
    component: Dashboard,
    icon: Fingerprint,
    // infoDetails: __("Clean Admin dashboard", "storm-clean-admin"),
    // infoLink: {
    //   url: "https://wpstorm.ir/",
    //   title: __("Learn more", "storm-clean-admin"),
    // },
  },
  {
    title: __('Generals', 'storm-clean-admin'),
    url: '/generals',
    restRoute: 'generals_options',
    isVisiable: true,
    component: Generals,
    icon: UserCog,
    // infoDetails: __("General settings for the plugin", "storm-clean-admin"),
    // infoLink: {
    //   url: "https://wpstorm.ir/",
    //   title: __("Learn more", "storm-clean-admin"),
    // },
  },
];
