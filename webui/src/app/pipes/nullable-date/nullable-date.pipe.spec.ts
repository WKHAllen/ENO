import { NullableDatePipe } from './nullable-date.pipe';

describe('NullableDatePipe', () => {
  it('create an instance', () => {
    const pipe = new NullableDatePipe();
    expect(pipe).toBeTruthy();
  });
});
