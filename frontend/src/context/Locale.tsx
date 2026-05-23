import * as i18n from "@solid-primitives/i18n";
import {
  type Accessor,
  type Setter,
  createContext,
  createEffect,
  createResource,
  createSignal,
  useContext,
  type ParentProps,
} from "solid-js";

export type Locale = "en" | "ru";

const DEFAULT_LOCALE: Locale = "en";
const SUPPORTED_LOCALE: Locale[] = ["en", "ru"];

type LocaleContextValue = {
  locale: Accessor<Locale>;
  setLocale: Setter<Locale>;
  t: (path: string) => string;
};

async function fetchDictionary(locale: Locale) {
  const dict = await import(`../i18n/${locale}.json`);

  return i18n.flatten(dict.default);
}

function isSupportedLocale(value: string | null): value is Locale {
  return SUPPORTED_LOCALE.includes(value as Locale);
}

function getInitialLocale(): Locale {
  if (typeof localStorage === "undefined") {
    return DEFAULT_LOCALE;
  }

  const storedLocale = localStorage.getItem("locale");

  return isSupportedLocale(storedLocale) ? storedLocale : DEFAULT_LOCALE;
}

export const LocaleContext = createContext<LocaleContextValue>();

export function LocaleProvider(props: ParentProps) {
  const initialLocale = getInitialLocale();

  const [locale, setLocale] = createSignal<Locale>(initialLocale);

  const [dict] = createResource(locale, fetchDictionary);

  dict();

  const translate = i18n.translator(dict);

  const t: LocaleContextValue["t"] = (path) =>
    (translate(path as never) as string | undefined) ?? path;

  createEffect(() => {
    localStorage.setItem("locale", locale());
  });

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        t,
      }}
    >
      {props.children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const value = useContext(LocaleContext);

  if (!value) {
    throw new Error("Missing LocaleContext");
  }

  return value;
}
