import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";

export const MAX_PROFILE_PHOTO_SIZE = 5 * 1024 * 1024;

export function validateProfilePhoto(file: File) {
  if (!file.type.startsWith("image/")) {
    return "Choose a JPG, PNG, WebP, or another image file.";
  }
  if (file.size > MAX_PROFILE_PHOTO_SIZE) {
    return "Profile photos must be smaller than 5 MB.";
  }
  return "";
}

export async function uploadProfilePhoto(userId: string, file: File) {
  const uploadedImage = await uploadBytes(
    ref(storage, `profile-images/${userId}`),
    file,
    { contentType: file.type },
  );

  return getDownloadURL(uploadedImage.ref);
}
