import { LucideBadgeCheck } from "lucide-solid";
import { For } from "solid-js";
import { Header } from "~/components/Header";
import { Button } from "~/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { Flex } from "~/components/ui/Flex";
import { Grid } from "~/components/ui/Grid";
import { Separator } from "~/components/ui/Separator";
import {
  Switch,
  SwitchControl,
  SwitchLabel,
  SwitchThumb,
} from "~/components/ui/Switch";

function Plans() {
  const plans = ["Free", "Pro", "Enterprise"];

  return (
    <div class="min-h-svh flex flex-col items-center bg-muted">
      <Header class="px-6 md:px-10" />
      <main class="flex-1 w-full mt-16 mb-8 px-6 md:px-10 flex flex-col items-center space-y-6">
        <div class="w-full container space-y-8">
          <Grid class="gap-4">
            <h1 class="text-3xl font-semibold">Plans</h1>
            <Switch class="flex items-center space-x-2">
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
              <SwitchLabel>Annual billing</SwitchLabel>
            </Switch>
          </Grid>
          <div class="flex-1">
            <Flex class="flex-col md:flex-row gap-4">
              <For each={plans}>
                {(plan, i) => (
                  <Card class="w-full flex-1">
                    <CardHeader>
                      <CardTitle>{plan}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Grid class="gap-12">
                        <Grid>
                          <p class="text-5xl font-semibold tracking-tight">
                            ${20 * (i() + 1)}
                          </p>
                          <p class="text-xs text-muted-foreground">per month</p>
                        </Grid>
                        <Grid class="gap-4">
                          <p class="text-sm text-muted-foreground">
                            Ideal for individuals getting started. No credit
                            card required.
                          </p>
                          <Button size="sm">Get started</Button>
                        </Grid>
                        <Grid class="gap-6">
                          <Flex class="gap-3">
                            <Separator class="flex-1" />
                            <span class=" text-xs text-muted-foreground opacity-50">
                              FEATURES
                            </span>
                            <Separator class="flex-1" />
                          </Flex>
                          <ul class="space-y-4">
                            <li class="flex items-center gap-3">
                              <LucideBadgeCheck class="size-5 shrink-0 text-muted-foreground" />
                              <span class="text-sm text-muted-foreground">
                                Up to 5 components
                              </span>
                            </li>
                            <li class="flex items-center gap-3">
                              <LucideBadgeCheck class="size-5 shrink-0 text-muted-foreground" />
                              <span class="text-sm text-muted-foreground">
                                Up to 5 components
                              </span>
                            </li>
                          </ul>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )}
              </For>
            </Flex>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Plans;
