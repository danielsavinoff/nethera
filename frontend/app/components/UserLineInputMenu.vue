<script>
import theme from "#build/b24ui/input-menu";
</script>

<script setup>
/* eslint-disable vue/require-default-prop */
import {
  computed,
  nextTick,
  onMounted,
  ref,
  toRaw,
  toRef,
  useTemplateRef,
  watch,
} from "vue";
import {
  ComboboxAnchor,
  ComboboxArrow,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxVirtualizer,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
  TagsInputRoot,
  useFilter,
  useForwardPropsEmits,
} from "reka-ui";
import { defu } from "defu";
import { isEqual } from "ohash/utils";
import { storeToRefs } from "pinia";
import {
  createReusableTemplate,
  reactivePick,
  useDebounceFn,
  useInfiniteScroll,
} from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useFieldGroup } from "@bitrix24/b24ui-nuxt/composables/useFieldGroup";
import { useComponentIcons } from "@bitrix24/b24ui-nuxt/composables/useComponentIcons";
import { useFormField } from "@bitrix24/b24ui-nuxt/composables/useFormField";
import { useLocale } from "@bitrix24/b24ui-nuxt/composables/useLocale";
import { usePortal } from "@bitrix24/b24ui-nuxt/composables/usePortal";
import {
  compare,
  get,
  getDisplayValue,
  isArrayOfArray,
} from "@bitrix24/b24ui-nuxt/utils";
import { getEstimateSize } from "@bitrix24/b24ui-nuxt/utils/virtualizer";
import { tv } from "@bitrix24/b24ui-nuxt/utils/tv";
import HeartIcon from "@bitrix24/b24icons-vue/outline/HeartIcon";
import SearchIcon from "@bitrix24/b24icons-vue/outline/SearchIcon";
import ThreePersonsIcon from "@bitrix24/b24icons-vue/outline/ThreePersonsIcon";
import icons from "@bitrix24/b24ui-nuxt/runtime/dictionary/icons.js";
import B24Avatar from "@bitrix24/b24ui-nuxt/components/Avatar.vue";
import B24Badge from "@bitrix24/b24ui-nuxt/components/Badge.vue";
import B24Chip from "@bitrix24/b24ui-nuxt/components/Chip.vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  as: { type: null, required: false },
  id: { type: String, required: false },
  type: { type: null, required: false, default: "text" },
  placeholder: { type: String, required: false },
  color: { type: null, required: false },
  size: { type: null, required: false },
  noBorder: { type: Boolean, required: false },
  underline: { type: Boolean, required: false },
  rounded: { type: Boolean, required: false },
  required: { type: Boolean, required: false },
  autofocus: { type: Boolean, required: false },
  autofocusDelay: { type: Number, required: false, default: 0 },
  trailingIcon: { type: [Function, Object], required: false },
  selectedIcon: { type: [Function, Object], required: false },
  deleteIcon: { type: [Function, Object], required: false },
  content: { type: Object, required: false },
  arrow: { type: [Boolean, Object], required: false },
  portal: {
    type: [Boolean, String],
    required: false,
    skipCheck: true,
    default: true,
  },
  virtualize: { type: [Boolean, Object], required: false, default: false },
  valueKey: { type: null, required: false },
  labelKey: { type: null, required: false, default: "label" },
  descriptionKey: {
    type: null,
    required: false,
    default: "description",
  },
  items: { type: null, required: false },
  defaultValue: { type: null, required: false },
  modelValue: { type: null, required: false },
  multiple: { type: Boolean, required: false },
  tag: { type: String, required: false },
  tagColor: { type: null, required: false },
  highlight: { type: Boolean, required: false },
  createItem: { type: [Boolean, String, Object], required: false },
  filterFields: { type: Array, required: false },
  ignoreFilter: { type: Boolean, required: false },
  class: { type: null, required: false },
  b24ui: { type: null, required: false },
  open: { type: Boolean, required: false },
  defaultOpen: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
  name: { type: String, required: false },
  resetSearchTermOnBlur: {
    type: Boolean,
    required: false,
    default: true,
  },
  resetSearchTermOnSelect: {
    type: Boolean,
    required: false,
    default: true,
  },
  highlightOnHover: { type: Boolean, required: false },
  openOnClick: { type: Boolean, required: false },
  openOnFocus: { type: Boolean, required: false },
  icon: { type: [Function, Object], required: false },
  avatar: { type: Object, required: false },
  loading: { type: Boolean, required: false },
  hasMore: { type: Boolean, required: false },
  trailing: { type: Boolean, required: false },
  searchState: { type: Object, required: false },
  browseState: { type: Object, required: false },
  loadNextSearch: { type: Function, required: false },
  loadDepartmentUsers: { type: Function, required: false },
  resetSearch: { type: Function, required: false },
});

const emits = defineEmits([
  "update:open",
  "change",
  "blur",
  "focus",
  "create",
  "highlight",
  "load-more",
  "remove-tag",
  "update:modelValue",
]);

const slots = defineSlots();
const searchTerm = defineModel("searchTerm", {
  type: String,
  ...{ default: "" },
});

const { t } = useLocale();
const appConfig = useAppConfig();
const { contains } = useFilter({ sensitivity: "base" });
const favoriteUsersStore = useFavoriteUsersStore();
const {
  favoriteItems: storedFavoriteItems,
  loaded: favoriteUsersLoaded,
  loading: favoriteUsersLoading,
} = storeToRefs(favoriteUsersStore);

const rootProps = useForwardPropsEmits(
  reactivePick(
    props,
    "as",
    "modelValue",
    "defaultValue",
    "open",
    "defaultOpen",
    "required",
    "multiple",
    "resetSearchTermOnBlur",
    "resetSearchTermOnSelect",
    "highlightOnHover",
    "openOnClick",
    "openOnFocus",
  ),
  emits,
);

const portalProps = usePortal(toRef(() => props.portal));
const contentProps = toRef(() =>
  defu(props.content, {
    side: "bottom",
    sideOffset: 8,
    collisionPadding: 8,
    position: "popper",
  }),
);
const arrowProps = toRef(() =>
  defu(typeof props.arrow === "boolean" ? {} : props.arrow, {
    width: 20,
    height: 10,
  }),
);
const virtualizerProps = toRef(() => {
  if (!props.virtualize) {
    return false;
  }

  return defu(typeof props.virtualize === "boolean" ? {} : props.virtualize, {
    estimateSize: getEstimateSize(
      flattenedItems.value,
      inputSize.value || "md",
      props.descriptionKey,
    ),
  });
});

const {
  emitFormBlur,
  emitFormFocus,
  emitFormChange,
  emitFormInput,
  size: formGroupSize,
  color,
  id,
  name,
  highlight,
  disabled,
  ariaAttrs,
} = useFormField(props);
const { orientation, size: fieldGroupSize } = useFieldGroup(props);
const { isLeading, isTrailing, leadingIconName, trailingIconName } =
  useComponentIcons(
    toRef(() =>
      defu(props, {
        trailingIcon: icons.chevronDown,
      }),
    ),
  );

const inputSize = computed(() => fieldGroupSize.value || formGroupSize.value);
const isTag = computed(() => props.tag);

const [DefineCreateItemTemplate, ReuseCreateItemTemplate] =
  createReusableTemplate();
const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate({
  props: {
    item: {
      type: [Object, String, Number, Boolean],
      required: true,
    },
    index: {
      type: Number,
      required: false,
    },
  },
});
const menuTabs = [
  {
    id: "search",
    icon: SearchIcon,
  },
  {
    id: "favorites",
    icon: HeartIcon,
  },
  {
    id: "people",
    icon: ThreePersonsIcon,
  },
];
const activeTab = ref("people");
const hasPickerState = computed(() =>
  Boolean(props.searchState && props.browseState),
);

const b24ui = computed(() =>
  tv({
    extend: tv(theme),
    ...appConfig.b24ui?.inputMenu,
  })({
    color: color.value,
    size: inputSize?.value,
    loading: props.loading,
    highlight: highlight.value,
    rounded: Boolean(props.rounded),
    noBorder: Boolean(props.noBorder),
    underline: Boolean(props.underline),
    leading: Boolean(isLeading.value || !!props.avatar || !!slots.leading),
    trailing: Boolean(isTrailing.value || !!slots.trailing),
    multiple: props.multiple,
    fieldGroup: orientation.value,
    virtualize: !!props.virtualize,
  }),
);

