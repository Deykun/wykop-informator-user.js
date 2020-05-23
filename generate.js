console.log(' ')
console.log('\x1b[33m%s\x1b[0m', 'Generating user script file...')
console.log(' ')

const fs = require('fs')

let template = fs.readFileSync('src/template.js', 'utf8')

fs.readdir(`./src/modules`, (err, modules) => {

  modules.map( moduleFilename => {
    const moduleContent = fs.readFileSync(`src/modules/${moduleFilename}`, 'utf8')
    template = template.replace(`[[${moduleFilename}]]`, moduleContent)
    console.log(`  ${moduleFilename} imported`)
  })

  fs.writeFileSync('./build/informator.user.js', template)
  console.log(' ')
  console.log('✔️  File generated!')
  console.log('')
})