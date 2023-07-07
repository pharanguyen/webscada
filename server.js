// // const sql = require('mssql');

// // // Cấu hình kết nối đến SQL Server
// // const config = {
// //   server: '192.168.0.2',
// //   database: 'baocao_scada_db',
// //   user: 'sa_baocao',
// //   password: 'Cntt54dth88',
// //   //port: 1433,
// //   options: {
// //     encrypt: false // Disable SSL encryption
// //   }
// // };
// // const batchSize = 20;
// // // Kết nối tới SQL Server
// // sql.connect(config, function(err) {
// //   if (err) {
// //     console.log(err);
// //     return;
// //   }

// //   const sqlRequest = new sql.Request();

// //   const sqlQuery = 'select a.Ten, b.Trang_Thai,c.Ten from Dm_Tram a join Dm_ChiNhanh c on a.Stt= c.Id join Su_co b on b.Id_Tram = c.Id where c.id <=13 order by c.Ten';
// //   sqlRequest.query(sqlQuery, function(err, data) {
// //     if (err) {
// //       console.log(err);
// //       return;
// //     }
// //     const coordinates = data.recordset.map(row => row.Toa_do);

// //     // // Call the initMap function with the coordinates
// //     // initMap(coordinates);

// //     console.table(data.recordset);
// //     sql.close();
// //   });
// // });
// const fs = require('fs');
// const sql = require('mssql');

// // Cấu hình kết nối đến SQL Server
// const config = {
//   server: '192.168.0.2',
//   database: 'baocao_scada_db',
//   user: 'sa_baocao',
//   password: 'Cntt54dth88',
//   options: {
//     encrypt: false // Disable SSL encryption
//   }
// };

// // Kết nối tới SQL Server
// sql.connect(config, function(err) {
//   if (err) {
//     console.log(err);
//     return;
//   }

//   const sqlRequest = new sql.Request();
//   const sqlvinhbao = `
//   SELECT DISTINCT
//     dt.id AS id,
//     dt.ten AS ten,
//     dt.dia_chi AS dia_chi,
//     dt.nhamay_duongong AS nm_do,
//     dt.id_tql AS id_tql,
//     dt.toa_do AS toa_do,
//     dt.stt AS stt,
//     sc.Trang_Thai AS trang_thai,
//     sc.Thoi_Gian AS thoi_gian,
//     tst.id_chinhanh AS id_chinhanh
//   FROM
//     dm_tram dt
//     LEFT JOIN Su_Co sc ON dt.Id = sc.Id_Tram
//     LEFT JOIN dm_tql tql ON dt.id_tql = tql.id
//     LEFT JOIN ThongSo_Tram tst ON dt.id = tst.Id_Tram
// `;

//   const sqlQuery = `
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

//   sqlRequest.query(sqlvinhbao, function(err, data) {
//     if (err) {
//       console.log(err);
//       return;
//     }

//     const jsonData = JSON.stringify(data.recordset);

//     fs.writeFile('sqlvinhbao.json', jsonData, 'utf8', function(err) {
//       if (err) {
//         console.log(err);
//         return;
//       }

//       console.log('Data has been written to sqlvinhbao.json file.');
//       sql.close();
//     });
//   });
  
    
  
// });

var express = require('express');
var app = express();

app.use(express.static('public'));
const sql = require('mssql');
const path = require('path');

// Cấu hình kết nối đến SQL Server
const config = {
  server: '192.168.0.2',
  database: 'baocao_scada_db',
  user: 'sa_baocao',
  password: 'Cntt54dth88',
  options: {
    encrypt: false // Disable SSL encryption
  }
};

// Establish the connection
sql.connect(config, function (err) {
  if (err) {
    console.error('Failed to connect to SQL Server:', err);
  } else {
    console.log('Connected to SQL Server');
  }
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(express.static(path.join(__dirname, "public")));

app.get('/process_get', function (req, res) {
  // Chuan bi output trong dinh dang JSON
  response = {
    first_name: req.query.first_name,
    last_name: req.query.last_name
  };
  console.log(response);
  res.end(JSON.stringify(response));
});

app.get('/api/getItem', (req, res) => {
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

  // Execute the SQL query
  const request = new sql.Request();
  request.query(query, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      const nestedData = result.recordset.reduce((result, item) => {
        const idChinhanh = item.id_chinhanh;
        if (!result[idChinhanh]) {
          result[idChinhanh] = [];
        }
        result[idChinhanh].push(item);
        return result;
      }, {});

      res.json(nestedData);
    }
  });
});

//const pool = mysql.createPool(config);

// Route handler cho API endpoint
// app.get('/api/data', (req, res) => {
//   const maxTimeQuery = 'SELECT MAX(thoi_gian) AS maxtime FROM Nhat_Ky_Ngay';
//   const dataQuery = `
//     SELECT bt.Id, bt.ten_tram, bt.Id_Ts AS Id_Ts, bt.ten_thongso, bt.Toa_Do, bt.donvi, nk.Gia_Tri, nk.Thoi_Gian, s.Trang_Thai AS trang_thai, s.Thoi_Gian AS ThoiGianSuco, s.id AS id_suco, 
//     xl.suco, xl.ket_thuc, bt.Ten_tql
//     FROM (
//       SELECT tr.Id, tr.Ten AS ten_tram, tr.Toa_Do, tq.Ten AS Ten_tql, ts.Id AS Id_Ts, ts.Ma AS ten_thongso, ts.Don_Vi AS donvi, tst.Id_tql AS Id_tql, tst.Id_ChiNhanh
//       FROM dm_Tram tr
//       LEFT JOIN ThongSo_Tram tst ON tr.Id = tst.Id_Tram
//       LEFT JOIN Dm_ThongSo ts ON ts.Id = tst.Id_ThongSo
//       LEFT JOIN Dm_Tql tq ON tq.Id = tst.Id_Tql
//     ) bt
//     LEFT JOIN (
//       SELECT Id_Tram, Trang_Thai, Thoi_Gian, id
//       FROM Su_Co
//     ) s ON s.Id_Tram = bt.Id
//     LEFT JOIN xulysuco xl ON s.id = xl.id_suco
//     LEFT JOIN (
//       SELECT Id_Tram, Gia_Tri, Thoi_Gian, Id_ThongSo
//       FROM Nhat_Ky_Ngay
//       WHERE Thoi_Gian = (
//         SELECT DATEADD(minute, -5, (SELECT MAX(Thoi_Gian) FROM Nhat_Ky_Ngay))
//       )
//     ) nk ON nk.Id_ThongSo = bt.Id_Ts AND bt.Id = nk.Id_Tram 
//     ORDER BY ten_thongso DESC`;

