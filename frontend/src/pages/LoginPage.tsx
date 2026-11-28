import { useState, type FormEvent } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormField } from "@/components/common/FormField";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import {
  validateLoginForm,
  type LoginFieldErrors,
  type LoginFormValues,
} from "@/lib/validation";

interface LocationState {
  from?: {
    pathname?: string;
  };
}

const INITIAL_VALUES: LoginFormValues = {
  username: "",
  password: "",
};

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTarget =
    (location.state as LocationState | null)?.from?.pathname || "/dashboard";

  const [values, setValues] = useState<LoginFormValues>(INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof LoginFormValues>(
    field: K,
    value: LoginFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (authError) {
      setAuthError(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError(null);

    const validationErrors = validateLoginForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await login(values.username, values.password);
      toast.success("Zalogowano pomyślnie.");
      navigate(redirectTarget, { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.isNetworkError || error.status >= 500) {
          setAuthError(
            "Nie udało się połączyć z serwerem. Sprawdź, czy backend działa na porcie 8080."
          );
        } else {
          // Generic message per acceptance criteria: never reveal whether username or password is wrong
          setAuthError("Nieprawidłowa nazwa użytkownika lub hasło.");
        }
      } else {
        setAuthError("Wystąpił nieoczekiwany błąd podczas logowania.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Zaloguj się"
      description="Wpisz swoje dane logowania, aby przejść do swoich zestawów."
    >
      <form onSubmit={handleSubmit} noValidate className="grid gap-4">
        {authError && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        <FormField
          id="login-username"
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
          id="login-password"
          name="password"
          type="password"
          label="Hasło"
          placeholder="Wpisz hasło"
          autoComplete="current-password"
          showPasswordToggle
          value={values.password}
          onChange={(e) => updateField("password", e.target.value)}
          error={fieldErrors.password}
          disabled={isSubmitting}
          required
        />

        <Button type="submit" className="mt-1 w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSubmitting ? "Logowanie..." : "Zaloguj się"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Nie masz konta?{" "}
          <Link
            to="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Zarejestruj się
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
