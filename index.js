const express = require('express')
const app = express()
const fs = require("fs")
const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

const data_path = "data/movies.json";
const history_path = "data/history.json";
let movies;
try{
    movies = JSON.parse(fs.readFileSync(data_path));
} catch(err){
    if (err.code === 'ENOENT') {
        movies = [];
    } else{
        console.log(err);
    }
}

try{
    history = JSON.parse(fs.readFileSync(history_path));
} catch(err){
    if (err.code === 'ENOENT') {
        history = [];
    } else{
        console.log(err);
    }
}

app.get('/', (req, res) => res.render('movies',{movies}));

app.post('/movie', (req, res) => {
    let movie = {title : req.body.title, addedBy : req.body.addedBy};
    addMovie(movie);
    res.send(movie);
})

app.get('/history', (req, res) => {
    res.render('history', {history});
})

app.delete('/movie', (req, res) => {
    removeMovie(req.body.title);
    res.send(movies);
})

app.post('/watch', (req, res) => {
    watch(req.body.title);
    res.send(movies);
})

app.listen(80, () => console.log('Listening on port 80'))

function addMovie(movie){
    movies.push(movie);
    fs.writeFile(data_path, JSON.stringify(movies));
}

function removeMovie(title){
    for(let i = 0; i<movies.length; i++){
        if(title == movies[i].title){
            movies.splice(i,1);
            fs.writeFile(data_path, JSON.stringify(movies));
            return;
        }    
    }
}

function watch(title){
    for(let movie of movies){
        if(movie.title == title){
            history.push(movie);
            fs.writeFile(history_path, JSON.stringify(history));
            removeMovie(title);
            return;
        }
    }
}