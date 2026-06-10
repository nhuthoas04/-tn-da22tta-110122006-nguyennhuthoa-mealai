import {
    IsString, IsNotEmpty, IsInt, IsOptional, IsArray,
    IsNumber, Min, IsBoolean, ValidateNested, IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

class StepDto {
    @IsInt()
    step: number;

    @IsString()
    @IsNotEmpty()
    description: string;
}

class IngredientItemDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    quantity: number;

    @IsString()
    @IsNotEmpty()
    unit: string;

    @IsBoolean()
    @IsOptional()
    isOptional?: boolean;
}

export class CreateRecipeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsInt()
    @Min(1)
    cookingTime: number;

    @IsInt()
    @IsOptional()
    servings?: number;

    @IsString()
    @IsOptional()
    difficulty?: string;

    @IsInt()
    @Min(0)
    calories: number;

    @IsNumber()
    @IsOptional()
    protein?: number;

    @IsNumber()
    @IsOptional()
    carbs?: number;

    @IsNumber()
    @IsOptional()
    fat?: number;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    mealType?: string[];

    @IsString()
    @IsOptional()
    cuisineRegion?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StepDto)
    steps: StepDto[];

    @IsNumber()
    @IsOptional()
    estimatedCost?: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => IngredientItemDto)
    @IsOptional()
    ingredients?: IngredientItemDto[];
}

export class RejectRecipeDto {
    @IsString()
    @IsNotEmpty()
    reason: string;
}
