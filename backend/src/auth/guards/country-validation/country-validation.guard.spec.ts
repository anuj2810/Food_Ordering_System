import { CountryValidationGuard } from './country-validation.guard';

describe('CountryValidationGuard', () => {
  it('should be defined', () => {
    expect(new CountryValidationGuard()).toBeDefined();
  });
});
