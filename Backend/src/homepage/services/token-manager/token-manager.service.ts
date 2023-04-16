import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class TokenManagerService {
	constructor(private jwtService: JwtService) {}

	public extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}

	public getToken(token: string) {
		console.log('Token recieved');
		console.log(token);
		let keyClean;
		if (!token)
			throw new HttpException(
				'No authentication token provided',
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		try {
			keyClean = this.jwtService.verify(token);
		} catch (error) {
			throw new HttpException('Wrong token', HttpStatus.UNAUTHORIZED);
		}
		return keyClean;
	}

	public getUsernameFromToken(request: Request) {
		return this.getToken(this.extractTokenFromHeader(request)).name;
	}
	public getIdFromToken(request: Request) {
		return this.getToken(this.extractTokenFromHeader(request)).sub;
	}
}
