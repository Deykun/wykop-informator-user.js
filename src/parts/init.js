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