import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UbicacionService } from '../../../services/ubicacion';
import { Ubicacion } from '../../../models/ubicacion.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-ubicacion-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterLink,
    TranslateModule,
    GoogleMap,
    MapMarker,
  ],
  templateUrl: './ubicacion-form.html',
  styleUrl: './ubicacion-form.scss',
})
export class UbicacionForm implements OnInit {
  form: FormGroup;
  edicion = false;
  id = 0;

  center: google.maps.LatLngLiteral = {
    lat: -12.0464,
    lng: -77.0428,
  };

  zoom = 13;

  markerPosition: google.maps.LatLngLiteral = {
    lat: -12.0464,
    lng: -77.0428,
  };

  constructor(
    private fb: FormBuilder,
    private service: UbicacionService,
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    private translate: TranslateService,
  ) {
    this.form = this.fb.group({
      ubicacion: ['', Validators.required],
      distrito: ['', Validators.required],
      latitud: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitud: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((p) => {
      this.id = +p['id'];
      this.edicion = !!p['id'];
      if (this.edicion) this.service.listId(this.id).subscribe((d) => this.form.patchValue(d));
    });
  }

  guardar() {
    if (this.form.invalid) return;
    const u: Ubicacion = this.form.value;
    const op = this.edicion ? this.service.update(this.id, u) : this.service.insert(u);
    op.subscribe({
      next: () => {
        this.snack.open(
          this.translate.instant(
            this.edicion ? 'UBICACION.MENSAJES.ACTUALIZADO' : 'UBICACION.MENSAJES.CREADO',
          ),
          'OK',
          { duration: 3000 },
        );
        this.router.navigate(['/ubicaciones']);
      },
      error: (e) =>
        this.snack.open(
          this.translate.instant('UBICACION.MENSAJES.ERROR_GENERAL') +
            ': ' +
            (e.error?.message || this.translate.instant('GENERAL.ERROR')),
          'OK',
          { duration: 4000 },
        ),
    });
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    this.markerPosition = {
      lat,
      lng,
    };

    this.form.patchValue({
      latitud: lat,
      longitud: lng,
    });
  }
}
