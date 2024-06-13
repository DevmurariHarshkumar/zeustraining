const fs = require("fs");
const fastcsv = require("fast-csv");
const path = require("path")

function greetx() {
    console.log("hey");
}

function perform(x, y) {
    console.log(x + y);
}

// async function processCSV(csvFilename) {
//     const csvRows = [];
//     const emailSeen = {};

//     const uploadDir = "./uploads";
//     const fileStream = fs.createReadStream(path.join(uploadDir, csvFilename));

//     // Parse CSV using fast-csv
//     fileStream
//         .pipe(fastcsv.parse({ headers: true }))
//         .on("data", (row) => {
//             // Check for null values in any column (assuming all columns need to be checked)
//             const nullValues = Object.values(row).some((value) => !value);

//             if (!nullValues) {
//                 const email = row.emailid;
//                 if (email in emailSeen) {
//                     // Update row if email ID has been seen before (replace with latest data)
//                     csvRows[emailSeen[email]] = row;
//                 } else {
//                     // Store row index for the latest occurrence of email ID
//                     emailSeen[email] = csvRows.length;
//                     csvRows.push(row);
//                     console.log(".data is working")
//                 }
//             }
//         })
//         .on("end", () => {
//             // Write cleaned data back to a new CSV file
//             console.log(".end is working")
//             const outputFilePath = path.join(uploadDir, "cleaned_data.csv");
        
//             const ws = fs.createWriteStream(outputFilePath);
//             fastcsv
//                 .write(csvRows, { headers: true })
//                 .pipe(ws)
//                 .on("finish", () => {
//                     console.log(
//                         "CSV processing completed. Cleaned data saved to cleaned_data.csv"
//                     );
//                 });
//                 console.log("csvrows: ", csvRows)
//                 // DATABASE WALE CONNECTIONS BANAO
//         })
//         .on("error", (err) => {
//             console.error("Error parsing CSV:", err);
//         });
// }



module.exports = { greetx, perform };
