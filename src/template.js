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

[[init.js]]

[[parse.js]]

[[render.js]]

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
	