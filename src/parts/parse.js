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


const processViolations = ( violations, save=false ) => {
	// const checked = getAlreadyChecked()
	// const inConsultation = getInConsultation()
	const total = {}
	const change = {}
	STATES.forEach( s => {
		total[s.code] = 1
		change[s.code] = 2
	})

	violations.forEach( v => {
		total[v.status]++
	})

	return {
		statistics: {
			total: total,
			change: Object.keys( change ).some( idx => change[idx] > 0 ) ? change : null
		}
	}
}

