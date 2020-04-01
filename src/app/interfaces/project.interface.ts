import { User } from "./user.interface";

export enum PROJECT_USER_ROLE {
  PRODUCT_LEADER = "PRODUCT_LEADER",
  PRODUCT_OWNER = "PRODUCT_OWNER",
  TEAM_MEMBER = "TEAM_MEMBER"
}
export interface Project {
  id: number;
  title: string;
  users: Array<User & { projectRole: PROJECT_USER_ROLE }>;
}
