import { User } from './user.interface';

export enum PROJECT_USER_ROLE {
  PROJECT_OWNER = "PROJECT_OWNER",
  SCRUM_MASTER = "SCRUM_MASTER",
  DEVELOPER = "DEVELOPER",
}

export interface Project {
  id: number;
  title: string;
  myRole?: PROJECT_USER_ROLE;
  users: Array<User & { projectRole: PROJECT_USER_ROLE }>;
}
