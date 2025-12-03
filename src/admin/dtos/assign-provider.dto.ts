import { IsNumber, IsString } from 'class-validator';

export class AssignProviderDto {
  @IsString()
  providerId: string;
}
