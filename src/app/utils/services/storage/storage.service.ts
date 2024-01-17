import { Injectable } from '@angular/core';
import { firebaseConfig } from 'firebase.config';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from 'firebase/storage';

const storage = getStorage();

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  async uploadFile(file: File, fileName: string, filePath: string[]) {
    try {
      const path = `${filePath.join('/')}/${fileName}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
    } catch (error) {
      console.log(error);
    }
  }

  async getUrl(filePath: string[]) {
    try {
      const path = `${filePath.join('/')}`;
      const storageRef = ref(storage, path);
      const avatarUrl = await getDownloadURL(storageRef);

      if (avatarUrl) {
        return avatarUrl;
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async getUrls(filePath: string[]) {
    try {
      const path = `${filePath.join('/')}`;
      const storageRef = ref(storage, path);
      const storageItems = await listAll(storageRef);
      const avatarsUrlsPromises = storageItems.items.map((item) =>
        this.getUrl([firebaseConfig.storage.profileAvatars, item.name])
      );

      const avatarsUrls = await Promise.all(avatarsUrlsPromises);
      return avatarsUrls;
    } catch (error) {
      console.log(error);
    }
    return [];
  }

  async deleteFile(filePath: string) {
    try {
      const path = `${firebaseConfig.storage.profileAvatars}/${filePath}`;
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.log(error);
    }
  }
}
