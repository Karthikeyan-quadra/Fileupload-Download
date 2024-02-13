// import * as React from 'react';
// import { Upload, downloadFile, getAllFilesInFolder } from '../../../helpers/Services';
// import { IFileProps } from './IFileProps';
// import 'antd/dist/reset.css';
// export default function File(props: IFileProps) {
//   const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
//   const [filePath, setFilePath] = React.useState<string | null>(null);
//   const [files, setFiles] = React.useState<any[]>([]);

//   React.useEffect(() => {
//     // Load files on component mount
//     loadFiles();
//   }, []);

//   const loadFiles = async () => {
//     const files = await getAllFilesInFolder();
//     setFiles(files);
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const fileInput = event.target;
//     if (fileInput.files && fileInput.files.length > 0) {
//       const file = fileInput.files[0];
//       const path = fileInput.value;

//       setSelectedFile(file);
//       setFilePath(path);
//     }
//   };

//   const handleUpload = () => {
//     if (selectedFile && filePath !== null) {
//       Upload(selectedFile, filePath)
//         .then(() => loadFiles()); // Reload files after upload
//     } else {
//       console.error('No file selected');
//     }
//   };

//   const handleDownload = (fileId: string, fileName: string) => {
//     // Placeholder function for downloading the file by its ID
//     downloadFile(fileId, fileName);
//   };

//   return (
//     <>
//       <div>
//         <input type="file" id="thefileinput" onChange={handleFileChange} />
//         <button onClick={handleUpload}>Upload</button>
//       </div>
//       <div>
//         {files.map((file) => (
//           <div key={file.UniqueId}>
//             <span>{file.Name}</span>
//             <button onClick={() => handleDownload(file.UniqueId, file.Name)}>Download</button>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }

import * as React from 'react';
import { useState, useEffect } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Upload, Button, message } from 'antd';
import { UploadFile, downloadFile, getAllFilesInFolder} from '../../../helpers/Services';
import 'antd/dist/reset.css';
import { IFileProps } from './IFileProps';

export default function File(props: IFileProps) {
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    // Load files on component mount
    loadFiles();
  }, []);

  const loadFiles = async () => {
    const files = await getAllFilesInFolder();
    setFiles(files);
  };

  const handleFileChange = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      loadFiles(); // Reload files after upload
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const customRequest = async (options: any) => {
    try {
      const { file, onSuccess} = options;
      if (file) {
        const filePath = file.name; // Adjust this as needed
        await UploadFile(file, filePath);
        onSuccess('ok', options.file);
      }
    } catch (error) {
      console.error('Error during file upload:', error);
      message.error('Error uploading file');
      error(error);
    }
  };

  const handleDownload = (fileId: string, fileName: string) => {
    // Placeholder function for downloading the file by its ID
    downloadFile(fileId, fileName);
  };

  return (
    <div style={{margin:"auto", width:"44%"}}>
      <div>
      <p style={{fontSize:"20px"}}><b>Choose the File to upload  </b></p>
        <Upload
          customRequest={customRequest}
          showUploadList={false}
          onChange={handleFileChange}
        >
          <Button icon={<UploadOutlined rev={undefined}/>}>Upload</Button>
        </Upload>
      </div>
      <div>
      <p style={{marginTop:"20px", fontSize:"20px"}}><b>Available Files for download</b></p>
          <table style={{border:"1px solid black", borderCollapse:"collapse", marginTop:"10px"}}>
          {files.map((file) => (
            <tr key={file.UniqueId} >
            <td style={{border:"1px solid black"}}>{file.Name}</td>
            <td style={{border:"1px solid black"}}><Button onClick={() => handleDownload(file.UniqueId, file.Name)}>Download</Button></td>
            </tr>
        ))}
          </table>

      </div>
    </div>
  );
}
