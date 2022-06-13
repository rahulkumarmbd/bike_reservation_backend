import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/AuthGuard/AuthGuard';
import { RoleGuard } from 'src/AuthGuard/RoleGuard';
import { JoiValidationPipe } from 'src/joi-validation.pipes';
import { Role } from 'src/userroles';
import { Auth, IAuth } from 'src/utils/auth.decorator';
import { Comment } from './comment.entity';
import { createCommentSchema } from './comment.schema';
import { commentService, ResponseComments } from './comment.service';

@Controller('comments')
export class commentController {
  constructor(private readonly commentService: commentService) {}

  @RoleGuard(Role.Regular, Role.Manager)
  @UseGuards(AuthGuard)
  @Post('/:id')
  @UsePipes(new JoiValidationPipe(createCommentSchema))
  addComment(
    @Param() { id }: { id: number },
    @Auth() auth: IAuth,
    @Body() review: Comment,
    @Query() { page, limit }: { page: string; limit: string },
  ): Promise<ResponseComments> {
    return this.commentService.addComment(id, auth, review, +page, +limit);
  }

  @RoleGuard(Role.Regular, Role.Manager)
  @UseGuards(AuthGuard)
  @Get('/:id')
  @UsePipes(new JoiValidationPipe(createCommentSchema))
  getReviews(
    @Param() { id }: { id: number },
    @Query() { page, limit }: { page: string; limit: string },
  ): Promise<ResponseComments> {
    return this.commentService.getReviews(id, +page, +limit);
  }
}
