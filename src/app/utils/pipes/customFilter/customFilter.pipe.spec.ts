import { CustomFilterPipe } from './customFilter.pipe';

describe('FilterShiftsPipe', () => {
  it('create an instance', () => {
    const pipe = new CustomFilterPipe();
    expect(pipe).toBeTruthy();
  });
});
