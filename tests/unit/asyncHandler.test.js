const asyncHandler = require('../../utils/asyncHandler');
test('Catches errors and passes to next', async () => {
  const mockReq = {}, mockRes = {}, mockNext = jest.fn();
  const error = new Error('Test error');
  const fn = async () => { throw error; };
  
  await asyncHandler(fn)(mockReq, mockRes, mockNext);
  expect(mockNext).toHaveBeenCalledWith(error);
});