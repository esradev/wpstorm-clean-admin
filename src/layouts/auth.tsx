import { useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import { AdvancedForm } from "@/components/advanced-form/advanced-form";
import { FieldConfig } from "@/components/advanced-form/types";
import { useFetch } from "@/hooks/use-fetch";
import { Route } from "@/types";

type AuthValues = {
  username: string;
  password: string;
  from?: object;
  admin_numbers?: [];
};

const Auth = ({ route }: { route: Route }) => {
  const [fromOptions, setFromOptions] = useState([]);
  const fields: FieldConfig<AuthValues>[] = [
    {
      type: "text",
      name: "username",
      label: __("Username", "wpstorm-clean-admin"),
      placeholder: __("Enter SMS gateway Username", "wpstorm-clean-admin"),
      required: true,
      width: "half",
    },
    {
      type: "password",
      name: "password",
      label: __("Password or apikey", "wpstorm-clean-admin"),
      placeholder: __(
        "Enter SMS gateway password or apikey",
        "wpstorm-clean-admin"
      ),
      required: true,
      width: "half",
    },
    {
      type: "select",
      name: "from",
      label: __("Sender Number", "wpstorm-clean-admin"),
      placeholder: __("Select Sender Number", "wpstorm-clean-admin"),
      options: fromOptions,
    },
    {
      type: "phone",
      name: "admin_numbers",
      label: __("Admin Numbers", "wpstorm-clean-admin"),
      placeholder: __("Enter Admin Number", "wpstorm-clean-admin"),
    },
  ];

  const defaultValues: AuthValues = {
    username: "",
    password: "",
    from: {},
    admin_numbers: [],
  };

  const [initialValues, setInitialValues] = useState<AuthValues>(defaultValues);
  const LOCAL_STORAGE_KEY = "wpstorm_clean_admin_auth_data";
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

export default Auth;
