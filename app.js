var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var mysql = require('mysql');
var bodyParser = require("body-parser");
var multer = require('multer');
var crypto = require('crypto');
var s = require('multer');
var uuid = unique_id();

var connection = mysql.createConnection({
    host : 'sibejoo.com',
    user : 'sibejoo1_heroo',
    password : 'Bismillah4771',
    database : 'sibejoo1_remake',
});

// var connection = mysql.createConnection({
//     host : 'localhost',
//     user : 'root',
//     password : '',
//     database : 'db_cattloo',
// });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connection.connect(function (err) {
    if (!err){
        console.log("Database terkoneksi");
        console.log(uuid);
    } else {
        console.log("Database tidak terhubung");
    }
})

app.get('/',function(req,res){
    var data = {
        "Data":""
    };
    data["Data"] = "Hello Sibejoo";
    res.json(data);
});

var storage = multer.diskStorage({
    destination: './image/fotoProfil',
    filename: function(req, file, cb) {
        return crypto.pseudoRandomBytes(16, function(err, raw) {
            if (err) {
                return cb(err);
            }
            return cb(null, "" + (raw.toString('hex')) + (path.extname(file.originalname)));
        });
    }


});

//upload poto
app.post('/uploadFoto', multer({storage: storage}).single('upload'), function(req, res) {
    console.log(req.file);
    console.log(req.body);
    console.log("sebelum di isi : "+s);
    s = req.file.filename;
    console.log("yaaaannggggg  iniiiiiiiiiiiiii "+s);
    return res.status(204).end(), res.s;
});

//ambil user
app.get('/getSiswa',function (req,res) {
    var data = {
    };
    connection.query("SELECT * " +
        " FROM `tb_siswa` s JOIN `tb_pengguna` p ON s.penggunaID = p.id " +
        " WHERE p.kataSandi = '"+req.query.kataSandi+"' AND p.status = '1' AND (p.namaPengguna='"+req.query.namaPengguna+"' OR p.eMail='"+req.query.eMail+"')", function (err, rows, fields) {
        if (rows.length !=0){
            data["Siswa"] = rows;
            res.json(data);
        } else{
            data["Siswa"] = 'Tidak Ada Siswa';
            res.json(data);
        }
    })
});

//ambil mata pelajaran berdasarkan tingkat
app.get('/getMapel',function (req,res) {
    var data = {
    };
    connection.query("SELECT DISTINCT `tp`.`id`, `tp`.`tingkatID`, `tp`.`matapelajaranID`, `tp`.`keterangan`, `mp`.`namaMataPelajaran`, `mp`.`aliasMataPelajaran` " +
        " FROM (`tb_mata-pelajaran` `mp`, `tb_tingkat-pelajaran` `tp`) " +
        " JOIN `tb_bab` `bab` ON `bab`.`tingkatPelajaranID`=`tp`.`id` " +
        " JOIN `tb_subbab` `sub` ON `sub`.`babID`=`bab`.`id` " +
        " JOIN `tb_video` `video` ON `video`.`subBabID`=`sub`.`id` " +
        " WHERE `mp`.`id` = `tp`.`mataPelajaranID` AND `tingkatID` = '"+req.query.tingkatID+"' AND `mp`.`status` = '1' AND `tp`.`status` = '1'", function (err, rows, fields) {
        if (rows.length !=0){
            data["MataPelajaran"] = rows;
            res.json(data);
        } else{
            data["MataPelajaran"] = 'Tidak Ada Mata Pelajaran';
            res.json(data);
        }
    })
});

//ambil bab
app.get('/getBab',function (req,res) {
    var data = {
    };
    connection.query("SELECT bab.`id`, bab.`judulBab` FROM tb_video video " +
        " JOIN tb_subbab subbab ON video.subBabID = subbab.id " +
        " JOIN tb_bab bab ON bab.id = subbab.babID  " +
        " JOIN `tb_tingkat-pelajaran` tingpel ON tingpel.id = bab.`tingkatPelajaranID`" +
        " JOIN tb_tingkat tingkat ON tingkat.`id` = tingpel.`tingkatID` " +
        " JOIN `tb_mata-pelajaran` mapel ON mapel.`id` = tingpel.`mataPelajaranID` " +
        " WHERE tingpel.id = "+req.query.id+" GROUP BY bab.id", function (err, rows, fields) {
        if (rows.length !=0){
            data["Bab"] = rows;
            res.json(data);
        } else{
            data["Bab"] = 'Tidak Ada Mata Pelajaran';
            res.json(data);
        }
    })
});

