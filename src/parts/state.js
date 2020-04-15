const getStore = ( ) => {
	const initStore = {
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
		}
	}
	STATES.forEach( s => {
		initStore.total[s.code] = 0
	})

	let store = localStorage.getItem('informator') ? JSON.parse( localStorage.getItem('informator') ) : initStore

	return store
}

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
		store.mods[moderator] = { title: moderator, times: { } }
	}

	const hours = new Date( date ).getHours()

	store.mods[moderator].times[hours] = store.mods[moderator].times[hours] ? store.mods[moderator].times[hours] + 1 : 1

	return store
}