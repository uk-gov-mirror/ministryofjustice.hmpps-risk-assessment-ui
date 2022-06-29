afterAll(async () => {
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 1000))
})
jest.mock('redis', () => jest.requireActual('redis-mock'))
