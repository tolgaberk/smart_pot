import app from '../../src/app';

describe('\'blogs\' service', () => {
  it('registered the service', () => {
    const service = app.service('blogs');
    expect(service).toBeTruthy();
  });
});
