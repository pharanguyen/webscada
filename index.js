const express = require('express');
const config = require('./dbconfig');
const sql = require('mssql');
const path = require('path');



const app = express();
const fs = require('fs');

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
  const request = connection.request();
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

      const jsonData = JSON.stringify(nestedData);

      fs.writeFile('data1.json', jsonData, 'utf8', (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        } else {
          console.log('Data has been written to data1.json file.');
          res.json(nestedData);
        }
      });
    }
  });
});




// Route API to get data for a specific id_chinhanh
app.get('/api/getItem/:id_chinhanh', (req, res) => {
  const id_chinhanh = req.params.id_chinhanh;

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
    WHERE tst.id_chinhanh = @id_chinhanh
  `;

});




// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the HTML file


// Khởi chạy server
app.listen(5501, () => {
  console.log('Server started on port http://127.0.0.1:5501/');
});

function DanhSachChiNhanh() {
  fetch('ChiNhanh.json')
    .then(response => response.json())
    .then(data => {
      const chiNhanhList = data;

      const list = document.getElementById('list');
      list.innerHTML = ''; // Clear the existing list

      for (const chiNhanh of chiNhanhList) {
        const listItem = document.createElement('li');
        listItem.textContent = chiNhanh.TenChiNhanh;
        list.appendChild(listItem);

        const coordinates = chiNhanh.Toa_Do.split(", ");
        const position = { lat: parseFloat(coordinates[0]), lng: parseFloat(coordinates[1]) };

        const marker = new google.maps.Marker({
          position: position,
          map: map,
          title: chiNhanh.TenTram,
          icon: icon,
        });

        markers.push(marker);

        const infoWindow = new google.maps.InfoWindow({
          content: chiNhanh.TenChiNhanh,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function initMap(jsonFile) {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: 20.865139, lng: 106.683830 },
    gestureHandling: "greedy",
  });

  const icon = {
    url: "https://capnuochaiphong.com.vn/DesktopModule/CapNuocHP/asset/img/diemdo.png",
    scaledSize: new google.maps.Size(30, 30),
    fillColor: "green",
    fillOpacity: 1,
    anchor: new google.maps.Point(15, 30),
  };

  const markers = [];

  fetch(jsonFile)
    .then(response => response.json())
    .then(data => {
      const chiNhanhList = data;
      console.log(chiNhanhList);

      for (const chiNhanh of chiNhanhList) {
        const coordinates = chiNhanh.toa_do.split(", ");
        const position = { lat: parseFloat(coordinates[0]), lng: parseFloat(coordinates[1]) };

        const marker = new google.maps.Marker({
          position: position,
          map: map,
          title: chiNhanh.TenTram,
          icon: icon,
        });

        markers.push(marker);

        const infoWindow = new google.maps.InfoWindow({
          content: chiNhanh.TenTram,
        });

        marker.addListener("click", () => {
          const modal = document.getElementById("exampleModalScrollable");
          const modalTitle = modal.querySelector(".modal-title");
          const modalBody = modal.querySelector(".modal-body");
        
          // Thiết lập nội dung cho modal dựa trên thông tin của marker
          modalTitle.textContent = chiNhanh.TenTram;
          modalBody.textContent = "Thông tin khác về chi nhánh";
        
          // Hiển thị modal
          $(modal).modal("show");
        });
      }
    })
    .catch(error => {
      console.log(error);
    });
}

window.initMap = initMap;

