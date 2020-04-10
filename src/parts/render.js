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

const renderLink = ( stats ) => {
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
			position: relative;
		}
		.in-m__value[data-change]::before {
			content: attr(data-change);
			position: absolute;
			top: 100%;
			left: 50%;
			transform: translateX( -50% );
			font-size: 10px;
			line-height: 10px;
			color: white;
			background-color: #4383af;
		}
		.in-m > :last-child {
			margin-right: 25px;
		}
  `)
  
	let linkToStats
	if ( stats.total ) {
		let statsHTML = ''
		Object.keys( stats.total ).forEach( status => {
			const value = stats.total[status]
			if ( value > 0 ) {
				const valueEl = `<span class="in-m__value" ${stats.change[status] ? `data-change="${stats.change[status]}"` : ''}>${value}</span>`
				const boxEl = `<span class="in-m__box in-bg-${status}"></span>`
				statsHTML += `<span class="in-m in-m--${status}">${status === 'fail' ? boxEl+valueEl : valueEl+boxEl}</span>`
			}
		})
		linkToStats = `<li>
			<a href="http://www.wykop.pl/naruszenia/informator">
				${statsHTML}
			</a>
		</liv>`
	} else {
		linkToStats = '<li><a href="http://www.wykop.pl/naruszenia/informator">Statystyki</a></liv>'
	}
	document.querySelector('.bspace > ul:last-child').innerHTML += linkToStats
}