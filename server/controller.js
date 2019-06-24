const db = require('../db/index.js');

module.exports = {
  /*
  ========================================================
  USER ROUTE BEGINS HERE
  ========================================================
  */
  getUser: (req, res) => { // logging into an account
    const { email, password } = req.body;
    const passphrase = password; // ready for salting. apply hashing function to password.
    // a user inputs email and password to log in to their account. If the credentials are correct, it will send back a success message. If incorrect credentials, it will send a defense message.
    // this is a general function for user login. Currently our team is trying to figure out how to auth and save cookies and sessions, so that's why the queries send back sucess or defense messages rather than sending session info.
    db.query(`SELECT * FROM users WHERE email = '${email}' AND passphrase = '${passphrase}'`)
      .then(data => data.rows.length ? res.status(200).send(`correct credentials! data.rows[0] has your login info`) : res.status(200).send(`are you a hacker`) )
      .catch(e => res.status(404).send(e.stack))
  },
  createUser: (req, res) => { // signing up for an account
    const { email, password, gender, age, description } = req.body;
    const passphrase = password; // ready for salting. apply hashing function to password.
    const first_name = req.body.first_name[0].toUpperCase() + req.body.first_name.slice(1).toLowerCase();
    const last_name = req.body.last_name[0].toUpperCase() + req.body.last_name.slice(1).toLowerCase();
    //grabs all fields required to sign up for an account. Proper capitalization for first name and last name. Inserts into users table.
    //current database does not take into count of unique emails.
    //to create a user, these values are required: email, password, gender, age, first_name, last_name. All strings except age.
    db.query(`INSERT INTO users(email, passphrase, first_name, last_name, gender, age, description) VALUES('${email}', '${passphrase}', '${first_name}', '${last_name}', '${gender}', ${age}, '${description}') RETURNING *;`)
      .then(data =>  res.status(200).send(data.rows[0]))
      .catch(e => res.status(404).send(e.stack))
  },
  editUser: (req, res) => { // editing info of an account based on their email.
    const { email, password, gender, age, description } = req.body;
    const passphrase = password; // ready for salting. apply hashing function to password.
    const first_name = req.body.first_name[0].toUpperCase() + req.body.first_name.slice(1).toLowerCase();
    const last_name = req.body.last_name[0].toUpperCase() + req.body.last_name.slice(1).toLowerCase();
    //grabs all fields of users row and edits all of them, even if there aren't edits made.
    // For example, a user might want to edit only their gender. This function edits every column of that user's row (found by email).
    // an edit request will require email, password, gender, age, first_name, last_name fields.
    // this function can be updated in the future based on our application's needs.
    db.query(`UPDATE users SET passphrase = '${passphrase}', first_name = '${first_name}', last_name = '${last_name}', gender = '${gender}', age = ${age}, description = ${description} WHERE email = '${email}'`)
      .then(data =>  res.status(200).send(`Updated info for ${email}!`))
      .catch(e => res.status(404).send(e.stack))
  },
  /*
  ========================================================
  USER ROUTE ENDS HERE
  ========================================================
  */
  /*
  ========================================================
  POST ROUTE BEGINS HERE
  ========================================================
  */
  getAllPosts: (req, res) => { // allows user to get all posts with search filters
    db.query('SELECT * FROM posts')
      .then((data) => res.status(200).send(data.rows))
      .catch((err) => res.status(404).send("error get: ", err))
  },
  getOnePost: (req, res) => { // allows user to view one post
    const { id } = req.params;
    db.query(`SELECT * FROM posts WHERE id = ${id}`)
      .then((data) => res.status(200).send(data.rows))
      .catch((err) => res.status(404).send("error get: ", err))
  },

  makeNewPost: (req, res) => { // allows user to create a new post
    const { title, post_address, post_city, post_state, post_zip, post_desc, images, category_id } = req.body;
    db.query(`INSERT INTO posts (title, post_address, post_city, post_state, post_zip, post_desc, images, category_id) VALUES ('${title}', '${post_address}', '${post_city}', '${post_state}', '${post_zip}', '${post_desc}', '${images}', '${category_id}');`)
      .then(() => res.status(201).send("post ok"))
      .catch((err) => res.status(404).send("error post: ", err))
  },

  editOnePost: async (req, res) => { // allows user to edit their post
    const { id } = req.params;
    let updates = '';
    for (key in req.body) {
      updates += await `${key} = '${req.body[key]}', `
    }
    updates = updates.slice(0, updates.length - 2);
    db.query(`UPDATE posts SET ${updates} WHERE id = ${id};`)
      .then(() => res.status(200).send(`Updated post: ${id}`))
      .catch((err) => res.status(404).send("error edit: "), err)
  },

  deleteOnePost: (req, res) => { // allows user to delete their post
    const { id } = req.params;
    db.query(`DELETE FROM posts WHERE id = ${id}`)
      .then(() => res.status(200).send(`Deleted post: ${id}`))
      .catch((err) => res.status(404).send("error delete: "), err)    
  },
  /*
  ========================================================
  POST ROUTE ENDS HERE
  ========================================================
  */
  /*
  ========================================================
  ATTENDEE ROUTE BEGINS HERE
  ========================================================
  */
  getAllAttendees: (req, res) => { // allows user to view attendees of a single post
    db.query('SELECT * FROM attendees')
      .then((data) => res.status(200).send(data.rows))
      .catch((err) => res.status(404).send("error get: ", err))
  },

  requestToBeAttendee: (req, res) => { // allows user to request to join a single post

  },

  confirmAttendee: (req, res) => { // allows user (host) to accept or reject a potential attendee of a single post

  },
  /*
  ========================================================
  ATTENDEE ROUTE ENDS HERE
  ========================================================
  */
   /*
  ========================================================
  RATING ROUTE BEGINS HERE
  ========================================================
  */
  viewUserReviews: (req, res) => { // allows user to view all reviews of a particular user

  },

  writeReview: (req, res) => { // allows user to write a review about another user

  }
  /*
  ========================================================
  RATING ROUTE ENDS HERE
  ========================================================
  */
}