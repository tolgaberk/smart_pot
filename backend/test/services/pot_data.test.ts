import app from '../../src/app';

describe('\'pot_data\' service', () => {
  it('registered the service', () => {
    const service = app.service('pot-data');
    expect(service).toBeTruthy();
  });
});
