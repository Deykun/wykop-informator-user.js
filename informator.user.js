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
		code: 'new',
		name: 'Nowe',
		color: '#8cb1ba',
	},
	{
		code: 'current',
		name: '',
		color: '#717171',
	},
]


if ( document.location.pathname.match('/naruszenia/moje') ) {
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
	const violations = getList()
	console.log( violations )
	// stats = getVolationsStats( violations )
	// stats -> { total: { }, change: { }} - will be also used in Ajax call for check
	// if ( stats.change ) save
	// renderStats( stats )
}
	