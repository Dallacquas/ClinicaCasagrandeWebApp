import { TableData } from '../../models/Tables/TableData';
import { FormClienteComponent } from './../../sharepage/form-cliente/form-cliente.component';
import { Cliente } from './../../models/Clientes';
import { ClienteService } from './../../services/cliente/cliente.service';
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../../shared/shared.service';  // Atualize o caminho
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MeuModalComponent } from './meu-modal/meu-modal.component';
import { first } from 'rxjs/operators';
import { Grid01Component } from 'src/app/sharepage/grid01/grid01.component';
import { TabResult } from 'src/app/models/Tables/TabResult';


@Component({
  selector: 'app-fichacliente',
  templateUrl: './fichacliente.component.html',
  styleUrls: ['./fichacliente.component.css'],
})


export class FichaclienteComponent implements OnDestroy, OnInit {
  // [x: string]: any; 

  @ViewChild(FormClienteComponent) formCliente!: FormClienteComponent;
  selectedName: string = '';
  selectedNascimento: string = '';
  nCliente: number = 0;
  Atual!: TableData;
  imagefilter = 'assets/img/filter_alt_black_24dp.svg';
  imagefiltro = 'Clinica/Clinica/src/assets/img/filter_alt_black_24dp.svg';
  selectedImage: string = '';
  private subscription: Subscription;
  Selecionada: string = 'Seu texto aqui';
  public idade1: any;
  public idade: any;
  nChanges: boolean = false;
  minhaCondicao: boolean = false;

  // =================== VARIÁVEIS PARA CRIAR COMPONENTES ===============================================

                novo = [
                  { texto: "novo", altura: '9vh', largura: '18vh', cor: 'var(--cor-clara)', size: '16pt' }
                ];
                bAnexar = [
                  { texto: 'Anexar Arquivos', altura: '100%', largura: '100%', cor: 'white', size: '16pt' }
              ]
                containers = [
                  {altura:'10vh', largura: "200vh"}
                ]
                meutxt = {
                  label: 'Parâmetro',
                  nome: 'filtro-param',
                  largura: '65%',  // em pixels
                  altura: '3.5vh'     // em pixels
                };

                filtro = [
                  {altura:'4vh', largura: "30vh"}
                ]

                infoContainer = [
                  {altura:'55vh', largura: "80vh"}
                ]
                salvarEnd = [
                  {texto: 'Salvar', altura: "7vh", largura:'18vh', cor: 'var(--cor-clara)', size: '18pt', fontCor: 'black'},
                  {texto: 'Cancelar', altura: "7vh", largura:'18vh', cor: 'var(--cor-media)', size: '18pt', fontCor: 'white'}
                ]
  // ============== FIM DAS VARIÁVEIS PARA CRIAR COMPONENTES =========================================


  constructor(private sharedService: SharedService,
    public dialog: MatDialog,
    private clienteService: ClienteService){

    this.subscription = this.sharedService.selectedName$.subscribe(
      name => this.selectedName = name
    );

    this.subscription = this.clienteService.ClienteA$.subscribe(
      name => this.nCliente = name
    );


    this.sharedService.currentSelectedRow.subscribe(row => {
      if(this.selectedName !==''){
        this.Selecionada = row;
      }else{
        this.Selecionada = '';
      }

    });


  }


  CliqueNovo(){
    this.clienteService.setChangesA(false);
    this.clienteService.setClienteAtual(this.clienteService.Vazia[0]);
    this.clienteService.setClienteA(-1);
    setTimeout(() => {
      this.clienteService.setChangesA(true);
    }, 0)

  }

    ngOnInit(): void {
      this.clienteService.ClienteAtual$.subscribe(clienteAtual => {
        this.Atual = clienteAtual;
      });
      this.clienteService.ChangesA$.subscribe(chng => {
        this.nChanges = chng;
      });
    }

  ngOnDestroy() {
    this.subscription.unsubscribe();

  }


  converterParaDate(dataString: string): Date {
    const [dia, mes, ano] = dataString.split('/').map(Number);
    return new Date(ano, mes - 1, dia);
  }

