import { IsBoolean, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdatePersonalFieldsDto {
  @IsOptional()
  @IsBoolean()
  owned?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @Min(1)
  @Max(5)
  complexity?: number;
}