//ambil materi berdasarkan bab
app.get('/getMateriBab',function (req,res) {
    var data = {
    };
    connection.query("SELECT *,video.id AS videoID, subbab.id AS subbabID,bab.id AS babID FROM tb_video video " +
        " JOIN tb_subbab subbab ON video.subBabID = subbab.id " +
        " JOIN tb_bab bab ON bab.id = subbab.babID " +
        " JOIN `tb_tingkat-pelajaran` tingpel ON tingpel.id = bab.`tingkatPelajaranID` " +
        " JOIN tb_tingkat tingkat ON tingkat.`id` = tingpel.`tingkatID` " +
        " JOIN `tb_mata-pelajaran` mapel ON mapel.`id` = tingpel.`mataPelajaranID` " +
        " WHERE tingpel.id = "+req.query.id+" AND babID = "+req.query.babID+" ORDER BY bab.id", function (err, rows, fields) {
        if (rows.length !=0){
            data["Materi"] = rows;
            res.json(data);
        } else{
            data["Materi"] = 'Tidak Ada Mata Pelajaran';
            res.json(data);
        }
    })
});

//ambil materi berdasarkan mata pelajaran
app.get('/getMateri',function (req,res) {
    var data = {
    };
    connection.query("SELECT *,video.id AS videoID, subbab.id AS subbabID,bab.id AS babID FROM tb_video video " +
        " JOIN tb_subbab subbab ON video.subBabID = subbab.id " +
        " JOIN tb_bab bab ON bab.id = subbab.babID " +
        " JOIN `tb_tingkat-pelajaran` tingpel ON tingpel.id = bab.`tingkatPelajaranID` " +
        " JOIN tb_tingkat tingkat ON tingkat.`id` = tingpel.`tingkatID` " +
        " JOIN `tb_mata-pelajaran` mapel ON mapel.`id` = tingpel.`mataPelajaranID` WHERE tingpel.id = "+req.query.id+" ORDER BY bab.id", function (err, rows, fields) {
        if (rows.length !=0){
            data["Materi"] = rows;
            res.json(data);
        } else{
            data["Materi"] = 'Tidak Ada Mata Pelajaran';
            res.json(data);
        }
    })
});

//ambil materi berdasarkan mata pelajaran dan jenis video
app.get('/getMateriByJenisVideo',function (req,res) {
    var data = {
    };
    connection.query("SELECT *,video.id AS videoID, subbab.id AS subbabID,bab.id AS babID FROM tb_video video " +
        " JOIN tb_subbab subbab ON video.subBabID = subbab.id " +
        " JOIN tb_bab bab ON bab.id = subbab.babID " +
        " JOIN `tb_tingkat-pelajaran` tingpel ON tingpel.id = bab.`tingkatPelajaranID` " +
        " JOIN tb_tingkat tingkat ON tingkat.`id` = tingpel.`tingkatID` " +
        " JOIN `tb_mata-pelajaran` mapel ON mapel.`id` = tingpel.`mataPelajaranID` WHERE tingpel.id = "+req.query.id+" " +
        " AND video.jenis_video = "+req.query.jenis_video+" ORDER BY bab.id", function (err, rows, fields) {
        if (rows.length !=0){
            data["Materi"] = rows;
            res.json(data);
        } else{
            data["Materi"] = 'Tidak Ada Mata Pelajaran';
            res.json(data);
        }
    })
});

//ambil video
app.get('/getVideo',function (req,res) {
    var data = {
    };
    connection.query("SELECT `video`.`id`, `video`.`judulVideo`, `video`.`thumbnail`, `video`.`deskripsi`, `video`.`link`, `video`.`date_created`, `video`.`namaFile`, `video`.`penggunaID`, `video`.`subBabID` " +
        " FROM `tb_video` `video` " +
        " WHERE `video`.`id` = '"+req.query.id+"'", function (err, rows, fields) {
        if (rows.length !=0){
            data["Video"] = rows;
            res.json(data);
        } else{
            data["Video"] = 'Tidak Ada Mata Pelajaran';
            res.json(data);
        }
    })
});

//ambil edu drive
app.get('/getEduDrive',function (req,res) {
    var data = {
    };
    connection.query("SELECT * FROM tb_modul", function (err, rows, fields) {
        if (rows.length !=0){
            data["EduDrive"] = rows;
            res.json(data);
        } else{
            data["EduDrive"] = 'Tidak Ada Mata Pelajaran';
            res.json(data);
        }
    })
});