const groups = computed(() =>
  props.items?.length
    ? isArrayOfArray(props.items)
      ? props.items
      : [props.items]
    : [],
);
const normalizedGroups = computed(() => groups.value);
const browseGroups = computed(() => {
  if (!hasPickerState.value) {
    return normalizedGroups.value;
  }

  return props.browseState?.users?.length ? [props.browseState.users] : [];
});
const searchGroups = computed(() => {
  if (!hasPickerState.value) {
    return [];
  }

  return props.searchState?.users?.length ? [props.searchState.users] : [];
});
const flattenedItems = computed(() =>
  normalizedGroups.value.flatMap((group) => group),
);

function getItemValue(item) {
  return props.valueKey && isInputItem(item) ? get(item, props.valueKey) : item;
}

function createFavoriteItem(item) {
  if (!props.valueKey) {
    return item.label;
  }

  return {
    [props.valueKey]: item.id,
    [props.labelKey]: item.label,
  };
}

const favoriteMenuItems = computed(() => {
  const favoriteIds = new Set(
    storedFavoriteItems.value.map((item) => String(item.id)),
  );
  const itemsById = new Map();

  for (const item of flattenedItems.value) {
    const itemValue = getItemValue(item);

    if (itemValue === undefined || itemValue === null) {
      continue;
    }

    const favoriteId = String(itemValue);

    if (!favoriteIds.has(favoriteId) || itemsById.has(favoriteId)) {
      continue;
    }

    itemsById.set(favoriteId, item);
  }

  for (const favoriteItem of storedFavoriteItems.value) {
    if (itemsById.has(favoriteItem.id)) {
      continue;
    }

    itemsById.set(favoriteItem.id, createFavoriteItem(favoriteItem));
  }

  return Array.from(itemsById.values());
});

const displayItems = computed(() => {
  const itemsById = new Map();

  for (const item of flattenedItems.value) {
    const itemValue = getItemValue(item);

    if (itemValue === undefined || itemValue === null) {
      continue;
    }

    itemsById.set(String(itemValue), item);
  }

  for (const item of favoriteMenuItems.value) {
    const itemValue = getItemValue(item);

    if (itemValue === undefined || itemValue === null) {
      continue;
    }

    if (itemsById.has(String(itemValue))) {
      continue;
    }

    itemsById.set(String(itemValue), item);
  }

  return Array.from(itemsById.values());
});

function displayValue(value) {
  return (
    getDisplayValue(displayItems.value, value, {
      labelKey: props.labelKey,
      valueKey: props.valueKey,
    }) ?? ""
  );
}

const filteredGroups = computed(() => {
  if (hasPickerState.value || props.ignoreFilter || !searchTerm.value) {
    return normalizedGroups.value;
  }

  const fields = Array.isArray(props.filterFields)
    ? props.filterFields
    : [props.labelKey];

  return normalizedGroups.value
    .map((group) =>
      group.filter((item) => {
        if (item === undefined || item === null) {
          return false;
        }

        if (typeof item !== "object") {
          return contains(String(item), searchTerm.value);
        }

        if (item.type && ["label", "separator"].includes(item.type)) {
          return true;
        }

        return fields.some((field) => {
          const value = get(item, field);

          return (
            value !== undefined &&
            value !== null &&
            contains(String(value), searchTerm.value)
          );
        });
      }),
    )
    .filter(
      (group) =>
        group.filter(
          (item) =>
            !isInputItem(item) ||
            !item.type ||
            !["label", "separator"].includes(item.type),
        ).length > 0,
    );
});

const filteredFavoriteItems = computed(() => {
  if (hasPickerState.value || !searchTerm.value) {
    return favoriteMenuItems.value;
  }

  const fields = Array.isArray(props.filterFields)
    ? props.filterFields
    : [props.labelKey];

  return favoriteMenuItems.value.filter((item) =>
    fields.some((field) => {
      const value = isInputItem(item) ? get(item, field) : item;

      return (
        value !== undefined &&
        value !== null &&
        contains(String(value), searchTerm.value)
      );
    }),
  );
});

const visibleGroups = computed(() => {
  if (activeTab.value === "favorites") {
    return filteredFavoriteItems.value.length
      ? [filteredFavoriteItems.value]
      : [];
  }

  if (hasPickerState.value) {
    if (activeTab.value === "people") {
      return browseGroups.value;
    }

    if (activeTab.value === "search") {
      return searchGroups.value;
    }
  }

  if (activeTab.value === "people") {
    return normalizedGroups.value;
  }

  return filteredGroups.value;
});

