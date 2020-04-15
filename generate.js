console.log(' ')
console.log('\x1b[33m%s\x1b[0m', 'Generating user script file...')
console.log(' ')

const fs = require('fs')

let template = fs.readFileSync('src/template.js', 'utf8')

fs.readdir(`./src/parts`, (err, parts) => {

  parts.map( partFilename => {
    const partContent = fs.readFileSync(`src/parts/${partFilename}`, 'utf8')
    template = template.replace(`[[${partFilename}]]`, partContent)
    console.log(`  ${partFilename} imported`)
  })

  fs.writeFileSync('./informator.user.js', template)
  console.log(' ')
  console.log('✔️  File generated!')
  console.log('')
})