//ambil edu druve terlaris
app.get('/getEduDriveFav',function (req,res) {
    var data = {
    };
    connection.query("SELECT * FROM tb_modul WHERE download > 0 AND STATUS = 1 ORDER BY download DESC LIMIT 20", function (err, rows, fields) {
        if (rows.length !=0){
            data["EduDrive"] = rows;
            res.json(data);
        } else{
            data["EduDrive"] = 'Tidak Ada Mata Pelajaran';
            res.json(data);
        }
    })
});

//ambil edu druve by judul
app.get('/getEduDriveByJudul',function (req,res) {
    var key = req.query.judul;
    var data = {
        
    };
    connection.query("SELECT * FROM tb_modul WHERE judul LIKE ?","%" + key + "%", function (err, rows, fields) {
        if (rows.length !=0){
            data["EduDrive"] = rows;
            res.json(data);
        } else{
            data["EduDrive"] = 'Tidak Ada Mata Pelajaran';
            res.json(data);
        }
    })
});

//ambil mapel learning line
app.get('/getMapelLearningLine',function (req,res) {
    var data = {

    };
    connection.query("SELECT DISTINCT `tp`.`keterangan` AS `mapel`, `statusAksesLearningLine` " +
        " FROM `tb_tingkat-pelajaran` `tp` JOIN `tb_bab` `bab` ON `bab`.`tingkatPelajaranID` = `tp`.`id` " +
        " JOIN `tb_line_topik` `topik` ON `topik`.`babID`=`bab`.`id` JOIN .`tb_line_step` `step` ON `step`.`topikId`=`topik`.`id` " +
        " WHERE `topik`.`status` = 1 AND `bab`.`statusLearningLine` = 1 AND `tingkatID` = '"+req.query.tingkatID+"' " +
        " GROUP BY `mapel`", function (err, rows, fields) {
        if (rows.length !=0){
            data["MapelLearningLine"] = rows;
            res.json(data);
        } else{
            data["MapelLearningLine"] = 'Tidak Ada Mata Pelajaran';
            res.json(data);
        }
    })
});

//ambil topik learning line
app.get('/getTopikLearningLine',function (req,res) {
    var data = {

    };
    connection.query("SELECT DISTINCT `topik`.`id`, `topik`.`UUID`, `topik`.`namaTopik` " +
        " FROM `tb_line_topik` `topik` " +
        " JOIN `tb_line_step` `step` ON `step`.`topikID`=`topik`.`id` " +
        " WHERE `topik`.`babID` = '"+req.query.babID+"' AND `topik`.`status` = 1 AND `topik`.`statusLearning` = 1 " +
        " ORDER BY `topik`.`urutan`", function (err, rows, fields) {
        if (rows.length !=0){
            data["TopikLearningLine"] = rows;
            res.json(data);
        } else{
            data["TopikLearningLine"] = 'Tidak Ada Mata Pelajaran';
            res.json(data);
        }
    })
});

//ambillearning line
app.get('/getLearningLine',function (req,res) {
    var data = {

    };
    connection.query("SELECT topik.id topikId, `namaTopik`, stp.`namaStep`, `stp`.`UUID` AS `stepUUID`, `namaStep`, `jenisStep`, `topik`.`deskripsi`, `bab`.`judulBab`, " +
        " `tp`.`keterangan`, `tkt`.`aliasTingkat`, `stp`.`latihanID`, `stp`.`id` AS `stepID`, `stp`.`urutan`, `linlo`.`id` AS linlog_id, `linlo`.`penggunaID` AS linlog_penggunaID, `linlo`.`statusStep` AS linelog_statusStep, `linlo`.`stepID` AS linelog_stepID " +
        " FROM (SELECT * FROM tb_line_topik t WHERE t.status = 1 ) topik " +
        " JOIN `tb_line_step` stp ON stp.`topikID` = topik.`id` " +
        " JOIN `tb_bab` `bab` ON `bab`.`id`=`topik`.`babID` " +
        " JOIN `tb_tingkat-pelajaran` `tp` ON `tp`.`id`=`bab`.`tingkatPelajaranID` " +
        " JOIN `tb_tingkat` `tkt` ON `tkt`.`id`=`tp`.`tingkatID` " +
        " LEFT JOIN `tb_line_log` linlo ON `stp`.`id` = linlo.`stepID` WHERE stp.status=1 AND topik.id = "+req.query.id+" " +
        " ORDER BY topik.`urutan` , stp.`urutan`", function (err, rows, fields) {
        if (rows.length !=0){
            data["LearningLine"] = rows;
            res.json(data);
        } else{
            data["LearningLine"] = 'Tidak Ada Mata Pelajaran';
            res.json(data);
        }
    })
});

