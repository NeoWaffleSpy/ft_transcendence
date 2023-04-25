import { MatchEntity } from 'src/entities';
import { Player } from './Matchmaking.dto';
import { GamesService } from '../services/game/game.service';

export class MatchDto {
	entity: MatchEntity;
	players: Array<Player>;
	gameService: GamesService;
}
