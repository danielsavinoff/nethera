import {
  IconBrandAndroid,
  IconBrandApple,
  IconBrandFinder,
  IconBrandUbuntu,
  IconBrandWindows,
  IconDeviceTv,
} from "@tabler/icons-solidjs";
import { Plus, SquareArrowOutUpRight } from "lucide-solid";
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

  const formatSubscriptionUrl = (template: string) => {
    const subscriptionUrl = vpnSubscription()?.url;

    if (!subscriptionUrl && template.includes("{{SUBSCRIPTION_LINK}}")) {
      return "";
    }

    return template
      .replace("{{SUBSCRIPTION_LINK}}", subscriptionUrl ?? "")
      .replace(
        "{{USERNAME}}",
        encodeURIComponent(vpnSubscription()?.username ?? ""),
      );
  };

  const config = createMemo<
    Record<Platform, Partial<Record<VpnClient, DownloadStep[]>>>
  >(() => ({
    [Platform.Ios]: {
      [VpnClient.Happ]: [
        {
          title: t("downloadPage.steps.ios.happ.appInstallation.title"),
          description: t(
            "downloadPage.steps.ios.happ.appInstallation.description",
          ),
          content: [
            {
              url: "https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973",
              label: t(
                "downloadPage.steps.ios.happ.appInstallation.links.appStoreRu",
              ),
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://apps.apple.com/us/app/happ-proxy-utility/id6504287215",
              label: t(
                "downloadPage.steps.ios.happ.appInstallation.links.appStoreGlobal",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.ios.happ.addSubscription.title"),
          description: t(
            "downloadPage.steps.ios.happ.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl("happ://add/{{SUBSCRIPTION_LINK}}"),
              label: t(
                "downloadPage.steps.ios.happ.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.ios.happ.connectionUsage.title"),
          description: t(
            "downloadPage.steps.ios.happ.connectionUsage.description",
          ),
          content: [],
        },
      ],
      [VpnClient.Stash]: [
        {
          title: t("downloadPage.steps.ios.stash.appInstallation.title"),
          description: t(
            "downloadPage.steps.ios.stash.appInstallation.description",
          ),
          content: [
            {
              url: "https://apps.apple.com/us/app/stash-rule-based-proxy/id1596063349",
              label: t(
                "downloadPage.steps.ios.stash.appInstallation.links.appStore",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.ios.stash.addSubscription.title"),
          description: t(
            "downloadPage.steps.ios.stash.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl(
                "stash://install-config?url={{SUBSCRIPTION_LINK}}",
              ),
              label: t(
                "downloadPage.steps.ios.stash.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.ios.stash.connectionUsage.title"),
          description: t(
            "downloadPage.steps.ios.stash.connectionUsage.description",
          ),
          content: [],
        },
      ],
      [VpnClient.Shadowrocket]: [
        {
          title: t(
            "downloadPage.steps.ios.shadowrocket.appInstallation.title",
          ),
          description: t(
            "downloadPage.steps.ios.shadowrocket.appInstallation.description",
          ),
          content: [
            {
              url: "https://apps.apple.com/ru/app/shadowrocket/id932747118",
              label: t(
                "downloadPage.steps.ios.shadowrocket.appInstallation.links.appStore",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t(
            "downloadPage.steps.ios.shadowrocket.addSubscription.title",
          ),
          description: t(
            "downloadPage.steps.ios.shadowrocket.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl(
                "shadowrocket://add/{{SUBSCRIPTION_LINK}}#{{USERNAME}}",
              ),
              label: t(
                "downloadPage.steps.ios.shadowrocket.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t(
            "downloadPage.steps.ios.shadowrocket.connectionUsage.title",
          ),
          description: t(
            "downloadPage.steps.ios.shadowrocket.connectionUsage.description",
          ),
          content: [],
        },
      ],
      [VpnClient.Streisand]: [
        {
          title: t("downloadPage.steps.ios.streisand.appInstallation.title"),
          description: t(
            "downloadPage.steps.ios.streisand.appInstallation.description",
          ),
          content: [
            {
              url: "https://apps.apple.com/ru/app/streisand/id6450534064",
              label: t(
                "downloadPage.steps.ios.streisand.appInstallation.links.appStore",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.ios.streisand.addSubscription.title"),
          description: t(
            "downloadPage.steps.ios.streisand.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl(
                "streisand://import/{{SUBSCRIPTION_LINK}}",
              ),
              label: t(
                "downloadPage.steps.ios.streisand.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.ios.streisand.connectionUsage.title"),
          description: t(
            "downloadPage.steps.ios.streisand.connectionUsage.description",
          ),
          content: [],
        },
      ],
    },
    [Platform.Android]: {
      [VpnClient.Happ]: [
        {
          title: t("downloadPage.steps.android.happ.appInstallation.title"),
          description: t(
            "downloadPage.steps.android.happ.appInstallation.description",
          ),
          content: [
            {
              url: "https://play.google.com/store/apps/details?id=com.happproxy",
              label: t(
                "downloadPage.steps.android.happ.appInstallation.links.googlePlay",
              ),
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://github.com/Happ-proxy/happ-android/releases/latest/download/Happ.apk",
              label: t(
                "downloadPage.steps.android.happ.appInstallation.links.downloadApk",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.android.happ.addSubscription.title"),
          description: t(
            "downloadPage.steps.android.happ.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl("happ://add/{{SUBSCRIPTION_LINK}}"),
              label: t(
                "downloadPage.steps.android.happ.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.android.happ.connectionUsage.title"),
          description: t(
            "downloadPage.steps.android.happ.connectionUsage.description",
          ),
          content: [],
        },
      ],
      [VpnClient.FlClashX]: [
        {
          title: t(
            "downloadPage.steps.android.flclashx.appInstallation.title",
          ),
          description: t(
            "downloadPage.steps.android.flclashx.appInstallation.description",
          ),
          content: [
            {
              url: "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClashX-android-universal.apk",
              label: t(
                "downloadPage.steps.android.flclashx.appInstallation.links.downloadApk",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t(
            "downloadPage.steps.android.flclashx.addSubscription.title",
          ),
          description: t(
            "downloadPage.steps.android.flclashx.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl(
                "flclashx://install-config?url={{SUBSCRIPTION_LINK}}",
              ),
              label: t(
                "downloadPage.steps.android.flclashx.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.android.flclashx.manual.title"),
          description: t(
            "downloadPage.steps.android.flclashx.manual.description",
          ),
          content: [],
        },
        {
          title: t(
            "downloadPage.steps.android.flclashx.connectionUsage.title",
          ),
          description: t(
            "downloadPage.steps.android.flclashx.connectionUsage.description",
          ),
          content: [],
        },
      ],
      [VpnClient.ClashMeta]: [
        {
          title: t(
            "downloadPage.steps.android.clashMeta.appInstallation.title",
          ),
          description: t(
            "downloadPage.steps.android.clashMeta.appInstallation.description",
          ),
          content: [
            {
              url: "https://github.com/MetaCubeX/ClashMetaForAndroid/releases/download/v2.11.20/cmfa-2.11.20-meta-universal-release.apk",
              label: t(
                "downloadPage.steps.android.clashMeta.appInstallation.links.downloadApk",
              ),
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://f-droid.org/packages/com.github.metacubex.clash.meta/",
              label: t(
                "downloadPage.steps.android.clashMeta.appInstallation.links.fDroid",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t(
            "downloadPage.steps.android.clashMeta.addSubscription.title",
          ),
          description: t(
            "downloadPage.steps.android.clashMeta.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl(
                "clashmeta://install-config?name={{USERNAME}}&url={{SUBSCRIPTION_LINK}}",
              ),
              label: t(
                "downloadPage.steps.android.clashMeta.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t(
            "downloadPage.steps.android.clashMeta.connectionUsage.title",
          ),
          description: t(
            "downloadPage.steps.android.clashMeta.connectionUsage.description",
          ),
          content: [],
        },
      ],
      [VpnClient.V2rayNg]: [
        {
          title: t("downloadPage.steps.android.v2rayNg.appInstallation.title"),
          description: t(
            "downloadPage.steps.android.v2rayNg.appInstallation.description",
          ),
          content: [
            {
              url: "https://github.com/2dust/v2rayNG/releases/download/1.10.31/v2rayNG_1.10.31_universal.apk",
              label: t(
                "downloadPage.steps.android.v2rayNg.appInstallation.links.downloadApk",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.android.v2rayNg.addSubscription.title"),
          description: t(
            "downloadPage.steps.android.v2rayNg.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl(
                "v2rayng://install-config?name={{USERNAME}}&url={{SUBSCRIPTION_LINK}}",
              ),
              label: t(
                "downloadPage.steps.android.v2rayNg.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.android.v2rayNg.update.title"),
          description: t("downloadPage.steps.android.v2rayNg.update.description"),
          content: [],
        },
        {
          title: t(
            "downloadPage.steps.android.v2rayNg.connectionUsage.title",
          ),
          description: t(
            "downloadPage.steps.android.v2rayNg.connectionUsage.description",
          ),
          content: [],
        },
      ],
    },
    [Platform.Linux]: {
      [VpnClient.FlClashX]: [
        {
          title: t(
            "downloadPage.steps.linux.flclashx.appInstallation.title",
          ),
          description: t(
            "downloadPage.steps.linux.flclashx.appInstallation.description",
          ),
          content: [
            {
              url: "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClashX-linux-amd64.deb",
              label: "amd64 (.deb)",
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClashX-linux-amd64.AppImage",
              label: "amd64 (AppImage)",
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClashX-linux-amd64.rpm",
              label: "amd64 (.rpm)",
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClashX-linux-arm64.deb",
              label: "arm64 (.deb)",
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t(
            "downloadPage.steps.linux.flclashx.addSubscription.title",
          ),
          description: t(
            "downloadPage.steps.linux.flclashx.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl(
                "flclashx://install-config?url={{SUBSCRIPTION_LINK}}",
              ),
              label: t(
                "downloadPage.steps.linux.flclashx.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.linux.flclashx.manual.title"),
          description: t(
            "downloadPage.steps.linux.flclashx.manual.description",
          ),
          content: [],
        },
        {
          title: t(
            "downloadPage.steps.linux.flclashx.connectionUsage.title",
          ),
          description: t(
            "downloadPage.steps.linux.flclashx.connectionUsage.description",
          ),
          content: [],
        },
      ],
      [VpnClient.KoalaClash]: [
        {
          title: t(
            "downloadPage.steps.linux.koalaClash.appInstallation.title",
          ),
          description: t(
            "downloadPage.steps.linux.koalaClash.appInstallation.description",
          ),
          content: [
            {
              url: "https://github.com/coolcoala/clash-verge-rev-lite/releases/latest/download/Koala.Clash_amd64.deb",
              label: "amd64 (.deb)",
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://github.com/coolcoala/clash-verge-rev-lite/releases/latest/download/Koala.Clash.x86_64.rpm",
              label: "amd64 (.rpm)",
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://github.com/coolcoala/clash-verge-rev-lite/releases/latest/download/Koala.Clash_arm64.deb",
              label: "arm64 (.deb)",
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://github.com/coolcoala/clash-verge-rev-lite/releases/latest/download/Koala.Clash.aarch64.rpm",
              label: "arm64 (.rpm)",
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.linux.koalaClash.warning.title"),
          description: t(
            "downloadPage.steps.linux.koalaClash.warning.description",
          ),
          content: [],
        },
        {
          title: t(
            "downloadPage.steps.linux.koalaClash.addSubscription.title",
          ),
          description: t(
            "downloadPage.steps.linux.koalaClash.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl(
                "koala-clash://install-config?url={{SUBSCRIPTION_LINK}}",
              ),
              label: t(
                "downloadPage.steps.linux.koalaClash.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.linux.koalaClash.manual.title"),
          description: t(
            "downloadPage.steps.linux.koalaClash.manual.description",
          ),
          content: [],
        },
        {
          title: t(
            "downloadPage.steps.linux.koalaClash.connectionUsage.title",
          ),
          description: t(
            "downloadPage.steps.linux.koalaClash.connectionUsage.description",
          ),
          content: [],
        },
      ],
      [VpnClient.PrizrakBox]: [
        {
          title: t(
            "downloadPage.steps.linux.prizrakBox.appInstallation.title",
          ),
          description: t(
            "downloadPage.steps.linux.prizrakBox.appInstallation.description",
          ),
          content: [
            {
              url: "https://github.com/legiz-ru/Prizrak-Box/releases/latest/download/linux-amd64.deb",
              label: "amd64 (.deb)",
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://github.com/legiz-ru/Prizrak-Box/releases/latest/download/linux-amd64.rpm",
              label: "amd64 (.rpm)",
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://github.com/legiz-ru/Prizrak-Box/releases/latest/download/linux-arm64.deb",
              label: "arm64 (.deb)",
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://github.com/legiz-ru/Prizrak-Box/releases/latest/download/linux-arm64.rpm",
              label: "arm64 (.rpm)",
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.linux.prizrakBox.warning.title"),
          description: t(
            "downloadPage.steps.linux.prizrakBox.warning.description",
          ),
          content: [],
        },
        {
          title: t(
            "downloadPage.steps.linux.prizrakBox.addSubscription.title",
          ),
          description: t(
            "downloadPage.steps.linux.prizrakBox.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl(
                "prizrak-box://install-config?url={{SUBSCRIPTION_LINK}}",
              ),
              label: t(
                "downloadPage.steps.linux.prizrakBox.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.linux.prizrakBox.manual.title"),
          description: t(
            "downloadPage.steps.linux.prizrakBox.manual.description",
          ),
          content: [],
        },
        {
          title: t(
            "downloadPage.steps.linux.prizrakBox.connectionUsage.title",
          ),
          description: t(
            "downloadPage.steps.linux.prizrakBox.connectionUsage.description",
          ),
          content: [],
        },
      ],
    },
    [Platform.Macos]: {
      [VpnClient.Happ]: [
        {
          title: t("downloadPage.steps.macos.happ.appInstallation.title"),
          description: t(
            "downloadPage.steps.macos.happ.appInstallation.description",
          ),
          content: [
            {
              url: "https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973",
              label: t(
                "downloadPage.steps.macos.happ.appInstallation.links.appStoreRu",
              ),
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://apps.apple.com/us/app/happ-proxy-utility/id6504287215",
              label: t(
                "downloadPage.steps.macos.happ.appInstallation.links.appStoreGlobal",
              ),
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
              url: formatSubscriptionUrl("happ://add/{{SUBSCRIPTION_LINK}}"),
              label: t(
                "downloadPage.steps.macos.happ.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.macos.happ.connectionUsage.title"),
          description: t(
            "downloadPage.steps.macos.happ.connectionUsage.description",
          ),
          content: [],
        },
      ],
      [VpnClient.FlClashX]: [
        {
          title: t("downloadPage.steps.macos.flclashx.appInstallation.title"),
          description: t(
            "downloadPage.steps.macos.flclashx.appInstallation.description",
          ),
          content: [
            {
              url: "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClashX-macos-arm64.dmg",
              label: t(
                "downloadPage.steps.macos.flclashx.appInstallation.links.appleSilicon",
              ),
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClashX-macos-amd64.dmg",
              label: t(
                "downloadPage.steps.macos.flclashx.appInstallation.links.intel",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.macos.flclashx.addSubscription.title"),
          description: t(
            "downloadPage.steps.macos.flclashx.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl(
                "flclashx://install-config?url={{SUBSCRIPTION_LINK}}",
              ),
              label: t(
                "downloadPage.steps.macos.flclashx.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.macos.flclashx.manual.title"),
          description: t(
            "downloadPage.steps.macos.flclashx.manual.description",
          ),
          content: [],
        },
        {
          title: t("downloadPage.steps.macos.flclashx.connectionUsage.title"),
          description: t(
            "downloadPage.steps.macos.flclashx.connectionUsage.description",
          ),
          content: [],
        },
      ],
      [VpnClient.KoalaClash]: [
        {
          title: t(
            "downloadPage.steps.macos.koalaClash.appInstallation.title",
          ),
          description: t(
            "downloadPage.steps.macos.koalaClash.appInstallation.description",
          ),
          content: [
            {
              url: "https://github.com/coolcoala/clash-verge-rev-lite/releases/latest/download/Koala.Clash_aarch64.dmg",
              label: t(
                "downloadPage.steps.macos.koalaClash.appInstallation.links.appleSilicon",
              ),
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://github.com/coolcoala/clash-verge-rev-lite/releases/latest/download/Koala.Clash_x64.dmg",
              label: t(
                "downloadPage.steps.macos.koalaClash.appInstallation.links.intel",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.macos.koalaClash.warning.title"),
          description: t(
            "downloadPage.steps.macos.koalaClash.warning.description",
          ),
          content: [],
        },
        {
          title: t(
            "downloadPage.steps.macos.koalaClash.addSubscription.title",
          ),
          description: t(
            "downloadPage.steps.macos.koalaClash.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl(
                "koala-clash://install-config?url={{SUBSCRIPTION_LINK}}",
              ),
              label: t(
                "downloadPage.steps.macos.koalaClash.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.macos.koalaClash.manual.title"),
          description: t(
            "downloadPage.steps.macos.koalaClash.manual.description",
          ),
          content: [],
        },
        {
          title: t(
            "downloadPage.steps.macos.koalaClash.connectionUsage.title",
          ),
          description: t(
            "downloadPage.steps.macos.koalaClash.connectionUsage.description",
          ),
          content: [],
        },
      ],
      [VpnClient.PrizrakBox]: [
        {
          title: t(
            "downloadPage.steps.macos.prizrakBox.appInstallation.title",
          ),
          description: t(
            "downloadPage.steps.macos.prizrakBox.appInstallation.description",
          ),
          content: [
            {
              url: "https://github.com/legiz-ru/Prizrak-Box/releases/latest/download/macos-arm64-dmg.zip",
              label: t(
                "downloadPage.steps.macos.prizrakBox.appInstallation.links.appleSilicon",
              ),
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://github.com/legiz-ru/Prizrak-Box/releases/latest/download/macos-amd64-dmg.zip",
              label: t(
                "downloadPage.steps.macos.prizrakBox.appInstallation.links.intel",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.macos.prizrakBox.warning.title"),
          description: t(
            "downloadPage.steps.macos.prizrakBox.warning.description",
          ),
          content: [
            {
              url: "https://github.com/legiz-ru/Prizrak-Box/blob/v3/doc/mac/mac.md",
              label: t(
                "downloadPage.steps.macos.prizrakBox.warning.links.macGuide",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t(
            "downloadPage.steps.macos.prizrakBox.addSubscription.title",
          ),
          description: t(
            "downloadPage.steps.macos.prizrakBox.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl(
                "prizrak-box://install-config?url={{SUBSCRIPTION_LINK}}",
              ),
              label: t(
                "downloadPage.steps.macos.prizrakBox.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.macos.prizrakBox.manual.title"),
          description: t(
            "downloadPage.steps.macos.prizrakBox.manual.description",
          ),
          content: [],
        },
        {
          title: t(
            "downloadPage.steps.macos.prizrakBox.connectionUsage.title",
          ),
          description: t(
            "downloadPage.steps.macos.prizrakBox.connectionUsage.description",
          ),
          content: [],
        },
      ],
    },
    [Platform.Windows]: {
      [VpnClient.FlClashX]: [
        {
          title: t("downloadPage.steps.windows.flclashx.appInstallation.title"),
          description: t(
            "downloadPage.steps.windows.flclashx.appInstallation.description",
          ),
          content: [
            {
              url: "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClashX-windows-amd64-setup.exe",
              label: t(
                "downloadPage.steps.windows.flclashx.appInstallation.links.setup",
              ),
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClashX-windows-arm64-setup.exe",
              label: t(
                "downloadPage.steps.windows.flclashx.appInstallation.links.armSetup",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.windows.flclashx.addSubscription.title"),
          description: t(
            "downloadPage.steps.windows.flclashx.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl(
                "flclashx://install-config?url={{SUBSCRIPTION_LINK}}",
              ),
              label: t(
                "downloadPage.steps.windows.flclashx.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.windows.flclashx.manual.title"),
          description: t(
            "downloadPage.steps.windows.flclashx.manual.description",
          ),
          content: [],
        },
        {
          title: t("downloadPage.steps.windows.flclashx.connectionUsage.title"),
          description: t(
            "downloadPage.steps.windows.flclashx.connectionUsage.description",
          ),
          content: [],
        },
      ],
      [VpnClient.KoalaClash]: [
        {
          title: t(
            "downloadPage.steps.windows.koalaClash.appInstallation.title",
          ),
          description: t(
            "downloadPage.steps.windows.koalaClash.appInstallation.description",
          ),
          content: [
            {
              url: "https://github.com/coolcoala/clash-verge-rev-lite/releases/latest/download/Koala.Clash_x64-setup.exe",
              label: t(
                "downloadPage.steps.windows.koalaClash.appInstallation.links.setup",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.windows.koalaClash.warning.title"),
          description: t(
            "downloadPage.steps.windows.koalaClash.warning.description",
          ),
          content: [],
        },
        {
          title: t(
            "downloadPage.steps.windows.koalaClash.addSubscription.title",
          ),
          description: t(
            "downloadPage.steps.windows.koalaClash.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl(
                "koala-clash://install-config?url={{SUBSCRIPTION_LINK}}",
              ),
              label: t(
                "downloadPage.steps.windows.koalaClash.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.windows.koalaClash.manual.title"),
          description: t(
            "downloadPage.steps.windows.koalaClash.manual.description",
          ),
          content: [],
        },
        {
          title: t(
            "downloadPage.steps.windows.koalaClash.connectionUsage.title",
          ),
          description: t(
            "downloadPage.steps.windows.koalaClash.connectionUsage.description",
          ),
          content: [],
        },
      ],
      [VpnClient.PrizrakBox]: [
        {
          title: t(
            "downloadPage.steps.windows.prizrakBox.appInstallation.title",
          ),
          description: t(
            "downloadPage.steps.windows.prizrakBox.appInstallation.description",
          ),
          content: [
            {
              url: "https://github.com/legiz-ru/Prizrak-Box/releases/latest/download/windows-amd64.msi",
              label: t(
                "downloadPage.steps.windows.prizrakBox.appInstallation.links.setup",
              ),
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://github.com/legiz-ru/Prizrak-Box/releases/latest/download/windows-arm64.msi",
              label: t(
                "downloadPage.steps.windows.prizrakBox.appInstallation.links.armSetup",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.windows.prizrakBox.warning.title"),
          description: t(
            "downloadPage.steps.windows.prizrakBox.warning.description",
          ),
          content: [],
        },
        {
          title: t(
            "downloadPage.steps.windows.prizrakBox.addSubscription.title",
          ),
          description: t(
            "downloadPage.steps.windows.prizrakBox.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl(
                "prizrak-box://install-config?url={{SUBSCRIPTION_LINK}}",
              ),
              label: t(
                "downloadPage.steps.windows.prizrakBox.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.windows.prizrakBox.manual.title"),
          description: t(
            "downloadPage.steps.windows.prizrakBox.manual.description",
          ),
          content: [],
        },
        {
          title: t(
            "downloadPage.steps.windows.prizrakBox.connectionUsage.title",
          ),
          description: t(
            "downloadPage.steps.windows.prizrakBox.connectionUsage.description",
          ),
          content: [],
        },
      ],
      [VpnClient.Happ]: [
        {
          title: t("downloadPage.steps.windows.happ.appInstallation.title"),
          description: t(
            "downloadPage.steps.windows.happ.appInstallation.description",
          ),
          content: [
            {
              url: "https://github.com/Happ-proxy/happ-desktop/releases/latest/download/setup-Happ.x64.exe",
              label: t(
                "downloadPage.steps.windows.happ.appInstallation.links.windows",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.windows.happ.addSubscription.title"),
          description: t(
            "downloadPage.steps.windows.happ.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl("happ://add/{{SUBSCRIPTION_LINK}}"),
              label: t(
                "downloadPage.steps.windows.happ.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.windows.happ.connectionUsage.title"),
          description: t(
            "downloadPage.steps.windows.happ.connectionUsage.description",
          ),
          content: [],
        },
      ],
    },
    [Platform.AndroidTv]: {
      [VpnClient.Happ]: [
        {
          title: t("downloadPage.steps.androidTv.happ.appInstallation.title"),
          description: t(
            "downloadPage.steps.androidTv.happ.appInstallation.description",
          ),
          content: [
            {
              url: "https://play.google.com/store/apps/details?id=com.happproxy",
              label: t(
                "downloadPage.steps.androidTv.happ.appInstallation.links.googlePlay",
              ),
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://github.com/Happ-proxy/happ-android/releases/latest/download/Happ.apk",
              label: t(
                "downloadPage.steps.androidTv.happ.appInstallation.links.downloadApk",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.androidTv.happ.instructions.title"),
          description: t(
            "downloadPage.steps.androidTv.happ.instructions.description",
          ),
          content: [
            {
              url: "https://www.happ.su/main/ru/faq/android-tv",
              label: t(
                "downloadPage.steps.androidTv.happ.instructions.links.russian",
              ),
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://www.happ.su/main/faq/android-tv",
              label: t(
                "downloadPage.steps.androidTv.happ.instructions.links.english",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.androidTv.happ.addSubscription.title"),
          description: t(
            "downloadPage.steps.androidTv.happ.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl("happ://add/{{SUBSCRIPTION_LINK}}"),
              label: t(
                "downloadPage.steps.androidTv.happ.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.androidTv.happ.connectionUsage.title"),
          description: t(
            "downloadPage.steps.androidTv.happ.connectionUsage.description",
          ),
          content: [],
        },
      ],
      [VpnClient.Vpn4Tv]: [
        {
          title: t("downloadPage.steps.androidTv.vpn4tv.appInstallation.title"),
          description: t(
            "downloadPage.steps.androidTv.vpn4tv.appInstallation.description",
          ),
          content: [
            {
              url: "https://play.google.com/store/apps/details?id=com.vpn4tv.hiddify",
              label: t(
                "downloadPage.steps.androidTv.vpn4tv.appInstallation.links.googlePlay",
              ),
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://vpn4tv.com/download/vpn4tv.apk",
              label: t(
                "downloadPage.steps.androidTv.vpn4tv.appInstallation.links.downloadApk",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.androidTv.vpn4tv.instructions.title"),
          description: t(
            "downloadPage.steps.androidTv.vpn4tv.instructions.description",
          ),
          content: [
            {
              url: "https://vpn4tv.com/quick-guide.html",
              label: t(
                "downloadPage.steps.androidTv.vpn4tv.instructions.links.quickGuide",
              ),
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://vpn4tv.com/sber.html",
              label: t(
                "downloadPage.steps.androidTv.vpn4tv.instructions.links.sberBoxGuide",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.androidTv.vpn4tv.addSubscription.title"),
          description: t(
            "downloadPage.steps.androidTv.vpn4tv.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl(
                "hiddify://import/{{SUBSCRIPTION_LINK}}",
              ),
              label: t(
                "downloadPage.steps.androidTv.vpn4tv.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.androidTv.vpn4tv.connectionUsage.title"),
          description: t(
            "downloadPage.steps.androidTv.vpn4tv.connectionUsage.description",
          ),
          content: [],
        },
      ],
    },
    [Platform.AppleTv]: {
      [VpnClient.Happ]: [
        {
          title: t("downloadPage.steps.appleTv.happ.appInstallation.title"),
          description: t(
            "downloadPage.steps.appleTv.happ.appInstallation.description",
          ),
          content: [
            {
              url: "https://apps.apple.com/us/app/happ-proxy-utility-for-tv/id6748297274",
              label: t(
                "downloadPage.steps.appleTv.happ.appInstallation.links.appStore",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.appleTv.happ.instructions.title"),
          description: t(
            "downloadPage.steps.appleTv.happ.instructions.description",
          ),
          content: [
            {
              url: "https://www.happ.su/main/ru/faq/android-tv",
              label: t(
                "downloadPage.steps.appleTv.happ.instructions.links.russian",
              ),
              icon: SquareArrowOutUpRight,
            },
            {
              url: "https://www.happ.su/main/faq/android-tv",
              label: t(
                "downloadPage.steps.appleTv.happ.instructions.links.english",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.appleTv.happ.addSubscription.title"),
          description: t(
            "downloadPage.steps.appleTv.happ.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl("happ://add/{{SUBSCRIPTION_LINK}}"),
              label: t(
                "downloadPage.steps.appleTv.happ.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.appleTv.happ.connectionUsage.title"),
          description: t(
            "downloadPage.steps.appleTv.happ.connectionUsage.description",
          ),
          content: [],
        },
      ],
      [VpnClient.Shadowrocket]: [
        {
          title: t(
            "downloadPage.steps.appleTv.shadowrocket.appInstallation.title",
          ),
          description: t(
            "downloadPage.steps.appleTv.shadowrocket.appInstallation.description",
          ),
          content: [
            {
              url: "https://apps.apple.com/ru/app/shadowrocket/id932747118",
              label: t(
                "downloadPage.steps.appleTv.shadowrocket.appInstallation.links.appStore",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t(
            "downloadPage.steps.appleTv.shadowrocket.addSubscription.title",
          ),
          description: t(
            "downloadPage.steps.appleTv.shadowrocket.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl(
                "shadowrocket://add/{{SUBSCRIPTION_LINK}}#{{USERNAME}}",
              ),
              label: t(
                "downloadPage.steps.appleTv.shadowrocket.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t(
            "downloadPage.steps.appleTv.shadowrocket.connectionUsage.title",
          ),
          description: t(
            "downloadPage.steps.appleTv.shadowrocket.connectionUsage.description",
          ),
          content: [],
        },
      ],
      [VpnClient.Stash]: [
        {
          title: t("downloadPage.steps.appleTv.stash.appInstallation.title"),
          description: t(
            "downloadPage.steps.appleTv.stash.appInstallation.description",
          ),
          content: [
            {
              url: "https://apps.apple.com/us/app/stash-rule-based-proxy/id1596063349",
              label: t(
                "downloadPage.steps.appleTv.stash.appInstallation.links.appStore",
              ),
              icon: SquareArrowOutUpRight,
            },
          ],
        },
        {
          title: t("downloadPage.steps.appleTv.stash.addSubscription.title"),
          description: t(
            "downloadPage.steps.appleTv.stash.addSubscription.description",
          ),
          content: [
            {
              url: formatSubscriptionUrl(
                "stash://install-config?url={{SUBSCRIPTION_LINK}}",
              ),
              label: t(
                "downloadPage.steps.appleTv.stash.addSubscription.links.addSubscription",
              ),
              icon: Plus,
            },
          ],
        },
        {
          title: t("downloadPage.steps.appleTv.stash.connectionUsage.title"),
          description: t(
            "downloadPage.steps.appleTv.stash.connectionUsage.description",
          ),
          content: [],
        },
      ],
    },
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

  const [vpnClient, setVpnClient] = createSignal<VpnClient>(
    vpnClientOptions()[0].value,
  );

  const selectedVpnClient = createMemo(
    () =>
      vpnClientOptions().find((option) => option.value === vpnClient()) ??
      vpnClientOptions()[0],
  );

  const steps = createMemo(
    () => config()[platform()][selectedVpnClient().value] ?? [],
  );

  const handlePlatformChange = (value: PlatformOption | null) => {
    if (!value) {
      return;
    }

    setPlatform(value.value);

    setVpnClient(vpnClientOptionsByPlatform[value.value][0].value);
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
                    value={selectedVpnClient()}
                    onChange={(value) => value && setVpnClient(value.value)}
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