//ambil log learning line
app.get('/getLogLearningLine',function (req,res) {
    var data = {

    };
    connection.query("SELECT * from tb_line_log where penggunaID ="+req.query.penggunaID+" and stepID ="+req.query.stepID, function (err, rows, fields) {
        if (rows.length !=0){
            data["LearningLineLog"] = rows;
            res.json(data);
        } else{
            data["LearningLineLog"] = 'Tidak Ada Mata Pelajaran';
            res.json(data);
        }
    })
});

//ambil video learning line
app.get('/getVideoLearningLine',function (req,res) {
    var data = {

    };
    connection.query("SELECT `namaStep`, `namaTopik`, `judulVideo`, `namaFile`, `video`.`deskripsi` AS `deskripsiVideo`, `link`, `video`.`date_created`, `topik`.`UUID` " +
        " FROM `tb_line_topik` `topik` JOIN `tb_line_step` `step` ON `step`.`topikID`=`topik`.`id` " +
        " JOIN `tb_video` `video` ON `step`.`videoID` = `video`.`id` " +
        " WHERE `step`.`UUID` = '"+req.query.UUID+"'", function (err, rows, fields) {
        if (rows.length !=0){
            data["LearningLineVideo"] = rows;
            res.json(data);
        } else{
            data["LearningLineVideo"] = 'Tidak Ada Mata Pelajaran';
            res.json(data);
        }
    })
});

//ambil pdf learning line
app.get('/getModulLearningLine',function (req,res) {
    var data = {

    };
    connection.query("SELECT `namaStep`, `namaTopik`, `judulMateri`, `isiMateri`, `materi`.`date_created`, `topik`.`UUID`, `url_file` " +
        " FROM `tb_line_topik` `topik` JOIN `tb_line_step` `step` ON `step`.`topikID`=`topik`.`id` " +
        " JOIN `tb_line_materi` `materi` ON `materi`.`id`=`step`.`materiID` " +
        " WHERE `step`.`UUID` = '"+req.query.UUID+"'", function (err, rows, fields) {
        if (rows.length !=0){
            data["LearningLineModul"] = rows;
            res.json(data);
        } else{
            data["LearningLineModul"] = 'Tidak Ada Mata Pelajaran';
            res.json(data);
        }
    })
});

//ambil soal learning line
app.get('/getSoalLearningLine',function (req,res) {
    var data = {

    };
    connection.query("SELECT `id_latihan` AS `idlat`, `soal` AS `soal`, `soal`.`id_soal` AS `soalid`, `soal`.`judul_soal` AS `judul`, `soal`.`gambar_soal` AS `gambar`, `soal`.`jawaban` AS `jaw`, `soal`.`pembahasan`, `soal`.`gambar_pembahasan`, `soal`.`video_pembahasan`, `soal`.`status_pembahasan`, `soal`.`link`, `soal`.`audio` " +
        " FROM `tb_mm_sol_lat` AS `sollat` " +
        " JOIN `tb_banksoal` AS `soal` ON `sollat`.`id_soal` = `soal`.`id_soal` " +
        " WHERE `sollat`.`id_latihan` = '"+req.query.latihanID+"' ORDER BY RAND()", function (err, rows, fields) {
        if (rows.length !=0){
            data["LearningLineSoal"] = rows;
            res.json(data);
        } else{
            data["LearningLineSoal"] = 'Tidak Ada Mata Pelajaran';
            res.json(data);
        }
    })
});



