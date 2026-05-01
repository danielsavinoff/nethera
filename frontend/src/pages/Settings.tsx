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
import { TextField, TextFieldInput } from "~/components/ui/TextField";

type ThemeOption = {
  label: string;
  key: string;
};

function Settings() {
  const themeOptions: ThemeOption[] = [
    {
      label: "System",
      key: "system",
    },
    {
      label: "Light",
      key: "light",
    },
    {
      label: "Dark",
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
        <h1 class="text-3xl font-semibold">Settings</h1>
      </Grid>
      <div class="flex-1">
        <Grid class="gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Email</CardTitle>
              <CardDescription class="text-card-foreground">
                Your email cannot be changed since it is linked to your account.
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
            <CardFooter class="justify-between border-t p-6 bg-muted">
              <p class="text-sm text-muted-foreground">
                However, you can create a new account with the desired email.
              </p>
              <Button disabled>Save</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription class="text-card-foreground">
                Choose a prefered theme
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
                <SelectTrigger aria-label="Theme" class="w-45">
                  <SelectValue<ThemeOption>>
                    {(state) => state.selectedOption().label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent />
              </Select>
            </CardContent>
            <CardFooter class="justify-end border-t p-6 bg-muted">
              <Button
                on:click={() => setColorMode(theme().key as ConfigColorMode)}
              >
                Save
              </Button>
            </CardFooter>
          </Card>

          <Card class="border-destructive/20">
            <CardHeader>
              <CardTitle>Delete account</CardTitle>
              <CardDescription class="text-card-foreground">
                Permanently remove your Personal Account and all of its contents
                from the platform. This action is not reversible, so please
                continue with caution.
              </CardDescription>
            </CardHeader>

            <CardFooter class="justify-end border-t border-destructive/20 p-6  bg-destructive/10">
              <Button variant={"destructive"}>Delete Personal Account</Button>
            </CardFooter>
          </Card>
        </Grid>
      </div>
    </div>
  );
}

export default Settings;
