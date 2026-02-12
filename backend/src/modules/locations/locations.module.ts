import { MongooseModule } from '@nestjs/mongoose';
import {
  Location,
  LocationSchema,
} from './infrastructure/persistence/mongodb/location.schema';
import { LocationsService } from './application/locations.service';
import { LocationsController } from './presentation/locations.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
  ],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}
