import {Directive, ElementRef, inject, OnInit} from '@angular/core';

@Directive({
  standalone: true,
  selector: 'img[staticGif]'
})
export class StaticGif implements OnInit{

  private el = inject(ElementRef<HTMLImageElement>);

  ngOnInit() {
    const img = new Image();
    img.src = this.el.nativeElement.src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d')?.drawImage(img, 0, 0);
      this.el.nativeElement.src = canvas.toDataURL('image/png');
    };
  }

}
/*import {Directive, ElementRef, inject, OnInit} from '@angular/core';

@Directive({
  selector: 'img[staticGif]'
})
export class StaticGif implements OnInit {

  private el = inject(ElementRef<HTMLImageElement>);

  ngOnInit() {
    const img = new Image();
    img.src = this.el.nativeElement.src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 200 && data[i+1] > 200 && data[i+2] > 200) {
          data[i+3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);

      this.el.nativeElement.src = canvas.toDataURL('image/png');
    };
  }
}*/
