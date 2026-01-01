import Dropzone from "react-dropzone";

const [drivingLicenseImg, setDrivingLicenseImg] = useState(0);
const [drivingLicenseImgPath, setDrivingLicenseImgPath] = useState("");
const [drivingLicenseImgUploaded, setDrivingLicenseImgUploaded] = useState("");

const acceptableFileTypes = {
  "image/*": [],
};

const uploadDrivingLicenseImg = async (acceptedFiles) => {
  setDrivingLicenseImgUploaded(false);
  setDrivingLicenseImg(0);
  var d = new Date();
  var dFormat = `${d.getHours()}${d.getMinutes()}${d.getSeconds()}`;

  // Get file
  var file = acceptedFiles[0];
  // Create storage reference
  if (file) {
    var storageRef = ref(storage, `adult-docs/${dFormat}-${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setDrivingLicenseImg(progress);
      },
      (error) => {
        console.error(error);
      },
      () => {
        setDrivingLicenseImgUploaded(true);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setDrivingLicenseImgPath(downloadURL);
        });
      }
    );
  }
};

const progressStyleDrivingLicenseImg = {
  width: drivingLicenseImg + "%",
};

//  Include it in onsubmit: drivingLicense: drivingLicenseImgPath,

<div className="col-span-12 relative">
  <div className="grid gap-4 grid-cols-12">
    <div className="col-span-4">
      <label htmlFor="drivingLicense">Driving License/ID *</label>
    </div>
    <div className="col-span-8">
      <Dropzone
        onDrop={(acceptedFiles) => {
          uploadDrivingLicenseImg(acceptedFiles);
        }}
        accept={acceptableFileTypes}
        multiple={true}
        maxSize={20971520}
        onDragEnter={() => {
          setDragging(true);
          setDropError(false);
        }}
        onDragLeave={() => {
          setDragging(false);
        }}
        onDropRejected={(fileRejections) => {
          if (fileRejections.length > 1) {
            setDropError(fileRejections[0].errors[0].code);
          } else {
            setDropError(fileRejections[0].errors[0].code);
          }
          console.error(fileRejections[0]);
        }}
        onDropAccepted={() => {
          setDropError(false);
        }}
        onError={(error) => {
          console.error(error);
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <section
              className={`flex h-48 cursor-pointer bg-white items-center justify-center px-6 pt-8 pb-10 border-2 border-slate-300 border-dashed rounded-md ${
                dragging ? "border-green-400" : ""
              } ${dropError ? "border-red-300" : ""}`}
            >
              <div className="text-center">
                {/* <DocumentTextIcon className="mx-auto h-8 w-8 m-3 text-slate-400" /> */}
                <div className="text-sm text-slate-600 w-full font-medium">
                  <span className="relative cursor-pointer rounded-md  text-blue-600 hover:text-blue-700">
                    <span>Upload a file</span>
                  </span>
                  <span className="pl-1">or drag and drop</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 font-medium">
                  PNG, JPG up to 20MB
                </p>
              </div>
            </section>
          </div>
        )}
      </Dropzone>
    </div>
    <div className="col-span-4"> </div>
    <div className=" col-span-8">
      {drivingLicenseImg > 1 && (
        <span className="w-full block bg-slate-200 border-4 rounded-full shadow-inner border-slate-200 mt-4">
          <span
            className="h-2 bg-green-400 block rounded-full"
            style={progressStyleDrivingLicenseImg}
          ></span>
        </span>
      )}
      {drivingLicenseImgUploaded && (
        <div className="mt-2 text-sm">
          <p>File uploaded successfully.</p>
        </div>
      )}
      {dropError && (
        <div className="mt-2 text-sm">
          <p>{dropError}</p>
        </div>
      )}
    </div>
  </div>
</div>;
