import { User } from "./user.interface";

export interface Project {
  id: number;
  title: string;
  scrumMaster: User;
  projectOwner: User;
  developers: Array<User>;
}
