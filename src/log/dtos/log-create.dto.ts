import { ApiProperty } from '@nestjs/swagger';
import { LogEntityEnum } from 'src/enums/log-entity.enum';
import { LogOperationEnum } from 'src/enums/log-operation.enum';

export class LogCreateDto {
  @ApiProperty()
  entity: LogEntityEnum;

  @ApiProperty()
  entityId: number;

  @ApiProperty()
  operation: LogOperationEnum;

  @ApiProperty()
  oldObject: object;

  @ApiProperty()
  newObject: object;

  @ApiProperty()
  changesObject: object;
}
