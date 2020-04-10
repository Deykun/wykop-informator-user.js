// ==UserScript==
// @name        	Informator
// @namespace   	http://www.wykop.pl/ludzie/Deykun
// @description 	Dodatkowe informacje o zgłoszeniach w panelu naruszeń portalu Wykop.pl.
// @author      	Deykun
// @icon        	http://x3.cdn03.imgwykop.pl/c3201142/comment_bWVFKhjLOfg5B1xNe08BMxJTQF4qMS8V.gif
// @include	    	htt*wykop.pl/naruszenia/*
// @version     	4.00
// @grant       	none
// @run-at      	document-end
//
// ==/UserScript==

const version = '4'
console.info(`%c Informator ${version}`, 'color: white; background: #4383af; padding: 10px 35px; font-size: 1rem; font-family: Arial, Verdana; border-radius: 5px;')

const darkmode = Array.from( document.body.classList ).includes('night')

const debug = true

const STATES = [
	{
		code: 'success',
		name: 'Prawidłowe',
		color: '#8aa380',
	},
	{
		code: 'fail',
		name: 'Nieprawidłowe',
		color: '#b3868f',
	},
	{
		code: 'changed',
		name: 'Zmieniony powód',
		color: '#d4cbad',
	},
	{
		code: 'consultation',
		name: 'W konsultacji',
		color: '#62a2b1',
	},
	{
		code: 'fresh',
		name: 'Nowe',
		color: '#8cb1ba',
	},
	{
		code: 'current',
		name: '',
		color: '#717171',
	},
]


const LSinitState = {
	total: { },
	reasons: {

	},
	mods: {

	}
}
STATES.forEach( s => {
	LSinitState.total[s.code] = 0
})

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



const appendCSS = ( styles ) => {
	const style = document.createElement('style')
	style.innerHTML = styles
	document.head.append(style)
}

const appendColorsCSS = ( ) => {
	let colorsCSS = ''
	STATES.forEach( s => {
		colorsCSS += `
			.in-txt-${s.code} { color: ${s.color} !important; }
			.in-bg-${s.code} { background-color: ${s.color} !important; }
		`
	})
	appendCSS( colorsCSS )
}

const renderLink = ( stats ) => {
	appendColorsCSS()
	appendCSS(`
		.in-m__box {
			display: inline-block;
			height: 13px;
			min-width: 13px;
			vertical-align: middle;
			border-radius: 10px;
			margin: 0 6px;
		}
		.in-m__value {
			vertical-align: middle;
			position: relative;
		}
		.in-m__value[data-change]::before {
			content: attr(data-change);
			position: absolute;
			top: 100%;
			left: 50%;
			transform: translateX( -50% );
			font-size: 10px;
			line-height: 10px;
			color: white;
			background-color: #4383af;
		}
		.in-m > :last-child {
			margin-right: 25px;
		}
  `)
  
	let linkToStats
	if ( stats.total ) {
		let statsHTML = ''
		Object.keys( stats.total ).forEach( status => {
			const value = stats.total[status]
			if ( value > 0 ) {
				const valueEl = `<span class="in-m__value" ${stats.change[status] ? `data-change="${stats.change[status]}"` : ''}>${value}</span>`
				const boxEl = `<span class="in-m__box in-bg-${status}"></span>`
				statsHTML += `<span class="in-m in-m--${status}">${status === 'fail' ? boxEl+valueEl : valueEl+boxEl}</span>`
			}
		})
		linkToStats = `<li>
			<a href="http://www.wykop.pl/naruszenia/informator">
				${statsHTML}
			</a>
		</liv>`
	} else {
		linkToStats = '<li><a href="http://www.wykop.pl/naruszenia/informator">Statystyki</a></liv>'
	}
	document.querySelector('.bspace > ul:last-child').innerHTML += linkToStats
}

if ( document.location.pathname.match('/naruszenia/moje') ) {
	const violations = getViolations()
	console.log( violations )
	const { statistics } = processViolations( violations )
	console.log( statistics )
	if ( statistics.change ) {
		// Saving change
	}
	renderLink( statistics )
}
	