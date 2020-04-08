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

const getList = () => {
	const list = []
	document.getElementById('violationsList').querySelectorAll('tbody tr').forEach( vTr => {
		const id = vTr.querySelector('td:nth-child(3) p').textContent.split(':').reverse().pop()
		const status = vTr.querySelector('td:nth-child(4) .fbold').textContent
		const reason = vTr.querySelector('td:nth-child(3) .fbold').textContent
		const moderator = vTr.querySelector('td:nth-child(4) .fbold + span').textContent.split('przez').pop().trim()
		const date = vTr.querySelector('td:nth-child(4) time') ? vTr.querySelector('td:nth-child(4) time').getAttribute('datetime') : null
		
		const violation = {
			id: id,
			moderator: moderator, 
			status: STATES.find( s => s.name === status ).code,
			reason: reason,
			date: date,
		}

		vTr.id = `v-${id}`

		list.push( violation )
	})
	return list
}

const getVolationsStats = ( violations ) => {
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
		total: total,
		change: Object.keys( change ).some( idx => change[idx] > 0 ) ? change : null
	}
}

const renderMiniStats = ( stats ) => {
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
		}
		.in-m > :last-child {
			margin-right: 25px;
		}
	`)
	let linkToStats
	if ( stats.total ) {
		console.log(stats.total)
		let statsHTML = ''
		Object.keys( stats.total ).forEach( status => {
			const value = stats.total[status]
			if ( value > 0 ) {
				const valueEl = `<span class="in-m__value in-m__value--${status}">${value}</span>`
				const boxEl = `<span class="in-m__box in-bg-${status}"></span>`
				statsHTML += `<span class="in-m">${status === 'fail' ? boxEl+valueEl : valueEl+boxEl}</span>`
			}
		})
		linkToStats = `<li>
			<a href="http://www.wykop.pl/naruszenia/informator">
				<div class="in-mini-stat">
					${statsHTML}
				</div>
			</a>
		</liv>`
	} else {
		linkToStats = '<li><a href="http://www.wykop.pl/naruszenia/informator">Statystyki</a></liv>'
	}
	document.querySelector('.bspace > ul:last-child').innerHTML += linkToStats
}

if ( document.location.pathname.match('/naruszenia/moje') ) {
	
	const violations = getList()
	console.log( violations )
	const stats = getVolationsStats( violations )
	console.log( stats )
	if ( stats.change ) {
		// Saving change
	}
	renderMiniStats( stats )
}
	