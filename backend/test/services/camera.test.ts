import app from '../../src/app';

describe('\'camera\' service', () => {
  it('registered the service', () => {
    const service = app.service('camera');
    expect(service).toBeTruthy();
  });
});
