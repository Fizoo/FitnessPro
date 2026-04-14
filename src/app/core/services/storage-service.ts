import { inject, Injectable } from '@angular/core';
import { Storage, ref, getDownloadURL, uploadBytes } from '@angular/fire/storage';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private storage = inject(Storage);

  getGifUrl(exerciseId: string): Observable<string> {
    const r = ref(this.storage, `gif/${exerciseId}.gif`);
    return from(getDownloadURL(r));
  }

  getBodyPartImageUrl(bodyPart: string): Observable<string> {
    const r = ref(this.storage, `img/${bodyPart}.png`);
    return from(getDownloadURL(r));
  }

  getOtherUrl(filename: string): Observable<string> {
    const r = ref(this.storage, `other/${filename}`);
    return from(getDownloadURL(r));
  }

  async uploadFile(path: string, file: File): Promise<string> {
    const r = ref(this.storage, path);
    await uploadBytes(r, file);
    return getDownloadURL(r);
  }
}
