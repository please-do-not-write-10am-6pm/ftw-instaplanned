import { nightsBetween } from './dates';

describe('date utils', () => {
  describe('nightsBetween()', () => {
    it('should fail if end date is before start date', () => {
      const start = new Date(2017, 0, 2);
      const end = new Date(2017, 0, 1);
      expect(() => nightsBetween(start, end)).toThrow('End date cannot be before start date');
    });
    it('should handle equal start and end dates', () => {
      const d = new Date(2017, 0, 1);
      expect(nightsBetween(d, d)).toEqual(0);
    });
    it('should calculate night count for a single night', () => {
      const start = new Date(2017, 0, 1);
      const end = new Date(2017, 0, 2);
      expect(nightsBetween(start, end)).toEqual(1);
    });
    it('should calculate night count', () => {
      const start = new Date(2017, 0, 1);
      const end = new Date(2017, 0, 3);
      expect(nightsBetween(start, end)).toEqual(2);
    });
  });
});
