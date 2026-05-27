import type { Component, ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

import { cn } from "~/lib/utils";

const Card: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      class={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden [&:has(>[data-card-aside])]:grid [&:has(>[data-card-aside])]:grid-cols-[auto_1fr]",
        local.class,
      )}
      {...others}
    />
  );
};

const CardAside: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-card-aside
      class={cn("p-6 pr-0", local.class)}
      {...others}
    />
  );
};

const CardIndex: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      class={cn(
        "flex size-10 items-center justify-center rounded-full bg-muted text-primary font-medium",
        local.class,
      )}
      {...others}
    />
  );
};

const CardMain: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={local.class} {...others} />;
};

const CardHeader: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div class={cn("flex flex-col space-y-1.5 p-6", local.class)} {...others} />
  );
};

const CardTitle: Component<ComponentProps<"h3">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <h3
      class={cn(
        "text-lg font-semibold leading-none tracking-tight",
        local.class,
      )}
      {...others}
    />
  );
};

const CardDescription: Component<ComponentProps<"p">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <p class={cn("text-sm text-muted-foreground", local.class)} {...others} />
  );
};

const CardContent: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn("p-6 pt-0", local.class)} {...others} />;
};

const CardFooter: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      class={cn("flex items-center p-6 pt-0 overflow-hidden", local.class)}
      {...others}
    />
  );
};

export {
  Card,
  CardAside,
  CardIndex,
  CardMain,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
