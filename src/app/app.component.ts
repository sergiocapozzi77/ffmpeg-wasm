import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private sanitizer: DomSanitizer) {}

  title = 'ffmpeg-wasm';

  ffmpeg = createFFmpeg({
    log: true,
    corePath: '/assets/ffmpeg-core/ffmpeg-core.js',
  });

  videoSrc: any;

  async doTranscode() {
    console.log('Loading ffmpeg-core.js');
    await this.ffmpeg.load();
    console.log('Start transcoding');
    this.ffmpeg.FS(
      'writeFile',
      'test.avi',
      await fetchFile('/assets/flame.avi')
    );
    await this.ffmpeg.run('-i', 'test.avi', 'test.mp4');
    console.log('Complete transcoding');
    const data = this.ffmpeg.FS('readFile', 'test.mp4');
    this.videoSrc = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))
    );

    console.log('videoSrc', this.videoSrc);
  }
}
