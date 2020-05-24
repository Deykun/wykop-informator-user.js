const initialStore = {
  settings: {
    hideThumbnails: true
  },
  latest: {
    seen: [],
    checked: [],
    inConsultation: []
  },
  total: {  
  },
  reasons: {
  },
  mods: {
  },
  consultation: {
    total: { },
    mods: { }
  }
}

const initStore = ( ) => {
  STATES.forEach( s => {
    initialStore.total[s.code] = 0
  })

  return initialStore
}

const getStore = () => localStorage.getItem('informator') ? JSON.parse( localStorage.getItem('informator') ) : initStore()

const saveStore = ( store ) => {
  localStorage.setItem('informator', JSON.stringify( store ) )
}

const addViolationToStore = ( violation, store ) => {
  const { reason, reasonKey, status, moderator, date } = violation

  store.total[status] = store.total[status] + 1

  if ( !store.reasons[reasonKey] ) {
    console.info(`Nowy powód "${reason}"`)
    store.reasons[reasonKey] = { title: reason, mods: {} }
  }
  store.reasons[reasonKey][status] = store.reasons[reasonKey][status] ? store.reasons[reasonKey][status] + 1 : 1
	
  if ( !store.reasons[reasonKey].mods[moderator] ) {
    console.info(`Nowy moderator ${moderator}`)
    store.reasons[reasonKey].mods[moderator] = { title: moderator }
  }
	
  store.reasons[reasonKey].mods[moderator][status] = store.reasons[reasonKey].mods[moderator][status] ? store.reasons[reasonKey].mods[moderator][status] + 1 : 1

  if ( !store.mods[moderator] ) {
    store.mods[moderator] = { title: moderator, total: {}, times: {} }
  }
  store.mods[moderator].total[status] = store.mods[moderator].total[status] ? store.mods[moderator].total[status] + 1 : 1

  const hours = new Date( date ).getHours()
  store.mods[moderator].times[hours] = store.mods[moderator].times[hours] ? store.mods[moderator].times[hours] + 1 : 1

  return store
}

const addConsultedViolationToStore = ( violation, store ) => {
  const { status, moderator } = violation

  store.consultation.total[status] = store.consultation.total[status] + 1
  store.consultation.mods[moderator][status] = store.consultation.mods[moderator][status] ? store.consultation.mods[moderator][status] + 1 : 1

  return store
}