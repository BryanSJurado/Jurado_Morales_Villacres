import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiProductoService } from '../services/api-producto.service';
import {Response} from '../models/response';
import { Producto } from '../models/producto';
import { Subject } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {

  public lst: any[] = [];
  public lst2: any[] = [];
  public columnas: string[] = ['id','nombre', 'precio', 'imagen', 'marca', 'stock'];
  readonly width:string = '300px';
  public nuevaImgPro=new Blob();
  dtOptions: DataTables.Settings | any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private apiProducto: ApiProductoService,
    public dialog:MatDialog,
    public snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) {
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
}

transform(value: any, args?: any): any {
  return this.sanitizer.bypassSecurityTrustHtml(value);
}

  ngOnInit(): void {
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      info: true,
      order: [],
      language: {
        "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      responsive: true,
      retrieve: true,
      "columnDefs": [
        {
          "targets": [6],
          "orderable": false
        }
      ]
    };
      this.apiProducto.getProducto().subscribe((res) => {
        let dtInstance = $('#pagoTable').DataTable();
        dtInstance.destroy();
        this.lst = res.data;
        this.dtTrigger.next(this.lst);
        console.log(this.lst)
      } );
      
     this.getProducto();
};




  async getProducto(){
    this.apiProducto.getProducto().subscribe(response => {
      this.copiaProductos(response);
    })
  }

  async copiaProductos(res: Response ){
    //var image = new Image()
    let arr = res.data;
    this.lst = arr
    for(let i = 0; i <= this.lst.length-1; i++){
      this.nuevaImgPro = this.base64toBlob(this.lst[i].imgPro);
      var image = document.createElement('img'); 
      image.src = URL.createObjectURL(this.nuevaImgPro);
      image.width = 100;
      image.height = 100; 
      //this.lst[i].imgPro = image.src
      //console.log(this.lst[i].imgPro)
      document.getElementById('#img')?.appendChild(image)
    }
    return this.lst
  }
  
  base64toBlob(cadenaImagen:string): Blob {
    let dataStringImg = 'data:text/plain;base64,' + cadenaImagen;
    var arr = dataStringImg != null ? dataStringImg.split(','): this.lst,
    mime = arr[0].match(/:(.*?);/)[1]
    var sliceSize = 1024;
    var byteCharacters = atob(cadenaImagen);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    let img = new Blob(byteArrays, {type:"image/png"})
    return img;
}

  //stringToImg(cadenaImagen: string){}
/*
  stringToImg(cadenaImagen: string): Producto{

      var arr = cadenaImagen,
      mime = arr == null ? arr='' : arr.match(/:(.*?);/)[1],
      bstr = atob(arr), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
            
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    producto.data[3] = [u8arr], {type:mime}    
    return producto.data;
  }
  */


/*
  dataURLtoFile(cadenaImagen:string): Blob {
    
    let dataStringImg = 'data:image/jpg;base64,' + cadenaImagen;
      var arr = dataStringImg != null ? dataStringImg.split(','): this.lst,
        mime = arr[0].match(/:(.*?);/)[1], 
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        var img = new File([u8arr], 'filename', {type:mime})
        console.log(img)
        return img;   
  }
  */
  
}
