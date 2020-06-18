export const debug = true

export const darkmode = () => Array.from( document.body.classList ).includes('night')

export const STATES = [
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

export const STATES_STATUTES = {}

const checked_states_init = []
const resolved_states_init = []
STATES.forEach( s => {
  STATES_STATUTES[s.code] = s
  if ( s.resolved ) { resolved_states_init.push( s.code ) }
  if ( s.checked ) { checked_states_init.push( s.code ) }
} )
export const CHECKED_STATES = checked_states_init
export const RESOLVED_STATES = resolved_states_init

export const THEME_COLORS = [
  {
    code: 'main',
    color: '#34495e'
  },
  {
    code: 'white',
    color: '#fff'
  }
]