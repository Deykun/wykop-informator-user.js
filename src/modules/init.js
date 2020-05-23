const version = '4'
console.info(`%c Informator ${version}`, 'color: white; background: #4383af; padding: 10px 35px; font-size: 1rem; font-family: Arial, Verdana; border-radius: 5px;')

const darkmode = Array.from( document.body.classList ).includes('night')

const debug = true

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