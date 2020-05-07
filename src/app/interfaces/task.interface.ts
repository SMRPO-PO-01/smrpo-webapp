export enum TASK_STATE {
  UNASSIGNED = "UNASSIGNED",
  ASSIGNED = "ASSIGNED",
  ACTIVE = "ACTIVE",
  DONE = "DONE",
}

export interface Task {
  id: number;
  title: String;
  description: String;
  state: TASK_STATE;
  createdAt: String;
  projectId: number;
  userId: number;
  size: number;

  undo?: boolean;
}
