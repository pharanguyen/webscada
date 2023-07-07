// const express = require('express');
// const routes = express.Router();

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
//       res.json(result.recordset);
//       console.log(result);
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

//   const request = connection.request();
//   request.input('id_chinhanh', id_chinhanh);
//   request.query(query, (error, result) => {
//     if (error) {
//       console.error(error);
//       res.status(500).send('Internal Server Error');
//     } else {
//       res.json(result.recordset);
//       console.log(result);
//     }
//   });
// });




// module.exports= routes;
