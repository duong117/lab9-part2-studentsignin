var express = require('express')
var bodyParser = require('body-parser')
var Sequelize = require('sequelize')
var api_routes = require('./routes/api.js')
var path = require('path')

db_url = process.env.DATABASE_URL

let sequelize

if(db_url){
    sequelize = new Sequelize(db_url, {
        dialect: 'postgres',
    })

    sequelize.authenticate()
        .then(() => console.log('connected to Postgres'))
        .catch(err => console.log(err))
}

else {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './db.sqlite3'
    })

    sequelize.authenticate()
        .then(() => console.log('connected to sqlite'))
        .catch(err => console.log(err))
}

let student = require('./model/student.js')(sequelize, Sequelize)

var app = express()
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'Student-sign-in-client','dist')))

app.use('/api', api_routes(student))

// Error handlers - for route not found
app.use(function(req, res, next){
    res.status(404).send('Not found')
})

// Error handler for server errors
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Server error')

})

// Start server running
var server = app.listen(process.env.PORT || 3001, function(){
    console.log('app running on port', server.address().port)
})