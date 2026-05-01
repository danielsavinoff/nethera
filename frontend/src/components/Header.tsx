import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";
import { Flex } from "./ui/Flex";
import { Col, Grid } from "./ui/Grid";
import { Avatar, AvatarFallback } from "./ui/Avatar";
import { NavigationMenu, NavigationMenuTrigger } from "./ui/NavigationMenu";
import { Button } from "./ui/Button";
import { Cog, Download, Globe } from "lucide-solid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
type HeaderProps = JSX.HTMLAttributes<HTMLHeadElement> & {};

export function Header(props: HeaderProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <header
      class={cn(
        "h-16 w-full flex justify-center border-b bg-background",
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
              <NavigationMenuTrigger as="a" href="/app/subscription">
                Subscription
              </NavigationMenuTrigger>
              <NavigationMenuTrigger as="a" href="/billing">
                Billing
              </NavigationMenuTrigger>
              <NavigationMenuTrigger as="a" href="/app/plans">
                Plans
              </NavigationMenuTrigger>
            </NavigationMenu>
          </Flex>
        </Col>

        <Col class="hidden md:flex md:justify-center"></Col>

        <Col>
          <Flex class="justify-end gap-4">
            <Button variant={"outline"}>
              <Download />
              Download
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarFallback>FP</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="min-w-3xs">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Cog class="size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Globe class="size-4" />
                  Interface language
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Flex>
        </Col>
      </Grid>
    </header>
  );
}
