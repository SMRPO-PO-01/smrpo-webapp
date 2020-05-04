import { Story } from './story.interface';
import { User } from './user.interface';

export interface Project {
  id: number;
  title: string;
  scrumMaster: User;
  projectOwner: User;
  developers: Array<User>;
}

export interface ProjectWithStories extends Project {
  backlog: Story[];
  sprint: Story[];
  accepted: Story[];
}
