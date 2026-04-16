<script setup lang="ts">
import type { ProgressProps } from "@bitrix24/b24ui-nuxt";
import type { IStep } from "#shared/types/base";
import type { B24Frame } from "@bitrix24/b24jssdk";
import { ref, onMounted } from "vue";
import { sleepAction } from "~/utils/sleep";
import { withoutTrailingSlash } from "ufo";
import Logo from "~/components/Logo.vue";
import { useInstallationStore } from "~/stores/installation";

definePageMeta({
  layout: "install",
});

const { t } = useI18n();

useHead(() => ({
  title: t("page.install.seo.title"),
}));

// region Init ////
const config = useRuntimeConfig();
const appUrl = withoutTrailingSlash(config.public.appUrl);

const { $logger, processErrorGlobal } = useAppInit("Install");
const { $initializeB24Frame } = useNuxtApp();
const $b24: B24Frame = await $initializeB24Frame();

const confetti = useConfetti();

const isShowDebug = ref(false);

const progressColor = ref<ProgressProps["color"]>("air-primary");
const progressValue = ref<null | number>(null);

const installationStore = useInstallationStore();
// endregion ////

// region Steps ////
const steps = ref<Record<string, IStep>>({
  init: {
    caption: t("page.install.steps.init.caption"),
    action: makeInit,
  },
  demo: {
    caption: t("page.install.steps.demo.caption"),
    action: async () => {
      return sleepAction(1000);
    },
  },
  // events: {
  //   caption: t('page.install.steps.events.caption'),
  //   action: async () => {
  //     /**
  //      * Registering onAppInstall | onAppUninstall
  //      */
  //     await $b24.callBatch([
  //       {
  //         method: 'event.unbind',
  //         params: {
  //           event: 'ONAPPINSTALL',
  //           handler: `${appUrl}/api/event/onAppInstall`
  //         }
  //       },
  //       {
  //         method: 'event.unbind',
  //         params: {
  //           event: 'ONAPPUNINSTALL',
  //           handler: `${appUrl}/api/event/onAppUninstall`
  //         }
  //       },
  //       {
  //         method: 'event.bind',
  //         params: {
  //           event: 'ONAPPINSTALL',
  //           handler: `${appUrl}/api/event/onAppInstall`
  //         }
  //       },
  //       {
  //         method: 'event.bind',
  //         params: {
  //           event: 'ONAPPUNINSTALL',
  //           handler: `${appUrl}/api/event/onAppUninstall`
  //         }
  //       }
  //     ])
  //   }
  // },
  placement: {
    caption: t("page.install.steps.placement.caption"),
    action: async () => {
      const key = {
        placement: "CRM_DEAL_DETAIL_TAB",
        handler: `${appUrl}/handler/placement-crm-deal-detail-tab`,
      };
      const exists = (
        steps.value.init?.data?.placementList as {
          placement: string;
          handler: string;
        }[]
      ).some(
        (item) =>
          item.placement === key.placement && item.handler === key.handler,
      );
      if (exists) {
        await $b24.callBatch([
          {
            method: "placement.unbind",
            params: {
              PLACEMENT: key.placement,
            },
          },
          {
            method: "placement.bind",
            params: {
              PLACEMENT: key.placement,
              HANDLER: key.handler,
              TITLE: "[demo] Some Tab",
              OPTIONS: {
                errorHandlerUrl: `${appUrl}/handler/background-some-problem`,
              },
            },
          },
        ]);

        return;
      }

      await $b24.callBatch([
        {
          method: "placement.bind",
          params: {
            PLACEMENT: key.placement,
            HANDLER: key.handler,
            TITLE: "[demo] Some Tab",
            OPTIONS: {
              errorHandlerUrl: `${appUrl}/handler/background-some-problem`,
            },
          },
        },
      ]);
    },
  },
  userFields: {
    caption: t("page.install.steps.userFields.caption"),
    action: async () => {
      const typeId = `some_type_${import.meta.dev ? "dev" : "prod"}`;

      const exists = (
        steps.value.init?.data?.userFieldTypeList as { USER_TYPE_ID: string }[]
      ).some((item) => item.USER_TYPE_ID === typeId);
      if (exists) {
        await $b24.callBatch(
          [
            {
              method: "userfieldtype.update",
              params: {
                USER_TYPE_ID: typeId,
                HANDLER: `${appUrl}/handler/uf.demo`,
                TITLE: `[${import.meta.dev ? "dev" : "prod"}] Some Type`,
                DESCRIPTION: `Some Description`,
                OPTIONS: {
                  height: 105,
                },
              },
            },
          ],
          false,
        );

        return;
      }

      await $b24.callBatch(
        [
          {
            method: "userfieldtype.add",
            params: {
              USER_TYPE_ID: typeId,
              HANDLER: `${appUrl}/handler/uf.demo`,
              TITLE: `[${import.meta.dev ? "dev" : "prod"}] Some Type`,
              DESCRIPTION: `Some Description`,
              OPTIONS: {
                height: 105,
              },
            },
          },
        ],
        false,
      );
    },
  },
  // crm: {
  //   caption: t('page.install.steps.crm.caption'),
  //   action: async () => {
  //     /**
  //      * Some actions for crm
  //      */
  //     if (steps.value.crm) {
  //       steps.value.crm.data = {
  //         par31: 'val31',
  //         par32: 'val32'
  //       }
  //     }
  //     return sleepAction()
  //   }
  // },
  serverSide: {
    caption: t("page.install.steps.serverSide.caption"),
    action: async () => {
      const authData = $b24.auth.getAuthData();

      if (authData === false) {
        throw new Error("Some problem with auth. See App logic");
      }
      await installationStore.postInstall({
        accessToken: authData.access_token,
        refreshToken: authData.refresh_token,
        expires: Number(authData.expires ?? 0),
        expiresIn: Number(authData.expires_in ?? 0),
        domain: authData.domain,
        memberId: authData.member_id,
      });
    },
  },
  finish: {
    caption: t("page.install.steps.finish.caption"),
    action: makeFinish,
  },
});
const stepCode = ref<string>("init" as const);

