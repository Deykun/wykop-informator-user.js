console.log(' ')
console.log('\x1b[33m%s\x1b[0m', 'Generating...')
console.log(' ')

const fs = require('fs')

let template = fs.readFileSync('src/template.js', 'utf8')

fs.readdir(`./src/parts`, (err, parts) => {

  parts.map( partFilename => {
    const partContent = fs.readFileSync(`src/parts/${partFilename}`, 'utf8')
    template = template.replace(`[[${partFilename}]]`, partContent)
  })

  fs.writeFileSync('./informator.user.js', template)
  console.log('✔️  Script content generated')
  console.log('')
})