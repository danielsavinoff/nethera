import type { JSX } from "solid-js";
import { createSignal, splitProps } from "solid-js";
import { cn } from "~/lib/utils";
import { Flex } from "./ui/Flex";
import { Col, Grid } from "./ui/Grid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";
import { Separator } from "./ui/Separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { NavigationMenu, NavigationMenuTrigger } from "./ui/NavigationMenu";
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
            <Select
              value={tenant()}
              onChange={setTenant}
              options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
              placeholder="Select a fruit…"
              itemComponent={(props) => (
                <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
              )}
            >
              <SelectTrigger aria-label="Fruit" class="w-[180px]">
                <SelectValue<string>>
                  {(state) => state.selectedOption()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
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
              Settings
            </NavigationMenuTrigger>
          </NavigationMenu>
        </Col>

        <Col class="flex justify-end">
          <Avatar>
            <AvatarImage src="https://github.com/stefan-karger.png" />
            <AvatarFallback>EK</AvatarFallback>
          </Avatar>
        </Col>
      </Grid>
    </header>
  );
}
