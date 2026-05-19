import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";
import { useLocale } from "~/context/Locale";
import { Flex } from "./ui/Flex";
import { Col, Grid } from "./ui/Grid";
import { Avatar, AvatarFallback } from "./ui/Avatar";
import { NavigationMenu, NavigationMenuTrigger } from "./ui/NavigationMenu";
import { Button } from "./ui/Button";
import { Cog, Download, Globe, LogOut } from "lucide-solid";
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

type HeaderProps = JSX.HTMLAttributes<HTMLHeadElement> & {};

export function Header(props: HeaderProps) {
  const [local, others] = splitProps(props, ["class"]);

  const { locale, setLocale, t } = useLocale();

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
        "h-16 w-full flex justify-center border-b bg-card",
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
              <NavigationMenuTrigger as="a" href="/billing">
                {t("header.nav.billing")}
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
            <Button variant={"outline"}>
              <Download />
              {t("header.actions.download")}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarFallback>FP</AvatarFallback>
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
          </Flex>
        </Col>
      </Grid>
    </header>
  );
}