//   // Execute the SQL queries
//   const request = new sql.Request();
//   request.query(maxTimeQuery, (maxTimeError, maxTimeResults) => {
//     if (maxTimeError) {
//       console.error('Lỗi truy vấn SQL maxtime:', maxTimeError);
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       const maxTime = maxTimeResults.recordset[0].maxtime;

//       request.query(dataQuery, (dataError, dataResults) => {
//         if (dataError) {
//           console.error('Lỗi truy vấn SQL data:', dataError);
//           res.status(500).json({ error: 'Internal Server Error' });
//         } else {
//           res.json({ maxtime: maxTime, data: dataResults.recordset });
//         }
//       });
//     }
//   });
// });

app.get('/api/data', (req, res) => {
  const maxTimeQuery = 'SELECT MAX(thoi_gian) AS maxtime FROM Nhat_Ky_Ngay';
  const dataQuery = `
    SELECT bt.Id, bt.ten_tram, bt.Id_Ts AS Id_Ts, bt.ten_thongso, bt.Toa_Do, bt.donvi, nk.Gia_Tri, nk.Thoi_Gian, s.Trang_Thai AS trang_thai, s.Thoi_Gian AS ThoiGianSuco, s.id AS id_suco, 
    xl.suco, xl.ket_thuc, bt.Ten_tql
    FROM (
      SELECT tr.Id, tr.Ten AS ten_tram, tr.Toa_Do, tq.Ten AS Ten_tql, ts.Id AS Id_Ts, ts.Ma AS ten_thongso, ts.Don_Vi AS donvi, tst.Id_tql AS Id_tql, tst.Id_ChiNhanh
      FROM dm_Tram tr
      LEFT JOIN ThongSo_Tram tst ON tr.Id = tst.Id_Tram
      LEFT JOIN Dm_ThongSo ts ON ts.Id = tst.Id_ThongSo
      LEFT JOIN Dm_Tql tq ON tq.Id = tst.Id_Tql
    ) bt
    LEFT JOIN (
      SELECT Id_Tram, Trang_Thai, Thoi_Gian, id
      FROM Su_Co
    ) s ON s.Id_Tram = bt.Id
    LEFT JOIN xulysuco xl ON s.id = xl.id_suco
    LEFT JOIN (
      SELECT Id_Tram, Gia_Tri, Thoi_Gian, Id_ThongSo
      FROM Nhat_Ky_Ngay
      WHERE Thoi_Gian = (
        SELECT DATEADD(minute, -5, (SELECT MAX(Thoi_Gian) FROM Nhat_Ky_Ngay))
      )
    ) nk ON nk.Id_ThongSo = bt.Id_Ts AND bt.Id = nk.Id_Tram 
    ORDER BY ten_thongso DESC`;

  // Execute the SQL queries
  const request = new sql.Request();
  request.query(maxTimeQuery, (maxTimeError, maxTimeResults) => {
    if (maxTimeError) {
      console.error('Lỗi truy vấn SQL maxtime:', maxTimeError);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const maxTime = maxTimeResults.recordset[0].maxtime;

      request.query(dataQuery, (dataError, dataResults) => {
        if (dataError) {
          console.error('Lỗi truy vấn SQL data:', dataError);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          const json = {
            maxtime: maxTime,
            data: []
          };

          // Xử lý dữ liệu và tạo JSON theo yêu cầu
          const groupedData = {};
          dataResults.recordset.forEach((item) => {
            const tenTram = item.ten_tram;
            const tenThongSo = item.ten_thongso;
            const donVi = item.donvi;
            const giaTri = item.Gia_Tri;
            const toaDo = item.Toa_Do;
            const trangThai = item.trang_thai;
            const suco = item.suco;
            const ketThuc = item.ket_thuc;
            const tenTql = item.Ten_tql;

            if (!groupedData[tenTram]) {
              groupedData[tenTram] = {
                ten_tram: tenTram,
                Toa_Do: toaDo,
                trang_thai: trangThai,
                details: []
              };
            }
            groupedData[tenTram].details.push({ ten_thongso: tenThongSo, donvi: donVi, Gia_Tri: giaTri });
            groupedData[tenTram].suco = suco;
            groupedData[tenTram].ket_thuc = ketThuc;
            groupedData[tenTram].Ten_tql = tenTql;
          });

          for (const key in groupedData) {
            if (groupedData.hasOwnProperty(key)) {
              json.data.push(groupedData[key]);
            }
          }

          res.json(json);
        }
      });
    }
  });
});





var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Ung dung Node.js dang lang nghe tai dia chi: http://%s:%s", host, port);
});
