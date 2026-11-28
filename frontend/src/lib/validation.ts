export interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type RegisterFieldErrors = Partial<
  Record<keyof RegisterFormValues, string>
>;

export interface LoginFormValues {
  identifier: string;
  password: string;
}

export type LoginFieldErrors = Partial<Record<keyof LoginFormValues, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return "Adres e-mail jest wymagany.";
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return "Podaj poprawny adres e-mail.";
  }
  return null;
}

export function validateRegisterForm(
  values: RegisterFormValues
): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {};

  const username = values.username.trim();
  if (!username) {
    errors.username = "Nazwa użytkownika jest wymagana.";
  } else if (username.length < 3) {
    errors.username = "Nazwa użytkownika musi mieć co najmniej 3 znaki.";
  }

  const emailError = validateEmail(values.email);
  if (emailError) {
    errors.email = emailError;
  }

  if (!values.password) {
    errors.password = "Hasło jest wymagane.";
  } else if (values.password.length < 8) {
    errors.password = "Hasło musi mieć co najmniej 8 znaków.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Potwierdzenie hasła jest wymagane.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Hasła nie są identyczne.";
  }

  return errors;
}

export function validateLoginForm(values: LoginFormValues): LoginFieldErrors {
  const errors: LoginFieldErrors = {};

  if (!values.identifier.trim()) {
    errors.identifier = "Podaj adres e-mail lub nazwę użytkownika.";
  }

  if (!values.password) {
    errors.password = "Podaj hasło.";
  }

  return errors;
}
