import { useQuery } from '@tanstack/react-query';

type UseWpApiOptions<T> = {
  restRoute?: string;
  queryKey?: string | string[];
  enabled?: boolean;
  select?: (data: any) => T;
};

declare const wpstormCleanAdminJsObject: {
  rootapiurl: string;
  nonce: string;
};

export function useWpApiQuery<T = unknown>({
  restRoute,
  enabled = true,
  select,
}: UseWpApiOptions<T>) {
  const url = `${wpstormCleanAdminJsObject.rootapiurl}wpstorm-clean-admin/v1/${restRoute}`;

  const headers = {
    'Content-Type': 'application/json',
    'X-WP-Nonce': wpstormCleanAdminJsObject.nonce,
  };

  return useQuery({
    queryKey: [restRoute + '_query'],
    queryFn: async () => {
      const res = await fetch(url, { headers });
      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }
      return res.json();
    },
    enabled,
    select,
  });
}
