import cn from "clsx";
import * as React from "react";
import {
  Form,
  Icons,
  Input,
  ParagraphWithHTML,
  Popover,
  Tooltip,
} from "@instill-ai/design-system";
import { Nullable } from "../../../type";
import { useInstillStore } from "../../../use-instill-store";

import { useFormContext } from "react-hook-form";
import { SmartHintInfoCard } from "./SmartHintInfoCard";
import { useFilteredHints } from "./useFilteredHints";
import { onInputChange } from "./onInputChange";
import { onInputKeydown } from "./onInputKeydown";
import { SmartHintList } from "./SmartHintList";
import { AutoFormFieldBaseProps, SmartHintWarning } from "../../type";
import { useValidateReferenceAndTemplate } from "./useValidateReferenceAndTemplate";

export const TextField = ({
  fieldKey,
  form,
  path,
  title,
  description,
  shortDescription,
  disabled,
  instillAcceptFormats,
  isRequired,
  instillUpstreamTypes,
  componentID,
  size,
  isHidden,
}: {
  fieldKey: Nullable<string>;
  instillAcceptFormats: string[];
  shortDescription?: string;
  disabled?: boolean;
  isRequired?: boolean;
  instillUpstreamTypes: string[];
  componentID?: string;
} & AutoFormFieldBaseProps) => {
  const smartHints = useInstillStore((s) => s.smartHints);
  const [smartHintsPopoverIsOpen, setSmartHintsPopoverIsOpen] =
    React.useState(false);
  const [enableSmartHints, setEnableSmartHints] = React.useState(false);
  const [smartHintEnabledPos, setSmartHintEnabledPos] =
    React.useState<Nullable<number>>(null);
  const [currentCursorPos, setCurrentCursorPos] =
    React.useState<Nullable<number>>(null);
  const inputRef = React.useRef<Nullable<HTMLInputElement>>(null);
  const smartHintsScrollAreaViewportRef =
    React.useRef<Nullable<HTMLDivElement>>(null);
  const [highlightedHintIndex, setHighlightedHintIndex] =
    React.useState<number>(0);
  const [smartHintWarning, setSmartHintWarning] =
    React.useState<Nullable<SmartHintWarning>>(null);

  const { getFieldState, formState } = useFormContext();
  const { error } = getFieldState(path, formState);
  const fieldValue = form.getValues(path) as string;

  useValidateReferenceAndTemplate({
    hints: smartHints,
    fieldValue,
    setSmartHintWarning,
  });

  function initSmartHintState() {
    setEnableSmartHints(false);
    setHighlightedHintIndex(0);
    setSmartHintEnabledPos(null);
    setCurrentCursorPos(null);
  }

  const filteredHints = useFilteredHints({
    smartHints,
    instillAcceptFormats,
    currentCursorPos,
    smartHintEnabledPos,
    fieldValue,
    componentID,
  });

  const supportTemplate = instillUpstreamTypes.includes("template");
  const supportReference = instillUpstreamTypes.includes("reference");

  return isHidden ? null : (
    <Form.Field
      key={path}
      control={form.control}
      name={path}
      render={({ field }) => {
        return (
          <Form.Item className="w-full">
            {title || shortDescription ? (
              <div className="flex flex-row gap-x-2">
                <Form.Label
                  className={
                    size === "sm" ? "!product-body-text-4-semibold" : ""
                  }
                >
                  {isRequired ? `${title} *` : title}
                </Form.Label>

                {shortDescription ? (
                  <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <Icons.HelpCircle className="my-auto h-[14px] w-[14px] cursor-pointer stroke-semantic-fg-secondary" />
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className="w-[360px]"
                          sideOffset={5}
                          side="top"
                        >
                          <div className="!rounded-sm !bg-semantic-bg-primary !px-3 !py-2">
                            <ParagraphWithHTML
                              text={description}
                              className="break-all text-semantic-fg-primary product-body-text-4-semibold"
                            />
                          </div>
                          <Tooltip.Arrow
                            className="fill-white"
                            offset={5}
                            width={9}
                            height={6}
                          />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                ) : null}
              </div>
            ) : null}
            <Popover.Root
              open={smartHintsPopoverIsOpen}
              onOpenChange={(open) => {
                initSmartHintState();
                setSmartHintsPopoverIsOpen(open);
              }}
            >
              <Popover.Trigger
                onClick={(e) => {
                  e.preventDefault();
                }}
                asChild
              >
                <Form.Control>
                  <Input.Root>
                    <Input.Core
                      {...field}
                      aria-label={title ?? undefined}
                      ref={inputRef}
                      type="text"
                      value={
                        typeof field.value === "object" ? "" : field.value ?? ""
                      }
                      className={cn(
                        "nodrag",
                        size === "sm" ? "!product-body-text-4-regular" : ""
                      )}
                      autoComplete="off"
                      onChange={(e) => {
                        onInputChange({
                          event: e,
                          field,
                          form,
                          path,
                          setEnableSmartHints,
                          setCurrentCursorPos,
                          setSmartHintEnabledPos,
                          setSmartHintsPopoverIsOpen,
                        });
                      }}
                      onFocus={() => {
                        setSmartHintsPopoverIsOpen(true);
                      }}
                      onClick={() => {
                        initSmartHintState();
                      }}
                      disabled={disabled}
                      onKeyDown={(e) => {
                        onInputKeydown({
                          event: e,
                          form,
                          field,
                          path,
                          setEnableSmartHints,
                          enableSmartHints,
                          initSmartHintState,
                          filteredHints,
                          highlightedHintIndex,
                          setHighlightedHintIndex,
                          inputRef,
                          smartHintsScrollAreaViewportRef,
                          smartHintEnabledPos,
                        });
                      }}
                    />
                  </Input.Root>
                </Form.Control>
              </Popover.Trigger>
              <Popover.Content
                // Popover will auto-focus the content, we need to disable it
                onOpenAutoFocus={(e) => {
                  e.preventDefault();
                }}
                className={cn(
                  "relative !w-[var(--radix-popover-trigger-width)] !rounded !p-0"
                )}
                align="end"
              >
                {supportReference || supportTemplate ? (
                  <React.Fragment>
                    <SmartHintInfoCard
                      fieldKey={fieldKey}
                      instillAcceptFormats={instillAcceptFormats}
                      className="absolute left-0 top-0 w-[var(--radix-popover-trigger-width)] -translate-x-[calc(var(--radix-popover-trigger-width)+10px)] rounded border border-semantic-bg-line bg-semantic-bg-primary shadow-md"
                      error={error}
                      supportReference={supportReference}
                      supportTemplate={supportTemplate}
                      smartHintWarning={smartHintWarning}
                    />
                    <SmartHintList
                      field={field}
                      form={form}
                      smartHintsScrollAreaViewportRef={
                        smartHintsScrollAreaViewportRef
                      }
                      enableSmartHints={enableSmartHints}
                      setEnableSmartHints={setEnableSmartHints}
                      filteredHints={filteredHints}
                      path={path}
                      highlightedHintIndex={highlightedHintIndex}
                      setHighlightedHintIndex={setHighlightedHintIndex}
                      inputRef={inputRef}
                      smartHintEnabledPos={smartHintEnabledPos}
                      instillUpstreamTypes={instillUpstreamTypes}
                    />
                  </React.Fragment>
                ) : (
                  <SmartHintInfoCard
                    fieldKey={fieldKey}
                    instillAcceptFormats={instillAcceptFormats}
                    error={error}
                    supportReference={supportReference}
                    supportTemplate={supportTemplate}
                    smartHintWarning={smartHintWarning}
                  />
                )}
              </Popover.Content>
            </Popover.Root>
            <Form.Description
              className={size === "sm" ? "!product-body-text-4-regular" : ""}
              text={shortDescription ?? null}
            />
            <Form.Message
              className={size === "sm" ? "!product-body-text-4-medium" : ""}
            />
          </Form.Item>
        );
      }}
    />
  );
};
