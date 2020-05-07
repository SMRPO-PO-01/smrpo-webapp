import { Story } from './story.interface';

export interface Board {
  title: String;
  stories: Story[];
  dropDisabled: boolean;
}
