import {
  IsOptional,
  IsString,
  IsNumber,
  IsObject,
  ValidateNested,
  IsArray,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

class PreferencesDto {
  @IsOptional()
  @IsString()
  dietType?: string;

  @IsOptional()
  @IsArray()
  allergies?: string[];

  @IsOptional()
  @IsArray()
  dislikedIngredients?: string[];

  @IsOptional()
  @IsArray()
  likedIngredients?: string[];

  @IsOptional()
  @IsArray()
  cuisineTags?: string[];

  @IsOptional()
  @IsNumber()
  maxCookingTime?: number;

  @IsOptional()
  @IsNumber()
  budgetPerMeal?: number;

  @IsOptional()
  @IsNumber()
  servings?: number;

  @IsOptional()
  @IsString()
  healthConditions?: string;

  @IsOptional()
  @IsNumber()
  maxSugarPerMeal?: number;

  @IsOptional()
  @IsNumber()
  maxSodiumPerMeal?: number;

  @IsOptional()
  @IsNumber()
  minProteinPerMeal?: number;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(300)
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(250)
  height?: number;

  @IsOptional()
  @IsString()
  activityLevel?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PreferencesDto)
  preferences?: PreferencesDto;
}
