const os = require("os");
const path = require("path");
const fs = require("fs");
const EventEmitter = require("events");
const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const cors = require("cors");
const helper = require("./helper");
const fastcsv = require('fast-csv');

const app = express();
const port = 3000;

app.use(express.static("views"));
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "harsh",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the database");
});

connection.query("SELECT * FROM users", (error, results, fields) => {
  if (error) throw error;
  console.log(error);
});

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });



const allRows = [];
async function processCSV(csvFilename) {
  const csvRows = [];
  const emailSeen = {};

  const uploadDir = "./uploads";
  const fileStream = fs.createReadStream(path.join(uploadDir, csvFilename));

  // Parse CSV using fast-csv
  fileStream
      .pipe(fastcsv.parse({ headers: true }))
      .on("data", (row) => {
          // Check for null values in any column (assuming all columns need to be checked)
          const nullValues = Object.values(row).some((value) => !value);
          // console.log("nulllllll", nullValues)

          if (!nullValues) {
              const email = row.emailid;
              allRows.push(row);
              csvRows.push(row);
              // if (email in emailSeen) {
              //     // Update row if email ID has been seen before (replace with latest data)
              //     csvRows[emailSeen[email]] = row;
              // } else {
              //   console.log("IM in else")
              //     // Store row index for the latest occurrence of email ID
              //     emailSeen[email] = csvRows.length;
              //     allRows.push(row);
              //     csvRows.push(row);
                  
              // }
          }
          // console.log(".data is working", csvRows)
      })
      .on("end", () => {
          // Write cleaned data back to a new CSV file
          // console.log(".end is working", allRows)
          const outputFilePath = path.join(uploadDir, "cleaned_data.csv");
          
          // DATABASE WALE CONNECTIONS BANAO
          // const sql = 'INSERT INTO users (id, fname, lname, email) VALUES ?';
          const sql = "INSERT INTO users (id, fname, lname, email) VALUES ? ON DUPLICATE KEY UPDATE id = VALUES(id),fname = VALUES(fname),lname = VALUES(lname)";
          const values = csvRows.map(row => [row.id, row.fname, row.lname, row.email]);
          // console.log("-----------------------------", csvRows, "|||||||||||||||||||||||||",values)

          connection.query(sql, [values], (err, results) => {
            if (err) {
              console.error('Error inserting data into MySQL:', err);
              return;
            }
            console.log('Data inserted into MySQL successfully');
          });        
      })
      .on("error", (err) => {
          console.error("Error parsing CSV:", err);
      });
}





// function uploadToBase(csvFilename) {
//   const csvPath = path.join(__dirname, "uploads", csvFilename);
//   const csvRows = [];

//   // Read CSV file
//   fs.createReadStream(csvPath)
//     .pipe(fastcsv.parse({ headers: true }))
//     .on("data", (row) => {
//       // Check for null values in any column (assuming all columns need to be checked)
//       const nullValues = Object.values(row).some((value) => !value);

//       if (!nullValues) {
//         csvRows.push(row);
//       }
//     })
//     .on("end", () => {
//       // Format data for bulk insert into MySQL
//       const sql = 'INSERT INTO your_table_name (id, fname, lname, email) VALUES ?';
//       const values = csvRows.map(row => [row.id, row.fname, row.lname, row.email]);

//       // Perform bulk insert
//       connection.query(sql, [values], (err, results) => {
//         if (err) {
//           console.error('Error inserting data into MySQL:', err);
//           return;
//         }
//         console.log('Data inserted into MySQL successfully');
//       });
//     })
//     .on("error", (err) => {
//       console.error("Error parsing CSV:", err);
//     });
// }





// function uploadtobase(data) {
//   console.log("data", data)
//   const sql = 'INSERT INTO your_table_name (id, fname, lname, email) VALUES ?';

//   // bulk insert
//   const values = data.map(row => [row.id, row.fname, row.lname, row.email]);

//   // Perform bulk insert
//   connection.query(sql, [values], (err, results) => {
//       if (err) {
//           console.error('Error inserting data into MySQL:', err);
//           return;
//       }
//       console.log('Data inserted into MySQL successfully');
//   });
// }



app.get("/", (req, res) => {
  console.log("this is __dirname", __dirname);
  console.log("thats get request from / route")
  // res.sendFile(path.join("views", "index.html"));
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send("No file uploaded.");
  }
  console.log(`File ${file.originalname} uploaded successfully.`);
  res.send("File uploaded successfully!");
  try {
    const processedData = await processCSV(file.originalname).then(data=>{
      console.log(".then block", data)
    })
    
  } catch (error) {
    console.error('ASYNC HAI:', error);
  }
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});









// const os = require("os")
// console.log(os.type)

// const path = require("path")
// var pathobj = path.parse(__filename);

// const fil = require("fs");
// fil.readdir("./", (err, files) => {
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log(files)
//     }
// })

// const EventEmiiter = require("events");
// emitter = new EventEmiiter()

// emitter.on("nowdoit", function(){
//     console.log("this is done")
// })

// emitter.emit("nowdoit")

// const greet = require("./helper.js");
// greet.greetx();

// // console.log(module)

// function hehe(name) {
//     console.log("hehe", name)
// }

// greet.perform(2,3)

// hehe("xyz")

// console.log("hehe this is due to nodemon")

// const express = require("express")
// const multer = require("multer")
// const mysql = require("mysql")
// const cors = require("cors")
// const mysql2 = require("mysql2")

// const app = express()
// app.use(express.static('views'));
// const port = 3000

// //database connect
// var connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : 'root',
//     database : 'harsh'
// });

// app.get('/', (req, res) => {
//   console.log("hi")
//     res.render("./views/index")
// })

// const storage = multer.diskStorage({
//     destination: './uploads/',
//     filename: function(req, file, cb) {
//     cb(null, file.originalname);
//     }
// });
// connection.connect();
// app.use(express.urlencoded({ extended: false }))
// // const upload = multer({storage:storage})
// app.use(cors())

// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
// });

// const upload = multer({ storage });

// const db = require("./database.db")

// app.post("/", (req, res) => {
//     res.send("HERE JS")
//     const file = req.file;
//     db.saveFile(file, function(err, savedFile) {
//         if (err) {
//         return next(err);
//         }

//         res.send('File uploaded successfully!');
//     });
// })

// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })
