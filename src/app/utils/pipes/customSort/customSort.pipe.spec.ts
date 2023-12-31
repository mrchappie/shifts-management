import { CustomSortPipe } from './customSort.pipe';

describe('SortShiftsPipe', () => {
  it('create an instance', () => {
    const pipe = new CustomSortPipe();
    expect(pipe).toBeTruthy();
  });
});
