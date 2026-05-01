import * as i18n from "@solid-primitives/i18n";
import {
  type Accessor,
  type Setter,
  createContext,
  createEffect,
  createResource,
  createSignal,
  onMount,
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

export const LocaleContext = createContext<LocaleContextValue>();

export function LocaleProvider(props: ParentProps) {
  const [locale, setLocale] = createSignal<Locale>(DEFAULT_LOCALE);

  const [dict] = createResource(locale, fetchDictionary);

  dict();

  const translate = i18n.translator(dict);

  const t: LocaleContextValue["t"] = (path) =>
    (translate(path as never) as string | undefined) ?? path;

  onMount(() => {
    const storedLocale = localStorage.getItem("locale");

    if (!storedLocale) {
      return;
    }

    if (storedLocale) {
      const isSupported = SUPPORTED_LOCALE.includes(storedLocale as Locale);

      if (isSupported) {
        setLocale(storedLocale as Locale);
      }
    }
  });

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
