const mockOpenAIFactory = {
  createService: jest.fn((type, options) => ({
    execute: jest.fn().mockResolvedValue('Mocked response')
  }))
};

module.exports = mockOpenAIFactory;
