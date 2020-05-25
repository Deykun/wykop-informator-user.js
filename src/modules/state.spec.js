const rewire = require('rewire')
const initModule = rewire('./init.js')
const stateModule = rewire('./state.js')

const STATES = initModule.__get__('STATES')
stateModule.__set__('STATES', STATES)
const getState = stateModule.__get__('getState')
const saveState = stateModule.__get__('saveState')
const initialStore = stateModule.__get__('initialStore')

describe('getState()', () => {
  it('should init store for empty localStorage with totals', () => {
    stateModule.__set__('localStorage', { getItem: () => null })

    const state = getState()

    const lengthOfTotals = Object.keys( state.total ).length

    expect( lengthOfTotals ).toBeGreaterThan( 0 )
    expect( lengthOfTotals ).toEqual( STATES.length )

    expect(state).toEqual(initialStore)
  })

  it('should use "informator" as itemKey', () => {
    let usedKey
    stateModule.__set__('localStorage', { getItem: (key) => {
      usedKey = key
      return null
    }})

    getState()

    expect( usedKey ).toEqual( 'informator' )
  })

  it('should return saved JSON state from localStorage', () => {
    const fakeState = {
      str: 'text'
    }
    stateModule.__set__('localStorage', { getItem: () => JSON.stringify( fakeState ) })

    const state = getState()

    expect(state.str).toEqual(fakeState.str)
  })

  it('should save state as valid JSON string', () => {
    const fakeState = { 
      str: 'text', 
      int: 1, 
      arr: [0,1,2], 
      obj: {} 
    }

    let JSONstate
    stateModule.__set__('localStorage', { setItem: (key, value) => {
      JSONstate = value
    }})

    saveState(fakeState)

    expect(typeof JSONstate).toEqual('string')

    const state = JSON.parse( JSONstate )
    expect(state.arr).toEqual(fakeState.arr)
    
  })
})