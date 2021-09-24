const { splitPredictorScores } = require('./predictors')

const predictors = [
  {
    type: 'RSR',
    scores: {
      RSR: {
        level: 'HIGH',
        score: 11.34,
        isValid: true,
        date: '2021-07-23T12:00',
      },
      OSPC: {
        level: 'MEDIUM',
        score: 8.76,
        isValid: true,
        date: '2021-07-23T12:00',
      },
      OSPI: {
        level: 'LOW',
        score: 3.45,
        isValid: true,
        date: '2021-07-23T12:00',
      },
    },
  },
]

describe('should format the predictors ready to be displayed', () => {
  it('formats the predictors', () => {
    const expected = {
      current: {
        date: '23 Jul 2021 at 12:00:00',
        scores: {
          OSPC: {
            level: 'MEDIUM',
            score: 8.76,
            type: 'OSP/C',
          },
          OSPI: {
            level: 'LOW',
            score: 3.45,
            type: 'OSP/I',
          },
          RSR: {
            level: 'HIGH',
            score: 11.34,
            type: 'RSR',
          },
        },
      },
      historical: [],
    }
    expect(splitPredictorScores(predictors)).toEqual(expected)
  })
})
