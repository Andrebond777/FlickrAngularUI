import { Component, Input, Output } from '@angular/core';
import { Photo } from '../../models/Photo';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss'
})
export class ImageComponent {
  @Input()
  isShow = false;
  @Output()
  isImgFullScreen = false
  @Input()
  photo = new Photo();

  resizeImage(resize : boolean){
    if(resize)
      return 'width : auto; height: 100vh; max-width: 100vw;  z-index: 7;';
    else
      return ' z-index: 6;';
  }

  resizePinchZoom(resize : boolean){
    if(resize)
      return 'width : 100vw; height: 100vh; max-width: 100vw; position: fixed;   bottom: 0; right: 0; z-index: 7; margin: auto; padding:auto; border-width:0px; background-color: black;';
    else
      return 'z-index:6;  position: relative;';
  }

  getExpandOrCompressIconClass(){
    if(this.isImgFullScreen)
      return 'fa fa-compress';
    else
      return 'fa fa-expand';
  }

}
