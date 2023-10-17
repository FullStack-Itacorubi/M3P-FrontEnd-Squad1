import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import IMedicamentos from 'src/app/interfaces/IMedicamentos';
import { MedicamentosService } from 'src/app/services/medicamento/medicamentos.service';

@Component({
  selector: 'app-cadastro-medicamentos',
  templateUrl: './cadastro-medicamentos.component.html',
  styleUrls: ['./cadastro-medicamentos.component.css']
})
export class CadastroMedicamentosComponent implements OnInit {

  formMedicamento: any = FormGroup;
	pacientes: any = [];
	medicamentoId: number  = 0;
  medicamento: any;


	constructor(
    private fb: FormBuilder,
    private service: MedicamentosService,
    private route: ActivatedRoute,
    private router: Router
     ) {
		this.formMedicamento = this.fb.group({
			nome: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(5)]],
			data: ['', [Validators.required]],
			horario: ['', [Validators.required]],
			tipo: ['', [Validators.required, Validators.maxLength(1024), Validators.minLength(16)]],
		  quantidade: ['',[Validators.required] ],
      unidade: ['', [Validators.required]],
      observacoes: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(10)]],
			paciente: ['', [Validators.required]],
			status: [true, [Validators.required]]
		});
	}

  async ngOnInit() {
		this.pacientes = await this.service.buscarTodosPacientes();
		const params = await firstValueFrom(this.route.queryParams);

    if (params['id']) {
      this.medicamentoId = Number(params['id']);

      this.medicamento = await this.service.buscarPorId(this.medicamentoId);
      if (this.medicamento == null) {
        this.medicamentoId = 0;
        this.router.navigate(['/cadastro-medicamentos']);
        return;
      }

      this.formMedicamento.setValue({
        nome: this.medicamento.nome,
        data: this.convertBdDateToInputDate(this.medicamento.data),
        horario: this.medicamento.horario,
        tipo: this.medicamento.tipo,
        quantidade: this.medicamento.quantidade,
        unidade: this.medicamento.unidade,
        observacoes: this.medicamento.observacoes,
        status: this.medicamento.status,
        paciente: this.medicamento.paciente.id
      });
    } else {
      this.formMedicamento.get('status').disable();
    }
	}

  async onSubmit() {
    let data = this.formMedicamento.get('data').value;

    let consulta: IMedicamentos = {

      nome: this.formMedicamento.get('nome')?.value,
      data: this.convertInputDateToBdDate(data),
      horario: this.formMedicamento.get('horario')?.value,
      tipo: this.formMedicamento.get('tipo')?.value,
      quantidade: this.formMedicamento.get('quantidade')?.value,
      unidade:this.formMedicamento.get('unidade')?.value,
      observacoes:this.formMedicamento.get('observacoes')?.value,
      status: this.formMedicamento.get('status')?.value,
      paciente: {
        id: this.formMedicamento.get('paciente')?.value,
      },
    };
    if (this.medicamentoId) {
      this.medicamento.id = this.medicamentoId;
      await this.service.editar(consulta);
    } else {
      await this.service.salvar(consulta);
    }

  }

  deletar() {

    this.service.excluir(this.medicamentoId);
    this.router.navigate(["/"]);

}
convertInputDateToBdDate(data: string): string {
  let dataArray = data.split('-');
  return `${dataArray[2]}/${dataArray[1]}/${dataArray[0]}`;
}

convertBdDateToInputDate(data: string): string {
  let dataArray = data.split('-');
  return `${dataArray[2]}-${dataArray[1]}-${dataArray[0]}`;
}

}
