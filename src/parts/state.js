// const LSexampleState = {
// 	total: {
// 	},
// 	reasons: {
// 		nieprawidlowe_tagi: {
// 			title,
// 			success,
// 			fail,
// 			consultation,
// 			mods: {
// 				mtm: {
// 					success,
// 					fail,
// 					consultation
// 				}
// 			}
// 		}
// 	},
// 	mods: {
// 		success,
// 		fail,
// 		consultation
// 	}
// }

const getStore = ( ) => {
	const defaultInitState = {
		latest: {
			checked: [],
			consulted: []
		},
		total: {  
		},
		reasons: {
		},
		mods: {
		}
	}
	STATES.forEach( s => {
		defaultInitState.total[s.code] = 0
	})

	return defaultInitState
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