import { A } from "@solidjs/router";
import { CircleQuestionMark, PlusIcon } from "lucide-solid";
import { Show } from "solid-js";
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
import { BarChart } from "~/components/ui/Charts";
import { Flex } from "~/components/ui/Flex";
import { Col, Grid } from "~/components/ui/Grid";
import { TextField, TextFieldInput } from "~/components/ui/TextField";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/Tooltip";

function App() {
  const hasSubscription = true;

  const chartData = {
    labels: [
      "Amphibians",
      "Birds",
      "Crustaceans",
      "Ferns",
      "Arachnids",
      "Corals",
      "Algae",
    ],
    datasets: [
      {
        label: "Number of threatened species",
        data: [2488, 1445, 734, 281, 251, 232, 98],
        backgroundColor: "var(--color-chart-3)",
        borderColor: "var(--color-chart-3)",
      },
    ],
  };

  return (
    <div class="h-svh overflow-hidden flex flex-col items-center bg-muted">
      <Header class="px-6 md:px-10" />
      <main class="flex-1 min-h-0 w-full overflow-hidden px-6 pt-16 pb-8 md:px-10 flex flex-col items-center">
        <Flex class="h-full w-full min-h-0 flex-1 flex-col items-baseline container gap-8">
          <Grid class="gap-4">
            <h1 class="text-3xl font-semibold">Subscription</h1>
          </Grid>
          <Show
            when={hasSubscription}
            fallback={
              <Card class="w-full flex-1 flex justify-center items-center">
                <CardContent>
                  <Flex class="gap-7 flex-col">
                    <Flex class="gap-1 flex-col">
                      <h2 class="text-xl font-bold">
                        You don't have a plan yet
                      </h2>
                      <p class="text-sm font-medium text-muted-foreground">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      </p>
                    </Flex>
                    <A href="/plans">
                      <Button>Go to plans</Button>
                    </A>
                  </Flex>
                </CardContent>
              </Card>
            }
          >
            <Grid
              cols={4}
              class="w-full flex-1 min-h-0 gap-4 overflow-hidden grid-rows-[fit_1fr]"
            >
              <Col span={2}>
                <Card class="h-full flex flex-col">
                  <CardHeader class="flex-row justify-between items-center space-y-0">
                    <CardTitle>Link</CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        <CircleQuestionMark class="text-muted-foreground size-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Tooltip content</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent class="flex-1 flex items-center">
                    <TextField class="grid w-full items-center gap-1.5">
                      <TextFieldInput
                        type="email"
                        id="email"
                        value={"https://tuntunms.twilightparadox.com"}
                        readonly
                      />
                    </TextField>
                  </CardContent>
                  <CardFooter class="gap-4">
                    <Button variant="default" class="w-full">
                      <PlusIcon />
                      Add subscription
                    </Button>
                    <Button variant="secondary" class="w-full">
                      Copy URL
                    </Button>
                  </CardFooter>
                </Card>
              </Col>

              <Col>
                <Card class="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>Plan</CardTitle>
                  </CardHeader>
                  <CardContent class="flex-1 flex items-center">
                    <p class="text-2xl font-semibold tracking-tight">
                      Exclusive
                    </p>
                  </CardContent>
                  <CardFooter class="gap-4">
                    <Button variant="outline" class="w-full">
                      Cancel
                    </Button>
                  </CardFooter>
                </Card>
              </Col>
              <Col>
                <Card class="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>Valid</CardTitle>
                  </CardHeader>
                  <CardContent class="flex-1 flex items-center">
                    <p class="text-2xl font-semibold tracking-tight">
                      Until 15th March
                    </p>
                  </CardContent>
                  <CardFooter class="gap-4">
                    <Button variant="outline" class="w-full">
                      Extend
                    </Button>
                  </CardFooter>
                </Card>
              </Col>

              <Col span={4} class="h-full min-h-0">
                <Card class="h-full min-h-0 flex flex-col">
                  <CardHeader>
                    <CardTitle>Traffic usage</CardTitle>
                    <CardDescription>
                      Showing total traffic for the last 3 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent class="flex flex-1 min-h-0 overflow-hidden">
                    <div class="h-full min-h-0 w-full">
                      <BarChart data={chartData} />
                    </div>
                  </CardContent>
                </Card>
              </Col>
            </Grid>
          </Show>
        </Flex>
      </main>
    </div>
  );
}

export default App;
