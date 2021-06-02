const { areaSelectionController } = require('./get.controller')

describe('get areas', () => {
  const req = {
    flash: jest.fn(),
  }
  const res = {
    render: jest.fn(),
  }

  beforeEach(() => {
    const testRegions = [
      {
        name: 'Hertfordshire',
        code: 'HFS',
      },
      {
        name: 'West Yorkshire',
        code: 'YSW',
      },
      {
        name: 'Lancashire',
        code: 'LAN',
      },
      {
        name: 'Lancashire 2 (HMP)',
        code: 'LAN2',
      },
    ]
    req.flash.mockReturnValue([JSON.stringify(testRegions)])
  })

  it('should call render with the correct areas', async () => {
    const expected = {
      areas: [
        {
          text: 'Hertfordshire',
          value: '{"areaName":"Hertfordshire","areaCode":"HFS"}',
        },
        {
          text: 'West Yorkshire',
          value: '{"areaName":"West Yorkshire","areaCode":"YSW"}',
        },
        {
          text: 'Lancashire',
          value: '{"areaName":"Lancashire","areaCode":"LAN"}',
        },
        {
          text: 'Lancashire 2 (HMP)',
          value: '{"areaName":"Lancashire 2 (HMP)","areaCode":"LAN2"}',
        },
      ],
    }
    await areaSelectionController(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })

  it('should render the error page', async () => {
    const theError = new Error('Error message')
    req.flash.mockImplementation(() => {
      throw theError
    })
    await areaSelectionController(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
