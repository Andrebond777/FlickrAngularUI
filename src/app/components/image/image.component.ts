import { Component, Input } from '@angular/core';
import { Photo } from '../../models/Photo';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss'
})
export class ImageComponent {
  @Input()
  isShow = false;
  @Input()
  isImgFullScreen
  @Input()
  photo = new Photo();

  resizeImage(){
    if(this.isImgFullScreen)
      return 'width : auto; height: 100vh;';
    else
      return 'max-height: 70vh;';
  }

  resizePinchZoom(){
    if(this.isImgFullScreen)
      return 'width : 100vw; height: 100vh; position: fixed;   bottom: 0; right: 0; z-index: 7; margin: auto; padding:auto; border-width:0px; background-color: black;';
    else
      return 'max-height: 70vh;';
  }

  getExpandOrCompressIconClass(){
    if(this.isImgFullScreen)
      return 'fa fa-compress';
    else
      return 'fa fa-expand';
  }

}
