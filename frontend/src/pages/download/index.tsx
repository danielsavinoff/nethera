import {
  IconBrandAndroid,
  IconBrandApple,
  IconBrandFinder,
  IconBrandUbuntu,
  IconBrandWindows,
  IconDeviceTv,
} from "@tabler/icons-solidjs";
import { Link, Plus, SquareArrowOutUpRight } from "lucide-solid";
import { createMemo, createSignal, type Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";
import { Grid } from "~/components/ui/Grid";
import {
  Card,
  CardAside,
  CardContent,
  CardDescription,
  CardHeader,
  CardIndex,
  CardMain,
  CardTitle,
} from "~/components/ui/Card";
import { useLocale } from "~/context/Locale";
import { Flex } from "~/components/ui/Flex";
import { Button } from "~/components/ui/Button";
import { useVpnSubscription } from "~/context/VpnSubscription";

type PlatformOption = {
  label: string;
  value: Platform;
  icon: Component<{ class?: string; stroke?: string }>;
};

type VpnClientOption = {
  label: string;
  value: VpnClient;
};

type DownloadStep = {
  title: string;
  description: string;
  content?: {
    url: string;
    label: string;
    icon?: Component;
  }[];
};

const Platform = {
  Ios: "ios",
  Android: "android",
  Linux: "linux",
  Macos: "macos",
  Windows: "windows",
  AndroidTv: "android-tv",
  AppleTv: "apple-tv",
} as const;

const VpnClient = {
  Happ: "happ",
  Stash: "stash",
  Shadowrocket: "shadowrocket",
  Streisand: "streisand",
  FlClashX: "flclashx",
  ClashMeta: "clash-meta",
  V2rayNg: "v2rayng",
  KoalaClash: "koala-clash",
  PrizrakBox: "prizrak-box",
  Vpn4Tv: "vpn4tv",
} as const;

type Platform = (typeof Platform)[keyof typeof Platform];
type VpnClient = (typeof VpnClient)[keyof typeof VpnClient];

const platformOptions: PlatformOption[] = [
  {
    label: "iOS",
    value: Platform.Ios,
    icon: IconBrandApple,
  },
  {
    label: "Android",
    value: Platform.Android,
    icon: IconBrandAndroid,
  },
  {
    label: "Linux",
    value: Platform.Linux,
    icon: IconBrandUbuntu,
  },
  {
    label: "macOS",
    value: Platform.Macos,
    icon: IconBrandFinder,
  },
  {
    label: "Windows",
    value: Platform.Windows,
    icon: IconBrandWindows,
  },
  {
    label: "Android TV",
    value: Platform.AndroidTv,
    icon: IconDeviceTv,
  },
  {
    label: "Apple TV",
    value: Platform.AppleTv,
    icon: IconDeviceTv,
  },
];

const vpnClientOptionsByPlatform: Record<Platform, VpnClientOption[]> = {
  [Platform.Ios]: [
    { label: "Happ", value: VpnClient.Happ },
    { label: "Stash", value: VpnClient.Stash },
    { label: "Shadowrocket", value: VpnClient.Shadowrocket },
    { label: "Streisand", value: VpnClient.Streisand },
  ],
  [Platform.Android]: [
    { label: "Happ", value: VpnClient.Happ },
    { label: "FlClashX", value: VpnClient.FlClashX },
    { label: "Clash Meta", value: VpnClient.ClashMeta },
    { label: "v2rayNG", value: VpnClient.V2rayNg },
  ],
  [Platform.Linux]: [
    { label: "FlClashX", value: VpnClient.FlClashX },
    { label: "Koala Clash", value: VpnClient.KoalaClash },
    { label: "Prizrak-Box", value: VpnClient.PrizrakBox },
  ],
  [Platform.Macos]: [
    { label: "Happ", value: VpnClient.Happ },
    { label: "FlClashX", value: VpnClient.FlClashX },
    { label: "Koala Clash", value: VpnClient.KoalaClash },
    { label: "Prizrak-Box", value: VpnClient.PrizrakBox },
  ],
  [Platform.Windows]: [
    { label: "FlClashX", value: VpnClient.FlClashX },
    { label: "Koala Clash", value: VpnClient.KoalaClash },
    { label: "Prizrak-Box", value: VpnClient.PrizrakBox },
    { label: "Happ", value: VpnClient.Happ },
  ],
  [Platform.AndroidTv]: [
    { label: "Happ", value: VpnClient.Happ },
    { label: "VPN4TV", value: VpnClient.Vpn4Tv },
  ],
  [Platform.AppleTv]: [
    { label: "Happ", value: VpnClient.Happ },
    { label: "Shadowrocket", value: VpnClient.Shadowrocket },
    { label: "Stash", value: VpnClient.Stash },
  ],
};

function Download() {
  const { t } = useLocale();

  const { vpnSubscription } = useVpnSubscription();

  const config = createMemo<
    Record<Platform, Partial<Record<VpnClient, DownloadStep[]>>>
  >(() => ({
    [Platform.Ios]: {
      [VpnClient.Happ]: [
        {
          title: t("downloadPage.steps.appInstallation.title"),
          description: t("downloadPage.steps.appInstallation.description"),
          content: [
            {
              url: "#",
              label: t("downloadPage.actions.appStoreRu"),
              icon: Link,
            },
            {
              url: "#",
              label: t("downloadPage.actions.appStoreGlobal"),
              icon: Link,
            },
          ],
        },
      ],
      [VpnClient.Stash]: [
        {
          title: t("downloadPage.steps.appInstallation.title"),
          description: t("downloadPage.steps.appInstallation.description"),
          content: [
            {
              url: "#",
              label: t("downloadPage.actions.appStoreRu"),
              icon: Link,
            },
            {
              url: "#",
              label: t("downloadPage.actions.appStoreGlobal"),
              icon: Link,
            },
          ],
        },
      ],
      [VpnClient.Shadowrocket]: [
        {
          title: t("downloadPage.steps.appInstallation.title"),
          description: t("downloadPage.steps.appInstallation.description"),
          content: [
            {
              url: "#",
              label: t("downloadPage.actions.appStoreRu"),
              icon: Link,
            },
            {
              url: "#",
              label: t("downloadPage.actions.appStoreGlobal"),
              icon: Link,
            },
          ],
        },
      ],
      [VpnClient.Streisand]: [
        {
          title: t("downloadPage.steps.appInstallation.title"),
          description: t("downloadPage.steps.appInstallation.description"),
          content: [
            {
              url: "#",
              label: t("downloadPage.actions.appStoreRu"),
              icon: Link,
            },
            {
              url: "#",
              label: t("downloadPage.actions.appStoreGlobal"),
              icon: Link,
            },
          ],
        },
      ],
    },
    [Platform.Android]: {},
    [Platform.Linux]: {},
    [Platform.Macos]: {
      [VpnClient.Happ]: [
        {
          title: t("downloadPage.steps.macos.happ.appInstallation.title"),
          description: t(
            "downloadPage.steps.macos.happ.appInstallation.description",
          ),
          content: [
            {
              url: "https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973?l=en-GB",
              label: t("downloadPage.actions.appStoreRu"),
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://apps.apple.com/us/app/happ-proxy-utility/id6504287215",
              label: t("downloadPage.actions.appStoreGlobal"),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.macos.happ.addSubscription.title"),
          description: t(
            "downloadPage.steps.macos.happ.addSubscription.description",
          ),
          content: [
            {
              url: `happ://add/${vpnSubscription()?.url}`,
              label: t("downloadPage.actions.addSubscription"),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.macos.happ.connectionUsage.title"),
          description: t(
            "downloadPage.steps.macos.happ.connectionUsage.description",
          ),
        },
      ],
    },
    [Platform.Windows]: {},
    [Platform.AndroidTv]: {},
    [Platform.AppleTv]: {},
  }));

  const [platform, setPlatform] = createSignal<Platform>(Platform.Ios);

  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("appletv")) {
    setPlatform(Platform.AppleTv);
  }

  if (userAgent.includes("android") && userAgent.includes("tv")) {
    setPlatform(Platform.AndroidTv);
  }

  if (/iphone|ipad|ipod/.test(userAgent)) {
    setPlatform(Platform.Ios);
  }

  if (userAgent.includes("android")) {
    setPlatform(Platform.Android);
  }

  const userPlatform = navigator.platform.toLowerCase();

  if (userPlatform.includes("mac")) {
    setPlatform(Platform.Macos);
  }

  if (userPlatform.includes("win")) {
    setPlatform(Platform.Windows);
  }

  if (userPlatform.includes("linux")) {
    setPlatform(Platform.Linux);
  }

  const selectedPlatform = createMemo(
    () =>
      platformOptions.find((option) => option.value === platform()) ??
      platformOptions[0],
  );

  const vpnClientOptions = createMemo(
    () => vpnClientOptionsByPlatform[platform()],
  );

  const [vpnClient, setVpnClient] = createSignal(vpnClientOptions()[0]);

  const steps = createMemo(() => config()[platform()][vpnClient().value] ?? []);

  const handlePlatformChange = (value: PlatformOption | null) => {
    if (!value) {
      return;
    }

    setPlatform(value.value);

    setVpnClient(vpnClientOptionsByPlatform[value.value][0]);
  };

  return (
    <div class="w-full flex-1 flex flex-col gap-8">
      <Grid class="w-full gap-4">
        <h1 class="text-3xl font-semibold">{t("downloadPage.title")}</h1>
      </Grid>
      <div class="flex-1">
        <Grid class="gap-4 grid-cols-[1fr_fit-content]">
          <Grid class="gap-4">
            <Card>
              <CardAside>
                <CardIndex>1</CardIndex>
              </CardAside>
              <CardMain>
                <CardHeader>
                  <CardTitle>{t("downloadPage.platform.title")}</CardTitle>
                  <CardDescription>
                    {t("downloadPage.platform.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedPlatform()}
                    onChange={handlePlatformChange}
                    options={platformOptions}
                    optionValue="value"
                    optionTextValue="label"
                    itemComponent={(props) => (
                      <SelectItem item={props.item}>
                        <span class="flex items-center gap-2">
                          <Dynamic
                            component={props.item.rawValue.icon}
                            stroke="1.75"
                            class="size-5"
                          />
                          {props.item.rawValue.label}
                        </span>
                      </SelectItem>
                    )}
                  >
                    <SelectTrigger
                      aria-label={t("downloadPage.platform.title")}
                      class="w-full max-w-80"
                    >
                      <SelectValue<PlatformOption>>
                        {(state) => (
                          <span class="flex items-center gap-2">
                            <Dynamic
                              component={state.selectedOption().icon}
                              stroke="1.75"
                              class="size-5"
                            />
                            {state.selectedOption().label}
                          </span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent class="min-w-72" />
                  </Select>
                </CardContent>
              </CardMain>
            </Card>

            <Card>
              <CardAside>
                <CardIndex>2</CardIndex>
              </CardAside>
              <CardMain>
                <CardHeader>
                  <CardTitle>{t("downloadPage.vpnClient.title")}</CardTitle>
                  <CardDescription>
                    {t("downloadPage.vpnClient.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={vpnClient()}
                    onChange={(value) => value && setVpnClient(value)}
                    options={vpnClientOptions()}
                    optionValue="value"
                    optionTextValue="label"
                    itemComponent={(props) => (
                      <SelectItem item={props.item}>
                        {props.item.rawValue.label}
                      </SelectItem>
                    )}
                  >
                    <SelectTrigger
                      aria-label={t("downloadPage.vpnClient.title")}
                      class="w-full max-w-64"
                    >
                      <SelectValue<VpnClientOption>>
                        {(state) => state.selectedOption().label}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent class="min-w-44" />
                  </Select>
                </CardContent>
              </CardMain>
            </Card>

            {steps().map((step, index) => (
              <Card>
                <CardAside>
                  <CardIndex>{index + 3}</CardIndex>
                </CardAside>
                <CardMain>
                  <CardHeader>
                    <CardTitle>{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  {!!step.content?.length && (
                    <CardContent>
                      <Flex class="justify-start gap-2 flex-wrap">
                        {step.content.map((content) => (
                          <Button
                            as="a"
                            href={content.url || "#"}
                            target={
                              content.url.startsWith("http")
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              content.url.startsWith("http")
                                ? "noreferrer"
                                : undefined
                            }
                            disabled={!content.url}
                            variant="outline"
                          >
                            {content.icon && (
                              <Dynamic component={content.icon} />
                            )}
                            {content.label}
                          </Button>
                        ))}
                      </Flex>
                    </CardContent>
                  )}
                </CardMain>
              </Card>
            ))}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Download;
