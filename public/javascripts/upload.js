$(function() {
  $('#downloadBtn').hide();

  Dropzone.autoDiscover = false;
  $("#dropzone").dropzone({
      url: "/upload",
      addRemoveLinks: true,
      success: function (file, response) {
          var imgName = response;
          file.previewElement.classList.add("dz-success");
          console.log("Successfully uploaded :" + imgName);
          $('#downloadBtn').show();
      },
      error: function (file, response) {
          file.previewElement.classList.add("dz-error");
      }
  });

});

$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('#downloadBtn').hide();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#downloadBtn').on('click', function (){
  var fileName = '1.sqr';
  window.open(
    '/v1/ab7820028322/uploads/'+fileName,
    '_blank'
  );
});


$('#upload-input').on('change', function(){

  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('upload successful!\n' + data);
          $('#downloadBtn').show();
      },
      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }

          }

        }, false);

        return xhr;
      }
    });

  }
});
