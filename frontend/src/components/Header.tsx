import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";
import { useLocale } from "~/context/Locale";
import { Flex } from "./ui/Flex";
import { Col, Grid } from "./ui/Grid";
import { Avatar, AvatarFallback } from "./ui/Avatar";
import { NavigationMenu, NavigationMenuTrigger } from "./ui/NavigationMenu";
import { Button } from "./ui/Button";
import { ChevronDown, Cog, Download, Globe } from "lucide-solid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuSub,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from "./ui/DropdownMenu";
import { A } from "@solidjs/router";
import { authControllerHandleLogout } from "~/api/generated";
import { Icon } from "@iconify-icon/solid";
import { Separator } from "./ui/Separator";
import {
  IconBrandAndroid,
  IconBrandApple,
  IconBrandFinder,
  IconBrandUbuntu,
  IconBrandWindows,
  IconDeviceTv,
} from "@tabler/icons-solidjs";
import { useAuth } from "~/context/Auth";

type HeaderProps = JSX.HTMLAttributes<HTMLHeadElement> & {};

export function Header(props: HeaderProps) {
  const [local, others] = splitProps(props, ["class"]);

  const { locale, setLocale, t } = useLocale();

  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await authControllerHandleLogout();
    } finally {
      window.location.href = "/login";
    }
  };

  return (
    <header
      class={cn(
        "h-16 w-full flex justify-center border-b bg-card shadow-sm",
        local.class,
      )}
      {...others}
    >
      <Grid cols={2} colsMd={3} class="h-full container items-center gap-4">
        <Col class="min-w-0">
          <Flex class="w-fit items-center gap-4">
            <div
              class="flex size-10 items-center justify-center rounded-xl border border-foreground/10 bg-foreground text-background shadow-sm"
              aria-label="Brand logo"
              role="img"
            >
              <span class="text-sm font-semibold">N</span>
            </div>
            <NavigationMenu class="flex-none">
              <NavigationMenuTrigger as="a" href="/subscription">
                {t("header.nav.subscription")}
              </NavigationMenuTrigger>
              <NavigationMenuTrigger as="a" href="/invoices">
                {t("header.nav.invoices")}
              </NavigationMenuTrigger>
              <NavigationMenuTrigger as="a" href="/plans">
                {t("header.nav.plans")}
              </NavigationMenuTrigger>
            </NavigationMenu>
          </Flex>
        </Col>

        <Col class="hidden md:flex md:justify-center"></Col>

        <Col>
          <Flex class="justify-end gap-4">
            <Flex class="w-fit items-center gap-1">
              <A
                href="#"
                class="flex justify-center items-center size-10 text-muted-foreground/50 hover:text-primary/80 transition-colors"
              >
                <span class="sr-only">Telegram</span>
                <Icon icon="mingcute:telegram-fill" class="text-xl" />
              </A>

              <A
                href="#"
                class="flex justify-center items-center size-10 text-muted-foreground/50 hover:text-primary/80 transition-colors"
              >
                <span class="sr-only">Signal</span>
                <Icon icon="simple-icons:signal" class="text-xl" />
              </A>
            </Flex>

            <Separator orientation="vertical" class="h-6" />

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarFallback>
                    {user()!.displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="min-w-3xs">
                <DropdownMenuLabel>
                  {t("header.account.label")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem as={A} href="/settings">
                  <Cog class="size-4" />
                  {t("header.account.settings")}
                </DropdownMenuItem>
                <DropdownMenuSub overlap>
                  <DropdownMenuSubTrigger class="gap-2">
                    <Globe class="size-4" />
                    {t("header.language.label")}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent class="min-w-48">
                      <DropdownMenuLabel>
                        {t("header.language.select")}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={locale()}
                        onChange={setLocale}
                      >
                        <DropdownMenuRadioItem value="en">
                          {t("header.language.options.en")}
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="ru">
                          {t("header.language.options.ru")}
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout}>
                  {t("header.actions.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger as={Button} variant={"outline"}>
                <Download />
                {t("header.actions.download")}
                {/* <ChevronDown class="size-3!" /> */}
              </DropdownMenuTrigger>
              <DropdownMenuContent class="min-w-3xs">
                <DropdownMenuLabel>
                  {t("header.download.platform")}
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <IconBrandApple stroke={"1.75"} class="size-5" />
                  iOS
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconBrandAndroid stroke={"1.75"} class="size-5" />
                  Android
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconBrandUbuntu stroke={"1.75"} class="size-5" />
                  Linux
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconBrandFinder stroke={"1.75"} class="size-5" />
                  macOS
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconBrandWindows stroke={"1.75"} class="size-5" />
                  Windows
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconDeviceTv stroke={"1.75"} class="size-5" />
                  Android TV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconDeviceTv stroke={"1.75"} class="size-5" />
                  Apple TV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Flex>
        </Col>
      </Grid>
    </header>
  );
}
