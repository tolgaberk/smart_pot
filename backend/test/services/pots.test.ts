import app from '../../src/app';

describe('\'pots\' service', () => {
  it('registered the service', () => {
    const service = app.service('pots');
    expect(service).toBeTruthy();
  });
});
