import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdatePersonalFieldsDto } from './update-personal-fields.dto';

describe('UpdatePersonalFieldsDto', () => {
  describe('when updating personal fields', () => {
    it('should accept valid update with owned field only', async () => {
      const dto = plainToInstance(UpdatePersonalFieldsDto, {
        owned: true,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept valid update with notes field only', async () => {
      const dto = plainToInstance(UpdatePersonalFieldsDto, {
        notes: 'Great game for parties!',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept valid update with all fields', async () => {
      const dto = plainToInstance(UpdatePersonalFieldsDto, {
        owned: true,
        notes: 'Amazing strategy game!',
        complexity: 4,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept empty update (all fields optional)', async () => {
      const dto = plainToInstance(UpdatePersonalFieldsDto, {});

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('when validation fails', () => {
    it('should reject owned field that is not a boolean', async () => {
      const dto = plainToInstance(UpdatePersonalFieldsDto, {
        owned: 'yes',
      });

      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'owned')).toBe(true);
    });

    it('should reject notes field that is not a string', async () => {
      const dto = plainToInstance(UpdatePersonalFieldsDto, {
        notes: 123,
      });

      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'notes')).toBe(true);
    });

    it('should reject complexity less than 1', async () => {
      const dto = plainToInstance(UpdatePersonalFieldsDto, {
        complexity: 0,
      });

      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'complexity')).toBe(true);
    });

    it('should reject complexity greater than 5', async () => {
      const dto = plainToInstance(UpdatePersonalFieldsDto, {
        complexity: 6,
      });

      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'complexity')).toBe(true);
    });

    it('should reject complexity that is not a number', async () => {
      const dto = plainToInstance(UpdatePersonalFieldsDto, {
        complexity: 'high',
      });

      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'complexity')).toBe(true);
    });
  });
});
