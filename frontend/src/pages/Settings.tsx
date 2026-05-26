import { useColorMode, type ConfigColorMode } from "@kobalte/core";
import { createMemo, createResource, createSignal } from "solid-js";
import {
  billingControllerHandleGetCurrencies,
  type UpdateCurrentUserCurrencyRequestDtoPreferredCurrencyCode,
  userControllerHandleDeleteMe,
  userControllerHandleUpdateMeCurrency,
  userControllerHandleUpdateMeLocale,
} from "~/api/generated";
import { Button } from "~/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { Grid } from "~/components/ui/Grid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";
import { useLocale, type Locale } from "~/context/Locale";
import { TextField, TextFieldInput } from "~/components/ui/TextField";
import { useAuth } from "~/context/Auth";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/Dialog";

type ThemeOption = {
  label: string;
  key: ConfigColorMode;
};

type LanguageOption = {
  label: string;
  key: Locale;
};

type CurrencyOption = {
  label: string;
  code: UpdateCurrentUserCurrencyRequestDtoPreferredCurrencyCode;
};

function Settings() {
  const { locale, setLocale, t } = useLocale();

  const { user } = useAuth();

  const { setColorMode, colorMode } = useColorMode();

  const themeOptions = createMemo<ThemeOption[]>(() => [
    {
      label: t("settingsPage.theme.options.system"),
      key: "system",
    },
    {
      label: t("settingsPage.theme.options.light"),
      key: "light",
    },
    {
      label: t("settingsPage.theme.options.dark"),
      key: "dark",
    },
  ]);

  const selectedTheme = createMemo(
    () =>
      themeOptions().find((option) => option.key === colorMode()) ??
      themeOptions()[0],
  );

  const [draftThemeKey, setDraftThemeKey] = createSignal<ConfigColorMode>(
    selectedTheme().key,
  );

  const draftTheme = createMemo(
    () =>
      themeOptions().find((option) => option.key === draftThemeKey()) ??
      selectedTheme(),
  );

  const hasThemeChanges = createMemo(() => draftThemeKey() !== colorMode());

  const languageOptions = createMemo<LanguageOption[]>(() => [
    {
      label: t("settingsPage.language.options.en"),
      key: "en",
    },
    {
      label: t("settingsPage.language.options.ru"),
      key: "ru",
    },
  ]);

  const selectedLanguage = createMemo(
    () =>
      languageOptions().find((option) => option.key === locale()) ??
      languageOptions()[0],
  );

  const [draftLocale, setDraftLocale] = createSignal<Locale>(
    selectedLanguage().key,
  );

  const draftLanguage = createMemo(
    () =>
      languageOptions().find((option) => option.key === draftLocale()) ??
      selectedLanguage(),
  );
  const hasLanguageChanges = createMemo(() => draftLocale() !== locale());

  const [supportedCurrencies] = createResource(async () => {
    const response = await billingControllerHandleGetCurrencies();

    return response.data.currencies;
  });

  const currencyOptions = createMemo<CurrencyOption[]>(() => {
    const displayNames = new Intl.DisplayNames([locale()], {
      type: "currency",
    });

    const currencies = supportedCurrencies() ?? [
      user()!
        .preferredCurrencyCode as UpdateCurrentUserCurrencyRequestDtoPreferredCurrencyCode,
    ];

    return currencies.map((code) => ({
      code,
      label: `${displayNames.of(code) ?? code} (${code})`,
    }));
  });

  const [savedCurrency, setSavedCurrency] =
    createSignal<UpdateCurrentUserCurrencyRequestDtoPreferredCurrencyCode>(
      user()!
        .preferredCurrencyCode as UpdateCurrentUserCurrencyRequestDtoPreferredCurrencyCode,
    );

  const selectedCurrency = createMemo(
    () =>
      currencyOptions().find((option) => option.code === savedCurrency()) ??
      currencyOptions()[0],
  );

  const [draftCurrency, setDraftCurrency] =
    createSignal<UpdateCurrentUserCurrencyRequestDtoPreferredCurrencyCode>(
      selectedCurrency().code,
    );

  const draftCurrencyOption = createMemo(
    () =>
      currencyOptions().find((option) => option.code === draftCurrency()) ??
      selectedCurrency(),
  );

  const hasCurrencyChanges = createMemo(
    () => draftCurrency() !== savedCurrency(),
  );

  const [isDeletingAccount, setIsDeletingAccount] = createSignal(false);

  const handleSaveLanguage = () => {
    const locale = draftLocale();

    void userControllerHandleUpdateMeLocale({
      locale,
    });

    setLocale(locale);
  };

  const handleSaveCurrency = () => {
    const preferredCurrencyCode = draftCurrency();

    void userControllerHandleUpdateMeCurrency({
      preferredCurrencyCode,
    });

    setSavedCurrency(preferredCurrencyCode);
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);

    try {
      await userControllerHandleDeleteMe();

      window.location.href = "/login";
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div class="w-full flex-1 flex flex-col gap-8">
      <Grid class="w-full gap-4">
        <h1 class="text-3xl font-semibold">{t("settingsPage.title")}</h1>
      </Grid>
      <div class="flex-1">
        <Grid class="gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("settingsPage.email.title")}</CardTitle>
              <CardDescription class="text-card-foreground">
                {t("settingsPage.email.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TextField class="grid w-full items-center gap-1.5">
                <TextFieldInput
                  type="email"
                  id="email"
                  value={user()!.email}
                  class="max-w-xs"
                  readonly
                />
              </TextField>
            </CardContent>
            <CardFooter class="justify-between border-t p-6 bg-muted/20">
              <p class="text-sm text-muted-foreground">
                {t("settingsPage.email.footer")}
              </p>
              <Button class="transition-opacity" disabled>
                {t("settingsPage.actions.save")}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("settingsPage.theme.title")}</CardTitle>
              <CardDescription class="text-card-foreground">
                {t("settingsPage.theme.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={draftTheme()}
                onChange={(value) => value && setDraftThemeKey(value.key)}
                options={themeOptions()}
                optionValue="key"
                optionTextValue="label"
                itemComponent={(props) => (
                  <SelectItem item={props.item}>
                    {props.item.rawValue.label}
                  </SelectItem>
                )}
              >
                <SelectTrigger
                  aria-label={t("settingsPage.theme.title")}
                  class="w-45"
                >
                  <SelectValue<ThemeOption>>
                    {(state) => state.selectedOption().label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent />
              </Select>
            </CardContent>
            <CardFooter class="justify-end border-t p-6 bg-muted/20">
              <Button
                class="transition-opacity"
                disabled={!hasThemeChanges()}
                on:click={() => setColorMode(draftThemeKey())}
              >
                {t("settingsPage.actions.save")}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("settingsPage.language.title")}</CardTitle>
              <CardDescription class="text-card-foreground">
                {t("settingsPage.language.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={draftLanguage()}
                onChange={(value) => value && setDraftLocale(value.key)}
                options={languageOptions()}
                optionValue="key"
                optionTextValue="label"
                itemComponent={(props) => (
                  <SelectItem item={props.item}>
                    {props.item.rawValue.label}
                  </SelectItem>
                )}
              >
                <SelectTrigger
                  aria-label={t("settingsPage.language.title")}
                  class="w-full max-w-xs"
                >
                  <SelectValue<LanguageOption>>
                    {(state) => state.selectedOption().label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent />
              </Select>
            </CardContent>
            <CardFooter class="justify-end border-t p-6 bg-muted/20">
              <Button
                class="transition-opacity"
                disabled={!hasLanguageChanges()}
                on:click={handleSaveLanguage}
              >
                {t("settingsPage.actions.save")}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("settingsPage.currency.title")}</CardTitle>
              <CardDescription class="text-card-foreground">
                {t("settingsPage.currency.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={draftCurrencyOption()}
                onChange={(value) => value && setDraftCurrency(value.code)}
                options={currencyOptions()}
                optionValue="code"
                optionTextValue="label"
                itemComponent={(props) => (
                  <SelectItem item={props.item}>
                    {props.item.rawValue.label}
                  </SelectItem>
                )}
              >
                <SelectTrigger
                  aria-label={t("settingsPage.currency.title")}
                  class="w-full max-w-xs"
                >
                  <SelectValue<CurrencyOption>>
                    {(state) => state.selectedOption().label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent class="max-h-80 overflow-y-auto" />
              </Select>
            </CardContent>
            <CardFooter class="justify-end border-t p-6 bg-muted/20">
              <Button
                class="transition-opacity"
                disabled={!hasCurrencyChanges()}
                on:click={handleSaveCurrency}
              >
                {t("settingsPage.actions.save")}
              </Button>
            </CardFooter>
          </Card>

          <Card class="border-destructive/20">
            <CardHeader>
              <CardTitle>{t("settingsPage.deleteAccount.title")}</CardTitle>
              <CardDescription class="text-card-foreground">
                {t("settingsPage.deleteAccount.description")}
              </CardDescription>
            </CardHeader>

            <CardFooter class="justify-end border-t border-destructive/20 p-6  bg-destructive/10">
              <Dialog>
                <DialogTrigger as={Button} variant="destructive">
                  {t("settingsPage.deleteAccount.action")}
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {t("settingsPage.deleteAccount.dialog.title")}
                    </DialogTitle>
                    <DialogDescription>
                      {t("settingsPage.deleteAccount.dialog.description")}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose as={Button} variant="outline">
                      {t("settingsPage.deleteAccount.dialog.cancel")}
                    </DialogClose>
                    <Button
                      variant="destructive"
                      disabled={isDeletingAccount()}
                      onClick={handleDeleteAccount}
                    >
                      {t("settingsPage.deleteAccount.dialog.continue")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </Grid>
      </div>
    </div>
  );
}

export default Settings;
