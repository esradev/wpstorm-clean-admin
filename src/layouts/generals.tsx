import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { AdvancedForm } from '@/components/advanced-form/advanced-form';
import { FieldConfig } from '@/components/advanced-form/types';
import { useFetch } from '@/hooks/use-fetch';
import { Route } from '@/types';
import { useWpApiQuery } from '@/hooks/use-wp-api-query';

type GeneralsValues = {
  inactivity_days: number;
  action: {
    value: 'deactivate' | 'delete';
    label: string;
  };
  exclude_roles: string[];
  schedule: {
    value: 'daily' | 'twicedaily' | 'weekly';
    label: string;
  };
};

const Generals = ({ route }: { route: Route }) => {
  const { data, isPending } = useWpApiQuery({
    restRoute: route.restRoute,
  });

  const { data: rolesData, isFetching: rolesLoading } = useFetch('roles');

  const fields: FieldConfig<GeneralsValues>[] = [
    {
      type: 'number',
      name: 'inactivity_days',
      label: __('Inactivity Days', 'storm-clean-admin'),
      placeholder: __('Enter inactivity days, e.g. 30', 'storm-clean-admin'),
      required: true,
      width: 'half',
    },
    {
      type: 'select',
      name: 'action',
      label: __('Action', 'storm-clean-admin'),
      options: [
        { value: 'deactivate', label: __('Deactivate', 'storm-clean-admin') },
        { value: 'delete', label: __('Delete', 'storm-clean-admin') },
      ],
      required: false,
      width: 'half',
    },
    {
      type: 'select',
      name: 'exclude_roles',
      label: __('Exclude Roles', 'storm-clean-admin'),
      description: __(
        'Select roles to exclude from the action. Administrator role is always excluded.',
        'storm-clean-admin',
      ),
      isMulti: true,
      options: rolesData || [],
      width: 'half',
    },
    {
      type: 'select',
      name: 'schedule',
      label: __('Schedule', 'storm-clean-admin'),
      description: __(
        'Select how often the scan and action should be performed.',
        'storm-clean-admin',
      ),
      options: [
        { value: 'daily', label: __('Daily', 'storm-clean-admin') },
        {
          value: 'twicedaily',
          label: __('Twice Daily', 'storm-clean-admin'),
        },
        { value: 'weekly', label: __('Weekly', 'storm-clean-admin') },
      ],
      required: true,
      width: 'half',
    },
  ];

  const defaultValues: GeneralsValues = {
    inactivity_days: 30,
    action: {
      value: 'deactivate',
      label: __('Deactivate', 'storm-clean-admin'),
    },
    exclude_roles: [],
    schedule: {
      value: 'daily',
      label: __('Daily', 'storm-clean-admin'),
    },
  };

  const [initialValues, setInitialValues] =
    useState<GeneralsValues>(defaultValues);

  useEffect(() => {
    if (data) {
      setInitialValues({
        ...defaultValues,
        ...data,
      });
    }
  }, [data]);

  return (
    <AdvancedForm
      fields={fields}
      defaultValues={initialValues}
      isFetching={isPending || rolesLoading}
      route={route}
    />
  );
};

export default Generals;
