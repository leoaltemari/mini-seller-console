import { simulateFailure } from '../simulateFailure';

describe('simulateFailure', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('calls callback when random number is above failure rate', () => {
    const callback = jest.fn();
    const fallback = jest.fn();

    // Mock Math.random to return 0.9, higher than failure rate 0.5
    jest.spyOn(Math, 'random').mockReturnValue(0.9);

    simulateFailure(callback, fallback, 0.5);

    expect(callback).toHaveBeenCalled();
    expect(fallback).not.toHaveBeenCalled();
  });

  it('calls fallback when random number is below failure rate', () => {
    const callback = jest.fn();
    const fallback = jest.fn();

    // Mock Math.random to return 0.1, lower than failure rate 0.5
    jest.spyOn(Math, 'random').mockReturnValue(0.1);

    simulateFailure(callback, fallback, 0.5);

    expect(fallback).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
  });

  it('uses default FAILURE_RATE when rate is not provided', () => {
    const callback = jest.fn();
    const fallback = jest.fn();

    // If FAILURE_RATE is 0.5, mock Math.random to 0.6 so callback runs
    jest.spyOn(Math, 'random').mockReturnValue(0.6);

    simulateFailure(callback, fallback);

    expect(callback).toHaveBeenCalled();
    expect(fallback).not.toHaveBeenCalled();
  });
});
