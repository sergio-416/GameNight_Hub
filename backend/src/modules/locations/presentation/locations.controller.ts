import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LocationsService } from '../application/locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(id);
  }

  @Get('bounds')
  findInBounds(
    @Query('swLat') swLat: string,
    @Query('swLng') swLng: string,
    @Query('neLat') neLat: string,
    @Query('neLng') neLng: string,
    @Query('venueType') venueType?: string,
  ) {
    const types = venueType ? venueType.split(',') : [];

    return this.locationsService.findInBounds(
      parseFloat(swLat),
      parseFloat(swLng),
      parseFloat(neLat),
      parseFloat(neLng),
      types,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationsService.remove(id);
  }
}
