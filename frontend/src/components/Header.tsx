import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";
import { Flex } from "./ui/Flex";
import { Col, Grid } from "./ui/Grid";
import { Avatar, AvatarFallback } from "./ui/Avatar";
import { NavigationMenu, NavigationMenuTrigger } from "./ui/NavigationMenu";
import { Button } from "./ui/Button";
import { Download } from "lucide-solid";
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
              <NavigationMenuTrigger as="a" href="/">
                Subscription
              </NavigationMenuTrigger>
              <NavigationMenuTrigger as="a" href="/billing">
                Billing
              </NavigationMenuTrigger>
              <NavigationMenuTrigger as="a" href="/plans">
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
            <Avatar>
              <AvatarFallback>FP</AvatarFallback>
            </Avatar>
          </Flex>
        </Col>
      </Grid>
    </header>
  );
}