const stepCaptionKeyByCode: Record<string, string> = {
  init: "page.install.steps.init.caption",
  demo: "page.install.steps.demo.caption",
  placement: "page.install.steps.placement.caption",
  userFields: "page.install.steps.userFields.caption",
  serverSide: "page.install.steps.serverSide.caption",
  finish: "page.install.steps.finish.caption",
};

const currentStepCaption = computed(() => {
  const key = stepCaptionKeyByCode[stepCode.value];

  return key ? t(key) : "...";
});
// endregion ////

// region Actions ////
async function makeInit(): Promise<void> {
  if (steps.value.init) {
    const response = await $b24.callBatch({
      appInfo: { method: "app.info" },
      profile: { method: "profile" },
      userFieldTypeList: { method: "userfieldtype.list" },
      placementList: { method: "placement.get" },
    });

    steps.value.init.data = response.getData() as {
      appInfo: {
        ID: number;
        CODE: string;
        VERSION: string;
        STATUS: string;
        LICENSE: string;
        LICENSE_FAMILY: string;
        INSTALLED: boolean;
      };
      profile: {
        ID: number;
        ADMIN: boolean;
        LAST_NAME?: string;
        NAME?: string;
      };
      userFieldTypeList: {
        USER_TYPE_ID: string;
        HANDLER: string;
        TITLE: string;
        DESCRIPTION: string;
      }[];
      placementList: {
        placement: string;
        userId: number;
        handler: string;
        options: any;
        title: string;
        description: string;
      }[];
    };
  }
}

async function makeFinish(): Promise<void> {
  progressColor.value = "air-primary-success";
  progressValue.value = 100;

  confetti.fire();
  await sleepAction(3000);

  await $b24.installFinish();
}

const stepsData = computed(() => {
  return Object.entries(steps.value).map(([index, row]) => {
    return {
      step: index,
      data: row?.data,
    };
  });
});
// endregion ////

// region Lifecycle Hooks ////
onMounted(async () => {
  $logger.info("Hi from install page");

  try {
    await $b24.parent.setTitle(t("page.install.seo.title"));

    for (const [key, step] of Object.entries(steps.value)) {
      stepCode.value = key;
      await step.action();
    }
  } catch (error: any) {
    processErrorGlobal(error);
  }
});
// endregion ////
</script>

<template>
  <div class="mx-3 flex flex-col items-center justify-center gap-1 h-dvh">
    <Logo
      class="size-[208px]"
      :class="[
        stepCode === 'finish'
          ? 'text-(--ui-color-accent-main-success)'
          : 'text-(--ui-color-accent-soft-green-1)',
      ]"
    />
    <B24Progress
      v-model="progressValue"
      size="xs"
      animation="elastic"
      :color="progressColor"
      class="w-1/2 sm:w-1/3"
    />
    <div class="mt-6 flex flex-col items-center justify-center gap-2">
      <ProseH1 class="text-nowrap mb-0">
        {{ $t("page.install.header.title") }}
      </ProseH1>
      <ProseP small accent="less">
        {{ currentStepCaption }}
      </ProseP>
    </div>

    <ProsePre v-if="isShowDebug">
      {{ stepsData }}
    </ProsePre>
  </div>
</template>
