import { SkeletonImg } from 'Components/Skeletion';
import React, { useEffect, useState } from 'react';

const DropboxThumbnail = ({ dropboxToken, filePath, dropboxAccessToken }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [componentUrl, setcomponentUrl] = useState('');

  useEffect(() => {
    if(!componentUrl)setcomponentUrl("loaded")
  }, [filePath]);

  useEffect(() => {
    const getThumbnail = async () => {
      try {
        const url = 'https://content.dropboxapi.com/2/files/get_thumbnail_v2';

        const dropboxHeaders = new Headers();
        dropboxHeaders.append('Content-Type', 'application/octet-stream');
         dropboxHeaders.append('Authorization', 'Bearer ' + dropboxAccessToken);
        dropboxHeaders.append('Dropbox-API-Arg', JSON.stringify({
          "format": "jpeg",
          "size": "w64h64",
          "mode": "strict",
            "resource": {
                ".tag": "path",
                "path": `${filePath}`
            }
        }));
        const response = await fetch(url, {
          method: 'POST',
          headers: dropboxHeaders
        });

        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result.split(',')[1];
          const dataUrl = 'data:image/jpeg;base64,' + base64data;
          setThumbnailUrl(dataUrl);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error fetching thumbnail:', error);
      }
    };
    if(componentUrl) getThumbnail();
  }, [componentUrl]);

  return !thumbnailUrl ? <SkeletonImg style={{width:60,height:60,borderRadius:3}} /> : <img className='r-1 overflow-hidden' src={thumbnailUrl} alt="Thumbnail" style={{maxWidth:60, maxHeight:60}} />;
};

export default DropboxThumbnail;
