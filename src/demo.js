console.log(' ')
console.log('\x1b[33m%s\x1b[0m', 'Generating demo file...')
console.log(' ')

const fs = require('fs')

let informator = fs.readFileSync('build/informator.user.js', 'utf8')
let template = fs.readFileSync('demo/template.html', 'utf8')

template = template.replace('[[informator.user.js]]', informator)

fs.writeFileSync('./demo/demo.html', template)
console.log(' ')
console.log('✔️  Demo file generated!')
console.log('')