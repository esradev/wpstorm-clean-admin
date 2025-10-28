import { useEffect } from '@wordpress/element';
import { useLocation } from 'react-router-dom';

const useRemoveLoader = () => {
  useEffect(() => {
    // remove the loading screen
    const loadingScreen = document.getElementById(
      'storm-clean-admin-dashboard-loading-container',
    );
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
  }, []);
};

const updateActiveMenuItem = () => {
  const hash = window.location.hash.replace('#/', '').trim();
  const menuItems = document.querySelectorAll('.wp-submenu li');

  menuItems.forEach((li) => {
    const link = li.querySelector('a');
    const href = link?.getAttribute('href') || '';
    const isCurrent = href.endsWith(hash) && hash !== '';
    li.classList.toggle('current', isCurrent);
    link?.classList.toggle('current', isCurrent);
  });

  if (!hash) {
    const defaultItem = document.querySelector(
      '.wp-submenu li a[href="admin.php?page=storm_clean_admin_settings"]',
    );
    defaultItem?.parentElement?.classList.add('current');
    defaultItem?.classList.add('current');
  }
};

const useCurrentMenu = () => {
  const location = useLocation();

  useEffect(() => {
    updateActiveMenuItem();
  }, [location]);
};

export { useRemoveLoader, useCurrentMenu };
