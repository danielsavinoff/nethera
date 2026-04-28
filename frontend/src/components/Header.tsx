import type { JSX } from "solid-js";
import { createSignal, splitProps } from "solid-js";
import { cn } from "~/lib/utils";
import { Flex } from "./ui/Flex";
import { Col, Grid } from "./ui/Grid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/DropdownMenu";
import { Separator } from "./ui/Separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { NavigationMenu, NavigationMenuTrigger } from "./ui/NavigationMenu";
import { Button } from "./ui/Button";
import { ChevronsUpDown } from "lucide-solid";
type HeaderProps = JSX.HTMLAttributes<HTMLHeadElement> & {};

export function Header(props: HeaderProps) {
  const [local, others] = splitProps(props, ["class"]);

  const [tenant, setTenant] = createSignal("");

  return (
    <header class={cn("h-16 w-full border-b", local.class)} {...others}>
      <Grid cols={2} colsMd={3} class="h-full items-center gap-4">
        <Col class="min-w-0">
          <Flex class="w-fit items-center gap-4">
            <div
              class="flex size-10 items-center justify-center rounded-xl border border-foreground/10 bg-foreground text-background shadow-sm"
              aria-label="Brand logo"
              role="img"
            >
              <span class="text-sm font-semibold">N</span>
            </div>
            <Separator orientation="vertical" class="h-10" />
            <DropdownMenu>
              <DropdownMenuTrigger as={Button<"button">} variant={"ghost"}>
                My space
                <ChevronsUpDown class="stroke-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Flex>
        </Col>

        <Col class="hidden md:flex md:justify-center">
          <NavigationMenu class="flex-none">
            <NavigationMenuTrigger as="a" href="#" target="_blank">
              Subscriptions
            </NavigationMenuTrigger>
            <NavigationMenuTrigger as="a" href="#" target="_blank">
              Billing
            </NavigationMenuTrigger>
            <NavigationMenuTrigger as="a" href="#" target="_blank">
              Spaces
            </NavigationMenuTrigger>
          </NavigationMenu>
        </Col>

        <Col class="flex justify-end">
          <Avatar>
            <AvatarFallback>FP</AvatarFallback>
          </Avatar>
        </Col>
      </Grid>
    </header>
  );
}
