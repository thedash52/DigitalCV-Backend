var express = require('express');
var Promise = require('promise');
var database = require('./database');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();

var corsOptions = {
    origin: '*'
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
const port = 3000;

app.get('/', function (req, res) {
    res.status(200).json("Nothing to see here!");
});

app.get('/check-connection', function (req, res) {
    var testResults = {
        connection: true,
        database: false,
        err: ""
    };

    database.checkDatabase().then((result) => {
        testResults.database = true;
        testResults.err = result;
        res.status(200).json(testResults);
    }).catch((err) => {
        testResults.err = err;
        res.status(200).json(testResults);
    });
});

app.get('/get-type', function (req, res) {
    database.getType().then((result) => res.status(200).json(result));
})

app.get('/get-basic', function (req, res) {
    Promise.all([
        database.getBasic(),
        database.getPhone(),
        database.getSocial()
    ]).then((results) => {
        var values = {
            basic: null,
            phone: null,
            social: null
        };

        results.forEach(result => {
            switch (result.type) {
                case "basic":
                    values.basic = result.results;
                    break;
                case "phone":
                    values.phone = result.results;
                    break;
                case "social":
                    values.social = result.results;
                    break;
            }
        });

        res.status(200).json(values);
    }).catch((err) => {
        res.status(200).json(err);
    });
});

app.get('/get-skills', function (req, res) {
    database.getSkills().then((results) => {
        var values = [];

        results.forEach(function (value) {
            var data = {
                id: value.id,
                category: value.category,
                details: value.details
            };

            values.push(data);
        });

        res.status(200).json(values);
    }).catch((err) => {
        res.status(200).json(err);
    });
});

app.get('/get-technology', function (req, res) {
    Promise.all([
        database.getTechnologies(),
        database.getRepositories()
    ]).then((results) => {
        var values = {
            technologies: null,
            repositories: null
        };

        results.forEach(result => {
            switch (result.type) {
                case "technology":
                    values.technologies = result.results;
                    break;
                case "repository":
                    values.repositories = result.results;
                    break;
            }
        });

        res.status(200).json(values);
    }).catch((err) => {
        res.status(200).json(err);
    });
});

app.get('/get-education', function (req, res) {
    Promise.all([
        database.getEducation(),
        database.getPapers()
    ]).then((results) => {
        var values = {
            education: null,
            papers: null
        };

        results.forEach(result => {
            switch (result.type) {
                case "education":
                    values.education = result.results;
                    break;
                case "paper":
                    values.papers = result.results;
                    break;
            }
        });

        res.status(200).json(values);
    }).catch((err) => {
        res.status(200).json(err);
    });
});

app.get('/get-experience', function (req, res) {
    database.getExperience().then((results) => {
        var values = [];

        results.forEach(function (experience) {
            var data = {
                id: experience.id,
                img: experience.image,
                title: experience.title,
                location: experience.location,
                description: experience.description,
                startDate: experience.start_date,
                endDate: experience.end_date,
                current: experience.current
            };

            values.push(data);
        });

        res.status(200).json(values);
    }).catch((err) => {
        res.status(200).json(err);
    });
});

app.get('/get-other', function (req, res) {
    Promise.all([
        database.getAchievements(),
        database.getInterests()
    ]).then((results) => {
        var values = {
            achievement: null,
            interest: null
        };

        results.forEach(result => {
            switch (result.type) {
                case "achievement":
                    values.achievement = result.results;
                    break;
                case "interest":
                    values.interest = result.results;
                    break;
            }
        });

        res.status(200).json(values);
    }).catch((err) => {
        res.status(200).json(err);
    });
});

app.post('/verify-basic', function (req, res) {
    Promise.all([
        database.verifyBasic(req.body.basic),
        database.verifyPhone(req.body.phone),
        database.verifySocial(req.body.social)
    ]).then((results) => {
        var values = {
            basic: null,
            phone: null,
            social: null
        };

        results.forEach(result => {
            switch (result.type) {
                case "basic":
                    values.basic = result.result;
                    break;
                case "phone":
                    values.phone = result.result;
                    break;
                case "social":
                    values.social = result.result;
                    break;
            }
        });

        res.status(200).json(values);
    }).catch((err) => {
        res.status(200).json(err);
    });
});

app.post('/verify-skills', function (req, res) {
    database.verifySkill(req.body).then((results) => {
        res.status(200).json(results);
    }).catch((err) => {
        res.status(200).json(err);
    });
});

app.post('/verify-tech', function (req, res) {
    Promise.all([
        database.verifyTech(req.body.technologies),
        database.verifyRepo(req.body.repositories)
    ]).then((results) => {
        var values = {
            technology: null,
            repository: null
        }

        results.forEach(result => {
            switch (result.type) {
                case "technology":
                    values.technology = result.result;
                    break;
                case "repository":
                    values.repository = result.result;
                    break;
            }
        });

        res.status(200).json(values);
    }).catch((err) => {
        res.status(200).json(err);
    });
});

app.post('/verify-experience', function (req, res) {
    database.verifyExperience(req.body).then((results) => {
        res.status(200).json(results);
    }).catch((err) => {
        res.status(200).json(err);
    });
});

app.post('/verify-education', function (req, res) {
    Promise.all([
        database.verifyEducation(req.body.education),
        database.verifyPapers(req.body.papers)
    ]).then((results) => {
        var values = {
            education: null,
            paper: null
        }

        results.forEach(result => {
            switch (result.type) {
                case "education":
                    values.education = result.result;
                    break;
                case "paper":
                    values.paper = result.result;
                    break;
            }
        });

        res.status(200).json(values);
    }).catch((err) => {
        res.status(200).json(err);
    });
});

app.post('/verify-other', function (req, res) {
    Promise.all([
        database.verifyAchievements(req.body.achievement),
        database.verifyInterests(req.body.interest)
    ]).then((results) => {
        var values = {
            achievement: null,
            interest: null
        }

        results.forEach(result => {
            switch (result.type) {
                case "achievement":
                    values.achievement = result.result;
                    break;
                case "interest":
                    values.interest = result.result;
                    break;
            }
        });

        res.status(200).json(values);
    }).catch((err) => {
        res.status(200).json(err);
    });
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Connection Error', err);
    }

    console.log(`server is listening on ${port}`);
});