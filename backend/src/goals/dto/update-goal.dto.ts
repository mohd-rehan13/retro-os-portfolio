import { IsOptional, IsInt, Min, Max, IsEnum } from 'class-validator';
import { GoalStatus } from '@prisma/client';

export class UpdateGoalDto {
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress?: number;

  @IsEnum(GoalStatus)
  @IsOptional()
  status?: GoalStatus;
}
