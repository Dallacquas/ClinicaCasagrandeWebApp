import { BrowserModule } from '@angular/platform-browser';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderService } from './header.service';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { UserService } from '../../services/user.service'; // Importe o UserService aqui
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { NavbarService } from './navbar.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  template: `
  <button (click)="abrirCalendario()">Abrir Calendário</button>
`,
styles: []
})
export class NavbarComponent implements OnInit {
  imageLogo = 'assets/img/CasagrandeLogo.png'; // Caminho relativo à pasta de ativos
  imageNot= 'assets/img/bell-fill.svg';
  dataAtual = new Date;
  UsrA$!: Observable<string | null>;
  public usr: string = "(---)";
  public Perf: string = '';



  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public headerService: HeaderService,
    public userService: UserService,
    public navbarService: NavbarService,

  ) {


  }




  ngOnInit(): void {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.atualizarLinkAtivo();
      });

      this.userService.UsrA$.subscribe((novoValor) => {
       const user = novoValor;
        let Perf: string = '';

        if(user !== null && user !== undefined){
          const UsrName = user.name;
          if(user.perfil?.toString() == '0') {
            Perf = 'Diretoria';
            }
            if(user.perfil?.toString() == '1') {
              Perf = 'Secretaria';
            }
            if(user.perfil?.toString() == '2') {
              Perf = 'Coordenação';
            }
            if(user.perfil?.toString() == '3') {
              Perf = 'Equipe Clínica';
            }
            this.usr = UsrName + ' (' + Perf + ')'

          }
          else{
            this.usr = "(usuário)"
          }
      });

  }


  atualizarLinkAtivo(): void {
    const child = this.activatedRoute.firstChild;
    if (child) {
      const snapshot = child.snapshot;
      if (snapshot.data && snapshot.data['title']) {
        this.headerService.linkAtivo = snapshot.data['title'];
        this.headerService.setLinkA(snapshot.data['title']);
      }
    }
  }
}
