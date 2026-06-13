import {
  Controller,
  Get,
  Post,
  Delete,
  UseGuards,
  Request,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecipesService } from './recipes.service';

@Controller('favorites')
@UseGuards(AuthGuard('jwt'))
export class FavoritesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  getFavorites(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.recipesService.getFavorites(req.user.id, {
      page,
      limit,
      search,
      category,
    });
  }

  @Get(':recipeId/status')
  getFavoriteStatus(@Request() req, @Param('recipeId') recipeId: string) {
    return this.recipesService.getFavoriteStatus(req.user.id, recipeId);
  }

  @Post()
  addFavorite(@Request() req, @Body('recipeId') recipeId: string) {
    return this.recipesService.addFavorite(req.user.id, recipeId);
  }

  @Delete(':recipeId')
  removeFavorite(@Request() req, @Param('recipeId') recipeId: string) {
    return this.recipesService.removeFavorite(req.user.id, recipeId);
  }
}
