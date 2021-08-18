const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const fs = require('fs')
const cp = require('child_process')

app.use('/coverage', express.static('coverage'))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/ping', (req, res) => {
    res.send('pong!')
})

app.get('/coverage.x', (req, res) => {
    // generate coverage files and redirect to coverage/index.html
    const cov = global['__coverage__']

    if(!cov) {
        res.send('nyc not configured right')
        return        
    }

    // make directory
    cp.execSync('mkdir -p .nyc_output')

    // write cov to file
    const fd = fs.openSync('.nyc_output/out.json', 'w', '0666')
    fs.writeSync(fd, JSON.stringify(cov));
    fs.closeSync(fd);

    // generate coverages
    cp.execSync('./node_modules/.bin/nyc report --reporter=html')

    res.redirect('/coverage/index.html')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})