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
const debug = true

const darkmode = () => Array.from( document.body.classList ).includes('night')

const STATES = [
  {
    code: 'success',
    checked: true,
    resolved: true,
    name: 'Prawidłowe',
    progressBarTip: 'Prawidłowe zgłoszenia',
    color: '#73995e',
  },
  {
    code: 'fail',
    checked: true,
    resolved: true,
    name: 'Nieprawidłowe',
    progressBarTip: 'Nieprawidłowe zgłoszenia',
    color: '#c86b6b',
  },
  {
    code: 'changed',
    checked: true,
    resolved: true,
    name: 'Zmieniony powód',
    progressBarTip: 'Zgłoszenia ze zmienionym powodem',
    color: '#dfc56e',
  },
  {
    code: 'consultation',
    checked: true,
    resolved: false,
    name: 'W konsultacji',
    progressBarTip: 'Zgłoszenia przekazane do konsultacji',
    color: '#62a2b1',
  },
  {
    code: 'fresh',
    checked: false,
    resolved: false,
    name: 'Nowe',
    progressBarTip: 'Nowe zgłoszenia',
    color: '#8cb1ba',
  },
  {
    code: 'current',
    checked: false,
    resolved: false,
    name: 'Rozpatrywane',
    label: '',
    progressBarTip: 'Rozpatrywane w tym momencie',
    color: '#717171',
  },
]

const STATES_STATUTES = {}
const CHECKED_STATES = []
const RESOLVED_STATES = []
STATES.forEach( s => {
  STATES_STATUTES[s.code] = s
  if ( s.resolved ) { RESOLVED_STATES.push( s.code ) }
  if ( s.checked ) { CHECKED_STATES.push( s.code ) }
} )

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

// Helpers
  const removeDiacritics = text => text.replace(/\u0141/g, 'L').replace(/\u0142/g, 'l').normalize('NFD').replace(/[^\w\s]/g, '')

const hashToKey = text => removeDiacritics( text.toLowerCase() ).replace(/ /g, '_').replace(/[^a-z0-9_]+/g, '').substring(0, 25)

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
  let store = getState()
  const { seen, checked, inConsultation } = store.latest
  const total = {}
  const change = {}
  STATES.forEach( s => {
    total[s.code] = 0
    change[s.code] = 0
  })

  const newLatest = {
    seen: [],
    checked: [],
    inConsultation: []
  }

  violations.forEach( violation => {
    const { id, status } = violation
    total[status]++
    newLatest.seen.push( id )
    if ( !seen.includes( id ) ) {
      change[status]++
    }

    if ( CHECKED_STATES.includes( status ) ) {
      newLatest.checked.push( id )
      if ( status === 'consultation' ) {
        newLatest.inConsultation.push( id )
      }

      if ( !checked.includes( id ) ) {
        if ( seen.includes( id ) ) {
          change[status]++
        }
        if ( debug ) {
          console.log('New volation')
          console.log( violation )
        }
        store = addViolationToStore( violation, store )
      }
    }
		
    if ( seen.includes( id ) && inConsultation.includes( id ) && RESOLVED_STATES.includes( status )  ) {
      change[status]++
      console.log('Consultation') 
      store = addViolationToStore( violation, store )
      store = addConsultedViolationToStore( violation, store )	
    }
  })

  if ( save ) {
    console.log('Przed', store.latest)
    store.latest = newLatest
    console.log('Po', newLatest)
    saveState( store )
  }

  return {
    statistics: {
      total: total,
      change: change
    }
  }
}



// Render
  const appendJS = ( src ) => {
  const script = document.createElement('script')
  script.src = src
  document.body.append(script)
	
  return script
}

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
  const renderValue = ({ value }) => `<span class="in-m__value ${darkmode() ? 'in-txt-white' : 'in-txt-main'}">${value}</span>`
	
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
  const script = appendJS('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js')
  script.addEventListener('load', () => {
    console.log('Chart JS is avaible!')
  })
  const store = getState()
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

// State
  const initialStore = {
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
  },
  consultation: {
    total: { },
    mods: { }
  }
}

const initStore = ( ) => {
  STATES.forEach( s => {
    initialStore.total[s.code] = 0
  })

  return initialStore
}

const storeKey = 'informator'

const getState = () => localStorage.getItem( storeKey ) ? JSON.parse( localStorage.getItem( storeKey ) ) : initStore()

const saveState = ( store ) => localStorage.setItem( storeKey, JSON.stringify( store ) )

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
    store.mods[moderator] = { title: moderator, total: {}, times: {} }
  }
  store.mods[moderator].total[status] = store.mods[moderator].total[status] ? store.mods[moderator].total[status] + 1 : 1

  const hours = new Date( date ).getHours()
  store.mods[moderator].times[hours] = store.mods[moderator].times[hours] ? store.mods[moderator].times[hours] + 1 : 1

  return store
}

const addConsultedViolationToStore = ( violation, store ) => {
  const { status, moderator } = violation

  store.consultation.total[status] = store.consultation.total[status] + 1
  store.consultation.mods[moderator][status] = store.consultation.mods[moderator][status] ? store.consultation.mods[moderator][status] + 1 : 1

  return store
}

if ( location.pathname.match('/naruszenia/moje') ) {
  const store = getState()
  const { hideThumbnails } = store.settings 
  if ( hideThumbnails ) {
    document.querySelectorAll('#violationsList .media-content').forEach( el => el.parentNode.removeChild(el) )
  }
  const violations = getViolations()
  const { statistics } = processViolations( violations )
  renderLink( statistics )
} else if ( location.pathname.match('/naruszenia/') ) {
  renderLink( )
  if ( location.pathname.match('/naruszenia/informator') ) {
    renderInformatorPage( )
  }
}
	