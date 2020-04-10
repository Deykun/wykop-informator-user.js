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
			status: STATES.find( s => s.name === status ).code,
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
	let store = getStore()
	const { checked, consulted } = store.latest
	const total = {}
	const change = {}
	STATES.forEach( s => {
		total[s.code] = 0
		change[s.code] = 0
	})

	violations.forEach( violation => {
		const { id, status } = violation
		total[status]++
		if ( save ) {
			if ( !checked.includes( id ) && [...RESOLVED_STATES, 'consultation'].includes( status ) ) {
				console.log('save new')
				console.log( violation )
				store = addViolationToStore( violation, store )
			} else if ( consulted.includes( id ) && RESOLVED_STATES.includes( status )  ) {
				console.log('save resolved') 
			}
		}
	})

	console.log( store )

	return {
		statistics: {
			total: total,
			change: change
		}
	}
}

