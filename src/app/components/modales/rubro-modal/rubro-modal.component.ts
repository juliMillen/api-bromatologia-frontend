import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Rubro } from '../../../models/rubro';
import { RubroService } from '../../../services/rubro.service';

@Component({
  selector: 'app-rubro-modal',
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './rubro-modal.component.html',
  styleUrl: './rubro-modal.component.css'
})
export class RubroModalComponent implements OnInit {

  @Output() cerrar = new EventEmitter<void>();
  @Output() rubroCreado = new EventEmitter<Rubro>();


  rubro: Rubro = {
    nombreRubro: ''
  }

  rubros: Rubro[] = [];

  rubroForm!: FormGroup;

  private fb = inject(FormBuilder);

  constructor(private rubroService:RubroService){}

  ngOnInit(): void {
      this.formularioRubro();
  }

  cerrarModal(){
    this.cerrar.emit();
  }

  formularioRubro(){
    this.rubroForm = this.fb.group({
      nombreRubro: ['', Validators.required]
    })
  }


  crearRubro():void{
    if(this.rubroForm.invalid){
      this.rubroForm.markAllAsTouched();
      return;
    }

    const nuevoRubro: Rubro = this.rubroForm.value;

    this.rubroService.crearRubro(nuevoRubro).subscribe({
      next: (response:Rubro)=>{
        this.rubros.push(response);
        this.rubroForm.reset();
        this.cerrar.emit();
      },
      error: (err)=>{
        console.error('Error al crear el rubro: ',err);
      }
    })
  }
}