const visibleItems = computed(() =>
  visibleGroups.value.flatMap((group) => group),
);
const isListLoading = computed(() => {
  if (activeTab.value === "search" && props.searchState) {
    return Boolean(props.searchState.loading);
  }

  if (activeTab.value === "people" && props.browseState) {
    return Boolean(props.browseState.loading);
  }

  return Boolean(props.loading);
});
const hasMoreItems = computed(() => {
  if (activeTab.value === "search" && props.searchState) {
    return Boolean(props.searchState.hasMore);
  }

  if (activeTab.value === "people" && props.browseState) {
    return Boolean(props.browseState.hasMore);
  }

  return Boolean(props.hasMore);
});

const createItem = computed(() => {
  if (!props.createItem || !searchTerm.value) {
    return false;
  }

  const newItem = props.valueKey
    ? { [props.valueKey]: searchTerm.value }
    : searchTerm.value;

  if (
    (typeof props.createItem === "object" &&
      props.createItem.when === "always") ||
    props.createItem === "always"
  ) {
    return !visibleItems.value.find((item) =>
      compare(item, newItem, props.valueKey),
    );
  }

  return !visibleItems.value.length;
});

const createItemPosition = computed(() =>
  typeof props.createItem === "object" ? props.createItem.position : "bottom",
);

const inputRef = useTemplateRef("inputRef");
const viewportRef = useTemplateRef("viewportRef");
const isMenuOpen = ref(Boolean(props.open ?? props.defaultOpen));
const isLoadMorePending = ref(false);
const pendingViewportScrollTop = ref(null);
const triggerSearchLoad = useDebounceFn(() => {
  if (!props.loadNextSearch) {
    return;
  }

  void props.loadNextSearch(searchTerm.value);
}, 300);

function autoFocus() {
  if (props.autofocus) {
    inputRef.value?.$el?.focus();
  }
}

onMounted(() => {
  nextTick(() => {
    searchTerm.value = "";
  });

  if (
    props.loadDepartmentUsers &&
    !props.browseState?.loaded &&
    !props.browseState?.loading
  ) {
    void props.loadDepartmentUsers();
  }

  if (!favoriteUsersLoaded.value && !favoriteUsersLoading.value) {
    void favoriteUsersStore.fetchFavorites();
  }

  setTimeout(() => {
    autoFocus();
  }, props.autofocusDelay);
});

function onUpdate(value) {
  if (toRaw(props.modelValue) === value) {
    return;
  }

  const event = new Event("change", { target: { value } });
  emits("change", event);
  emitFormChange();
  emitFormInput();

  if (props.resetSearchTermOnSelect) {
    searchTerm.value = "";
  }
}

function onBlur(event) {
  emits("blur", event);
  emitFormBlur();
}

function onFocus(event) {
  emits("focus", event);
  emitFormFocus();
}

function onUpdateOpen(value) {
  let timeoutId;

  if (!value) {
    const event = new FocusEvent("blur");
    emits("blur", event);
    emitFormBlur();

    if (props.resetSearchTermOnBlur) {
      const STATE_ANIMATION_DELAY_MS = 100;
      timeoutId = setTimeout(() => {
        searchTerm.value = "";
      }, STATE_ANIMATION_DELAY_MS);
    }
  } else {
    const event = new FocusEvent("focus");
    emits("focus", event);
    emitFormFocus();
    clearTimeout(timeoutId);
  }

  isMenuOpen.value = value;
}

function onRemoveTag(event, modelValue) {
  if (props.multiple) {
    const filteredValue = modelValue.filter((value) => !isEqual(value, event));
    emits("update:modelValue", filteredValue);
    emits("remove-tag", event);
    onUpdate(filteredValue);
  }
}

function onCreate(e) {
  e.preventDefault();
  e.stopPropagation();
  emits("create", searchTerm.value);
}

function onSelect(e, item) {
  if (!isInputItem(item)) {
    return;
  }

  if (item.disabled) {
    e.preventDefault();
    return;
  }

  item.onSelect?.(e);
}

function isInputItem(item) {
  return typeof item === "object" && item !== null;
}

async function restoreViewportScrollPosition() {
  if (pendingViewportScrollTop.value === null) {
    return;
  }

  const scrollTop = pendingViewportScrollTop.value;

  await nextTick();

  if (viewportRef.value) {
    viewportRef.value.scrollTop = scrollTop;
  }

  pendingViewportScrollTop.value = null;
}

