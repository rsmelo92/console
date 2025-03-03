import { Form, Icons, Input } from "@instill-ai/design-system";
import * as React from "react";
import { AutoFormFieldBaseProps } from "../../..";
import { FieldHead } from "./FieldHead";
import { StartOperatorFreeFormFieldBaseProps } from "../../type";

export const NumbersField = ({
  mode,
  form,
  path,
  title,
  description,
  onEditField,
  onDeleteField,
  isHidden,
  disabled,
  keyPrefix,
  disabledFieldControl,
  disabledReferenceHint,
  instillFormat,
}: StartOperatorFreeFormFieldBaseProps & AutoFormFieldBaseProps) => {
  const [numberFieldsArray, setNumberFieldsArray] = React.useState<number[]>([
    1,
  ]);

  const [numberFieldsValue, setNumberFieldsValue] = React.useState<
    (string | undefined)[]
  >([""]);

  return isHidden ? null : (
    <Form.Field
      key={keyPrefix ? `${keyPrefix}-${path}` : path}
      control={form.control}
      name={path}
      render={({ field }) => {
        const {
          formState: { errors },
        } = form;

        let targetError: string | undefined;

        const fieldError = errors[field.name];

        if (fieldError) {
          if (Array.isArray(fieldError)) {
            targetError = String(
              fieldError.filter((e) => e !== undefined || e !== null)[0].message
            );
          } else {
            targetError = String(fieldError.message);
          }
        } else {
          targetError = undefined;
        }

        return (
          <div className="flex w-full flex-col gap-y-2">
            <FieldHead
              mode={mode}
              form={form}
              title={title}
              path={path}
              instillFormat={instillFormat}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              disabledFieldControl={disabledFieldControl}
              disabledReferenceHint={disabledReferenceHint}
            />
            <div className="mb-1.5 flex flex-col space-y-1">
              {numberFieldsArray.map((_, idx) => {
                return (
                  <div
                    key={`${path}-${idx}`}
                    className="flex w-full flex-row gap-x-2"
                  >
                    <Input.Root className="flex-1">
                      <Input.Core
                        type="number"
                        value={numberFieldsValue[idx] ?? undefined}
                        autoComplete="off"
                        className="nodrag appearance-none text-semantic-fg-primary product-body-text-4-regular"
                        onChange={(e) => {
                          const newNumberFieldsValue = [...numberFieldsValue];
                          newNumberFieldsValue[idx] = e.target.value;
                          setNumberFieldsValue(newNumberFieldsValue);

                          field.onChange(newNumberFieldsValue);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                          }
                        }}
                        disabled={disabled}
                      />
                    </Input.Root>
                    {numberFieldsArray.length > 1 ? (
                      <button
                        type="button"
                        className="my-auto flex h-6 w-6 flex-shrink-0 rounded border border-semantic-bg-line hover:border-semantic-fg-secondary"
                        onClick={() => {
                          const newNumberFieldsValue = [...numberFieldsValue];
                          newNumberFieldsValue.splice(idx, 1);
                          setNumberFieldsValue(newNumberFieldsValue);

                          const newTextFieldArray = [...numberFieldsArray];
                          newTextFieldArray.splice(idx, 1);
                          setNumberFieldsArray(newTextFieldArray);

                          field.onChange(newNumberFieldsValue);
                        }}
                      >
                        <Icons.X className="m-auto h-4 w-4 stroke-semantic-fg-secondary" />
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
            {targetError ? (
              <p className="mb-3 text-semantic-error-default !product-body-text-4-regular">
                {String(targetError)}
              </p>
            ) : null}
            <div className="flex">
              <button
                type="button"
                className="flex text-semantic-accent-default !underline product-button-button-3"
                onClick={() => {
                  const newNumberFieldsValue = [...numberFieldsValue];
                  newNumberFieldsValue.push(undefined);
                  setNumberFieldsValue(newNumberFieldsValue);

                  const newNumberFieldsArray = [...numberFieldsArray];
                  newNumberFieldsArray.push(1);
                  setNumberFieldsArray(newNumberFieldsArray);

                  field.onChange(newNumberFieldsValue);
                }}
              >
                Add field
              </button>
            </div>
            <Form.Description className="!text-xs" text={description} />
          </div>
        );
      }}
    />
  );
};
