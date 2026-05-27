import type { JSX } from "solid-js";
import { createSignal, splitProps } from "solid-js";
import { cn } from "~/lib/utils";
import { useLocale } from "~/context/Locale";
import { Flex } from "./ui/Flex";
import { Col, Grid } from "./ui/Grid";
import { Avatar, AvatarFallback } from "./ui/Avatar";
import { NavigationMenu, NavigationMenuTrigger } from "./ui/NavigationMenu";
import { Button } from "./ui/Button";
import { Cog, Download } from "lucide-solid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";

type HeaderProps = JSX.HTMLAttributes<HTMLHeadElement> & {};

export function Header(props: HeaderProps) {
  const [local, others] = splitProps(props, ["class"]);

  const { t } = useLocale();

  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await authControllerHandleLogout();
    } finally {
      window.location.href = "/login";
    }
  };

  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  return (
    <header
      class={cn(
        "relative top-0 h-16 w-full flex justify-center border-b bg-card shadow-sm ",
        local.class,
      )}
      {...others}
    >
      <Grid cols={2} colsMd={3} class="h-full container items-center gap-4">
        <Col class="min-w-0">
          <Flex class="w-fit items-center gap-4">
            <div
              class="hidden sm:flex size-10 items-center justify-center rounded-xl border border-foreground/10 bg-foreground text-background shadow-sm"
              aria-label={t("header.brand.logo")}
              role="img"
            >
              <span class="text-sm font-semibold">N</span>
            </div>
            <div class="sm:hidden flex items-center gap-4">
              <Popover
                overflowPadding={0}
                gutter={12}
                open={isMenuOpen()}
                onOpenChange={setIsMenuOpen}
              >
                <PopoverTrigger class="flex items-center gap-2 ">
                  <div class="relative flex h-8 w-4 items-center justify-center">
                    <div class="relative size-4">
                      <span
                        class={cn(
                          "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100 top-1",
                          isMenuOpen() && "top-[0.4rem] -rotate-45",
                        )}
                      />
                      <span
                        class={cn(
                          "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100 top-2.5",
                          isMenuOpen() && "top-[0.4rem] rotate-45",
                        )}
                      />
                    </div>
                    <span class="sr-only">{t("header.menu.toggle")}</span>
                  </div>
                  <span class="flex h-8 items-center text-lg leading-none font-medium">
                    {t("header.menu.label")}
                  </span>
                </PopoverTrigger>
                <PopoverContent class="h-(--kb-popper-content-available-height) w-(--kb-popper-content-available-width) bg-background/90 shadow-none backdrop-blur duration-100 border-none p-0">
                  <div class="p-6">
                    <Flex class="flex-col items-baseline gap-12">
                      <div class="space-y-4">
                        <div class="text-sm font-medium text-muted-foreground">
                          {t("header.menu.label")}
                        </div>
                        <div class="flex flex-col gap-3">
                          <A
                            class="flex items-center gap-2 text-2xl font-medium"
                            href="/subscription"
                          >
                            {t("header.nav.subscription")}
                          </A>
                          <A
                            class="flex items-center gap-2 text-2xl font-medium"
                            href="/invoices"
                          >
                            {t("header.nav.invoices")}
                          </A>
                          <A
                            class="flex items-center gap-2 text-2xl font-medium"
                            href="/plans"
                          >
                            {t("header.nav.plans")}
                          </A>
                        </div>
                      </div>

                      <div class="space-y-4">
                        <div class="text-sm font-medium text-muted-foreground">
                          {t("header.contacts.label")}
                        </div>
                        <div class="flex flex-col gap-3">
                          <A
                            class="flex items-center gap-2 text-2xl font-medium"
                            href="#"
                          >
                            Telegram
                          </A>
                          <A
                            class="flex items-center gap-2 text-2xl font-medium"
                            href="#"
                          >
                            Signal
                          </A>
                        </div>
                      </div>
                    </Flex>
                  </div>
                  <Flex class="fixed bottom-0 overflow-hidden whitespace-nowrap">
                    <span class="w-full inline-block animate-[marquee_15s_linear_infinite] font-black text-9xl opacity-10 blur-xs select-none">
                      Nethera
                    </span>
                  </Flex>
                </PopoverContent>
              </Popover>
            </div>
            <NavigationMenu class="flex-none hidden sm:flex">
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
            <Flex class="w-fit items-center gap-1 hidden sm:flex">
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

            <Separator orientation="vertical" class="h-6 hidden sm:block" />

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarFallback>
                    {user()?.displayName.slice(0, 2).toUpperCase()}
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
