import { useId, useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps
  extends Omit<ComponentProps<typeof Input>, "id" | "aria-invalid"> {
  id?: string;
  label: string;
  error?: string;
  hint?: string;
  showPasswordToggle?: boolean;
  containerClassName?: string;
}

export function FormField({
  id,
  label,
  error,
  hint,
  type = "text",
  showPasswordToggle = false,
  className,
  containerClassName,
  ...inputProps
}: FormFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordType = type === "password";
  const resolvedType =
    isPasswordType && showPasswordToggle && isPasswordVisible ? "text" : type;

  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy =
    [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("grid gap-1.5", containerClassName)}>
      <Label htmlFor={inputId}>{label}</Label>
      <div className="relative">
        <Input
          id={inputId}
          type={resolvedType}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            isPasswordType && showPasswordToggle && "pr-10",
            className
          )}
          {...inputProps}
        />
        {isPasswordType && showPasswordToggle && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={isPasswordVisible ? "Ukryj hasło" : "Pokaż hasło"}
            tabIndex={-1}
          >
            {isPasswordVisible ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </Button>
        )}
      </div>
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-sm font-medium text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
