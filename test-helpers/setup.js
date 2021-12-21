afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
})
jest.mock('redis', () => jest.requireActual('redis-mock'))
