export function convertImageToBase64(image: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Image = reader.result as string;
      resolve(base64Image);
    };
    reader.onerror = (error) => {
      reject("Error reading file:" + error);
    };
    reader.readAsDataURL(image);
  });
}