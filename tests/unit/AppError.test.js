const AppError = require('../../utils/AppError');
test('Creates AppError with correct status', () => {
  const err = new AppError('Not found', 404);
  expect(err.statusCode).toBe(404);
  expect(err.status).toBe('fail');
  expect(err.isOperational).toBe(true);
  expect(err).toBeInstanceOf(Error);
});