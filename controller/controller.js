const express = require('express');
const schema = require('../validation/urlValidation');
const {
  nanoid
} = require('nanoid');
const monk = require('monk');
app = express();

//MongoDB Connection
require('dotenv').config();

const db = monk(process.env.MONGO_URI);

const urls = db.get('urls');
urls.createIndex({
  alias: 1
}, {
  unique: true
});


//Middleware
app.set('view engine', 'ejs');

app.use(express.static('../views'));

//Export Functions
module.exports = {

  index: (req, res, next) => {
    res.status(200);
    res.render('index');
  },

  urlForward: async (req, res, next) => {
    console.log("Entered the method");
    const {
      id: alias
    } = req.params;
    console.log("User entered  :", alias);
    const redirect = await urls.findOne({ alias });
    console.log(redirect);
    if (redirect) {
      res.redirect(redirect.url);
    } else {
      res.status(404);
      res.json({
        error : {
          message : "That url does not exist on server!"
        }
      });
    }
  },

  checkUrl: async (req, res, next) => {
    let {
      alias,
      url
    } = req.body;
    console.log(alias, url);
    if(url.startsWith('www')){
      url="http://"+url;
    }
    const result = await schema.validate({
      alias: alias,
      url: url,
    });
    console.log(result.error);
    if (!alias) {
      alias = nanoid(5);
      console.log("Nano ID Generated : ", alias);
    }
    if (alias.length > 5) {
      alias = alias.substr(0, 5);
    }
    alias = alias.toLowerCase();

    const alreadyExists = await urls.findOne({ alias });

    if (alreadyExists) {
      throw new Error('Sorry! The entered alias is in use');
    }

    if (result.error !== undefined) {
      throw new Error(result.error.message);
    }
    const newUrl = {
      alias: alias,
      url: url,
    }
    const created = await urls.insert(newUrl);
    res.status(200).render('index', {
      alias : String(alias)
    });
  }
};
