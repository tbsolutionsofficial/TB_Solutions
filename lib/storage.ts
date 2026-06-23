import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadProjectImage(
  projectId: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const storageRef = ref(storage, `projects/${projectId}/${Date.now()}_${file.name}`);
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file);
    task.on(
      "state_changed",
      (snap) => onProgress && onProgress((snap.bytesTransferred / snap.totalBytes) * 100),
      reject,
      async () => resolve(await getDownloadURL(task.snapshot.ref))
    );
  });
}

export async function deleteImageByUrl(url: string) {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // ignore missing file errors
  }
}
