import { Directive, OnInit, Renderer2, Input, ElementRef , ViewChild} from "@angular/core";

@Directive({
  selector: "[resizeColumn]"
})
export class ResizeColumnDirective2 implements OnInit {
  @Input("resizeColumn") resizable: boolean;

  @Input() index: number;

  @ViewChild('grid') grid;

  private startX: number;

  private startWidth: number;

  private column: HTMLElement;

  private table: HTMLElement;

  private pressed: boolean;

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.column = this.el.nativeElement;
  }

  ngOnInit() {
  
      
    if (this.resizable) {
      const row = this.renderer.parentNode(this.column);
      //const thead = this.renderer.parentNode(row);
      this.table = this.renderer.parentNode(row);

      let iteraciones=5;
      //BUSCO EL GRID
      //CREO Q SE PUEDE HACER SOLO PONIENDOLE UNA DIRECTIVA A LA TABLA Y BUSQUE CADA ROW Y CELDA
      while(this.table.tagName!="ION-GRID" &&iteraciones>0){
        this.table = this.renderer.parentNode(this.table);
        iteraciones--;
      }
    
     // console.log(this.table.tagName);
      
     // console.log(row);
     // console.log(thead);
     // console.log(this.table);
      
      
      

      const resizer = this.renderer.createElement("span");
      this.renderer.addClass(resizer, "resize-holder");
      this.renderer.appendChild(this.column, resizer);
      this.renderer.listen(resizer, "mousedown", this.onMouseDown);
      this.renderer.listen(this.table, "mousemove", this.onMouseMove);
      this.renderer.listen("document", "mouseup", this.onMouseUp);

      //MOVIL
      this.renderer.listen(resizer, "touchstart", this.onTouchStart);
      this.renderer.listen("document", "touchend", this.onTouchEnd);
      this.renderer.listen(this.table, "touchmove", this.onTouchMove);
    }
  }

  onMouseDown = (event: MouseEvent) => {
      
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = this.column.offsetWidth;
  };

  onMouseMove = (event: MouseEvent) => {
  
      
    const offset = 35;
    if (this.pressed && event.buttons) {
      this.renderer.addClass(this.table, "resizing");

      // Calculate width of column
      let width =
        this.startWidth + (event.pageX - this.startX - offset);

      const tableCells = Array.from(this.table.querySelectorAll(".mat-row")).map(
        (row: any) => row.querySelectorAll(".mat-cell").item(this.index)
      );

      // Set table header width
      this.renderer.setStyle(this.column, "max-width", `${width}px`);

      // Set table cells width
      for (const cell of tableCells) {
        this.renderer.setStyle(cell, "max-width", `${width}px`);
      }
    }
  };




  onMouseUp = (event: MouseEvent) => {
    if (this.pressed) {
      this.pressed = false;
      this.renderer.removeClass(this.table, "resizing");
    }
  };

  //MOVILES

  onTouchStart=(event:TouchEvent)=>{
    this.pressed = true;
    this.startX = event.touches[0].pageX;
    this.startWidth = this.column.offsetWidth;
    
}

  onTouchMove = (event: TouchEvent ) => {
   // console.log("Touch");
 //  console.log(event.touches.item(0).pageX);
  const offset = 35;
  if (this.pressed) {
    this.renderer.addClass(this.table, "resizing");
    // Calculate width of column
    let width =
      this.startWidth + (event.touches.item(0).pageX - this.startX - offset);

    const tableCells = Array.from(this.table.querySelectorAll(".mat-row")).map(
      (row: any) => row.querySelectorAll(".mat-cell").item(this.index)
    );

    // Set table header width
    this.renderer.setStyle(this.column, "max-width", `${width}px`);
    this.renderer.setStyle(this.column, "width", `${width}px`);
    this.renderer.setStyle(this.column, "flex", "auto");

    // Set table cells width
    for (const cell of tableCells) {
        this.renderer.setStyle(cell, "max-width", `${width}px`);
        this.renderer.setStyle(cell, "width", `${width}px`);
        this.renderer.setStyle(cell, "flex", "auto");
    }
  }
}

onTouchEnd=(event:TouchEvent)=>{
    if (this.pressed) {
        this.pressed = false;
        this.renderer.removeClass(this.table, "resizing");
      }
    
}


}
