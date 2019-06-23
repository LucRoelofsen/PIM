/*
RijksCrowd Firebase Admin JavaScript
Andrew Tan, Luc Roelofsen, Bob Pietersen
*/

// Initialize Firebase storage
var storage = firebase.storage();
var storageRef = storage.ref();


/*
* --------------------------------------------------
* Handles uploading files functionality
* --------------------------------------------------
*/

// Handles drag and drop functionality
var obj = $("#drop-zone");
obj.on('dragenter', function(e) {
  e.stopPropagation();
  e.preventDefault();
  $(this).css('border', '2px solid #0B85A1');
});
obj.on('dragover', function(e) {
  e.stopPropagation();
  e.preventDefault();
});
obj.on('drop', function(e) {
  $(this).css('border', '2px dotted #0B85A1');
  e.preventDefault();
  var files = e.originalEvent.dataTransfer.files;

  // Hier nog een functie met een 'weet je het zeker?
  // Dan handleFileUpload in die functie in de ja condition

  // Send dropped files to Firebase
  handleFileUpload(files, obj);
});

// Prevent default handling when files are dropped outside the upload box
$(document).on('dragenter', function(e) {
  e.stopPropagation();
  e.preventDefault();
});
$(document).on('dragover', function(e) {
  e.stopPropagation();
  e.preventDefault();
  obj.css('border', '2px dotted #0B85A1');
});
$(document).on('drop', function(e) {
  e.stopPropagation();
  e.preventDefault();
});

// Automatically submit the form on file select
$('#drop-zone-file').on('change', function() {
  var files = $('#drop-zone-file')[0].files;
  handleFileUpload(files, obj);
});

function handleFileUpload(files, obj) {

  // Generate random string, used to create folder name
  window.name = generateRandomString(20);

  for (var i = 0; i < files.length; i++) {
    var fd = new FormData();
    fd.append('file', files[i]);

    fireBaseFileUpload({
      'file': files[i],
      'path': 'upload_' + name
    }, function(data) {
      // console.log(files.length);
      if (!data.error) {
        if (data.progress) {
          $("#drop-caption").empty().append(files.length + " file(s) uploaded!")
          $("#drop-zone").css('background-color', '#c8dfcd');
          $("#uploader").css('background-color', '#d55140');
          // progress update to view here
        }
        if (data.downloadURL) {
          // $("#drop-caption").empty().append("Files successfully uploaded!")
          // update done
          // download URL here "data.downloadURL"
        }
      } else {
        console.log(data.error + ' Firebase file upload error');
      }
    });
  }

};

function fireBaseFileUpload(parameters, callBackData) {

  // expected parameters to start storage upload
  var file = parameters.file;
  var path = parameters.path;

  // Debugging
  var uploadPath = ('upload_' + name + '/' + file.name);

  //just some error check
  if (!file) {
    callBackData({
      error: 'File required to interact with Firebase storage'
    });
  }
  if (!path) {
    callBackData({
      error: 'Node name required to interact with Firebase storage'
    });
  }

  var metaData = {
    'contentType': file.type
  };
  var uploader = document.getElementById('uploader');
  var arr = file.name.split('.');
  var fileSize = formatBytes(file.size); // get clean file size (function below)
  var fileType = file.type;
  var n = file.name;

  var fullPath = path + '/' + file.name;
  var storageRef = firebase.storage().ref(fullPath);
  var uploadFile = storageRef.put(file, metaData);

  var storageDefault = firebase.storage();
  var storageRefDefault = storageDefault.ref();

  // first instance identifier
  callBackData({
    id: name,
    fileSize: fileSize,
    fileType: fileType,
    fileName: n
  });

  uploadFile.on('state_changed', function(snapshot) {
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    progress = Math.floor(progress);
    uploader.value = progress;
    callBackData({
      progress: progress,
      element: name,
      fileSize: fileSize,
      fileType: fileType,
      fileName: n
    });
  }, function(error) {
    callBackData({
      error: error
    });
  }, function() {
    storageRefDefault.child(uploadPath).getDownloadURL().then(function(url) {
      createProject(url);
    });
    var downloadURL = uploadFile.snapshot.downloadURL;
    callBackData({
      downloadURL: downloadURL,
      element: name,
      fileSize: fileSize,
      fileType: fileType,
      fileName: n
    });

  });

}

// Used to generate the name of the folder in which documents are stored
function generateRandomString(length) {
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var pass = "";
  for (var x = 0; x < length; x++) {
    var i = Math.floor(Math.random() * chars.length);
    pass += chars.charAt(i);
  }
  return pass;
}

function formatBytes(bytes, decimals) {
  if (bytes === 0) return '0 Byte';
  var k = 1000;
  var dm = decimals + 1 || 3;
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Create a new project on upload
function createProject(previewURL) {

  // Listen for form submit
  if (currentFile == 'new_project.html') {

    db.collection("projects").doc("2").collection("documents").doc("1").set({
      image: previewURL
    });
    
  };

};
