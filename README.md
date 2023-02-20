# portfolio-back
Developed as our second project of the web development bootcamp at Ironhack Barcelona.

## About
Hi! Our name is Lucia, Xabier y Eduardo. We're junior web developers. This project constitutes a platform that makes easier the research of deals. In "iDeals" ,each user will be able to post and see about other's deals.

![Project Image](https://imgur.com/MagYd1K "Project Image")

## Deployment
You can check the app fully deployed [here](https://afabregasm-back.herokuapp.com/api/).

## Work structure
We developed this project in group and used [Trello](https://trello.com/home) to organize our workflow.

## Installation guide
- Fork this repo
- Clone this repo 

```shell
$ cd iDeals
$ npm install
$ npm start
```

## Models
#### User.model.js
```js
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: Boolean,
});
```
#### Deal.model.js
```js
const dealtSchema = new Schema({
  creator: {mongoose.Schema.Type.ObjectId, ref:"User"}
  title: { type: String, unique: true, required: true },
  description: String,
  place: String,
  image: String, (?????),
  created :{
    type: Date,
    default : Date.now
  }
});
```

## User roles
| Role  | Capabilities                                                                                                                               | Property       |
| :---: | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| User  | Can sigup/login/logout. Can create a post and read other's post.                                                                       | isAdmin: false |
| Admin | Can login/logout. Can read, edit or delete all the post. Can create a new post. Can read all user's profiles and delete them. | isAdmin: true  |

## Routes
| Method | Endpoint                    | Require                                             | Response (200)                                                        | Action                                                                    |
| :----: | --------------------------- | --------------------------------------------------- |---------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| POST   | /signup                     | const { username, email, password } = req.body      | res.redirect("/login")                                                    | Registers the user in the database and redirects to the log in view.        |
| POST   | /login                      | const { email, password } = req.body                |res.render(/home)registered.                                        | Redirects the user logged to the home page.
| GET    | /deal/add           | -                                                   | res.render(/oferta/add)                                                   | Redirects the user to the add a new deal form. |
| POST   | /deal/add            | -    const {creator, title, description, image, place, created }                                               | res.redirect(/home)                                                   | Registers the new post in database and redirects the user to the home page.|
| GET    | /deal |                     | res.render(/deal)                                                      | Redirects the user to the view of the deal to see more details.                        |
| GET    | /profile|                     | res.render(/profile)                                                       | Redirects the user to its own profile.                        |
| GET  | /profile/adm          |  | res.render(/profile/adm)                                                      | Redirects the admin user to its profile                                 |
