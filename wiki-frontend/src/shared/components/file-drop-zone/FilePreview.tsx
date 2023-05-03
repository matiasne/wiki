import React from "react";
import styles from "./FilePreview.module.css";

interface FilePreviewProps {
  fileData: any;
}

const FilePreview = ({ fileData }: FilePreviewProps) => {
  return (
    <div className={styles.fileList}>
      <div className={styles.fileContainer}>
        {/* loop over the fileData */}
        {fileData &&
          fileData.fileList.map((f: any) => {
            return (
              <ol key={f.lastModified}>
                <li className={styles.fileList}>
                  {/* display the filename and type */}
                  <div key={f.name} className={styles.fileName}>
                    {f.name}
                  </div>
                </li>
              </ol>
            );
          })}
      </div>
    </div>
  );
};

export default FilePreview;
