import app from '../../src/app';

describe('\'flowers\' service', () => {
  it('registered the service', () => {
    const service = app.service('flowers');
    expect(service).toBeTruthy();
  });
});
