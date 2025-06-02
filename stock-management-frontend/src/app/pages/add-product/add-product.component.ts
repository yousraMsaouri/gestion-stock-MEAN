import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  product = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: ''
  };

  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  addProduct() {
    this.http.post('http://localhost:3000/api/products', this.product).subscribe({
      next: () => {
        this.successMessage = 'Produit ajouté avec succès !';
        this.errorMessage = '';
        this.router.navigate(['/products']); // Redirection vers la liste
      },
      error: err => {
        this.errorMessage = 'Erreur lors de l\'ajout';
        this.successMessage = '';
        console.error(err);
      }
    });
  }
}
