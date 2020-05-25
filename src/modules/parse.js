const getViolations = () => {
  const violations = []
  document.getElementById('violationsList').querySelectorAll('tbody tr').forEach( vTr => {
    const id = vTr.querySelector('td:nth-child(3) p').textContent.split(':').reverse().pop()
    const status = vTr.querySelector('td:nth-child(4) .fbold') && vTr.querySelector('td:nth-child(4) .fbold').textContent
    const reason = vTr.querySelector('td:nth-child(3) .fbold') && vTr.querySelector('td:nth-child(3) .fbold').textContent
    const moderator = vTr.querySelector('td:nth-child(4) .fbold + span') && vTr.querySelector('td:nth-child(4) .fbold + span').textContent.split('przez').pop().trim()
    const date = vTr.querySelector('td:nth-child(4) time') && vTr.querySelector('td:nth-child(4) time').getAttribute('datetime')
		
    const violation = {
      id: id,
      moderator: moderator, 
      status: STATES.find( s => s.name === status || s.label === '' ).code,
      reason: reason,
      reasonKey: hashToKey(reason),
      date: date,
    }

    vTr.id = `v-${id}`

    if ( debug ) {
      console.log('Violation:', violation)
    }

    violations.push( violation )
  })
  return violations
}

const processViolations = ( violations, save=true ) => {
  let store = getState()
  const { seen, checked, inConsultation } = store.latest
  const total = {}
  const change = {}
  STATES.forEach( s => {
    total[s.code] = 0
    change[s.code] = 0
  })

  const newLatest = {
    seen: [],
    checked: [],
    inConsultation: []
  }

  violations.forEach( violation => {
    const { id, status } = violation
    total[status]++
    newLatest.seen.push( id )
    if ( !seen.includes( id ) ) {
      change[status]++
    }

    if ( CHECKED_STATES.includes( status ) ) {
      newLatest.checked.push( id )
      if ( status === 'consultation' ) {
        newLatest.inConsultation.push( id )
      }

      if ( !checked.includes( id ) ) {
        if ( seen.includes( id ) ) {
          change[status]++
        }
        if ( debug ) {
          console.log('New volation')
          console.log( violation )
        }
        store = addViolationToStore( violation, store )
      }
    }
		
    if ( seen.includes( id ) && inConsultation.includes( id ) && RESOLVED_STATES.includes( status )  ) {
      change[status]++
      console.log('Consultation') 
      store = addViolationToStore( violation, store )
      store = addConsultedViolationToStore( violation, store )	
    }
  })

  if ( save ) {
    console.log('Przed', store.latest)
    store.latest = newLatest
    console.log('Po', newLatest)
    saveState( store )
  }

  return {
    statistics: {
      total: total,
      change: change
    }
  }
}

