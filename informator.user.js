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

// Inits
const version = '4'
console.info(`%c Informator ${version}`, 'color: white; background: #4383af; padding: 10px 35px; font-size: 1rem; font-family: Arial, Verdana; border-radius: 5px;')

const darkmode = Array.from( document.body.classList ).includes('night')

const debug = true

const STATES = [
	{
		code: 'success',
		resolved: true,
		name: 'Prawidłowe',
		color: '#8aa380',
	},
	{
		code: 'fail',
		resolved: true,
		name: 'Nieprawidłowe',
		color: '#b3868f',
	},
	{
		code: 'changed',
		resolved: true,
		name: 'Zmieniony powód',
		color: '#dfc56e',
	},
	{
		code: 'consultation',
		resolved: false,
		name: 'W konsultacji',
		color: '#62a2b1',
	},
	{
		code: 'fresh',
		resolved: false,
		name: 'Nowe',
		color: '#8cb1ba',
	},
	{
		code: 'current',
		resolved: false,
		name: 'Rozpatrywane',
		label: '',
		color: '#717171',
	},
]

const STATES_STATUTES = {}
STATES.forEach( s => STATES_STATUTES[s.code] = s )

const THEME_COLORS = [
	{
		code: 'main',
		color: '#34495e'
	},
	{
		code: 'white',
		color: '#fff'
	}
]

const RESOLVED_STATES = ['success', 'fail', 'changed']

// Helpers
const hashToKey = text => {
  return text.toLowerCase().replace(/ /g, '_').replace(/[ą|ć|ę|ń|ł|ż|ó]/g, '').replace(/[^a-z0-9_]+/g, '').substring(0, 25)
}

// Parse
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
	let store = getStore()
	const { checked, consulted } = store.latest
	const total = {}
	const change = {}
	STATES.forEach( s => {
		total[s.code] = 0
		change[s.code] = 1
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



// Render
const appendCSS = ( styles ) => {
	const style = document.createElement('style')
	style.innerHTML = styles
	document.head.append( style )
}

const appendColorsCSS = ( ) => {
	let colorsCSS = ''
	STATES.concat( THEME_COLORS ).forEach( s => {
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
		.nav.bspace.rbl-block {
			overflow: visible;
			height: 41px;
		}
		.in-m[tooltip] {
			position: relative;
		}
		.in-m[tooltip]::before {
			white-space: nowrap;
			left: 50%;
			transform: translateX(-50%);
			background-color: #34495e;
			color: white;
			padding: 3px 10px;
			border-radius: 10px;
			font-size: 11px;
		}
		.in-m:not(:last-child) {
			margin-right: 10px;
			padding-right: 10px;
			border-right: 1px dashed #d9d9d9;
		}
		.in-m__box {
			display: inline-block;
			height: 13px;
			width: 13px;
			min-width: 5px;
			vertical-align: middle;
			border-radius: 10px;
			margin: 0 6px;
			position: relative;
		}
		.in-m__box[data-change]::before {
			content: attr(data-change);
			display: inline-block;
			position: absolute;
			right: -5px;
			bottom: -5px;
			z-index: 1;
			color: white;
			background-color: #34495e;
			line-height: 14px;
			font-size: 9px;
			padding: 0px 3px;
			font-weight: bold;
			border-radius: 10px;
		}
		.in-m--success {
			margin-right: 0 !important;
			padding-right: 0 !important;
			border: none !important;
		}
		.in-m--success .in-m__box {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
			margin-right: 0 !important;
			box-shadow: -5px 0px 5px -5px inset rgba(0, 0, 0, 0.5);
		}
		.in-m--success .in-m__box[data-change]::before {
			right: auto;
			left: -5px;
		}
		.in-m--fail .in-m__box {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			margin-left: 0 !important;
		}
		.in-m--fail .in-m__box {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			margin-left: 0 !important;
		}
		.in-m__value {
			vertical-align: middle;
		}
	`)

	const renderBox = ({ status, change, style}) => `<span 
		class="in-m__box in-bg-${status}" 
		${change ? `data-change="+${change}"` : ''} 
		${style ? `style="${style}"` : ''}>
	</span>`
	const renderValue = ({ value }) => `<span class="in-m__value ${darkmode ? 'in-txt-white' : 'in-txt-main'}">${value}</span>`
	
	const renderProgressBar = ( stats ) => {
		const { success, fail } = stats.total
		const { success: successChange, fail: failChange } = stats.change
		const succesRate = success + fail > 0 ? Math.round( 1000 * success / (success + fail ) ) / 10 : 50
		const failRate = Math.round( 10 * ( 100 - succesRate ) ) / 10
		const successHTML = `<span class="in-m in-m--success" tooltip="Prawidłowe - ${success} - ${succesRate.toFixed(0)}%">${ renderValue( { value: success } )}${ renderBox( { value: success, status: 'success', style: `width: ${succesRate}px;`, change: successChange } )}</span>`
		const failHTML = `<span class="in-m in-m--fail" tooltip="Nieprawidłowe - ${fail} - ${failRate.toFixed(0)}%">${ renderBox( { value: fail, status: 'fail', style: `width: ${failRate}px;`, change: failChange } )}${ renderValue( { value: fail } )}</span>`
		return successHTML+failHTML
	}
  
	let content = `<li><a href="http://www.wykop.pl/naruszenia/informator" class="in-link">Statystyki</a></li>`
	if ( stats.total ) {
		let statsHTML = ''

		statsHTML += renderProgressBar( stats )

		Object.keys( stats.total ).forEach( status => {
			const value = stats.total[status]
			if ( !['success', 'fail'].includes( status ) && value > 0 ) {
				const change = stats.change[status] ? stats.change[status] : null
				statsHTML += `<span class="in-m in-m--${status}" tooltip="${STATES_STATUTES[status].name} - ${value}" >${ renderValue( { value } )}${ renderBox( { value, status, change } )}</span>`
			}
		})
		if ( statsHTML ) {
			content = `<li><a href="http://www.wykop.pl/naruszenia/informator" class="in-link">${statsHTML}</a></liv>`
		}
	}
	document.querySelector('.bspace > ul:last-child').innerHTML += content
}

// State
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

if ( document.location.pathname.match('/naruszenia/moje') ) {
	const violations = getViolations()
	console.log( violations )
	const { statistics } = processViolations( violations )
	console.log( statistics )
	renderLink( statistics )
}
	