//ambil bab learning line
app.get('/getBabLearningLine',function (req,res) {
    var data = {

    };
    connection.query("SELECT DISTINCT `tp`.`keterangan` AS `mapel`, `bab`.`judulBab`, `bab`.`id` AS `babID`, `statusAksesLearningLine` " +
        " FROM `tb_tingkat-pelajaran` `tp` JOIN `tb_bab` `bab` ON `bab`.`tingkatPelajaranID` = `tp`.`id` " +
        " JOIN `tb_line_topik` `topik` ON `topik`.`babID`=`bab`.`id` JOIN .`tb_line_step` `step` ON `step`.`topikId`=`topik`.`id` " +
        " WHERE `topik`.`status` = 1 AND `bab`.`statusLearningLine` = 1 AND `tingkatID` = '"+req.query.tingkatID+"' " +
        " AND tp.`keterangan` = '"+req.query.keterangan+"'" +
        " ORDER BY `tp`.`keterangan`, `bab`.`judulBab`", function (err, rows, fields) {
        if (rows.length !=0){
            data["BabLearningLine"] = rows;
            res.json(data);
        } else{
            data["BabLearningLine"] = 'Tidak Ada Mata Pelajaran';
            res.json(data);
        }
    })
});

//ambil edu druve by tingkat
app.get('/getEduDriveByTingkat',function (req,res) {

    var data = {

    };
    connection.query("SELECT m.id, m.judul, m.deskripsi, m.url_file, m.publish, m.uuid, m.status, m.date_created, " +
        " m.create_by, m.download, m.tipefile, m.id_tingkatpelajaran, m.statusAksesFile " +
        " FROM `tb_modul` AS `m` JOIN `tb_tingkat-pelajaran` AS `tp` ON `tp`.`id` = `m`.`id_tingkatpelajaran` " +
        " WHERE `m`.`status` = '1' AND `tp`.`tingkatID` = '"+req.query.tingkatID+"'", function (err, rows, fields) {
        if (rows.length !=0){
            data["EduDrive"] = rows;
            res.json(data);
        } else{
            data["EduDrive"] = 'Tidak Ada Mata Pelajaran';
            res.json(data);
        }
    })
});

