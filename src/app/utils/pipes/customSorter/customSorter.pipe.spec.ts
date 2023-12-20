import { CustomSorterPipe } from './customSorter.pipe';

describe('SorterShiftsPipe', () => {
  it('create an instance', () => {
    const pipe = new CustomSorterPipe();
    expect(pipe).toBeTruthy();
  });
});
