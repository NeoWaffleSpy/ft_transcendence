import { Injectable } from '@nestjs/common';
import { ItemsService } from '../items/items.service';

@Injectable()
export class RequestService {
	constructor(private itemsService: ItemsService)
	{}

	async handleFriendRequestInvite(sourceId: number, targetId: number) {
		if (!(await this.itemsService.canSendRequest(sourceId, targetId)))
			return null;
		else if (!(await this.itemsService.addFriendRequestToUsers(sourceId, targetId)))
			return null;
	}

	async handleFriendRequestAnswer(sourceId: number, targetId: number) {
		return (await this.itemsService.addFriendToUser(sourceId, targetId))
	}
}
