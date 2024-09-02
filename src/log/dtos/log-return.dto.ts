import { ApiProperty } from '@nestjs/swagger';
import { CommentUserDto } from 'src/comment/dtos/comment-user.dto';
import { LogEntityEnum } from 'src/enums/log-entity.enum';
import { LogOperationEnum } from 'src/enums/log-operation.enum';
import { LogCreatorDto } from './log-creater.dto';

export class LogReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  entity: LogEntityEnum;

  @ApiProperty()
  operation: LogOperationEnum;

  @ApiProperty()
  adminId: number;

  @ApiProperty()
  admin: LogCreatorDto;

  @ApiProperty()
  oldObject: object;

  @ApiProperty()
  newObject: object;

  @ApiProperty()
  changesObject: object;

  @ApiProperty()
  createdAt: Date;
}
