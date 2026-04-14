import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { NotificationService } from '../../../core/services/notification-service';
import { IUser } from '../../auth/models/user';
import { Router } from '@angular/router';
import { AuthStore } from '../../../core/store/auth.store';
import { UserStore } from '../../../core/store/user.store';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-page-component.html',
  styleUrl: './profile-page-component.scss',
})
export class ProfilePageComponent {
  protected userStore = inject(UserStore);
  private authStore = inject(AuthStore);
  private notify = inject(NotificationService);
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isSaving = signal(false);
  isUploadingPhoto = signal(false);
  previewUrl = signal<string | null>(null);

  readonly fitnessGoals = [
    { value: 'lose_weight', label: 'Схуднення' },
    { value: 'gain_muscle', label: 'Набір маси' },
    { value: 'maintain', label: 'Підтримка форми' },
    { value: 'endurance', label: 'Витривалість' },
    { value: 'flexibility', label: 'Гнучкість' },
  ];

  readonly genders = [
    { value: 'male', label: 'Чоловік' },
    { value: 'female', label: 'Жінка' },
    { value: 'other', label: 'Інше' },
  ];

  form = this.fb.group({
    displayName: [this.userStore.displayName(), [Validators.required, Validators.minLength(2)]],
    age: [this.userStore.age()],
    gender: [this.userStore.gender()],
    height: [this.userStore.height()],
    weight: [this.userStore.weight()],
    fitnessGoal: [this.userStore.fitnessGoal()],
    weightUnit: [this.userStore.weightUnit()],
    language: [this.userStore.language()],
    notifications: [this.userStore.settings()?.notifications ?? true],
    theme: [this.userStore.theme()],
  });

  readonly avatarUrl = computed(() =>
    this.previewUrl() ?? this.userStore.photoURL() ?? null
  );

  readonly initials = computed(() => {
    const name = this.userStore.displayName();
    return name ? name.charAt(0).toUpperCase() : '?';
  });

  async onPhotoSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const uid = this.userStore.uid();
    if (!uid) return;

    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);

    this.isUploadingPhoto.set(true);
    try {
      const storageRef = ref(this.storage, `avatars/${uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await updateDoc(doc(this.firestore, 'users', uid), { photoURL: url });
      this.authStore.updateUser({ photoURL: url }); // ← через store
      this.notify.success('Фото оновлено! 📸');
    } catch {
      this.notify.error('Помилка завантаження фото');
    } finally {
      this.isUploadingPhoto.set(false);
    }
  }

  async onSave(): Promise<void> {
    if (this.form.invalid) return;
    const uid = this.userStore.uid();
    if (!uid) return;

    this.isSaving.set(true);
    try {
      const v = this.form.value;
      const updated: Partial<IUser> = {
        displayName: v.displayName ?? '',
        age: v.age ?? null,
        gender: v.gender ?? null,
        height: v.height ?? null,
        weight: v.weight ?? null,
        fitnessGoal: v.fitnessGoal ?? null,
        settings: {
          weightUnit: (v.weightUnit as 'kg' | 'lbs') ?? 'kg',
          language: v.language ?? 'uk',
          notifications: v.notifications ?? true,
          theme: (v.theme as 'dark' | 'light') ?? 'dark',
        },
      };

      await updateDoc(doc(this.firestore, 'users', uid), { ...updated });
      this.authStore.updateUser(updated); // ← через store
      this.notify.success('Профіль збережено! ✅');
    } catch {
      this.notify.error('Помилка збереження');
    } finally {
      this.isSaving.set(false);
      this.router.navigate(['dashboard']);
    }
  }
}
