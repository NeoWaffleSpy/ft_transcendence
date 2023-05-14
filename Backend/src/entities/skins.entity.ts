import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users.entity";

@Entity({name: 'skin'})
export class Skin
{
	@PrimaryGeneratedColumn()
	skin_id!: number;

	@Column({nullable: false})
	type!: string;

	@Column({nullable: true})
	img_url!: string;

	@Column({nullable: false})
	name!: string;

	@ManyToMany(() => User, (user) => user.skin, { onDelete: 'CASCADE' }) user: User[];
}