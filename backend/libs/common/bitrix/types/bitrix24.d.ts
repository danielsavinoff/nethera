import '@bitrix24/b24jssdk';
import {
  EventHandlerParams,
  HandlerAuthParams,
} from '@bitrix24/b24jssdk';

declare module '@bitrix24/b24jssdk' {
  export enum TaskStatus {
    WaitsExecution = 2,
    InProgress = 3,
    AwaitingControl = 4,
    Completed = 5,
    Deferred = 6,
  }

  export type TaskStatusLike = TaskStatus | `${TaskStatus}`;

  export type CrmBinding =
    | `L_${string}`
    | `D_${string}`
    | `C_${string}`
    | `CO_${string}`
    | `SI_${string}`
    | `T${string}_${string}`;

  export type DurationType =
    | 'secs'
    | 'mins'
    | 'hours'
    | 'days'
    | 'weeks'
    | 'monts'
    | 'years';

  export interface ChecklistItemAction {
    modify: boolean;
    remove: boolean;
    toggle: boolean;
    add: boolean;
    addAccomplice: boolean;
  }

  export interface ChecklistItem {
    id: string;
    taskId: string;
    createdBy: string;
    parentId: string;
    title: string;
    sortIndex: string;
    isComplete: 'Y' | 'N';
    isImportant: 'Y' | 'N';
    toggledBy: string;
    toggledDate: string;
    ufChecklistFiles: boolean;
    members: unknown[];
    attachments: unknown[];
    entityId: string;
    action: ChecklistItemAction;
  }

  export interface TaskGroup {
    id: string;
    name: string;
    opened: boolean;
    membersCount: number;
    image: string;
    additionalData: unknown[];
  }

  export interface TaskUser {
    id: string;
    name: string;
    link: string;
    icon: string;
    workPosition: string;
  }

  export interface TaskAction {
    accept: boolean;
    decline: boolean;
    complete: boolean;
    approve: boolean;
    disapprove: boolean;
    start: boolean;
    pause: boolean;
    delegate: boolean;
    remove: boolean;
    edit: boolean;
    defer: boolean;
    renew: boolean;
    create: boolean;
    changeDeadline: boolean;
    checklistAddItems: boolean;
    addFavorite: boolean;
    deleteFavorite: boolean;
    rate: boolean;
    take: boolean;
    'edit.originator': boolean;
    'checklist.reorder': boolean;
    'elapsedtime.add': boolean;
    'dayplan.timer.toggle': boolean;
    'edit.plan': boolean;
    'checklist.add': boolean;
    'favorite.add': boolean;
    'favorite.delete': boolean;
  }

  export interface CheckListTreeFields {
    id: string;
    copiedId: string;
    entityId: string;
    userId: number;
    createdBy: string;
    parentId: string;
    title: string;
    sortIndex: string;
    displaySortIndex: string;
    isComplete: boolean;
    isImportant: boolean;
    completedCount: number;
    members: unknown[];
    attachments: unknown[];
    nodeId: string;
  }

  export interface CheckListTreeNode {
    nodeId: number;
    fields: CheckListTreeFields;
    action: unknown[];
    descendants: CheckListTreeNode[];
  }

  export interface B24Task {
    id: string;
    parentId: string | null;
    title: string;
    description: string;
    chatId: number;
    mark: 'N' | 'P' | null;
    priority: '2' | '1' | '0';
    multitask: 'Y' | 'N';
    notViewed: 'Y' | 'N';
    replicate: 'Y' | 'N';
    stageId: string;
    sprintId: string;
    backlogId: string;
    createdBy: string;
    createdDate: string;
    responsibleId: string;
    changedBy: string;
    changedDate: string;
    statusChangedBy: string;
    closedBy: string;
    closedDate: string | null;
    activityDate: string;
    dateStart: string;
    deadline: string;
    startDatePlan: string;
    endDatePlan: string;
    guid: string;
    xmlId: string;
    commentsCount: string;
    serviceCommentsCount: string;
    allowChangeDeadline: 'Y' | 'N';
    allowTimeTracking: 'Y' | 'N';
    taskControl: 'Y' | 'N';
    addInReport: 'Y' | 'N';
    forkedByTemplateId: string;
    timeEstimate: string;
    timeSpentInLogs: string;
    matchWorkTime: 'Y' | 'N';
    forumTopicId: string;
    forumId: string;
    siteId: string;
    subordinate: 'Y' | 'N';
    exchangeModified: string;
    exchangeId: string;
    outlookVersion: string;
    viewedDate: string;
    sorting: string;
    durationFact: string;
    isMuted: 'Y' | 'N';
    isPinned: 'Y' | 'N';
    isPinnedInGroup: 'Y' | 'N';
    flowId: string;
    descriptionInBbcode: 'Y' | 'N';
    status: TaskStatusLike;
    statusChangedDate: string;
    durationPlan: string;
    durationType: DurationType;
    favorite: 'Y' | 'N';
    groupId: string;

