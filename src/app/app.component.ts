import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject } from 'rxjs';
import * as htmlToImage from 'html-to-image';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  url: string = '';

  FileLogoQrCode: string = 'assets/logo.png';
  QrCodeSize = {
    disabled: false,
    max: 1500,
    min: 100,
    showTicks: false,
    step: 1,
    thumbLabel: false,
    value: 250,
  };
  QrCodeSizeImageLogo = {
    disabled: false,
    max: 1000,
    min: 25,
    showTicks: false,
    step: 1,
    thumbLabel: false,
    value: 50,
  };

  constructor(private toastr: ToastrService) {}
  ngOnInit() {}
  imageError: any;
  isImageSaved: boolean = false;
  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 20971520;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.target.files[0].size > max_size) {
        this.imageError = 'Maximum size allowed is ' + max_size / 1000 + 'Mb';

        return false;
      }

      // if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
      //   this.imageError = 'Only Images are allowed ( JPG | PNG )';
      //   return false;
      // }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = (rs) => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          console.log(img_height, img_width);

          if (img_height > max_height && img_width > max_width) {
            this.imageError =
              'Maximum dimentions allowed ' +
              max_height +
              '*' +
              max_width +
              'px';
            return false;
          } else {
            const imgBase64Path = e.target.result;
            this.FileLogoQrCode = imgBase64Path;
            this.isImageSaved = true;
            // this.previewImagePath = imgBase64Path;
          }
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }
  removeImage() {
    this.FileLogoQrCode = null;
    this.isImageSaved = false;
  }

  saveAsImage() {
    const RAM_QRCODE_SIZE = this.QrCodeSize.value;
    this.QrCodeSize.value = 2500;
    const date = new Date();
    // this.check_load_bt_save_image = true;
    setInterval(() => {
      htmlToImage
        .toPng(document.getElementById('qrcode')!)
        .then((dataUrl) => {
          // this.check_load_bt_save_image = false;
          console.log(dataUrl);
          var img = new Image();
          img.src = dataUrl;
          // document.body.appendChild(img);
          FileSaver.saveAs(dataUrl, 'heatmap-charts' + date);
          this.QrCodeSize.value = RAM_QRCODE_SIZE;
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });
    }, 1000);
  }
}
