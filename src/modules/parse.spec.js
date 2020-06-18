import {
  processViolations,
} from './parse'

import {
  STATES,
  CHECKED_STATES,
} from './init'

import {
  getState,
} from './state'

describe('processViolations()', () => {
  const fakeRest = (id) => ({ id: `id${id}`, reason: `Reason ${id}`, reasonKey: `reason_${id}`})

  global.debug = false;
  global.STATES = STATES;
  global.CHECKED_STATES = CHECKED_STATES;
  global.getState = getState;
  global.addViolationToStore = ( _, store) => store;
  

  it('should save to store by default', () => {
    let calledSaveStore = 0;
    global.saveState = () => calledSaveStore++;
    
    processViolations([])
    
    expect(calledSaveStore).toEqual(1);
  })

  it('should not save to store with param false', () => {
    let calledSaveStore = 0;
    global.saveState = () => calledSaveStore++;
    
    processViolations([], false);

    expect(calledSaveStore).toEqual(0);
  })

  it('count all statuses', () => {    
    const violations = [
      { status: 'success', ...fakeRest(1)},
      { status: 'fail', ...fakeRest(2)},
      { status: 'changed', ...fakeRest(3)},
      { status: 'consultation', ...fakeRest(4) },
      { status: 'fresh', ...fakeRest(5)},
      { status: 'current', ...fakeRest(6)},
    ]
    const { statistics: { total } } = processViolations(violations);

    const totalCountent = Object.keys( total ).reduce( (stack, status ) => {
      stack += total[status]
      return stack;
    }, 0)

    expect(totalCountent).toEqual(violations.length);
  })
})