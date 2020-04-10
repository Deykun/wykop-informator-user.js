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