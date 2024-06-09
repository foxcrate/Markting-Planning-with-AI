export class StageDetailsReturnDto {
  id: number;
  name: string;
  description: string;
  theOrder: number;
  funnelId: number;
  tactics: {
    id: number;
    name: string;
    description: string;
    theOrder: number;
  }[];
}
