import { useColorMode, type ConfigColorMode } from "@kobalte/core";
import { createSignal } from "solid-js";
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
import { useLocale } from "~/context/Locale";
import { TextField, TextFieldInput } from "~/components/ui/TextField";

type ThemeOption = {
  label: string;
  key: string;
};

function Settings() {
  const { t } = useLocale();

  const themeOptions: ThemeOption[] = [
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
  ];

  const { setColorMode, colorMode } = useColorMode();

  const [theme, setTheme] = createSignal<ThemeOption>(
    themeOptions.find((theme) => theme.key === colorMode())!,
  );

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
                  value={"johndoe@gmail.com"}
                  class="max-w-xs"
                  readonly
                />
              </TextField>
            </CardContent>
            <CardFooter class="justify-between border-t p-6 bg-muted/50">
              <p class="text-sm text-muted-foreground">
                {t("settingsPage.email.footer")}
              </p>
              <Button disabled>{t("settingsPage.actions.save")}</Button>
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
                value={theme()}
                onChange={(value) => value && setTheme(value)}
                options={themeOptions}
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
            <CardFooter class="justify-end border-t p-6 bg-muted/50">
              <Button
                on:click={() => setColorMode(theme().key as ConfigColorMode)}
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
              <Button variant={"destructive"}>
                {t("settingsPage.deleteAccount.action")}
              </Button>
            </CardFooter>
          </Card>
        </Grid>
      </div>
    </div>
  );
}

export default Settings;