  calcularIdade(dataNascimento: Date): string {
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();

    // Ajuste para caso o aniversário ainda não tenha ocorrido este ano
    const m = hoje.getMonth() - dataNascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    }
    return idade.toString();
  }

  isNotNaN(valor: any): boolean {
    return !isNaN(valor);
  }

  abrirModal() {
    const dialogRef = this.dialog.open(MeuModalComponent, {
        disableClose: true  // Isto impede que o modal seja fechado ao clicar fora dele ou pressionar ESC
    });
    dialogRef.afterClosed().subscribe(result => {
      // // console.log('O modal foi fechado');
      // Você pode adicionar mais lógicas aqui se necessário.
    });
  }


  buscarAlteracoes(event:any){
    let TabNas: string = new Date().toISOString().split('T')[0];
      const TabForm = this.formCliente.clienteform.value
      let RestM = false;
      let RestP = false;
      let RestMT = false;
      let RestPT = false;
      let Ssz = false;
      let SszT = false;
      if(TabForm.telComercial == null){
        TabForm.telComercial="0";
      }
      if(this.Atual.telComercial == null || undefined){
        this.Atual.telComercial="0";
      }
      if(this.Atual.maeRestric !== null || undefined){
        this.Atual.maeRestric =='Sim' ? RestM = true : RestM = false
      }
      if(this.Atual.paiRestric !== null || undefined){
        this.Atual.paiRestric =='Sim' ? RestP = true : RestP = false
      }
      if(this.Atual.saiSozinho !== null || undefined){
        this.Atual.saiSozinho =='Sim' ? Ssz = true : Ssz = false
      }
      if(TabForm.maeRestric !== null || undefined){
        TabForm.maeRestric == true ? RestMT = true : RestMT = false
      }
      if(TabForm.paiRestric !== null || undefined){
        TabForm.paiRestric == true ? RestPT = true : RestPT = false
      }
      if(TabForm.saiSozinho !== null || undefined){
        TabForm.saiSozinho == true ? SszT = true : SszT = false
      }
// console.log('saiSozinho de TabForm:')
// console.log(TabForm.saiSozinho)
// console.log('saiSozinho de Atual:')
// console.log(this.Atual.saiSozinho)
// console.log('saiSozinho de SszT:')
// console.log(SszT)
// console.log('saiSozinho de Ssz:')
// console.log(Ssz)
      let Dif = 0;

      this.Atual.nome !== TabForm.nome ?  Dif+=1 : null;
      this.Atual.dtNascim == '' ?  this.Atual.dtNascim = new Date().toISOString().split('T')[0] : null;
      this.Atual.dtNascim !== TabForm.dtNascim ?  Dif+=1 : null;
      this.Atual.clienteDesde == '' ?  this.Atual.clienteDesde = new Date().toLocaleDateString() : null;
      this.Atual.dtInclusao == '' ?  this.Atual.dtInclusao = new Date().toLocaleDateString() : null;
      Ssz !== SszT ?  Dif+=1 : null;
      this.Atual.identidade !== TabForm.identidade ?  Dif+=1 : null;
      this.Atual.cpf !== TabForm.Cpf ?  Dif+=1 : null;
      this.Atual.email !== TabForm.email ?  Dif+=1 : null;
      this.Atual.telFixo !== TabForm.telFixo ?  Dif+=1 : null;
      this.Atual.celular !== TabForm.celular ?  Dif+=1 : null;
      this.Atual.endereco !== TabForm.endereco ?  Dif+=1 : null;
      this.Atual.telComercial !== TabForm.telComercial ?  Dif+=1 : null;

      this.Atual.mae !== TabForm.mae ?  Dif+=1 : null;
      RestM !== RestMT ?  Dif+=1 : null;
      this.Atual.maeIdentidade !== TabForm.maeIdentidade ?  Dif+=1 : null;
      this.Atual.maeCpf !== TabForm.maeCpf ?  Dif+=1 : null;
      this.Atual.maeCelular !== TabForm.maeCelular ?  Dif+=1 : null;
      this.Atual.maeTelFixo !== TabForm.maeTelFixo ?  Dif+=1 : null;
      this.Atual.maeTelComercial !== TabForm.maeTelComercial ?  Dif+=1 : null;
      this.Atual.maeEmail !== TabForm.maeEmail ?  Dif+=1 : null;
      this.Atual.maeEndereco !== TabForm.maeEndereco ?  Dif+=1 : null;

      this.Atual.pai !== TabForm.pai ?  Dif+=1 : null;
      RestP !== RestPT ?  Dif+=1 : null;
      this.Atual.paiIdentidade !== TabForm.paiIdentidade ?  Dif+=1 : null;
      this.Atual.paiCpf !== TabForm.paiCpf ?  Dif+=1 : null;
      this.Atual.paiCelular !== TabForm.paiCelular ?  Dif+=1 : null;
      this.Atual.paiTelFixo !== TabForm.paiTelFixo ?  Dif+=1 : null;
      this.Atual.paiTelComercial !== TabForm.paiTelComercial ?  Dif+=1 : null;
      this.Atual.paiEmail !== TabForm.paiEmail ?  Dif+=1 : null;
      this.Atual.paiEndereco !== TabForm.paiEndereco ?  Dif+=1 : null;



      try{
        let a = TabForm.dtNascim;
        let b = this.reDatas(a);
        let c = b.split('T')[0];
        TabNas = c
      }
      catch
      {
        let b = new Date();
        let c = b.toISOString();
        TabNas = c.split('T')[0];
        TabNas = new Date().toISOString().split('T')[0];
      }

     if(Dif>0){
        let Tab = {
          id: this.Atual.id == null ? 0 : this.Atual.id,
          nome: TabForm.nome == null ? '0' : TabForm.nome,
          dtInclusao: this.Atual.dtInclusao == null ? new Date().toISOString() : this.reDatas(this.Atual.dtInclusao),
          saiSozinho: SszT,
          respFinanc: TabForm.respFinanc == null ? 'Mãe' : TabForm.respFinanc,
          identidade: TabForm.identidade == null ? '0' : TabForm.identidade.toString(),
          cpf: TabForm.cpf == null ? '0' : TabForm.cpf.toString(),
          //dtNascim: TabForm.dtNascim == null ? new Date().toString : TabForm.dtNascim,
          //dtNascim: TabForm.dtNascim == null ? new Date().toISOString().split('T')[0] : new Date(TabForm.dtNascim).toISOString().split('T')[0],
          dtNascim: TabNas,
          celular: TabForm.celular == null ? '0' : TabForm.celular,
          telFixo: TabForm.telFixo == null ? '0' : TabForm.telFixo,
          telComercial: TabForm.telComercial == null ? '0' : TabForm.telComercial,
          email: TabForm.email == null ? '0' : TabForm.email,
          endereco: TabForm.endereco == null ? '0' : TabForm.endereco,
          //clienteDesde: this.Atual.Desde == null ? new Date().toString : this.Atual.Desde,
          clienteDesde: this.Atual.clienteDesde == null ? new Date().toISOString() : this.reDatas(this.Atual.dtInclusao),
          ativo: true,
          areaSession: TabForm.areaSession == null ? '' : this.Atual.areaSession,

          mae: TabForm.mae == null ? '0' : TabForm.mae,
          maeRestric: RestMT,
          maeIdentidade: TabForm.maeIdentidade == null ? '' : TabForm.maeIdentidade,
          maeCpf:  TabForm.maeCpf == null ? '' : TabForm.maeCpf,
          maeCelular:  TabForm.maeCelular == null ? '0' : TabForm.maeCelular,
          maeTelFixo:  TabForm.maeTelFixo == null ? '0' : TabForm.maeTelFixo,
          maeTelComercial:  TabForm.maeTelComercial == null ? '0' : TabForm.maeTelComercial,
          maeEmail:  TabForm.maeEmail == null ? '' : TabForm.maeEmail,
          maeEndereco:  TabForm.maeEndereco == null ? '' : TabForm.maeEndereco,

          pai: TabForm.pai == null ? '0' : TabForm.pai,
          paiRestric: RestPT,
          paiIdentidade: TabForm.paiIdentidade == null ? '0' : TabForm.paiIdentidade,
          paiCpf: TabForm.paiCpf == null ? '0' : TabForm.paiCpf,
          paiCelular: TabForm.paiCelular == null ? '0' : TabForm.paiCelular,
          paiTelFixo: TabForm.paiTelFixo == null ? '0' : TabForm.paiTelFixo,
          paiTelComercial: TabForm.paiTelComercial == null ? '0' : TabForm.paiTelComercial,
          paiEmail: TabForm.paiEmail == null ? '-' : TabForm.paiEmail,
          paiEndereco: TabForm.paiEndereco == null ? '-' : TabForm.paiEndereco,
        }

// console.log('Tab')
// console.log(Tab) 
        if(Tab.id==0){
          // console.log(Tab.id + ' - indo para create')
          // console.log(Tab)
          this.createCliente(Tab)
        }else{
          // console.log(Tab.id + ' - indo para update')
          // console.log(Tab)
          this.updateCliente(Tab)
        }

      }

  }

    FTel(telefone: string) {
      let somenteNumeros = parseInt(telefone.replace(/\D/g, ''));
      return +somenteNumeros;
    }


    reDatas(dataO: string){
      // console.log('reDatas: ' + dataO)

      const [dia, mes, ano] = dataO.split('/');
      if(dia.length == 2){
        const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
        const dataFormatada = data.toISOString();
        // console.log('Formatada: ' + dataFormatada);
        return (dataFormatada);
      }
      else{
        // console.log('Original: ' + dataO);
        return (dataO);
      }

    }

  createCliente(cliente: Cliente){
    this.clienteService.CreateCliente(cliente).subscribe((data) => {
      // console.log(data)
      this.delay(300)
      alert('Registro gravado!')
      location.reload()
    }, error => {
      console.error('Erro no upload', error);
    });
  }

    updateCliente(cliente: Cliente){
      this.clienteService.UpdateCliente(cliente).subscribe((data) => {
        // console.log('Este é o retorno:')
        // console.log(data)
        this.delay(300)
        alert('Registro atualizado!')
        location.reload()
      }, error => {
        console.error('Erro no upload', error);
      });
    }
      delay(time:number) {
        setTimeout(() => {

        }, time);
      }

  onButtonClick(){

  }

}


