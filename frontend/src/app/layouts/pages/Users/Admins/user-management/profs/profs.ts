import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from '../../../../../../models/user';
import { UserService } from '../../../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupModule } from 'primeng/inputgroup';
import { ToastModule } from 'primeng/toast';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-profs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    DialogModule,
    InputTextModule,
    ConfirmDialogModule,
    InputNumberModule,
    InputGroupModule,
    ToastModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './profs.html',
  styleUrls: ['./profs.css']
})
export class Profs implements OnInit {
  userDialog: boolean = false;

  users = signal<User[]>([]);

  user: User = {
    id: 0,
    name: '',
    email: '',
    role: 'Prof',
    specialite_id: undefined,
    created_at: '',
    updated_at: ''
  };
  cols: Column[] = [];

  selectedUsers: User[] | null = null;

  submitted: boolean = false;

  @ViewChild('dt') dt!: Table;

  exportColumns: ExportColumn[] = [];

  constructor(
    private userServices: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  exportCSV() {
    this.dt.exportCSV();
  }
  
  ngOnInit() {
    this.loadDemoData();
  }

  loadDemoData() {
    this.userServices.getAllProfs().subscribe({
      next: (data: User[]) => {
        this.users.set(data);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('Loading complete.');
      }
    });

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
      { field: 'specialite_id', header: 'Specialite' },
      { field: 'email', header: 'Email' },
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.user = {
      id: 0,
      name: '',
      email: '',
      role: 'Prof',
      specialite_id: undefined,
      created_at: '',
      updated_at: ''
    };
    this.submitted = false;
    this.userDialog = true;
  }

  editUser(user: User) {
    this.user = { ...user };
    this.userDialog = true;
  }

  deleteSelectedUsers() {
    if (!this.selectedUsers || this.selectedUsers.length === 0) {
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${this.selectedUsers.length} user(s)?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deletePromises = this.selectedUsers!.map(user => 
          this.userServices.destroy(user.id)
        );

        Promise.all(deletePromises).then(
          () => {
            this.users.set(this.users().filter((val) => !this.selectedUsers?.includes(val)));
            this.selectedUsers = null;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Users deleted successfully',
              life: 3000
            });
          }
        ).catch(
          (error) => {
            console.error('Batch delete error:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error deleting users',
              life: 3000
            });
          }
        );
      }
    });
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
    this.user = {
      id: 0,
      name: '',
      email: '',
      role: 'Prof',
      specialite_id: undefined,
      created_at: '',
      updated_at: ''
    };
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.name + '?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userServices.destroy(user.id).subscribe({
          next: () => {
            this.users.set(this.users().filter((val) => val.id !== user.id));
            this.selectedUsers = null;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User deleted successfully',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Delete error:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error deleting user',
              life: 3000
            });
          }
        });
      }
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.users().length; i++) {
      if (this.users()[i].id === Number(id)) {
        index = i;
        break;
      }
    }
    return index;
  }

  createId(): number {
    return Math.floor(Math.random() * 100000);
  }

  saveUser() {
    this.submitted = true;

    if (this.user.name?.trim() && this.user.email?.trim()) {
      if (this.user.id && this.user.id > 0) {
        this.userServices.updateUser(this.user).subscribe({
          next: (updatedUser) => {
            const _users = [...this.users()];
            const index = this.findIndexById(String(this.user.id));
            if (index !== -1) {
              _users[index] = updatedUser;
              this.users.set(_users);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User updated successfully',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Update error:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error updating user',
              life: 3000
            });
          }
        });
      } else {
        this.userServices.store(this.user).subscribe({
          next: (newUser) => {
            const _users = this.users();
            this.users.set([..._users, newUser]);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User created successfully',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            console.error('Create error:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error creating user',
              life: 3000
            });
          }
        });
      }
    }
  }
}

