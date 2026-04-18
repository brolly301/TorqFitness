export type Theme = {
  background: string;
  surface: string;
  card: string;
  border: string;
  divider: string;

  text: string;
  textSecondary: string;
  textMuted: string;

  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonSecondary: string;
  buttonSecondaryText: string;
  buttonDisabled: string;
  buttonDisabledText: string;

  success: string;
  error: string;
  warning: string;

  inputBg: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
  inputFocusBorder: string;

  press: string;
  overlay: string;
  shadow: string;

  cardSurface: string;
  rowSurface: string;
  headerSurface: string;
  rowDivider: string;
};

export type ThemeType = "Light" | "Dark" | "Nocturne" | "Dune" | "Neon";
