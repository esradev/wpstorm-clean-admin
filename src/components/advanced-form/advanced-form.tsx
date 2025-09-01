import { useEffect, useState } from "@wordpress/element";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldValues, type DefaultValues } from "react-hook-form";
import { __ } from "@wordpress/i18n";

import { Form } from "@/components/ui/form";

import { FieldRenderer } from "./field-renderer";
import type { FormConfig } from "./types";
import { buildZodSchema } from "./schema-builder";
import { usePostData } from "@/hooks/use-post-data";
import { toast } from "sonner";
import LoadingSkeleton from "../loading-skeleton";
import AccessDenied from "../access-denied";
import { FormHeader } from "../form-header";
import FormSubmitButton from "../form-submit-button";

export function AdvancedForm<TFormValues extends FieldValues>({
  fields,
  defaultValues,
  schema: customSchema,
  successMessage = __("Settings saved", "wpstorm-clean-admin"),
  successDescription = __(
    "Your settings have been updated",
    "wpstorm-clean-admin"
  ),
  submitButtonText = __("Save Settings", "wpstorm-clean-admin"),
  resetButtonText = __("Reset", "wpstorm-clean-admin"),
  hideResetButton = false,
  className = "space-y-8",
  renderButtons,
  isFetching = false,
  route = { title: "", url: "" },
  children = null,
  hasAccess = true,
  onSubmit: customOnSubmit,
  localStorageKey,
}: FormConfig<TFormValues> & {
  onSubmit?: (values: TFormValues) => void;
  localStorageKey?: string;
}) {
  const [saveBtnState, setSaveBtnState] = useState<
    "initial" | "loading" | "success" | "error"
  >("initial");

  // If no custom schema is provided, build one from the field configurations
  const schema = customSchema || buildZodSchema(fields);

  const form = useForm<TFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<TFormValues>,
  });

  // Watch form values to handle conditional fields
  const formValues = form.watch();

  // Reset form when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues as DefaultValues<TFormValues>);
    }
  }, [defaultValues]);

  const { postData } = usePostData(route.restRoute || "", {
    onSuccess: (res, { toastId }) => {
      setSaveBtnState("success");
      toast.success(successMessage, {
        description: successDescription,
        id: toastId,
      });
    },
    onError: (err, { toastId }) => {
      setSaveBtnState("error");
      toast.error(__("Error saving options", "wpstorm-clean-admin"), {
        description: __(
          "There was an error saving your options.",
          "wpstorm-clean-admin"
        ),
        id: toastId,
      });
    },
    onFinally: () => {
      setSaveBtnState("initial");
    },
  });
  const defaultOnSubmit = (values: TFormValues) => {
    setSaveBtnState("loading");
    const toastId = toast.loading(__("Loading...", "wpstorm-clean-admin"), {
      description: __("Sending data to the server.", "wpstorm-clean-admin"),
      id: undefined, // ensure toastId is generated
    });
    postData({ ...values, toastId });
  };
  const handleSubmit = customOnSubmit ? customOnSubmit : defaultOnSubmit;

  return (
    <>
      <div className="flex h-full flex-1 flex-col relative justify-between">
        {isFetching ? (
          <LoadingSkeleton inputs={Object.values(fields)} />
        ) : !hasAccess ? (
          <AccessDenied link="/integration" />
        ) : (
          <div className="space-y-10 p-2 mb-4">
            {route?.title && <FormHeader route={route} />}
            {children && children}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className={className}
              >
                <div className="grid grid-cols-12 gap-6">
                  {fields.map((field, index) => (
                    <FieldRenderer
                      key={`${String(field.name)}-${index}`}
                      field={field}
                      form={form}
                    />
                  ))}
                </div>

                {renderButtons ? (
                  renderButtons(form.getValues(), () => form.reset())
                ) : (
                  <div className="flex items-center justify-end fixed bottom-5 left-8 z-10">
                    <FormSubmitButton
                      state={saveBtnState}
                      onReset={() => form.reset()}
                      submitButtonText={submitButtonText}
                      resetButtonText={resetButtonText}
                    />
                  </div>
                )}
              </form>
            </Form>
          </div>
        )}
      </div>
    </>
  );
}
