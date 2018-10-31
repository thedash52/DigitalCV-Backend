require('dotenv').config();

const express = require('express');
const Promise = require('promise');
const database = require('./database');
const config = require('./config/config');
const cors = require('cors');
const bodyParser = require('body-parser');
const auth = require('./auth')();
const jwt = require('jsonwebtoken');
const fs = require('./fileSystem');

const whiteList = [
    'http://thedashcoder.online',
    'https://thedashcoder.online',
    'https://thedashcoder.online/',
    'http://thedashcoder.online/',
    'http://www.thedashcoder.online',
    'https://www.thedashcoder.online',
    'https://www.thedashcoder.online/',
    'http://www.thedashcoder.online/',
    'http://localhost:4200',
    'http://citizen.hosts.net.nz:8880'
];

const corsOptions = {
    origin: function (origin, cb) {
        if (origin === undefined || whiteList.indexOf(origin) !== -1) {
            cb(null, true);
        } else {
            cb(new Error('Not allowed by CORS'));
        };
    },
    methods: ['GET','POST'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'basicId']
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(auth.initialize());

const port = process.env.PORT || 3000;

process.on('unhandledRejection', (reason, promise) => {
    console.log(reason);
    console.log(promise);
});

app.get('/', function (req, res) {
    res.status(200).json("Nothing to see here!");
});

app.get('/test-storage', function (req, res) {
	fs.testStorageAuth().then((result) => {
		if (result.length > 0) {
			res.status(200).send("Authenticated");
		} else {
			res.status(500).send("Unable to get Bucket List. This could be because of missing/invalid credentials");
		}
	})
	.catch((err) => {
		res.status(401).send(err);
	});
});

app.post('/login', function (req, res) {
    if (req.body.username && req.body.password) {
        const username = req.body.username;
        const password = req.body.password;

        database.login(username, password).then(user => {
            if (user) {
                const payload = {
                    id: user.id
                };

                const token = jwt.sign(payload, config.jwtSecret, {
                    expiresIn: "3h"
                });

                res.json({
                    success: "true",
                    token: token
                });
            }
        }).catch(err => {
            res.status(401).json({
                success: "false",
                result: err
            });
        });
    } else {
        res.sendStatus(401);
    }
});

app.get('/check-login', auth.authenticate(), function (req, res) {
    res.status(200).json(true);
});

app.get('/check-connection', function (req, res) {
    const testResults = {
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
    database.getBasic().then(basic =>
        Promise.all([
            database.getBasic(),
            database.getPhone(typeof(basic.results) == 'undefined'? -1 : basic.results.id),
            database.getSocial(typeof(basic.results) == 'undefined'? -1 : basic.results.id)
        ])).then((results) => {
        const values = {
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
        console.log(err);
        res.status(200).json(err);
    });
});

app.get('/get-skills', function (req, res) {
    database.getSkills(req.headers['basicid']).then((results) => {
        const values = [];

        results.forEach(function (value) {
            const data = {
                id: value.id,
                user: value.user,
                category: value.category,
                details: value.details
            };

            values.push(data);
        });

        res.status(200).json(values);
    }).catch((err) => {
        console.log(err);
        res.status(200).json(err);
    });
});

app.get('/get-technology', function (req, res) {
    Promise.all([
        database.getTechnologies(req.headers['basicid']),
        database.getRepositories(req.headers['basicid'])
    ]).then((results) => {
        const values = {
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
        console.log(err);
        res.status(200).json(err);
    });
});

app.get('/get-education', function (req, res) {
    Promise.all([
        database.getEducation(req.headers['basicid']),
        database.getPapers(req.headers['basicid'])
    ]).then((results) => {
        const values = {
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
        console.log(err);
        res.status(200).json(err);
    });
});

app.get('/get-experience', function (req, res) {
    database.getExperience(req.headers['basicid']).then((results) => {
        const values = [];

        results.forEach(function (experience) {
            const data = {
                id: experience.id,
                user: experience.user,
                image: experience.image,
                title: experience.title,
                location: experience.location,
                description: experience.description,
                start_date: experience.start_date,
                end_date: experience.end_date,
                current: experience.current
            };

            values.push(data);
        });

        res.status(200).json(values);
    }).catch((err) => {
        console.log(err);
        res.status(200).json(err);
    });
});

app.get('/get-other', function (req, res) {
    Promise.all([
        database.getAchievements(req.headers['basicid']),
        database.getInterests(req.headers['basicid'])
    ]).then((results) => {
        const values = {
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
        console.log(err);
        res.status(200).json(err);
    });
});

app.post('/verify-basic', function (req, res) {
    Promise.all([
        database.verifyBasic(req.body.basic.basic),
        database.verifyPhone(req.body.basic.phone),
        database.verifySocial(req.body.basic.social)
    ]).then((results) => {
        const values = {
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
        console.log(err);
        res.status(200).json(err);
    });
});

app.post('/verify-skill', function (req, res) {
    database.verifySkill(req.body.skill).then((results) => {
        res.status(200).json(results);
    }).catch((err) => {
        res.status(200).json(err);
    });
});

app.post('/verify-tech', function (req, res) {
    Promise.all([
        database.verifyTech(req.body.tech.technologies),
        database.verifyRepo(req.body.tech.repositories)
    ]).then((results) => {
        const values = {
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
        console.log(err);
        res.status(200).json(err);
    });
});

app.post('/verify-experience', function (req, res) {
    database.verifyExperience(req.body.experience).then((results) => {
        res.status(200).json(results);
    }).catch((err) => {
        res.status(200).json(err);
    });
});

app.post('/verify-education', function (req, res) {
    Promise.all([
        database.verifyEducation(req.body.education.education),
        database.verifyPapers(req.body.education.papers)
    ]).then((results) => {
        const values = {
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
        console.log(err);
        res.status(200).json(err);
    });
});

app.post('/verify-other', function (req, res) {
    Promise.all([
        database.verifyAchievements(req.body.other.achievement),
        database.verifyInterests(req.body.other.interest)
    ]).then((results) => {
        const values = {
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
        console.log(err);
        res.status(200).json(err);
    });
});

app.post('/save-edit', auth.authenticate(), function (req, res) {
    const data = req.body.edit;
    database.saveBasic(data.basic).then(result =>
        Promise.all([
            database.savePhone(result, data.phone),
            database.saveSocial(result, data.social),
            database.saveSkill(result, data.skill),
            database.saveTechnology(result, data.technology),
            database.saveRepository(result, data.repository),
            database.saveExperience(result, data.experience),
            database.saveEducation(result, data.education),
            database.saveAchievement(result, data.achievement),
            database.saveInterest(result, data.interest)
        ])).then((results) => {
        res.status(200).json({
            result: true
        });
    }).catch((err) => {
        console.log(err);
        res.status(200).json({
            result: false,
            err: err
        });
    });
});

const server = app.listen(port, (err) => {
    if (err) {
        return console.log('Connection Error', err);
    }

    const host = server.address().address;

    console.log(`server is listening on http://${host}:${port}`);
});