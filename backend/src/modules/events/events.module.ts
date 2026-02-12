import { MongooseModule } from '@nestjs/mongoose';
import {
  Event,
  EventSchema,
} from './infrastructure/persistence/mongodb/event.schema';
import { EventsService } from './application/events.service';
import { EventsController } from './presentation/events.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
