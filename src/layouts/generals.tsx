import { useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import { AdvancedForm } from "@/components/advanced-form/advanced-form";
import { FieldConfig } from "@/components/advanced-form/types";
import { useFetch } from "@/hooks/use-fetch";
import { Route } from "@/types";

type GeneralsValues = {
  inactivity_days: number;
  action: {
    value: "deactivate" | "delete";
    label: string;
  };
  exclude_roles: string[];
  schedule: {
    value: "daily" | "twicedaily" | "weekly";
    label: string;
  };
};

const Generals = ({ route }: { route: Route }) => {
  const fields: FieldConfig<GeneralsValues>[] = [
    {
      type: "number",
      name: "inactivity_days",
      label: __("Inactivity Days", "wpstorm-clean-admin"),
      placeholder: __("Enter inactivity days, e.g. 30", "wpstorm-clean-admin"),
      required: true,
      width: "half",
    },
    {
      type: "select",
      name: "action",
      label: __("Action", "wpstorm-clean-admin"),
      options: [
        { value: "deactivate", label: __("Deactivate", "wpstorm-clean-admin") },
        { value: "delete", label: __("Delete", "wpstorm-clean-admin") },
      ],
      required: false,
      width: "half",
    },
    {
      type: "select",
      name: "exclude_roles",
      label: __("Exclude Roles", "wpstorm-clean-admin"),
      description: __(
        "Select roles to exclude from the action.",
        "wpstorm-clean-admin"
      ),
      isMulti: true,
      options: [],
      width: "half",
    },
    {
      type: "select",
      name: "schedule",
      label: __("Schedule", "wpstorm-clean-admin"),
      description: __(
        "Select how often the scan and action should be performed.",
        "wpstorm-clean-admin"
      ),
      options: [
        { value: "daily", label: __("Daily", "wpstorm-clean-admin") },
        {
          value: "twicedaily",
          label: __("Twice Daily", "wpstorm-clean-admin"),
        },
        { value: "weekly", label: __("Weekly", "wpstorm-clean-admin") },
      ],
      required: true,
      width: "half",
    },
  ];

  const defaultValues: GeneralsValues = {
    inactivity_days: 30,
    action: {
      value: "deactivate",
      label: __("Deactivate", "wpstorm-clean-admin"),
    },
    exclude_roles: [],
    schedule: {
      value: "daily",
      label: __("Daily", "wpstorm-clean-admin"),
    },
  };

  const [initialValues, setInitialValues] =
    useState<GeneralsValues>(defaultValues);
  const LOCAL_STORAGE_KEY = "wpstorm_clean_admin_generals_data";
  const { data, isFetching } = useFetch(route.restRoute || "");

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
      isFetching={isFetching}
      route={route}
      localStorageKey={LOCAL_STORAGE_KEY}
    />
  );
};

export default Generals;
