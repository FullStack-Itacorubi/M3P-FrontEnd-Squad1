import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import IMedicamentos from 'src/app/interfaces/IMedicamentos';
import { LoginService } from '../login/login.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MedicamentosService {

  urlBase = 'http://localhost:4200/api/medicamentos';
  medicamentos: IMedicamentos[] = []

  constructor(private httpClient: HttpClient,
    private loginService: LoginService,
    private toastr: ToastrService
  ) { }

  async buscarTodos() {
    try {
      this.medicamentos = await lastValueFrom(this.httpClient.get<IMedicamentos[]>(`${this.urlBase}`));
    } catch (e: any) {
      if (e.error[0].mensagem) {
        this.toastr.error(e.error[0].mensagem, 'Erro ao Buscar');
      } else if (e.error) {
        this.toastr.error(e.error, 'Erro ao Buscar');
      }
      return null;
    }
    return this.medicamentos;
  }

  async buscarPorId(id: number) {
    try {
      return await lastValueFrom(this.httpClient.get(`${this.urlBase}/${id}`));
    } catch (e: any) {
      if (e.error[0].mensagem) {
        this.toastr.error(e.error[0].mensagem, 'Erro ao Buscar');
      } else if (e.error) {
        this.toastr.error(e.error, 'Erro ao Buscar');
      }
      return null;
    }

  }

  async salvar(consulta: IMedicamentos) {
    // try {
    //   return await lastValueFrom(
    //     this.httpClient.post(`${this.urlBase}`, consulta)
    //   );
    // } catch (e) {
    //   return e;
    // }

    const idUsuarioLogado = this.loginService.idUsuarioLogado();
    if (idUsuarioLogado === undefined) return;
    let headers = new HttpHeaders().set('idUsuarioLogado', `${idUsuarioLogado}`);

    try {
      const response =  await lastValueFrom(
        this.httpClient.post(`${this.urlBase}`, consulta, { headers })
      );
      this.toastr.success('Cadastro realizado com sucesso','Cadastrado');
      return response;
    } catch (e: any) {
      if(e.error[0].mensagem){
        this.toastr.error(e.error[0].mensagem,'Erro ao cadastrar');
      }else if(e.error){
        this.toastr.error(e.error,'Erro ao cadastrar');
      }
      return e;
    }
  }

  async editar(medicamento: IMedicamentos,exercicioId:number) {
    const idUsuarioLogado = this.loginService.idUsuarioLogado();
    if (idUsuarioLogado === undefined) return;
    let headers = new HttpHeaders().set('idUsuarioLogado', `${idUsuarioLogado}`);

    try{
      let response = await firstValueFrom(this.httpClient.put<any>(`${this.urlBase}/${exercicioId}`,medicamento,{headers:headers}));
      this.toastr.success('Atualizado com sucesso','Atualizado');
      return response;
    }catch(e:any){
      if(e.error[0].mensagem){
        this.toastr.error(e.error[0].mensagem,'Erro ao Atualizar');
      }else if(e.error){
        this.toastr.error(e.error,'Erro ao Atualizar');
      }
      return e;
    }
  }

  async excluir(id: number) {
    await this.httpClient.delete(`${this.urlBase}/${id}`);
    const idUsuarioLogado = this.loginService.idUsuarioLogado();
    if (idUsuarioLogado === undefined) return;
    let headers = new HttpHeaders().set('idUsuarioLogado', `${idUsuarioLogado}`);

    try {
      const response = await lastValueFrom(
        this.httpClient.delete(`${this.urlBase}/${id}`, { headers }));
        this.toastr.success('Cadastro Deletado com sucesso','Deletado');
      return response;
    }catch(e:any){
      if(e.error[0].mensagem){
        this.toastr.error(e.error[0].mensagem,'Erro ao Deltar');
      }else if(e.error){
        this.toastr.error(e.error,'Erro ao Deletar');
      }
      return null;
    }
  }
}
