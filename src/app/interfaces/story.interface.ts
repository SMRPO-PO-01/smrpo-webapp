export interface Story {
  id: number;
  title: String;
  description: String;
  acceptanceTests: String;
  priority: String;
  businessValue: number;
  accepted: String;
  board: String;
  size: number;
  allTasksCompleted: boolean;
  rejectReason: string;

  unsaved?: boolean;
}
