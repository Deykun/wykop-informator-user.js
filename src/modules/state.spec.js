
import {
  STATES,
} from './init'

import {
  getState,
  saveState,
  initialStore,
} from './state'

describe('getState()', () => {
  global.STATES = STATES;

  var localStorageMock = {}; 

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });

  it('should init store for empty window.localStorage with totals', () => {
    window.localStorage.getItem = () => null

    const state = getState()

    const lengthOfTotals = Object.keys( state.total ).length

    expect( lengthOfTotals ).toBeGreaterThan( 0 )
    expect( lengthOfTotals ).toEqual( STATES.length )

    expect(state).toEqual(initialStore)
  })

  it('should use "informator" as itemKey', () => {
    let usedKey
    window.localStorage.getItem = (key) => {
      usedKey = key
      return null
    }

    getState()

    expect( usedKey ).toEqual( 'informator' )
  })

  it('should return saved JSON state from window.localStorage', () => {
    const fakeState = {
      str: 'text'
    }
    global.window.localStorage.getItem = () => {
      return JSON.stringify( fakeState )
    }

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
    window.localStorage.setItem = (key, value) => {
      JSONstate = value
    }

    saveState(fakeState)

    expect(typeof JSONstate).toEqual('string')

    const state = JSON.parse( JSONstate )
    expect(state.arr).toEqual(fakeState.arr)
    
  })
})