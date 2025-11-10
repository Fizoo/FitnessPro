import {Component, inject, signal} from '@angular/core';
import {ExerciseService} from '../exercise-service';
import {firstValueFrom} from 'rxjs';
import {MatButton} from '@angular/material/button';


@Component({
  selector: 'app-data-dowload',
  imports: [
    MatButton
  ],
  templateUrl: './data-dowload.html',
  styleUrl: './data-dowload.scss'
})
export class DataDowload {

  private exerciseService = inject(ExerciseService);

  bodyPart = signal('back');
  imgUrl = signal('');
  isLoading = signal(false);
  progress = signal('');
  allData = signal<any[]>([]);

  JSON = JSON; // Для template

  async loadAll() {
    this.isLoading.set(true);
    this.allData.set([]);

    const result: any[] = [];
    let offset = 0;



      const batch = await firstValueFrom(
        this.exerciseService.getExercisesByBodyPart(this.bodyPart(), 10, offset)
      );
      console.log(batch)

    /*  while (true) {
        this.progress.set(`Завантаження... offset ${offset}`);

        const batch = await firstValueFrom(
          this.exerciseService.getExercisesByBodyPart(this.bodyPart(), 10, offset)
        );

        console.log(`Loaded ${batch.length} exercises at offset ${offset}`);

        if (batch.length === 0) {
          console.log('No more data');
          break;
        }

        result.push(...batch);

        // Якщо повернулось менше 10 - це остання порція
        if (batch.length < 10) {
          console.log('Last batch');
          break;
        }

        offset += 10;

        // Затримка між запитами (щоб не перевантажити API)
        await this.delay(500);
      }

      this.allData.set(result);
      this.progress.set(`✅ Готово! ${result.length} exercises`);
      console.log('All data:', result);

    } catch (error) {
      console.error('Error:', error);
      this.progress.set('❌ Помилка');
    } finally {
      this.isLoading.set(false);
    }*/
  }

  copy() {
    const json = JSON.stringify(this.allData(), null, 2);
    navigator.clipboard.writeText(json).then(() => {
      alert('✅ Copied to clipboard!');
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  dowload() {
/*     this.imgUrl.set( this.exerciseService.getExerciseImageUrl('0007'))
    console.log(this.imgUrl())*/
    //console.log(this.back[0])
  }



}
