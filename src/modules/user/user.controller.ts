import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post
} from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiOperation({
        summary: 'Create new user',
        description: 'Creates a new user with the provided data'
    })
    @ApiCreatedResponse({
        description: 'User has been created successfully'
    })
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Get all users',
        description: 'Retrieves a list of all registered users'
    })
    @ApiOkResponse({ description: 'List of all users' })
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get user by id',
        description: 'Retrieves a specific user by their unique identifier'
    })
    @ApiOkResponse({ description: 'User found' })
    findOne(@Param('id') id: string): Promise<User> {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Update user',
        description: "Updates an existing user's information"
    })
    @ApiOkResponse({
        description: 'User has been updated successfully'
    })
    update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<User> {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete user',
        description: 'Removes a user from the system'
    })
    @ApiOkResponse({
        description: 'User has been deleted successfully'
    })
    remove(@Param('id') id: string): Promise<User> {
        return this.userService.remove(id);
    }
}
