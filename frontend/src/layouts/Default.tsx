import type { RouteSectionProps } from "@solidjs/router";
import { Header } from "~/components/Header";
import { Flex } from "~/components/ui/Flex";

export default function Default(props: RouteSectionProps) {
  return (
    <div class="lg:h-svh lg:overflow-hidden flex flex-col items-center bg-background">
      <Header class="px-6 md:px-10" />
      <main class="flex-1 min-h-0 w-full lg:overflow-hidden px-6 pt-16 pb-8 md:px-10 flex flex-col items-center">
        <Flex class="h-full w-full min-h-0 flex-1 flex-col items-baseline container gap-8">
          {props.children}
        </Flex>
      </main>
    </div>
  );
}
