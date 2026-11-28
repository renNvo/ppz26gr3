export interface RegisterFormValues {
  username: string;
  password: string;
  confirmPassword: string;
}

export type RegisterFieldErrors = Partial<
  Record<keyof RegisterFormValues, string>
>;

export interface LoginFormValues {
  username: string;
  password: string;
}

export type LoginFieldErrors = Partial<Record<keyof LoginFormValues, string>>;

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

  if (!values.username.trim()) {
    errors.username = "Podaj nazwę użytkownika.";
  }

  if (!values.password) {
    errors.password = "Podaj hasło.";
  }

  return errors;
}
