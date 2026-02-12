import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LocationDocument = HydratedDocument<Location>;

@Schema({ timestamps: true })
export class Location {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop()
  address?: string;

  @Prop({ enum: ['cafe', 'store', 'home', 'public_space', 'other'] })
  venueType?: string;

  @Prop()
  capacity?: number;

  @Prop({ type: [String] })
  amenities?: string[];

  @Prop()
  description?: string;

  @Prop()
  hostName?: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
