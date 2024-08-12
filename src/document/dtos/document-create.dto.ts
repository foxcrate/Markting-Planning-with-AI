import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DocumentCreateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  requiredData: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  templateId: number;
}
