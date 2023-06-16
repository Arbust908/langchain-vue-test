<template>
  <el-dialog v-model="isOpen" @close="closeDialog">
    <template #header>
      <slot name="header"></slot>
    </template>
    <slot name="content"></slot>
    <template #footer>
      <el-divider />
      <el-button
        type="danger"
        :disabled="action1Disabled"
        :loading="isLoading"
        @click="handleAction_1"
        v-if="!isEditing"
        plain
        round
        >{{ action1Text }}</el-button
      >
      <el-button
        type="primary"
        color="black"
        :disabled="action2Disabled"
        :loading="isLoading"
        @click="handleAction_2"
        plain
        round
        >{{ action2Text }}</el-button
      >
      <slot name="alternate-action"></slot>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {
  MODERATION_TIMEOUT_MS,
  RESOURCES,
  RESOURCE_TYPES_COPY,
} from "@/constants";
import { ElMessage, ElNotification } from "element-plus";
import type { MessageHandler } from "element-plus";
import { computed, h, ref, defineComponent } from "vue";
import type { PropType } from "vue";
import useActivities from "@/hooks/activities";
import useClaims from "@/hooks/claims";
import useReferrals from "@/hooks/referrals";

export default defineComponent({
  name: "ResourceDetail",
  props: {
    resourceType: {
      type: String as PropType<RESOURCES>,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    actionsStates: {
      type: Object,
      default: () => ({
        action1Disabled: false,
        action2Disabled: false,
      }),
    },
  },
  setup(props, { emit }) {
    const { approveActivity, rejectActivity, createActivity } = useActivities();
    const { approveClaim, rejectClaim } = useClaims();
    const { approveReferral, rejectReferral } = useReferrals();
    const messageContainerClasses = "dio-flex dio-w-full dio-justify-between";
    const messageUndoClasses = "dio-cta-link-2 dio-cursor-pointer";

    const isLoading = ref(false);

    const isEditing = computed(() => props.isEdit);

    const TIMEOUT = ref(0);

    const action1Disabled = computed(() => props.actionsStates.action1Disabled);
    const action2Disabled = computed(() => props.actionsStates.action2Disabled);

    const resourceMethods = {
      [RESOURCES.ACTIVITY]: {
        reject: rejectActivity,
        approve: approveActivity,
      },
      [RESOURCES.ACTIVITY_CREATE]: {
        reject: null,
        approve: createActivity,
      },
      [RESOURCES.KARMA_CLAIM]: {
        reject: rejectClaim,
        approve: approveClaim,
      },
      [RESOURCES.REFERRAL]: {
        reject: rejectReferral,
        approve: approveReferral,
      },
    };

    const action1 = ref({
      controller: new AbortController(),
      messageHandler: { close: () => ({}) } as MessageHandler,
      message: {
        success: {
          title: "",
          message: "",
        },
        error: {
          title: "",
        },
      },
      buttonText: "",
      method: async () => null,
    });

    const action2 = ref({
      controller: new AbortController(),
      messageHandler: { close: () => ({}) } as MessageHandler,
      message: {
        success: {
          title: "",
          message: "",
        },
        error: {
          title: "",
        },
      },
      buttonText: "",
      method: async () => null,
    });

    const dialogAttrs = computed<
      boolean | { open: boolean; shouldRefresh: boolean }
    >({
      get() {
        return props.visible;
      },
      set(attrs) {
        emit("update:visible", attrs);
      },
    });

    const closeDialog = ({ shouldRefresh = false } = {}) => {
      dialogAttrs.value = {
        open: false,
        shouldRefresh,
      };
    };

    if (
      !RESOURCE_TYPES_COPY[
        props.resourceType as keyof typeof RESOURCE_TYPES_COPY
      ]
    ) {
      ElNotification({
        title: "Resource type not mapped",
        type: "error",
      });
    } else {
      TIMEOUT.value = MODERATION_TIMEOUT_MS;
      action1.value = {
        ...action1.value,
        ...RESOURCE_TYPES_COPY[
          props.resourceType as keyof typeof RESOURCE_TYPES_COPY
        ].reject,
        method:
          resourceMethods[props.resourceType as keyof typeof resourceMethods]
            .reject,
      };
      action2.value = {
        ...action2.value,
        ...RESOURCE_TYPES_COPY[
          props.resourceType as keyof typeof RESOURCE_TYPES_COPY
        ].approve,
        method:
          resourceMethods[props.resourceType as keyof typeof resourceMethods]
            .approve,
      };
    }

    const handleAction_1 = async () => {
      // we have to instantiate a new AC in case the user aborts
      // action1 or action2 multiple times
      action1.value.controller = new AbortController();
      isLoading.value = true;
      action1.value.messageHandler = ElMessage({
        message: h(
          "div",
          {
            class: messageContainerClasses,
          },
          [
            h("span", null, action1.value.message.success.title),
            h(
              "a",
              {
                onClick: undoActions,
                class: messageUndoClasses,
              },
              "Undo"
            ),
          ]
        ),
        duration: TIMEOUT.value,
      });
      await action1WithTimeout(action1.value.controller.signal);
    };

    const action1WithTimeout = async (signal: AbortSignal) => {
      const executeAction1 = setTimeout(async () => {
        try {
          await action1.value.method();
          ElNotification({
            title: action1.value.message.success.title,
            message: action1.value.message.success.message,
            type: "success",
          });
          closeDialog({ shouldRefresh: true });
        } catch (error) {
          ElNotification({
            title: action1.value.message.error.title,
            message: `${error ? error : "Please try again later"}`,
            type: "error",
          });
        } finally {
          isLoading.value = false;
        }
      }, TIMEOUT.value);
      const onAbort = () => {
        clearTimeout(executeAction1);
        isLoading.value = false;
      };
      signal.onabort = onAbort;
    };

    const handleAction_2 = async () => {
      action2.value.controller = new AbortController();
      isLoading.value = true;
      action2.value.messageHandler = ElMessage({
        message: h(
          "div",
          {
            class: messageContainerClasses,
          },
          [
            h("span", null, action2.value.message.success.title),
            h(
              "a",
              {
                onClick: undoActions,
                class: messageUndoClasses,
              },
              "Undo"
            ),
          ]
        ),
        duration: TIMEOUT.value,
      });
      await action2WithTimeout(action2.value.controller.signal);
    };

    const action2WithTimeout = async (signal: AbortSignal) => {
      const executeAction2 = setTimeout(async () => {
        try {
          await action2.value.method();
          ElNotification({
            title: action2.value.message.success.title,
            message: action2.value.message.success.message,
            type: "success",
          });
          closeDialog({ shouldRefresh: true });
        } catch (error) {
          ElNotification({
            title: action2.value.message.error.title,
            message: `${error ? error : "Please try again later"}`,
            type: "error",
          });
        } finally {
          isLoading.value = false;
        }
      }, TIMEOUT.value);
      const onAbort = () => {
        clearTimeout(executeAction2);
        isLoading.value = false;
      };
      signal.onabort = onAbort;
    };

    const undoActions = () => {
      isLoading.value = false;
      action1.value.controller.abort();
      action2.value.controller.abort();
      action1.value.messageHandler.close();
      action2.value.messageHandler.close();
    };

    return {
      handleAction_1,
      handleAction_2,
      isOpen: dialogAttrs,
      action1Text: action1.value.buttonText,
      action2Text: action2.value.buttonText,
      action1Disabled,
      action2Disabled,
      isLoading,
      closeDialog,
      isEditing,
    };
  },
});
</script>
