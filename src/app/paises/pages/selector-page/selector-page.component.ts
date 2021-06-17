import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators'

import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html'
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: [ '', Validators.required ],
    pais: [ '', Validators.required ],
    frontera: [ '', Validators.required ]
  })

  // https://restcountries.eu/rest/v2/alpha/col

  // llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: string[] = [];

  constructor( private fb: FormBuilder, private paisesService: PaisesService ) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    // Cuando cambie la región
    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap( ( _ ) => {
        this.miFormulario.get('pais')?.reset('');
      }),
      switchMap( region => this.paisesService.getPaisesPorRegion( region ) )
    )
    .subscribe( paises => {
        this.paises = paises;
      })

    // Cuando cambie el país
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap( () => {
        this.fronteras = [];
        this.miFormulario.get('frontera')?.reset('');
      }),
      switchMap( codigo => this.paisesService.getPaisPorCodigo( codigo ) )
    )
    .subscribe( pais => {
        this.fronteras = pais?.borders || [] ;
      })
  }

  guardar(){
    console.log(this.miFormulario.value);
  }

}
