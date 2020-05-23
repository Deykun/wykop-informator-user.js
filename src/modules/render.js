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

const renderLink = ( stats={} ) => {
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
			content:attr(tooltip);
			position:absolute;
			opacity:0;
			pointer-events: none;
			white-space: nowrap;
			left: 50%;
			transform: translateX(-50%);
			background-color: #34495e;
			color: white;
			padding: 3px 10px;
			border-radius: 20px;
			font-size: 11px;
			transition:all .2s ease;
		}
		.in-m[tooltip]:hover::before {
			opacity:1;
			margin-top: 25px;
			z-index: 200;
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
			margin-left: 6px;
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
		}
		.in-m--success .in-m__box[data-change]::before {
			right: auto;
			left: -5px;
		}
		.in-m--fail .in-m__box {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			margin-left: 0;
			margin-right: 6px;
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
	
	const linkTooltip = ({ status, value, change, percent }) => {
		return `${STATES_STATUTES[status].progressBarTip} - ${value} ${change > 0 ? ` (nowe: ${change})` : ''}${ percent ? ` - ${percent.toFixed(1)}%` : ''}`
	}

	const renderProgressBar = ( stats ) => {
		const { success, fail } = stats.total
		const { success: successChange, fail: failChange } = stats.change
		const succesRate = success + fail > 0 ? Math.round( 1000 * success / (success + fail ) ) / 10 : 50
		const failRate = Math.round( 10 * ( 100 - succesRate ) ) / 10		
		const successHTML = `<span class="in-m in-m--success" tooltip="${linkTooltip({ status: 'success', value: success, change: successChange, percent: succesRate })}">${ renderValue( { value: success } )}${ renderBox( { value: success, status: 'success', style: `width: ${succesRate}px;`, change: successChange } )}</span>`
		const failHTML = `<span class="in-m in-m--fail" tooltip="${linkTooltip({ status: 'fail', value: fail, change: failChange, percent: failRate })}">${ renderBox( { value: fail, status: 'fail', style: `width: ${failRate}px;`, change: failChange } )}${ renderValue( { value: fail } )}</span>`
		return successHTML+failHTML
	}
  
	let content = `<li class="in-m-wrapper in-m-wrapper--link ${ location.pathname.match('/naruszenia/informator') ? 'active' : ''}"><a href="http://www.wykop.pl/naruszenia/informator" class="in-link">Informator</a></li>`
	if ( stats.total ) {
		let statsHTML = ''

		statsHTML += renderProgressBar( stats )

		Object.keys( stats.total ).forEach( status => {
			const value = stats.total[status]
			if ( !['success', 'fail'].includes( status ) && value > 0 ) {
				const change = stats.change[status] ? stats.change[status] : null
				statsHTML += `<span class="in-m in-m--${status}" tooltip="${linkTooltip({ status, value, change })}">${ renderValue( { value } )}${ renderBox( { value, status, change } )}</span>`		
			}
		})
		if ( statsHTML ) {
			content = `<li class="in-m-wrapper in-m-wrapper--stats"><a href="http://www.wykop.pl/naruszenia/informator" class="in-link">${statsHTML}</a></liv>`
		}
	}
	document.querySelector('.bspace > ul:last-child').innerHTML += content
}

const renderLegend = () => {
	let HTML = ''
	STATES.forEach( s => {
		HTML += `
			<li class="in-legend">
				<span class="in-legend-box in-bg-${s.code}">1</span> ${s.name}
			</li>
		`
	})
	return HTML
}

const renderInformatorPage = () => {
	const store = getStore()
	const { total, mods } = store
	const elPage = document.querySelector('.error-page')
	elPage.outerHTML = `
		<main class="in-page rbl-block">
			<section class="in-page-section in-page-section--intro space">
				<h1>Informator</h1>
				<p>Treść strony informatora.</p>
			</section>
			<section class="in-page-section space">
				<h1>Dev</h1>
				<hr>
				<p>
					<ul>
						<li>
							Legenda
							${renderLegend()}
							<ul>
								<li>Legenda</li>
								<li>Total</li>
							</ul>
						</li>
						<li>
							Intro
							<ul>
								<li>Legenda</li>
								<li>Total</li>
							</ul>
						</li>
					</ul>
				</p>
				<h2>Mods:</h3>
				${Object.keys(mods).map( moderator => {
					return mods[moderator].title
				})}
			</section>
			<section class="in-page-section in-page-section--outro space">
				<h2>O dodatku</h2>
				<p>Jeśli uważasz dodatek za użyteczny i wart polecenia pamiętaj, że zawsze <strong>możesz go ocenić</strong> <a class="button submit" href="http://www.wykop.pl/dodatki/pokaz/409/" target="_blank">tutaj</a>. :)</p>
				<p>Błędy w jego działaniu możesz zgłosić w <a href="http://www.wykop.pl/wiadomosc-prywatna/konwersacja/Deykun/" target="_blank">prywatnej wiadomości</a>.</p>
			</section>
		</main>
	`

}