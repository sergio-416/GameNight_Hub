import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Location,
  LocationDocument,
} from '../infrastructure/persistence/mongodb/location.schema';
import { CreateLocationDto } from '../presentation/dto/create-location.dto';
import { UpdateLocationDto } from '../presentation/dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Location.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {}

  async create(
    createLocationDto: CreateLocationDto,
  ): Promise<LocationDocument> {
    return this.locationModel.create(createLocationDto);
  }

  async findAll(): Promise<LocationDocument[]> {
    return this.locationModel.find().exec();
  }

  async findOne(id: string): Promise<LocationDocument | null> {
    return this.locationModel.findById(id).exec();
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<LocationDocument | null> {
    return this.locationModel
      .findByIdAndUpdate(id, updateLocationDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<LocationDocument | null> {
    return this.locationModel.findByIdAndDelete(id).exec();
  }

  async findInBounds(
    swLat: number,
    swLng: number,
    neLat: number,
    neLng: number,
    venueTypes?: string[],
  ): Promise<LocationDocument[]> {
    const query: Record<string, unknown> = {
      latitude: { $gte: swLat, $lte: neLat },
      longitude: { $gte: swLng, $lte: neLng },
    };
    if (venueTypes?.length) {
      query.venueType = { $in: venueTypes };
    }

    return this.locationModel.find(query).exec();
  }
}
