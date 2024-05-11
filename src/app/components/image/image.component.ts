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
      return 'height:fit-content;  z-index: 6; width: fit-content; max-width: 65vw; max-height: 70vh; ';
  }

  resizePinchZoom(resize : boolean){
    if(resize)
      return 'width : 100vw; height: 100vh; max-width: 100vw; position: fixed;   bottom: 0; right: 0; z-index: 7; margin: auto; padding:auto; border-width:0px; background-color: black;';
    else
      return 'height:70vh; max-height: 70vh; z-index:6;  position: relative; width: fit-content;  max-width: 65vw;';
  }

  getExpandOrCompressIconClass(){
    if(this.isImgFullScreen)
      return 'fa fa-compress';
    else
      return 'fa fa-expand';
  }

}
