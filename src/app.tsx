import { __ } from '@wordpress/i18n';
import { Route, Routes } from 'react-router-dom';
import { DirectionProvider } from '@radix-ui/react-direction';

import NotFound from '@/layouts/not-found';
import Layout from '@/layout';
import { items } from '@/lib/utils';

import { useCurrentMenu } from './hooks/use-helpers';

const App = () => {
  useCurrentMenu();

  return (
    <DirectionProvider dir="rtl">
      <Layout
        children={
          <div className="p-2">
            <Routes>
              {items.map((route, index) => (
                <Route
                  key={index}
                  path={route.url}
                  element={<route.component route={route} />}
                />
              ))}
              <Route key="not_found" path="*" element={<NotFound />} />
            </Routes>
          </div>
        }
      />
    </DirectionProvider>
  );
};

export default App;
