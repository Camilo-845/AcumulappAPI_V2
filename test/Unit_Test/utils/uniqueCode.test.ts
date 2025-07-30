
import { generateAlphanumericCode } from '@/utils/uniqueCode';

describe('Unique Code Utils', () => {
  it('should generate an alphanumeric code of the specified length', () => {
    const length = 8;
    const code = generateAlphanumericCode(length);
    expect(code).toHaveLength(length);
    expect(code).toMatch(/^[a-zA-Z0-9]+$/);
  });

  it('should generate different codes for multiple calls', () => {
    const length = 10;
    const code1 = generateAlphanumericCode(length);
    const code2 = generateAlphanumericCode(length);
    expect(code1).not.toBe(code2);
  });

  
});
