import express from "express";
import fs from 'fs';
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

function BlogPost (heading, body, notes, thanks)
{
    this.heading = heading;
    this.dateAndTime = new Date().toDateString();
    this.body = body;
    this.notes = notes;
    this.thanks = thanks;
}

const rawData = fs.readFileSync("./blogData.json", "utf-8");
const parsedData = JSON.parse(rawData);

const blogPosts = parsedData.map(
  (entry) => new BlogPost(entry.heading, entry.body, entry.notes, entry.thanks)
);

//console.log(blogPosts);

app.get("/", (req, res) => {
    res.render('home.ejs',{array : blogPosts});
})

app.get("/new", (req, res) => {
    res.render('new.ejs',{array : blogPosts});
})

app.post("/submit", (req, res) => {

  var newBlog = new BlogPost(req.body['heading'], req.body['body'], req.body['notes'], req.body['thanks']);
  blogPosts.push(newBlog);
  res.render('blog.ejs',{blog : blogPosts[blogPosts.length - 1]});
});

app.post('/blog', (req, res) => {
        const clickedId = req.body.item_id;
        //console.log('ID received:', clickedId);
        res.render('blog.ejs',{blog : blogPosts[clickedId]});
    });

app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});