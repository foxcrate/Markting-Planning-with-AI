import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { GlobalStagesEnum } from 'src/enums/global-stages.enum';

export class GetAllFilterDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty({ enum: GlobalStagesEnum })
  @IsOptional()
  globalStage: GlobalStagesEnum;
}
