export const useDownload = () => {
  const downloadFile = (filePath, fileName) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { downloadFile };
};
