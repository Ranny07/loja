
import { Injectable, signal } from '@angular/core';


export type Produto = {
  id: number;
  nome: string;
  preco: number;
};

export type Item = {
  id: number;
  produto: Produto;
  quantidade: number;
};

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  
  itens = signal<Item[]>([]);

  
  adicionarItem(produto: Produto, quantidade: number = 1): void {
    const atual = this.itens();
    const itemExistente = atual.find(item => item.produto.id === produto.id);

    if (itemExistente) {
      this.aumentarQuantidade(itemExistente.id);
    } else {
      const novoItem: Item = {
        id: Date.now(),
        produto,
        quantidade
      };
      this.itens.update(lista => [...lista, novoItem]);
    }
  }

  
  aumentarQuantidade(itemId: number): void {
    this.itens.update(lista =>
      lista.map(item =>
        item.id === itemId
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      )
    );
  }

  
  diminuirQuantidade(itemId: number): void {
    this.itens.update(lista =>
      lista
        .map(item =>
          item.id === itemId
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        )
        .filter(item => item.quantidade > 0)
    );
  }

  
  removerItem(itemId: number): void {
    this.itens.update(lista => lista.filter(item => item.id !== itemId));
  }

  
  obterTotal(): number {
    return this.itens().reduce(
      (total, item) => total + item.produto.preco * item.quantidade,
      0
    );
  }
}
