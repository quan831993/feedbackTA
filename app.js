const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const bodyParser = require('body-parser')
const multer = require("multer");
var upload = multer();
const morgan = require('morgan');

app.use(express.static('public'))
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload.array());




function checkExits(req, res, next) {
    let feedbackList = fs.readFileSync("dev-data/feedback.json", { encoding: "utf8" });
    switch (req.method) {
        case "POST":
            console.log(req.body);
            let content = JSON.parse(feedbackList).find(item => item.feedback == req.body.feedback);
            if (content == undefined) next()
            else res.json({ message: "Question already exists" });
            break;
        default:
            let check = JSON.parse(feedbackList).find(item => item.id == req.params.id);
            if (check != undefined) next()
            else res.json({ message: "Question not found" });
            break;
    }
}


app.get('/api/v1/feedbacks', (req, res) => {
    fs.readFile("dev-data/feedback.json", 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({
                status: "Fail!",
                err: err,
                message: err.message
            });
        } else {
            data = JSON.parse(data)
            res.status(200).json({
                status: "Success!",
                data: data
            })
        }
    });
});

app.get('/api/v1/feedbacks/:id', checkExits, (req, res) => {
    let { id } = req.params;
    fs.readFile('dev-data/feedback.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({
                status: "Fail!",
                err: err,
                message: err.message
            });
        } else {
            data = JSON.parse(data);
            let idQuestion = data.find((e, i) => e.id == id);
            res.status(200).json({
                status: "Success!",
                feedbackList: idQuestion
            });
        }
    });
});

app.post('/api/v1/feedbacks', checkExits, (req, res) => {
    fs.readFile('dev-data/feedback.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({
                status: "Fail!",
                err: err,
                message: err.message
            });
        } else {
            data = JSON.parse(data);
            let { feedback } = req.body;
            let newQuestion = {
                feedback: feedback,
                id: data.length + 1
            };
            data.push(newQuestion);
            fs.writeFile('dev-data/feedback.json', JSON.stringify(data), (err, data) => {
                if (err) {
                    res.status(500).json({
                        status: "Fail!",
                        err: err,
                        message: err.message
                    });
                } else {
                    res.status(200).json({
                        status: "Success!",
                        message: "Post successfully!"
                    })
                }
            });
        }
    });
});

app.put('/api/v1/feedbacks/:id', checkExits, (req, res) => {
    let { id } = req.params;
    fs.readFile('dev-data/feedback.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({
                status: "Fail!",
                err: err,
                message: err.message
            });
        } else {
            data = JSON.parse(data);
            let findIndex = data.findIndex((item) => {
                return item.id == id
            })
            console.log(findIndex);
            data[findIndex] = {
                ...data[findIndex],
                ...req.body,
            };
            console.log(data);
            fs.writeFile("dev-data/feedback.json", JSON.stringify(data), (err, data) => {
                if (err) {
                    res.status(500).json({
                        status: "fail",
                        err: err,
                        message: err.message
                    });
                } else {
                    res.status(200).json({
                        status: "Success!",
                        message: "Update successfully"
                    });
                };
            });
        }
    });
});

app.delete('/api/v1/feedbacks/:id', checkExits, (req, res) => {
    let { id } = req.params;
    fs.readFile('dev-data/feedback.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({
                status: "fail",
                err: err,
                message: err.message
            });
        } else {
            data = JSON.parse(data);
            let find = data.find((e, i) => e.id == id);
            console.log(find);
            data.splice(data.indexOf(find), 1);
            fs.writeFile('dev-data/feedback.json', JSON.stringify(data), (err, data) => {
                if (err) {
                    res.status(500).json({
                        status: "fail",
                        err: err,
                        message: err.message
                    });
                } else {
                    res.status(200).json({
                        status: "Success!",
                        message: "Delete successfully"
                    });
                };
            });
        }
    });

});

app.get('/', (req,res)=> {
    res.sendFile('feedback.html', {root: 'public'});
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})