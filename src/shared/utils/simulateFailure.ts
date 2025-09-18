import { FAILURE_RATE } from '@constants/api-simulation';

/**
 * Simulates a failure scenario based on a given failure rate.
 *
 * This utility function executes one of two provided callbacks: `callback` or `fallback`,
 * depending on whether a randomly generated number falls below the specified failure rate.
 *
 * @param callback - The function to execute if the simulated operation succeeds.
 * @param fallback - The function to execute if the simulated operation fails.
 * @param rate - The probability of failure, represented as a number between 0 and 1.
 *               Defaults to the `FAILURE_RATE` constant.
 */
export function simulateFailure(
  callback: () => void,
  fallback: () => void,
  rate = FAILURE_RATE
): void {
  if (Math.random() < rate) {
    fallback();
  } else {
    callback();
  }
}