function onLoadMore() {
  if (
    !isMenuOpen.value ||
    activeTab.value === "favorites" ||
    !hasMoreItems.value ||
    isListLoading.value ||
    isLoadMorePending.value
  ) {
    return;
  }

  pendingViewportScrollTop.value = viewportRef.value?.scrollTop ?? 0;
  isLoadMorePending.value = true;

  if (activeTab.value === "search" && props.loadNextSearch) {
    void props.loadNextSearch(searchTerm.value);
    return;
  }

  if (activeTab.value === "people" && props.loadDepartmentUsers) {
    void props.loadDepartmentUsers();
    return;
  }

  emits("load-more");
}

function onSelectTab(tabId) {
  if (activeTab.value === tabId) {
    return;
  }

  triggerSearchLoad.cancel?.();
  searchTerm.value = "";
  activeTab.value = tabId;

  if (
    tabId === "people" &&
    props.loadDepartmentUsers &&
    !props.browseState?.loaded &&
    !props.browseState?.loading
  ) {
    void props.loadDepartmentUsers();
  }

  if (
    tabId === "search" &&
    searchTerm.value &&
    props.loadNextSearch &&
    !props.searchState?.loading
  ) {
    triggerSearchLoad();
  }
}

watch(
  () => visibleItems.value.length,
  async (length, previousLength) => {
    if (pendingViewportScrollTop.value === null || length <= previousLength) {
      return;
    }

    await restoreViewportScrollPosition();
  },
);

watch(searchTerm, (value) => {
  if (value) {
    activeTab.value = "search";
    triggerSearchLoad();
    return;
  }

  triggerSearchLoad.cancel?.();

  if (props.resetSearch) {
    props.resetSearch();
  }

  if (activeTab.value === "search") {
    activeTab.value = "people";
  }
});

watch(
  isListLoading,
  async (loading) => {
    if (!loading) {
      isLoadMorePending.value = false;
      await restoreViewportScrollPosition();
    }
  },
  { immediate: true },
);

useInfiniteScroll(viewportRef, onLoadMore, {
  distance: 64,
  canLoadMore: () =>
    isMenuOpen.value &&
    activeTab.value !== "favorites" &&
    hasMoreItems.value &&
    !isListLoading.value &&
    !disabled.value,
});

defineExpose({
  inputRef: toRef(() => inputRef.value?.$el),
});
</script>

