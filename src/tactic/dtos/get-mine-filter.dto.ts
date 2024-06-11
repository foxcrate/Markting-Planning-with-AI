import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GlobalStagesEnum } from 'src/enums/global-stages.enum';

export class GetMineFilterDto {
  @ApiProperty()
  @IsOptional()
  private: boolean;

  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty({ enum: GlobalStagesEnum })
  @IsOptional()
  globalStage: GlobalStagesEnum;
}
