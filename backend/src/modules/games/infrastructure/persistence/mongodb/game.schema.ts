import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BoardGameDocument = HydratedDocument<BoardGame>;
@Schema({ timestamps: true })
export class BoardGame {
  @Prop({ required: true })
  name: string;

  @Prop()
  bggId?: number;

  @Prop()
  yearpublished?: number;

  @Prop()
  minplayers?: number;

  @Prop()
  maxplayers?: number;

  @Prop()
  playingtime?: number;

  @Prop()
  minage?: number;

  @Prop()
  description?: string;

  @Prop({ type: [String] })
  categories?: string[];

  @Prop({ type: [String] })
  mechanics?: string[];

  @Prop()
  publisher?: string;

  @Prop({ required: true, default: false })
  owned: boolean;

  @Prop()
  notes?: string;

  @Prop({ min: 1, max: 5 })
  complexity?: number;

  @Prop()
  createdAt?: Date;
}

export const BoardGameSchema = SchemaFactory.createForClass(BoardGame);