<template>
  <DefineCreateItemTemplate>
    <ComboboxItem
      data-slot="item"
      :class="b24ui.item({ addNew: true, class: props.b24ui?.item })"
      :value="searchTerm"
      @select="onCreate"
    >
      <span
        data-slot="itemLabel"
        :class="
          b24ui.itemLabel({
            addNew: true,
            class: props.b24ui?.itemLabel,
          })
        "
      >
        <slot name="create-item-label" :item="searchTerm">
          <Component
            :is="icons.plus"
            data-slot="itemLeadingIcon"
            :class="
              b24ui.itemLeadingIcon({
                addNew: true,
                class: props.b24ui?.itemLeadingIcon,
              })
            "
          />
          {{ t("inputMenu.create", { label: searchTerm }) }}
        </slot>
      </span>
    </ComboboxItem>
  </DefineCreateItemTemplate>

  <DefineItemTemplate v-slot="{ item, index }">
    <ComboboxLabel
      v-if="isInputItem(item) && item.type === 'label'"
      data-slot="label"
      :class="
        b24ui.label({
          class: [props.b24ui?.label, item.b24ui?.label, item.class],
        })
      "
    >
      {{ get(item, props.labelKey) }}
    </ComboboxLabel>

    <ComboboxSeparator
      v-else-if="isInputItem(item) && item.type === 'separator'"
      data-slot="separator"
      :class="
        b24ui.separator({
          class: [props.b24ui?.separator, item.b24ui?.separator, item.class],
        })
      "
    />

    <ComboboxItem
      v-else
      data-slot="item"
      :class="
        b24ui.item({
          class: [
            props.b24ui?.item,
            isInputItem(item) && item.b24ui?.item,
            isInputItem(item) && item.class,
          ],
          colorItem: isInputItem(item) ? item?.color : undefined,
        })
      "
      :disabled="isInputItem(item) && item.disabled"
      :value="
        props.valueKey && isInputItem(item) ? get(item, props.valueKey) : item
      "
      @select="onSelect($event, item)"
    >
      <slot name="item" :item="item" :index="index" :b24ui="b24ui">
        <slot name="item-leading" :item="item" :index="index" :b24ui="b24ui">
          <B24Avatar
            v-if="isInputItem(item) && item.avatar"
            :size="
              item.b24ui?.itemLeadingAvatarSize ||
              props.b24ui?.itemLeadingAvatarSize ||
              b24ui.itemLeadingAvatarSize()
            "
            v-bind="item.avatar"
            data-slot="itemLeadingAvatar"
            :class="
              b24ui.itemLeadingAvatar({
                class: [
                  props.b24ui?.itemLeadingAvatar,
                  item.b24ui?.itemLeadingAvatar,
                ],
                colorItem: item?.color,
              })
            "
          />
        </slot>

        <span
          data-slot="itemWrapper"
          :class="
            b24ui.itemWrapper({
              class: [
                props.b24ui?.itemWrapper,
                isInputItem(item) && item.b24ui?.itemWrapper,
              ],
            })
          "
        >
          <span
            data-slot="itemLabel"
            :class="
              b24ui.itemLabel({
                class: [
                  props.b24ui?.itemLabel,
                  isInputItem(item) && item.b24ui?.itemLabel,
                ],
              })
            "
          >
            <slot name="item-label" :item="item" :index="index">
              {{ isInputItem(item) ? get(item, props.labelKey) : item }}
            </slot>
          </span>

          <span
            v-if="
              isInputItem(item) &&
              (get(item, props.descriptionKey) || !!slots['item-description'])
            "
            data-slot="itemDescription"
            :class="
              b24ui.itemDescription({
                class: [
                  props.b24ui?.itemDescription,
                  isInputItem(item) && item.b24ui?.itemDescription,
                ],
              })
            "
          >
            <slot name="item-description" :item="item" :index="index">
              {{ get(item, props.descriptionKey) }}
            </slot>
          </span>
        </span>

        <span
          data-slot="itemTrailing"
          :class="
            b24ui.itemTrailing({
              class: [
                props.b24ui?.itemTrailing,
                isInputItem(item) && item.b24ui?.itemTrailing,
              ],
              colorItem: isInputItem(item) ? item?.color : undefined,
            })
          "
        >
          <ComboboxItemIndicator as-child>
            <Component
              :is="selectedIcon || icons.check"
              data-slot="itemTrailingIcon"
              :class="
                b24ui.itemTrailingIcon({
                  class: [
                    props.b24ui?.itemTrailingIcon,
                    isInputItem(item) && item.b24ui?.itemTrailingIcon,
                  ],
                  colorItem: isInputItem(item) ? item?.color : undefined,
                })
              "
            />
          </ComboboxItemIndicator>

          <slot name="item-trailing" :item="item" :index="index" :b24ui="b24ui">
            <Component
              :is="item.icon"
              v-if="isInputItem(item) && item.icon"
              data-slot="itemLeadingIcon"
              :class="
                b24ui.itemLeadingIcon({
                  class: [
                    props.b24ui?.itemLeadingIcon,
                    item.b24ui?.itemLeadingIcon,
                  ],
                  colorItem: item?.color,
                })
              "
            />
            <B24Chip
              v-else-if="isInputItem(item) && item.chip"
              :size="
                item.b24ui?.itemLeadingChipSize ||
                props.b24ui?.itemLeadingChipSize ||
                b24ui.itemLeadingChipSize()
              "
              inset
              standalone
              v-bind="item.chip"
              data-slot="itemLeadingChip"
              :class="
                b24ui.itemLeadingChip({
                  class: [
                    props.b24ui?.itemLeadingChip,
                    item.b24ui?.itemLeadingChip,
                  ],
                  colorItem: item?.color,
                })
              "
            />
          </slot>
        </span>
      </slot>
    </ComboboxItem>
  </DefineItemTemplate>

  <ComboboxRoot
    v-slot="{ modelValue: selectedModelValue, open: isOpen }"
    v-bind="rootProps"
    :name="name"
    :disabled="disabled"
    data-slot="root"
    :class="b24ui.root({ class: [props.b24ui?.root, props.class] })"
    :as-child="!!multiple"
    ignore-filter
    @update:model-value="onUpdate"
    @update:open="onUpdateOpen"
  >
    <B24Badge
      v-if="!multiple && isTag"
      data-slot="tag"
      :class="b24ui.tag({ class: props.b24ui?.tag })"
      :color="props.tagColor"
      :label="props.tag"
      size="xs"
    />

    <ComboboxAnchor
      :as-child="!multiple"
      data-slot="base"
      :class="b24ui.base({ class: props.b24ui?.base })"
      class="flex min-w-0 flex-nowrap items-center overflow-hidden"
    >
      <TagsInputRoot
        v-if="multiple"
        v-slot="{ modelValue: tags }"
        :model-value="modelValue"
        :disabled="disabled"
        :required="required"
        delimiter=""
        as-child
        @blur="onBlur"
        @focus="onFocus"
        @remove-tag="onRemoveTag($event, modelValue)"
      >
        <B24Badge
          v-if="!!multiple && isTag"
          data-slot="tag"
          :class="b24ui.tag({ class: props.b24ui?.tag })"
          :color="props.tagColor"
          :label="props.tag"
          size="xs"
        />

        <TagsInputItem
          v-for="(item, index) in tags"
          :key="index"
          :value="item"
          data-slot="tagsItem"
          :class="
            b24ui.tagsItem({
              class: [
                props.b24ui?.tagsItem,
                isInputItem(item) && item.b24ui?.tagsItem,
              ],
            })
          "
        >
          <TagsInputItemText
            data-slot="tagsItemText"
            :class="
              b24ui.tagsItemText({
                class: [
                  props.b24ui?.tagsItemText,
                  isInputItem(item) && item.b24ui?.tagsItemText,
                ],
              })
            "
          >
            <slot name="tags-item-text" :item="item" :index="index">
              {{ displayValue(item) }}
            </slot>
          </TagsInputItemText>

          <TagsInputItemDelete
            data-slot="tagsItemDelete"
            :class="
              b24ui.tagsItemDelete({
                class: [
                  props.b24ui?.tagsItemDelete,
                  isInputItem(item) && item.b24ui?.tagsItemDelete,
                ],
              })
            "
            :disabled="disabled"
          >
            <slot
              name="tags-item-delete"
              :item="item"
              :index="index"
              :b24ui="b24ui"
            >
              <Component
                :is="deleteIcon || icons.close"
                data-slot="tagsItemDeleteIcon"
                :class="
                  b24ui.tagsItemDeleteIcon({
                    class: [
                      props.b24ui?.tagsItemDeleteIcon,
                      isInputItem(item) && item.b24ui?.tagsItemDeleteIcon,
                    ],
                  })
                "
              />
            </slot>
          </TagsInputItemDelete>
        </TagsInputItem>

        <ComboboxInput v-model="searchTerm" as-child>
          <TagsInputInput
            :id="id"
            ref="inputRef"
            v-bind="{ ...$attrs, ...ariaAttrs }"
            :placeholder="placeholder"
            data-slot="tagsInput"
            :class="b24ui.tagsInput({ class: props.b24ui?.tagsInput })"
            @change.stop
          />
        </ComboboxInput>
      </TagsInputRoot>

      <ComboboxInput
        v-else
        :id="id"
        ref="inputRef"
        :display-value="displayValue"
        v-bind="{ ...$attrs, ...ariaAttrs }"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        @blur="onBlur"
        @focus="onFocus"
        @change.stop
        @update:model-value="searchTerm = $event"
      />

      <span
        v-if="isLeading || !!avatar || !!slots.leading"
        data-slot="leading"
        :class="b24ui.leading({ class: props.b24ui?.leading })"
      >
        <slot
          name="leading"
          :model-value="selectedModelValue"
          :open="isOpen"
          :b24ui="b24ui"
        >
          <Component
            :is="leadingIconName"
            v-if="isLeading && leadingIconName"
            data-slot="leadingIcon"
            :class="b24ui.leadingIcon({ class: props.b24ui?.leadingIcon })"
          />
          <B24Avatar
            v-else-if="!!avatar"
            :size="
              props.b24ui?.itemLeadingAvatarSize ||
              b24ui.itemLeadingAvatarSize()
            "
            v-bind="avatar"
            data-slot="itemLeadingAvatar"
            :class="
              b24ui.itemLeadingAvatar({
                class: props.b24ui?.itemLeadingAvatar,
              })
            "
          />
        </slot>
      </span>

      <ComboboxTrigger
        v-if="isTrailing || !!slots.trailing"
        data-slot="trailing"
        :class="b24ui.trailing({ class: props.b24ui?.trailing })"
      >
        <slot
          name="trailing"
          :model-value="selectedModelValue"
          :open="isOpen"
          :b24ui="b24ui"
        >
          <Component
            :is="trailingIconName"
            v-if="trailingIconName"
            data-slot="trailingIcon"
            :class="b24ui.trailingIcon({ class: props.b24ui?.trailingIcon })"
          />
        </slot>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal v-bind="portalProps">
      <ComboboxContent
        data-slot="content"
        :class="
          b24ui.content({
            class: [props.b24ui?.content, 'overflow-visible'],
          })
        "
        v-bind="contentProps"
        @focus-outside.prevent
      >
        <div class="absolute top-[10px] right-full flex flex-col gap-1">
          <button
            v-for="tab in menuTabs"
            :key="tab.id"
            type="button"
            :aria-pressed="activeTab === tab.id"
            class="group flex h-[38px] w-[42px] items-center justify-center rounded-s-[18px] rounded-e-none transition-colors"
            :class="
              activeTab === tab.id
                ? 'bg-(--ui-color-accent-main-primary) text-white'
                : 'bg-(--color-secondary-background) text-(--color-secondary-text) hover:bg-(--color-base-200)'
            "
            @click="onSelectTab(tab.id)"
          >
            <Component :is="tab.icon" class="size-6" />
          </button>
        </div>

        <slot name="content-top" />

        <ComboboxEmpty
          v-if="!isListLoading"
          data-slot="empty"
          :class="b24ui.empty({ class: props.b24ui?.empty })"
        >
          <slot name="empty" :search-term="searchTerm">
            {{
              searchTerm
                ? t("inputMenu.noMatch", { searchTerm })
                : t("inputMenu.noData")
            }}
          </slot>
        </ComboboxEmpty>

        <div
          ref="viewportRef"
          role="presentation"
          data-slot="viewport"
          :class="
            b24ui.viewport({
              class: [props.b24ui?.viewport, 'min-h-[40vh]'],
            })
          "
        >
          <template v-if="!!virtualize">
            <ReuseCreateItemTemplate
              v-if="createItem && createItemPosition === 'top'"
            />

            <ComboboxVirtualizer
              v-slot="{ option: item, virtualItem }"
              :options="visibleItems"
              :text-content="
                (candidate) =>
                  isInputItem(candidate)
                    ? get(candidate, props.labelKey)
                    : String(candidate)
              "
              v-bind="virtualizerProps"
            >
              <ReuseItemTemplate :item="item" :index="virtualItem.index" />
            </ComboboxVirtualizer>

            <ReuseCreateItemTemplate
              v-if="createItem && createItemPosition === 'bottom'"
            />
          </template>

          <template v-else>
            <ComboboxGroup
              v-if="createItem && createItemPosition === 'top'"
              data-slot="group"
              :class="b24ui.group({ class: props.b24ui?.group })"
            >
              <ReuseCreateItemTemplate />
            </ComboboxGroup>

            <ComboboxGroup
              v-for="(group, groupIndex) in visibleGroups"
              :key="`group-${groupIndex}`"
              data-slot="group"
              :class="b24ui.group({ class: props.b24ui?.group })"
            >
              <ReuseItemTemplate
                v-for="(item, index) in group"
                :key="`group-${groupIndex}-${index}`"
                :item="item"
                :index="index"
              />
            </ComboboxGroup>

            <ComboboxGroup
              v-if="createItem && createItemPosition === 'bottom'"
              data-slot="group"
              :class="b24ui.group({ class: props.b24ui?.group })"
            >
              <ReuseCreateItemTemplate />
            </ComboboxGroup>
            <div
              v-if="isListLoading"
              class="flex items-center justify-center py-2"
            >
              <Component
                :is="icons.loading"
                class="size-8 text-(--ui-color-design-plain-content-icon-secondary)"
              />
            </div>
          </template>
        </div>

        <slot name="content-bottom" />

        <ComboboxArrow
          v-if="!!arrow"
          v-bind="arrowProps"
          data-slot="arrow"
          :class="b24ui.arrow({ class: props.b24ui?.arrow })"
        />
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
