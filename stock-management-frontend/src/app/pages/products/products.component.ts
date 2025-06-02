import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    this.http.get<any[]>('http://localhost:3000/api/products').subscribe({
      next: data => this.products = data,
      error: err => {
        console.error(err);
        this.errorMessage = "Erreur lors du chargement des produits.";
      }
    });
  }

  editProduct(id: string) {
    this.router.navigate(['/edit-product', id]);
  }

  deleteProduct(id: string) {
    if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      this.http.delete(`http://localhost:3000/api/products/${id}`).subscribe({
        next: () => this.fetchProducts(),
        error: err => {
          console.error(err);
          this.errorMessage = "Erreur lors de la suppression.";
        }
      });
    }
  }
}
