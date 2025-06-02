import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productId: string = '';
  product: any = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: ''
  };

  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];
    this.http.get(`http://localhost:3000/api/products/${this.productId}`).subscribe({
      next: (data) => this.product = data,
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erreur lors du chargement du produit';
      }
    });
  }

  updateProduct() {
    this.http.put(`http://localhost:3000/api/products/${this.productId}`, this.product).subscribe({
      next: () => {
        this.successMessage = 'Produit mis à jour avec succès !';
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la mise à jour';
        console.error(err);
      }
    });
  }
}
