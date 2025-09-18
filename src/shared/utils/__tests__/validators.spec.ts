import { isValidEmail } from '../validators';

describe('isValidEmail', () => {
  it('returns true for a valid email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name+tag+sorting@example.co.uk')).toBe(true);
    expect(isValidEmail('user_name@example.io')).toBe(true);
  });

  it('returns false for an invalid email', () => {
    expect(isValidEmail('plainaddress')).toBe(false);
    expect(isValidEmail('missingatsign.com')).toBe(false);
    expect(isValidEmail('@missingusername.com')).toBe(false);
    expect(isValidEmail('username@.com')).toBe(false);
    expect(isValidEmail('username@com')).toBe(false);
  });

  it('returns false for empty string or whitespace', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('   ')).toBe(false);
  });
});
