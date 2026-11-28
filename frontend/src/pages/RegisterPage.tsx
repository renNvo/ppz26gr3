import { useState, type FormEvent } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormField } from "@/components/common/FormField";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import {
  validateRegisterForm,
  type RegisterFieldErrors,
  type RegisterFormValues,
} from "@/lib/validation";

const INITIAL_VALUES: RegisterFormValues = {
  username: "",
  password: "",
  confirmPassword: "",
};

function mapRegisterApiError(error: ApiError): {
  fieldErrors: RegisterFieldErrors;
  formError: string | null;
} {
  if (error.isNetworkError || error.status >= 500) {
    return {
      fieldErrors: {},
      formError:
        "Nie udało się połączyć z serwerem. Sprawdź, czy backend działa na porcie 8080.",
    };
  }

  const fieldErrors: RegisterFieldErrors = {};
  if (error.fieldErrors) {
    if (error.fieldErrors.username) {
      fieldErrors.username = error.fieldErrors.username;
    }
    if (error.fieldErrors.password) {
      fieldErrors.password = error.fieldErrors.password;
    }
  }

  const normalizedMessage = error.message.toLowerCase();
  if (
    !fieldErrors.username &&
    /(użytkownik|uzytkownik|nazw|username)/.test(normalizedMessage)
  ) {
    fieldErrors.username = error.message;
  } else if (
    !fieldErrors.password &&
    /(hasł|hasl|password)/.test(normalizedMessage)
  ) {
    fieldErrors.password = error.message;
  }

  const hasFieldErrors = Object.keys(fieldErrors).length > 0;
  return {
    fieldErrors,
    formError: hasFieldErrors ? null : error.message,
  };
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState<RegisterFormValues>(INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof RegisterFormValues>(
    field: K,
    value: RegisterFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (formError) {
      setFormError(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const validationErrors = validateRegisterForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await register({
        username: values.username,
        password: values.password,
      });
      toast.success("Konto zostało utworzone! Witamy w Memora.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        const mapped = mapRegisterApiError(error);
        setFieldErrors(mapped.fieldErrors);
        setFormError(mapped.formError);
      } else {
        setFormError("Wystąpił nieoczekiwany błąd podczas rejestracji.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Utwórz konto"
      description="Zarejestruj się w Memora, aby tworzyć własne zestawy fiszek."
    >
      <form onSubmit={handleSubmit} noValidate className="grid gap-4">
        {formError && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <FormField
          id="register-username"
          name="username"
          label="Nazwa użytkownika"
          placeholder="np. jan_kowalski"
          autoComplete="username"
          value={values.username}
          onChange={(e) => updateField("username", e.target.value)}
          error={fieldErrors.username}
          disabled={isSubmitting}
          required
        />

        <FormField
          id="register-password"
          name="password"
          type="password"
          label="Hasło"
          placeholder="Minimum 8 znaków"
          hint="Hasło powinno zawierać co najmniej 8 znaków."
          autoComplete="new-password"
          showPasswordToggle
          value={values.password}
          onChange={(e) => updateField("password", e.target.value)}
          error={fieldErrors.password}
          disabled={isSubmitting}
          required
        />

        <FormField
          id="register-confirm-password"
          name="confirmPassword"
          type="password"
          label="Potwierdzenie hasła"
          placeholder="Powtórz hasło"
          autoComplete="new-password"
          showPasswordToggle
          value={values.confirmPassword}
          onChange={(e) => updateField("confirmPassword", e.target.value)}
          error={fieldErrors.confirmPassword}
          disabled={isSubmitting}
          required
        />

        <Button type="submit" className="mt-1 w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSubmitting ? "Tworzenie konta..." : "Zarejestruj się"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Masz już konto?{" "}
          <Link
            to="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Zaloguj się
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
