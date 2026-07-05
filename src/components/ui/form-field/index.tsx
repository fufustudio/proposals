import type { ComponentProps, ReactNode } from "react";
import { useId } from "react";
import { cn } from "@/lib/cn";
import styles from "./styles.module.css";

type InputFieldProps = {
  label: string;
  labelVisibility?: "hidden" | "visible";
  description?: ReactNode;
  error?: ReactNode;
  multiline?: false;
  className?: string;
  fieldClassName?: string;
} & Omit<ComponentProps<"input">, "aria-label" | "className">;

type TextareaFieldProps = {
  label: string;
  labelVisibility?: "hidden" | "visible";
  description?: ReactNode;
  error?: ReactNode;
  multiline: true;
  className?: string;
  fieldClassName?: string;
} & Omit<ComponentProps<"textarea">, "aria-label" | "className">;

type FormFieldProps = InputFieldProps | TextareaFieldProps;

export function FormField(props: FormFieldProps) {
  const {
    label,
    labelVisibility = "hidden",
    description,
    error,
    className,
    fieldClassName,
    multiline,
    ...fieldProps
  } = props;
  const generatedId = useId();
  const id =
    typeof fieldProps.id === "string" && fieldProps.id
      ? fieldProps.id
      : `field-${generatedId}`;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [fieldProps["aria-describedby"], descriptionId, errorId]
    .filter(Boolean)
    .join(" ");
  const labelClassName =
    labelVisibility === "visible" ? styles.visibleLabel : styles.label;
  const sharedFieldProps = {
    ...fieldProps,
    id,
    "aria-describedby": describedBy || undefined,
    "aria-invalid": error ? true : fieldProps["aria-invalid"],
    className: cn(className, fieldClassName),
  };

  const fieldMeta = (
    <>
      {description ? (
        <p id={descriptionId} className={styles.description}>
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </>
  );

  if (multiline) {
    return (
      <>
        <label htmlFor={id} className={labelClassName}>
          {label}
        </label>
        <textarea
          {...(sharedFieldProps as Omit<
            ComponentProps<"textarea">,
            "aria-label" | "className"
          >)}
        />
        {fieldMeta}
      </>
    );
  }

  return (
    <>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <input
        {...(sharedFieldProps as Omit<
          ComponentProps<"input">,
          "aria-label" | "className"
        >)}
      />
      {fieldMeta}
    </>
  );
}
