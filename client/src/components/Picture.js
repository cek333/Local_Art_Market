import React, { useRef } from 'react';

function Picture(props) {
  const { picUrl: propsPicUrl, onChange: propsOnChange } = props;
  const inputFile = useRef();

  function getAndResizeImg() {
    const fileReader = new FileReader();

    // Setup fileReader file load event
    fileReader.addEventListener('load', function (event) {
      // On fileReader load, data from file/image can be accessed via event.target.result

      const image = new Image();
      // Setup img load event
      image.addEventListener('load', function () {
        // RESIZE IMG
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");

        let MAX_WIDTH = 200;
        let MAX_HEIGHT = 200;
        let calcWidth = image.width;
        let calcHeight = image.height;

        if (calcWidth > calcHeight) {
          if (calcWidth > MAX_WIDTH) {
            calcHeight *= MAX_WIDTH / calcWidth;
            calcWidth = MAX_WIDTH;
          }
        } else {
          if (calcHeight > MAX_HEIGHT) {
            calcWidth *= MAX_HEIGHT / calcHeight;
            calcHeight = MAX_HEIGHT;
          }
        }
        canvas.width = calcWidth;
        canvas.height = calcHeight;
        context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data url
        propsOnChange(canvas.toDataURL());
      });
      image.src = event.target.result;
    });

    // check and retuns the length of uploded file.
    if (inputFile.current.files.length === 0) {
      return;
    }

    // Is Used for validate a valid file.
    const uploadFile = inputFile.current.files[0];
    if (! uploadFile.type.match(/image.*/)) {
      alert("Please select a valid image.");
      return;
    }

    fileReader.readAsDataURL(uploadFile);
  }

  return (
    <div>
      <img src={propsPicUrl} alt="Upload a Profile Pic" />
      <input id="upload" name="upload" type="file" ref={inputFile} onChange={getAndResizeImg} />
    </div>
  );
}

export default Picture;