//edit profil
app.post('/updateProfil',function (req,res){
    var penggunaID = req.body.penggunaID;
    var namaDepan = req.body.namaDepan;
    var namaBelakang = req.body.namaBelakang;
    var alamat = req.body.alamat;
    var noKontak = req.body.noKontak;
    var biografi = req.body.biografi;
    var namaSekolah = req.body.namaSekolah;
    var alamatSekolah = req.body.alamatSekolah;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!namaDepan && !!namaBelakang && !!alamat && !!noKontak && !!biografi && !!namaSekolah && !!alamatSekolah && !!penggunaID){
        console.log("asdasdas")
        var x = connection.query("UPDATE tb_siswa SET namaDepan = ?, namaBelakang = ?, alamat = ?, noKontak = ?, " +
            " biografi = ?, namaSekolah = ?, alamatSekolah = ? WHERE penggunaID = ?",[namaDepan,namaBelakang,alamat,noKontak,biografi,namaSekolah,alamatSekolah,penggunaID],function(err,rows,fields){
            console.log(x);
            if(!!err){
                data["Informasi"] = "kesalahan pengubahan data";
                console.log("kesalahan pengubahan data");
            }else{
                data["error"] = 0;
                data["UpdateProfil"] = "Profil telah berhasil diubah";
                console.log("Profil telah berhasil diubah");
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});

//edit foto profil
app.post('/updatePhotoProfil',function (req,res){
    var penggunaID = req.body.penggunaID;
    var photo = "http://192.168.42.73:3100/image/fotoProfil/"+s;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!photo && !!penggunaID){
        console.log("photooo "+s)
        var x = connection.query("UPDATE tb_siswa SET photo = ? WHERE penggunaID = ?",[photo,penggunaID],function(err,rows,fields){
            console.log(x);
            if(!!err){
                data["Informasi"] = "kesalahan pengubahan data";
                console.log("kesalahan pengubahan data");
            }else{
                data["error"] = 0;
                data["UpdateProfil"] = "Profil telah berhasil diubah";
                console.log("Profil telah berhasil diubah");
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});

//edit email profil
app.post('/updateEMailProfil',function (req,res){
    var id = req.body.id;
    var eMail = req.body.eMail;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!eMail && !!id){
        console.log("photooo "+s)
        var x = connection.query("UPDATE tb_pengguna SET eMail = ? WHERE id = ?",[eMail,id],function(err,rows,fields){
            console.log(x);
            if(!!err){
                data["Informasi"] = "kesalahan pengubahan data";
                console.log("kesalahan pengubahan data");
            }else{
                data["error"] = 0;
                data["UpdateProfil"] = "Profil telah berhasil diubah";
                console.log("Profil telah berhasil diubah");
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});

//edit password profil
app.post('/updatePasswordProfil',function (req,res){
    var id = req.body.id;
    var kataSandi = req.body.kataSandi;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!kataSandi && !!id){
        console.log("photooo "+s)
        var x = connection.query("UPDATE tb_pengguna SET kataSandi = ? WHERE id = ?",[kataSandi,id],function(err,rows,fields){
            console.log(x);
            if(!!err){
                data["Informasi"] = "kesalahan pengubahan data";
                console.log("kesalahan pengubahan data");
            }else{
                data["error"] = 0;
                data["UpdateProfil"] = "Profil telah berhasil diubah";
                console.log("Profil telah berhasil diubah");
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});

//ambil new photo
app.get('/getPhoto',function (req,res) {
    var data = {
    };
    connection.query("SELECT penggunaID, photo FROM `tb_siswa` where penggunaID = "+req.query.penggunaID, function (err, rows, fields) {
        if (rows.length !=0){
            data["UpdatePhotoProfil"] = rows;
            res.json(data);
        } else{
            data["UpdatePhotoProfil"] = 'Tidak Ada Siswa';
            res.json(data);
        }
    })
});

//ambil comment
app.get('/getComments',function (req,res) {
    var data = {
    };
    connection.query("SELECT `namaPengguna`, `komen`.`date_created`, `isiKomen`, `avatar`, `komen`.`id` AS `komenID`, `avatar`, `hakAkses`, `siswa`.`photo` AS `siswa_photo`, `guru`.`photo` AS `guru_photo` FROM `tb_komen` `komen` " +
        " JOIN `tb_video` `video` ON `komen`.`videoID`=`video`.`id` " +
        " JOIN `tb_pengguna` `pengguna` ON `pengguna`.`id`=`komen`.`userID` " +
        " LEFT JOIN `tb_guru` `guru` ON `guru`.`penggunaID`=`pengguna`.`id` " +
        " LEFT JOIN `tb_siswa` `siswa` ON `siswa`.`penggunaID`=`pengguna`.`id` " +
        " WHERE `video`.`id` = "+req.query.id+" AND `komen`.`status` = 1 ORDER BY `komen`.`date_created` DESC", function (err, rows, fields) {
        if (rows.length !=0){
            data["Comment"] = rows;
            res.json(data);
        } else{
            data["Comment"] = 'Tidak Ada Siswa';
            res.json(data);
        }
    })
});

//insert log
app.post('/insertLog',function (req,res){
    var id = null;
    var penggunaID = req.body.penggunaID;
    var stepID = req.body.stepID;
    var statusStep = req.body.statusStep;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!penggunaID && !!stepID){
        console.log("asdasdas")
        var x = connection.query("INSERT INTO tb_line_log VALUES(?,?,?,?)",[id,penggunaID,stepID,statusStep],function(err,rows,fields){
            console.log(x);
            if(!!err){
                data["Informasi"] = "kesalahan penambahan data";
                console.log("kesalahan penambahan data");
            }else{
                data["error"] = 0;
                data["InsertKOmen"] = "Komen telah ditambahkan";
                console.log("Komen telah ditambahkan");
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});


//insert komentar
app.post('/insertKomen',function (req,res){
    var id = null;
    var isiKomen = req.body.isiKomen;
    var date_created = req.body.date_created;
    var videoID = req.body.videoID;
    var userID = req.body.userID;
    var status = req.body.status;
    var UUID = uuid;
    var read_status = req.body.read_status;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!isiKomen && !!date_created && !!videoID && !!userID && !!status && !!read_status ){
        console.log("asdasdas")
        var x = connection.query("INSERT INTO tb_komen VALUES(?,?,?,?,?,?,?,?)",[id,isiKomen,date_created,videoID,userID,status,UUID,read_status],function(err,rows,fields){
            console.log(x);
            if(!!err){
                data["Informasi"] = "kesalahan penambahan data";
                console.log("kesalahan penambahan data");
            }else{
                data["error"] = 0;
                data["InsertKOmen"] = "Komen telah ditambahkan";
                console.log("Komen telah ditambahkan");
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});

// jadi tinggal panggil fungsi unique_id pas mau insert komenya
//uuid
function unique_id() {
    return '_' + Math.random().toString(36).substr(2, 9);
};



http.listen(3100, '0.0.0.0',function(){
    console.log("Connected & Listen to port 3100");
    console.log(connection);
    app.use('/image', express.static(path.join(__dirname, 'image')));
});