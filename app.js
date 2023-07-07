const express = require('express');
const config = require('./dbconfig');
const sql = require('mssql');

const app = express();

// Kết nối cơ sở dữ liệu MSSQL
const connection = new sql.ConnectionPool(config);

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
  } else {
    console.log('Connected to the database');
  }
});

// Route API để lấy tất cả dữ liệu
app.get('/api/data', (req, res) => {
  const query = `
    SELECT DISTINCT
      dt.id AS id,
      dt.ten AS ten,
      dt.dia_chi AS dia_chi,
      dt.nhamay_duongong AS nm_do,
      dt.id_tql AS id_tql,
      dt.toa_do AS toa_do,
      dt.stt AS stt,
      sc.Trang_Thai AS trang_thai,
      sc.Thoi_Gian AS thoi_gian,
      tst.id_chinhanh AS id_chinhanh
    FROM
      dm_tram dt
      LEFT JOIN Su_Co sc ON dt.Id = sc.Id_Tram
      LEFT JOIN dm_tql tql ON dt.id_tql = tql.id
      LEFT JOIN ThongSo_Tram tst ON dt.id = tst.Id_Tram
  `;

  // Thực thi truy vấn SQL
  const request = connection.request();
  request.query(query, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result.recordset);
      console.log(result);
    }
  });
});
const htmlFilePath = path.join(__dirname, 'public', 'index.html');

// Serve static files from the "public" directory
app.use(express.static('public'));

// Route to serve the HTML file
app.get('/html', (req, res) => {
  res.sendFile(htmlFilePath);
});


// Khởi chạy server
app.listen(8000, () => {
  console.log('Server started on port 8000');
});
// const express = require('express');
// const config = require('./dbconfig');
// const sql = require('mssql');
// const path = require('path');



// const app = express();
// const fs = require('fs');

// // Kết nối cơ sở dữ liệu MSSQL
// const connection = new sql.ConnectionPool(config);

// connection.connect((error) => {
//   if (error) {
//     console.error('Error connecting to the database:', error);
//   } else {
//     console.log('Connected to the database');
//   }
// });

// // Route API để lấy tất cả dữ liệu


// app.get('/api/getItem', (req, res) => {
//   const query = `
//     SELECT DISTINCT
//       dt.id AS id,
//       dt.ten AS ten,
//       dt.dia_chi AS dia_chi,
//       dt.nhamay_duongong AS nm_do,
//       dt.id_tql AS id_tql,
//       dt.toa_do AS toa_do,
//       dt.stt AS stt,
//       sc.Trang_Thai AS trang_thai,
//       sc.Thoi_Gian AS thoi_gian,
//       tst.id_chinhanh AS id_chinhanh
//     FROM
//       dm_tram dt
//       LEFT JOIN Su_Co sc ON dt.Id = sc.Id_Tram
//       LEFT JOIN dm_tql tql ON dt.id_tql = tql.id
//       LEFT JOIN ThongSo_Tram tst ON dt.id = tst.Id_Tram
//   `;

//   // Execute the SQL query
//   const request = connection.request();
//   request.query(query, (error, result) => {
//     if (error) {
//       console.error(error);
//       res.status(500).send('Internal Server Error');
//     } else {
//       const nestedData = result.recordset.reduce((result, item) => {
//         const idChinhanh = item.id_chinhanh;
//         if (!result[idChinhanh]) {
//           result[idChinhanh] = [];
//         }
//         result[idChinhanh].push(item);
//         return result;
//       }, {});

//       const jsonData = JSON.stringify(nestedData);

//       fs.writeFile('data1.json', jsonData, 'utf8', (err) => {
//         if (err) {
//           console.error(err);
//           res.status(500).send('Internal Server Error');
//         } else {
//           console.log('Data has been written to data1.json file.');
//           res.json(nestedData);
//         }
//       });
//     }
//   });
// });




// // Route API to get data for a specific id_chinhanh
// app.get('/api/getItem/:id_chinhanh', (req, res) => {
//   const id_chinhanh = req.params.id_chinhanh;

//   const query = `
//     SELECT DISTINCT
//       dt.id AS id,
//       dt.ten AS ten,
//       dt.dia_chi AS dia_chi,
//       dt.nhamay_duongong AS nm_do,
//       dt.id_tql AS id_tql,
//       dt.toa_do AS toa_do,
//       dt.stt AS stt,
//       sc.Trang_Thai AS trang_thai,
//       sc.Thoi_Gian AS thoi_gian,
//       tst.id_chinhanh AS id_chinhanh
//     FROM
//       dm_tram dt
//       LEFT JOIN Su_Co sc ON dt.Id = sc.Id_Tram
//       LEFT JOIN dm_tql tql ON dt.id_tql = tql.id
//       LEFT JOIN ThongSo_Tram tst ON dt.id = tst.Id_Tram
//     WHERE tst.id_chinhanh = @id_chinhanh
//   `;

// });




// // Serve static files from the "public" directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Route to serve the HTML file


// // Khởi chạy server
// app.listen(5501, () => {
//   console.log('Server started on port http://127.0.0.1:5501/');
// });
