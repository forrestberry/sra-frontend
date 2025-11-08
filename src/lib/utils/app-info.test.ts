import { describe, expect, it } from 'vitest';

import { getRolePath, ROLE_PATHS } from './app-info';

describe('getRolePath', () => {
  it('returns mapped path for supported role', () => {
    expect(getRolePath('parent')).toBe(ROLE_PATHS.parent);
    expect(getRolePath('student')).toBe(ROLE_PATHS.student);
  });

  it('falls back to root for unsupported values', () => {
    expect(getRolePath('admin')).toBe('/');
    expect(getRolePath(undefined)).toBe('/');
    expect(getRolePath(null)).toBe('/');
  });
});
