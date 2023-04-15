/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Options,
	Param,
	ParseIntPipe,
	Post,
	Req,
	Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from '../../services/users/users.service';
import { NewUserDto } from '../../dtos/UserDto.dto';
import { AuthService } from 'src/homepage/services/auth/auth.service';
import { ItemsService } from 'src/homepage/services/items/items.service';
import { TokenManagerService } from 'src/homepage/services/token-manager/token-manager.service';
import { plainToClass } from 'class-transformer';
import { AnyProfileUserDto } from 'src/homepage/dtos/UserDto.dto';
import { ChannelsService } from 'src/homepage/services/channels/channels.service';

@Controller('users')
export class UsersController {
	constructor(
		private usersService: UsersService,
		private authService: AuthService,
		private itemsService: ItemsService,
		private tokenManager: TokenManagerService,
		private channelService: ChannelsService,
	) {}

	@Get('')
	async getUsers(@Req() req: Request, @Res() res: Response) {
		const userList = await this.usersService.getAllUsers();
		if (!userList) res.status(HttpStatus.NO_CONTENT).send({ msg: 'No users registered' });
		const serializedUsers = userList.map((user) => plainToClass(AnyProfileUserDto, user));
		res.status(HttpStatus.FOUND).send(serializedUsers);
	}

	@Post('create')
	async createUser(
		@Req() req: Request,
		@Res() res: Response,
		@Body() newUserDto: NewUserDto,
	) {
		const check_username = await this.usersService.checkUserByName(newUserDto.login);
		if (check_username && check_username.user_id === newUserDto.id)
			return res.status(HttpStatus.NOT_MODIFIED).send('You can\'t use the same username');
		else if (check_username)
			return res.status(HttpStatus.NOT_MODIFIED).send('Username is already taken');
		const check_id = await this.usersService.checkUserById(newUserDto.id);
		const userEntity = await this.usersService.createUser(newUserDto);
		if (!check_id)
			await this.channelService.addUserToChannel(userEntity.user_id, 1);
		const user_id = newUserDto.id;
		console.log(newUserDto);
		return res.status(HttpStatus.OK).send({
			msg: 'User created',
			token: await this.authService.login(newUserDto, user_id),
			user_id: user_id,
			username: userEntity.username,
		});
	}

	@Get('add_achievement')
	async addAchievement(@Req() req: Request, @Res() res: Response) {
		console.log('pass1');
		const user_id = await this.tokenManager.getIdFromToken(req);
		this.itemsService.addAchievementsToUser(user_id, 1);
		res.status(HttpStatus.OK).send('Achievement added');
	}

	@Get('add_friend/:id')
	async addFriend(
		@Param('id', ParseIntPipe) friend_id: number,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const user_id = this.tokenManager.getIdFromToken(req);

		console.log(friend_id);
		this.itemsService.addFriendToUser(user_id, friend_id);
		res.status(HttpStatus.OK).send('Friend added');
	}

	@Get(':username')
	async getUser(@Param('username') us: string, @Req() req: Request, @Res() res: Response) {
		const user = await this.itemsService.getUserByUsername(us);
		if (user) 
			res.status(HttpStatus.OK).send({
				msg: 'User connected',
				token: await this.authService.login(plainToClass(NewUserDto, user), user.user_id),
				user_id: user.user_id,
				username: user.username,
			});
		else res.status(HttpStatus.NOT_FOUND).send({ msg: 'User not found' });
	}
}
