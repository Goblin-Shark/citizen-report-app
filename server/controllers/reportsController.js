const db = require('../models/reportsModel');

const reportsController = {};

// Get all the complaints from the database, store them in the res.locals object and pass this information to next middleware function by invoking next()
reportsController.getComplaints = (req, res, next) => {
  const text = 'SELECT * FROM reports';
  db.query(text)
    .then(complaints => {
      res.locals.complaints = complaints.rows;
      return next();
    })
    .catch(err => next({ error: err }))
};

// Add a new complaint into your database
reportsController.addComplaint = (req, res, next) => {
  // Get all the information you need to create a new complaint from the request body
  const { location, zipcode, lat_lon, category, description, user_ip, status, created_on } = req.body;

  const query = {
    text: "INSERT INTO reports(location, zipcode, lat_lon, category, description, user_ip, status, created_on )",
    values: [location, zipcode, lat_lon, category, description, user_ip, status, created_on]
  }
       
    db.query(query)
      .then(insertedComplaint => {
        res.locals.insertedComplaint = insertedComplaint.rows;
        return next();
      })
      .catch(err => next({error: err}))

};

// Update a specific complaint from the database
reportsController.updateComplaint = (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const text = `UPDATE reports SET status = 'Not checked' WHERE id = ${id} RETURNING *`;
  
  db.query(text)
    .then(updatedComplaint => {
      res.locals.updatedComplaint = updatedComplaint.rows;
      return next();
    })
    .catch(err => next({error: err})) 
};


// Delete a specific complaint from the database
reportsController.deleteComplaint = (req, res, next) => {
  const { id } = req.params;
  const text = `DELETE FROM reports WHERE id = ${id} RETURNING *`;
  db.query(text)
    .then(deletedComplaint => {
      res.locals.deletedComplaint = deletedComplaint.rows;
      return next();
    })
    .catch(err => next({error: err})) 

};

module.exports = reportsController;