    auditors: string[];
    accomplices: string[];

    checklist: Record<string, ChecklistItem>;

    group: TaskGroup;
    creator: TaskUser;
    responsible: TaskUser;

    accomplicesData: Record<string, TaskUser> | TaskUser[];
    auditorsData: Record<string, TaskUser>;

    newCommentsCount: number;

    action: TaskAction;

    checkListTree: CheckListTreeNode;
    checkListCanAdd: boolean;

    UF_CRM_TASK: CrmBinding[];
    UF_TASK_WEBDAV_FILES: unknown[];
    UF_MAIL_MESSAGE: string;

    [k: `UF_${string}`]: any;
  }

  // item list

  export interface TaskElapsedTimeItem {
    ID: string;
    TASK_ID: string;
    USER_ID: string;
    COMMENT_TEXT: string;
    SECONDS: string;
    MINUTES: string;
    SOURCE: string;
    CREATED_DATE: string;
    DATE_START: string;
    DATE_STOP: string;
  }

  export interface EventOnTaskAddHandlerParams
    extends EventHandlerParams {
    data: {
      FIELDS_BEFORE:
        | {
            ID: number;
          }
        | undefined;
      FIELDS_AFTER:
        | {
            ID: number;
          }
        | undefined;
      IS_ACCESSIBLE_BEFORE: 'Y' | 'N' | undefined;
      IS_ACCESSIBLE_AFTER: 'Y' | 'N' | undefined;
    };
    auth: HandlerAuthParams;
  }

  export interface EventOnTaskUpdateHandlerParams
    extends EventHandlerParams {
    data: {
      FIELDS_BEFORE:
        | {
            ID: number;
          }
        | undefined;
      FIELDS_AFTER:
        | {
            ID: number;
          }
        | undefined;
      IS_ACCESSIBLE_BEFORE: 'Y' | 'N' | undefined;
      IS_ACCESSIBLE_AFTER: 'Y' | 'N' | undefined;
    };
    auth: HandlerAuthParams;
  }

  export interface EventOnTaskDeleteHandlerParams
    extends EventHandlerParams {
    data: {
      FIELDS_BEFORE:
        | {
            ID: number;
          }
        | undefined;
      FIELDS_AFTER:
        | {
            ID: number;
          }
        | undefined;
      IS_ACCESSIBLE_BEFORE: 'Y' | 'N' | undefined;
      IS_ACCESSIBLE_AFTER: 'Y' | 'N' | undefined;
    };
    auth: HandlerAuthParams;
  }

  export interface EventOnSonetGroupAddHandlerParams
    extends EventHandlerParams {
    data: {
      FIELDS: {
        ID: string;
      };
    };
    auth: HandlerAuthParams;
  }

  export interface EventOnSonetGroupUpdateHandlerParams
    extends EventHandlerParams {
    data: {
      FIELDS: {
        ID: string;
      };
    };
    auth: HandlerAuthParams;
  }

  export interface EventOnSonetGroupDeleteHandlerParams
    extends EventHandlerParams {
    data: {
      FIELDS: {
        ID: string;
      };
    };
    auth: HandlerAuthParams;
  }

  // on user add
  export interface EventOnUserAddHandlerParams
    extends EventHandlerParams {
    data: {
      ID: number;
      ACTIVE: 'Y' | 'N';
      EMAIL?: string;
      NAME?: string;
      LAST_NAME?: string;
      PERSONAL_GENDER?: 'M' | 'F';
      PERSONAL_BIRTHDAY?: string;
      UF_DEPARTMENT?: number[] | null;
      DATE_REGISTER: string;
      WORK_POSITION?: string;
      UF_EMPLOYMENT_DATE?: string;
    };
    auth: HandlerAuthParams;
  }

  export interface EventOnCrmDynamicItemAdd
    extends EventHandlerParams {
    data: {
      FIELDS: {
        ID: string;
        ENTITY_TYPE_ID: string;
      };
    };
  }

  export interface EventOnCrmDynamicItemUpdate
    extends EventHandlerParams {
    data: {
      FIELDS: {
        ID: string;
        ENTITY_TYPE_ID: string;
      };
    };
  }

  export interface EventOnCrmDynamicItemDelete
    extends EventHandlerParams {
    data: {
      FIELDS: {
        ID: string;
        ENTITY_TYPE_ID: string;
      };
    };
  }
}
