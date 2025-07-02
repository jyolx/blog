/* importing modules */
import express from "express";
import fs from 'fs';
import bodyParser from "body-parser";

/* app parameters */
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

/* Class for Blog */
function BlogPost(heading, body) {
    this.heading = heading;
    this.dateAndTime = new Date().toDateString();
    this.body = body;
}

/* Loading json file for default blogs */
const rawData = fs.readFileSync("./blogData.json", "utf-8");
const parsedData = JSON.parse(rawData);
const blogPosts = parsedData.map(
    (entry) => new BlogPost(entry.heading, entry.body)
);
//console.log(blogPosts);

/* Home Page => GET */
app.get("/", (req, res) => {
    res.render('home.ejs', { array: blogPosts });
})

/* New Blog Form => GET */
app.get("/newBlog", (req, res) => {
    res.render('new.ejs');
})

/* New Blog Form => POST */
app.post("/submitBlog", (req, res) => {

    var newBlog = new BlogPost(req.body['heading'], req.body['body']);
    blogPosts.push(newBlog);
    res.redirect(302, `/viewBlog/${blogPosts.length - 1}`);
});

/* View Blog Page => GET */
app.get('/viewBlog/:id', (req, res) => {
    const clickedId = parseInt(req.params.id);
    //console.log('ID received:', clickedId);
    res.render('blog.ejs', { blogId: clickedId, blog: blogPosts[clickedId] });
});

/* Edit Blog => PUT */
app.put('/viewBlog/:id', (req, res) => {
    blogPosts[req.params.id] = req.body.updatedValue;
    res.status(200).send("Updated successfully");
});

/* Delete Blog => DELETE */
app.delete('/viewBlog/:id', (req, res) => {
    const blogId = req.params.id;
    if (blogPosts[blogId]) {
        blogPosts.splice(blogId, 1);
        res.status(200).send("Blog deleted");
    } else {
        res.status(404).send("Blog not found");
    }
});

/* Running Server */
app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});