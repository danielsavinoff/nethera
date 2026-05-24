import { useColorMode, type ConfigColorMode } from "@kobalte/core";
import { createSignal } from "solid-js";
import { userControllerHandleDeleteMe } from "~/api/generated";
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
import { showToast } from "~/components/ui/Toast";

type ThemeOption = {
  label: string;
  key: string;
};

function Settings() {
  const { t } = useLocale();

  const { user } = useAuth();

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

  const [isDeletingAccount, setIsDeletingAccount] = createSignal(false);

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);

    try {
      await userControllerHandleDeleteMe();

      window.location.href = "/login";
    } catch {
      showToast({
        title: t("settingsPage.deleteAccount.error"),
        variant: "error",
      });
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
            <CardFooter class="justify-end border-t p-6 bg-muted/20">
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
