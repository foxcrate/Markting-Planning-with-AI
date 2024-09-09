export class SerializedDataObjectForChatDto {
  user_data: {
    name: string;
  };
  project_data: {};
  funnel_data: {
    name: string;
    description: string;
    funnel_stages: [];
  };
}
