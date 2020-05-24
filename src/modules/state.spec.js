const rewire = require('rewire')
const initModule = rewire('./init.js')
const stateModule = rewire('./state.js')

const STATES = initModule.__get__('STATES')
stateModule.__set__('STATES', STATES)
const getStore = stateModule.__get__('getStore')
const initialStore = stateModule.__get__('initialStore')

describe('getStore()', () => {
  it('should init store for empty localStorage with totals', () => {
    stateModule.__set__('localStorage', { getItem: () => null })

    const store = getStore()

    const lengthOfTotals = Object.keys( store.total ).length

    expect( lengthOfTotals ).toBeGreaterThan( 0 )
    expect( lengthOfTotals ).toEqual( STATES.length )

    expect(store).toEqual(initialStore)
  })

  it('should return saved JSON state from localStorage', () => {
    const fakeStore = {
      testProperty: 'testPropertyValue'
    }
    stateModule.__set__('localStorage', { getItem: () => JSON.stringify( fakeStore ) })

    const store = getStore()

    expect(store.testProperty).toEqual(fakeStore.testProperty)
  })
})