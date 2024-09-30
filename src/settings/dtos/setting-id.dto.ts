import { IsNotEmpty } from 'class-validator';

export class SettingIdDto {
  @IsNotEmpty()
  settingId: number;
}
